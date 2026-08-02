// Pure logic for turning LinkedIn's official "Get a copy of your data" CSV
// export into js/experienceData.js and js/skillsData.js. Node-only, never
// shipped to the browser. See scripts/import-linkedin-export.js for the CLI
// wrapper and README.md for the full manual workflow.

var MONTH_NAMES = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

function normalizeHeader(header) {
    return String(header).trim().toLowerCase();
}

// headerRow: array of raw CSV header strings.
// aliasList: array of normalized (lowercase) header names accepted for this column.
// Returns the original header string as it appears in headerRow, or null.
function resolveColumn(headerRow, aliasList) {
    var normalizedAliases = aliasList.map(normalizeHeader);
    for (var i = 0; i < headerRow.length; i++) {
        if (normalizedAliases.indexOf(normalizeHeader(headerRow[i])) !== -1) {
            return headerRow[i];
        }
    }
    return null;
}

// Tolerant parser for LinkedIn's export date formats ("Feb 2023", "2023-02",
// "02/2023"). Blank input defaults to 'Present' (jobs/education still in
// progress) — pass { blankValue: null } for fields like certification
// expiration dates, where blank means "no expiration" rather than "ongoing".
// Never throws — unparseable input is returned as-is, with a warning.
function normalizeLinkedInDate(raw, options) {
    var blankValue = (options && 'blankValue' in options) ? options.blankValue : 'Present';
    var trimmed = String(raw || '').trim();
    if (!trimmed) {
        return { value: blankValue, warning: null };
    }

    var monthYearMatch = trimmed.match(/^([A-Za-z]{3,})\s+(\d{4})$/);
    if (monthYearMatch) {
        var monthKey = monthYearMatch[1].slice(0, 3).toLowerCase();
        var monthNum = MONTH_NAMES[monthKey];
        if (monthNum) {
            return { value: monthNum + '/' + monthYearMatch[2], warning: null };
        }
    }

    var isoMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
    if (isoMatch) {
        return { value: isoMatch[2] + '/' + isoMatch[1], warning: null };
    }

    if (/^\d{2}\/\d{4}$/.test(trimmed)) {
        return { value: trimmed, warning: null };
    }

    // Bare year, common on older Education entries where LinkedIn only has
    // year precision. Kept as a bare year (not fabricated into a specific
    // month) — parseSortableDate below understands this format too.
    if (/^\d{4}$/.test(trimmed)) {
        return { value: trimmed, warning: null };
    }

    return { value: trimmed, warning: 'Could not confidently parse date "' + trimmed + '" — used as-is, please review.' };
}

// Splits a LinkedIn position "Description" field into bullet strings.
// Newline-delimited content is preferred; single-blob text falls back to a
// sentence-boundary heuristic. Imperfect by design — always review the diff.
function splitDescriptionIntoBullets(description) {
    var text = String(description || '').trim();
    if (!text) return [];

    var lines = text.split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean);

    var rawFragments = lines.length > 1
        ? lines
        : text.split(/(?<=[.!?])\s+(?=[A-Z•\-•])/);

    return rawFragments
        .map(function (fragment) {
            return fragment.replace(/^[•\-\*]\s*/, '').trim();
        })
        .filter(function (fragment) {
            return fragment.length > 2;
        });
}

function normalizeSkillName(name) {
    return String(name || '').trim().toLowerCase();
}

// Converts an "MM/YYYY" or bare "YYYY" string (or 'Present'/null/blank) into
// a comparable number for sorting. 'Present'/null sorts as the most recent
// (ongoing). Unparseable strings sort last rather than throwing.
function parseSortableDate(dateStr) {
    if (dateStr === 'Present' || dateStr === null || dateStr === undefined) return Infinity;

    var monthYearMatch = String(dateStr).match(/^(\d{2})\/(\d{4})$/);
    if (monthYearMatch) {
        return parseInt(monthYearMatch[2], 10) * 12 + parseInt(monthYearMatch[1], 10);
    }

    var yearOnlyMatch = String(dateStr).match(/^(\d{4})$/);
    if (yearOnlyMatch) {
        return parseInt(yearOnlyMatch[1], 10) * 12 + 1;
    }

    return -Infinity;
}

// Sorts entries most-recent-first by their end date (ongoing/'Present'
// entries first), tie-breaking by start date. LinkedIn's export row order
// isn't reliably chronological (e.g. concurrent roles can appear out of
// order), so this is applied to Experience and Education on import.
function sortByRecency(entries, startKey, endKey) {
    return entries.slice().sort(function (a, b) {
        // Compared via inequality first, not subtraction — Infinity - Infinity
        // is NaN, which would silently break ties between two 'Present' entries.
        var aEnd = parseSortableDate(a[endKey]);
        var bEnd = parseSortableDate(b[endKey]);
        if (aEnd !== bEnd) return bEnd - aEnd;

        var aStart = parseSortableDate(a[startKey]);
        var bStart = parseSortableDate(b[startKey]);
        return bStart - aStart;
    });
}

// Emits js/experienceData.js source text in the same hand-authored style used
// throughout the rest of the site (not raw JSON.stringify), so generated
// diffs read naturally against hand-edited history.
function buildExperienceDataFileSource(experienceArray) {
    var entries = experienceArray.map(function (entry) {
        var bulletsSource = entry.bullets
            .map(function (bullet) { return '            ' + JSON.stringify(bullet); })
            .join(',\n');
        return (
            '    {\n' +
            '        title: ' + JSON.stringify(entry.title) + ',\n' +
            '        company: ' + JSON.stringify(entry.company) + ',\n' +
            '        startDate: ' + JSON.stringify(entry.startDate) + ',\n' +
            '        endDate: ' + JSON.stringify(entry.endDate) + ',\n' +
            '        bullets: [\n' + bulletsSource + '\n        ]\n' +
            '    }'
        );
    }).join(',\n');

    return (
        '// Generated by scripts/import-linkedin-export.js from your LinkedIn data export.\n' +
        '// Safe to hand-edit afterward — re-running the importer will overwrite this file,\n' +
        '// so commit hand-edits and review the diff on your next import.\n\n' +
        'var EXPERIENCE = [\n' + entries + '\n];\n\n' +
        "if (typeof module !== 'undefined') {\n" +
        '    module.exports = { EXPERIENCE: EXPERIENCE };\n' +
        '}\n\n' +
        "if (typeof window !== 'undefined') {\n" +
        '    window.EXPERIENCE = EXPERIENCE;\n' +
        '}\n'
    );
}

// Emits js/educationData.js source text, same hand-authored-style pattern as
// buildExperienceDataFileSource.
function buildEducationDataFileSource(educationArray) {
    var entries = educationArray.map(function (entry) {
        var bulletsSource = entry.bullets
            .map(function (bullet) { return '            ' + JSON.stringify(bullet); })
            .join(',\n');
        return (
            '    {\n' +
            '        school: ' + JSON.stringify(entry.school) + ',\n' +
            '        degree: ' + JSON.stringify(entry.degree) + ',\n' +
            '        startDate: ' + JSON.stringify(entry.startDate) + ',\n' +
            '        endDate: ' + JSON.stringify(entry.endDate) + ',\n' +
            '        bullets: [\n' + bulletsSource + '\n        ]\n' +
            '    }'
        );
    }).join(',\n');

    return (
        '// Generated by scripts/import-linkedin-export.js from your LinkedIn data export.\n' +
        '// Safe to hand-edit afterward — re-running the importer will overwrite this file,\n' +
        '// so commit hand-edits and review the diff on your next import.\n\n' +
        'var EDUCATION = [\n' + entries + '\n];\n\n' +
        "if (typeof module !== 'undefined') {\n" +
        '    module.exports = { EDUCATION: EDUCATION };\n' +
        '}\n\n' +
        "if (typeof window !== 'undefined') {\n" +
        '    window.EDUCATION = EDUCATION;\n' +
        '}\n'
    );
}

// Emits js/certificationsData.js source text, same hand-authored-style
// pattern as the other generated data files.
function buildCertificationsDataFileSource(certificationsArray) {
    var entries = certificationsArray.map(function (entry) {
        return (
            '    {\n' +
            '        name: ' + JSON.stringify(entry.name) + ',\n' +
            '        issuer: ' + JSON.stringify(entry.issuer) + ',\n' +
            '        issueDate: ' + JSON.stringify(entry.issueDate) + ',\n' +
            '        expirationDate: ' + JSON.stringify(entry.expirationDate) + ',\n' +
            '        credentialUrl: ' + JSON.stringify(entry.credentialUrl) + ',\n' +
            '        licenseNumber: ' + JSON.stringify(entry.licenseNumber) + '\n' +
            '    }'
        );
    }).join(',\n');

    return (
        '// Generated by scripts/import-linkedin-export.js from your LinkedIn data export.\n' +
        '// Safe to hand-edit afterward — re-running the importer will overwrite this file,\n' +
        '// so commit hand-edits and review the diff on your next import.\n\n' +
        'var CERTIFICATIONS = [\n' + entries + '\n];\n\n' +
        "if (typeof module !== 'undefined') {\n" +
        '    module.exports = { CERTIFICATIONS: CERTIFICATIONS };\n' +
        '}\n\n' +
        "if (typeof window !== 'undefined') {\n" +
        '    window.CERTIFICATIONS = CERTIFICATIONS;\n' +
        '}\n'
    );
}

// Merges a flat list of LinkedIn skill names with the hand-curated
// scripts/skillsCategoryMap.js. Unions rather than replaces: curated skills
// absent from a given export are never dropped. Unknown skills bucket into
// "Other" with no icon and a warning — never auto-guessed.
function mergeSkills(linkedinSkillNames, categoryMapModule) {
    var SKILL_CATEGORIES = categoryMapModule.SKILL_CATEGORIES;
    var SKILL_ALIASES = categoryMapModule.SKILL_ALIASES;
    var CATEGORY_ORDER = categoryMapModule.CATEGORY_ORDER;

    var warnings = [];
    var resolvedKeys = {};

    // Every curated skill is always included, regardless of what this
    // particular export contains.
    Object.keys(SKILL_CATEGORIES).forEach(function (key) {
        resolvedKeys[key] = true;
    });

    (linkedinSkillNames || []).forEach(function (rawName) {
        var normalized = normalizeSkillName(rawName);
        if (!normalized) return;
        var canonicalKey = SKILL_ALIASES[normalized] || normalized;

        if (SKILL_CATEGORIES[canonicalKey]) {
            resolvedKeys[canonicalKey] = true;
        } else {
            resolvedKeys['other:' + normalized] = { name: rawName.trim(), category: 'Other', icon: null };
            warnings.push('Unrecognized skill "' + rawName.trim() + '" — added under "Other" with no icon. Add it to scripts/skillsCategoryMap.js to categorize it.');
        }
    });

    var byCategory = {};
    Object.keys(resolvedKeys).forEach(function (key) {
        var entry = resolvedKeys[key] === true ? SKILL_CATEGORIES[key] : resolvedKeys[key];
        if (!byCategory[entry.category]) byCategory[entry.category] = [];
        byCategory[entry.category].push({ name: entry.name, icon: entry.icon });
    });

    var orderedCategories = CATEGORY_ORDER.concat(
        Object.keys(byCategory).filter(function (cat) { return CATEGORY_ORDER.indexOf(cat) === -1; })
    );

    var categories = orderedCategories
        .filter(function (cat) { return byCategory[cat] && byCategory[cat].length; })
        .map(function (cat) {
            return {
                category: cat,
                skills: byCategory[cat].sort(function (a, b) { return a.name.localeCompare(b.name); })
            };
        });

    return { categories: categories, warnings: warnings };
}

function buildSkillsDataFileSource(categories) {
    var categoriesSource = categories.map(function (categoryEntry) {
        var skillsSource = categoryEntry.skills.map(function (skill) {
            return (
                '            { name: ' + JSON.stringify(skill.name) +
                ', icon: ' + JSON.stringify(skill.icon) + ' }'
            );
        }).join(',\n');
        return (
            '    {\n' +
            '        category: ' + JSON.stringify(categoryEntry.category) + ',\n' +
            '        skills: [\n' + skillsSource + '\n        ]\n' +
            '    }'
        );
    }).join(',\n');

    return (
        '// Generated by scripts/import-linkedin-export.js from your LinkedIn data export\n' +
        '// merged with the hand-curated scripts/skillsCategoryMap.js. Re-running the\n' +
        '// importer overwrites this file — categorize new skills in skillsCategoryMap.js,\n' +
        '// not here.\n\n' +
        'var SKILLS = [\n' + categoriesSource + '\n];\n\n' +
        "if (typeof module !== 'undefined') {\n" +
        '    module.exports = { SKILLS: SKILLS };\n' +
        '}\n\n' +
        "if (typeof window !== 'undefined') {\n" +
        '    window.SKILLS = SKILLS;\n' +
        '}\n'
    );
}

if (typeof module !== 'undefined') {
    module.exports = {
        resolveColumn: resolveColumn,
        normalizeLinkedInDate: normalizeLinkedInDate,
        splitDescriptionIntoBullets: splitDescriptionIntoBullets,
        normalizeSkillName: normalizeSkillName,
        parseSortableDate: parseSortableDate,
        sortByRecency: sortByRecency,
        buildExperienceDataFileSource: buildExperienceDataFileSource,
        buildEducationDataFileSource: buildEducationDataFileSource,
        buildCertificationsDataFileSource: buildCertificationsDataFileSource,
        mergeSkills: mergeSkills,
        buildSkillsDataFileSource: buildSkillsDataFileSource
    };
}
