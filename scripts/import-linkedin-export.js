#!/usr/bin/env node
// CLI: node scripts/import-linkedin-export.js <path-to-extracted-export-folder> [--dry-run]
//
// Reads Positions.csv, Education.csv, Certifications.csv, and Skills.csv from
// LinkedIn's official "Get a copy of your data" export (Settings -> Data
// Privacy -> Get a copy of your data) and regenerates js/experienceData.js,
// js/educationData.js, js/certificationsData.js, and js/skillsData.js. This
// is a manual, periodic workflow, not a live sync -- see README.md.

var fs = require('fs');
var path = require('path');
var parse = require('csv-parse/sync').parse;

var {
    resolveColumn,
    normalizeLinkedInDate,
    splitDescriptionIntoBullets,
    sortByRecency,
    parseSortableDate,
    buildExperienceDataFileSource,
    buildEducationDataFileSource,
    buildCertificationsDataFileSource,
    mergeSkills,
    buildSkillsDataFileSource
} = require('./lib/linkedinImport');

var categoryMap = require('./skillsCategoryMap');

function fail(message) {
    console.error('Error: ' + message);
    process.exit(1);
}

function findExportFile(dirPath, expectedBaseName) {
    var files = fs.readdirSync(dirPath);
    var match = files.find(function (f) {
        return f.toLowerCase() === expectedBaseName.toLowerCase();
    });
    return match ? path.join(dirPath, match) : null;
}

function readCsv(filePath) {
    var raw = fs.readFileSync(filePath, 'utf8');
    return parse(raw, { columns: true, skip_empty_lines: true, trim: true });
}

function importPositions(dirPath, warnings) {
    var filePath = findExportFile(dirPath, 'Positions.csv');
    if (!filePath) {
        fail('Positions.csv not found in ' + dirPath + '. Looked for a case-insensitive match.');
    }

    var rows = readCsv(filePath);
    if (rows.length === 0) {
        fail('Positions.csv has no rows.');
    }

    var headerRow = Object.keys(rows[0]);
    var titleCol = resolveColumn(headerRow, ['title']);
    var companyCol = resolveColumn(headerRow, ['company name', 'company']);
    var startedCol = resolveColumn(headerRow, ['started on', 'start date']);
    var finishedCol = resolveColumn(headerRow, ['finished on', 'end date']);
    var descriptionCol = resolveColumn(headerRow, ['description']);

    var missing = [];
    if (!titleCol) missing.push('Title');
    if (!companyCol) missing.push('Company Name');
    if (!startedCol) missing.push('Started On');
    if (missing.length) {
        fail('Positions.csv is missing required column(s): ' + missing.join(', ') + '. Found columns: ' + headerRow.join(', '));
    }

    var experience = rows.map(function (row) {
        var start = normalizeLinkedInDate(row[startedCol]);
        var end = normalizeLinkedInDate(finishedCol ? row[finishedCol] : '');
        if (start.warning) warnings.push(start.warning);
        if (end.warning) warnings.push(end.warning);

        return {
            title: (row[titleCol] || '').trim(),
            company: (row[companyCol] || '').trim(),
            startDate: start.value,
            endDate: end.value,
            bullets: splitDescriptionIntoBullets(descriptionCol ? row[descriptionCol] : '')
        };
    });

    return sortByRecency(experience, 'startDate', 'endDate');
}

function importEducation(dirPath, warnings) {
    var filePath = findExportFile(dirPath, 'Education.csv');
    if (!filePath) {
        fail('Education.csv not found in ' + dirPath + '. Looked for a case-insensitive match.');
    }

    var rows = readCsv(filePath);
    if (rows.length === 0) {
        fail('Education.csv has no rows.');
    }

    var headerRow = Object.keys(rows[0]);
    var schoolCol = resolveColumn(headerRow, ['school name', 'school']);
    var degreeCol = resolveColumn(headerRow, ['degree name', 'degree']);
    var startedCol = resolveColumn(headerRow, ['start date', 'started on']);
    var finishedCol = resolveColumn(headerRow, ['end date', 'finished on']);
    var notesCol = resolveColumn(headerRow, ['notes']);
    var activitiesCol = resolveColumn(headerRow, ['activities']);

    var missing = [];
    if (!schoolCol) missing.push('School Name');
    if (!startedCol) missing.push('Start Date');
    if (missing.length) {
        fail('Education.csv is missing required column(s): ' + missing.join(', ') + '. Found columns: ' + headerRow.join(', '));
    }

    var education = rows.map(function (row) {
        var start = normalizeLinkedInDate(row[startedCol]);
        var end = normalizeLinkedInDate(finishedCol ? row[finishedCol] : '');
        if (start.warning) warnings.push(start.warning);
        if (end.warning) warnings.push(end.warning);

        var notesText = [notesCol ? row[notesCol] : '', activitiesCol ? row[activitiesCol] : '']
            .filter(Boolean)
            .join('\n');

        return {
            school: (row[schoolCol] || '').trim(),
            degree: (degreeCol ? row[degreeCol] : '').trim(),
            startDate: start.value,
            endDate: end.value,
            bullets: splitDescriptionIntoBullets(notesText)
        };
    });

    return sortByRecency(education, 'startDate', 'endDate');
}

function importCertifications(dirPath, warnings) {
    var filePath = findExportFile(dirPath, 'Certifications.csv');
    if (!filePath) {
        warnings.push('Certifications.csv not found in ' + dirPath + ' — skipping, js/certificationsData.js will be empty.');
        return [];
    }

    var rows = readCsv(filePath);
    if (rows.length === 0) return [];

    var headerRow = Object.keys(rows[0]);
    var nameCol = resolveColumn(headerRow, ['name']);
    var issuerCol = resolveColumn(headerRow, ['authority', 'issuer']);
    var startedCol = resolveColumn(headerRow, ['started on', 'issue date']);
    var finishedCol = resolveColumn(headerRow, ['finished on', 'expiration date']);
    var urlCol = resolveColumn(headerRow, ['url', 'credential url']);
    var licenseCol = resolveColumn(headerRow, ['license number']);

    if (!nameCol) {
        warnings.push('Certifications.csv found but no recognizable "Name" column — skipping. Found columns: ' + headerRow.join(', '));
        return [];
    }

    var certifications = rows.map(function (row) {
        var issueDate = startedCol ? normalizeLinkedInDate(row[startedCol]) : { value: '', warning: null };
        // Blank expiration means "no expiration" for a certification, unlike
        // jobs/education where blank means "currently ongoing" -> 'Present'.
        var expirationDate = normalizeLinkedInDate(finishedCol ? row[finishedCol] : '', { blankValue: null });
        if (issueDate.warning) warnings.push(issueDate.warning);
        if (expirationDate.warning) warnings.push(expirationDate.warning);

        return {
            name: (row[nameCol] || '').trim(),
            issuer: (issuerCol ? row[issuerCol] : '').trim(),
            issueDate: issueDate.value,
            expirationDate: expirationDate.value,
            credentialUrl: (urlCol ? row[urlCol] : '').trim() || null,
            licenseNumber: (licenseCol ? row[licenseCol] : '').trim() || null
        };
    });

    // Certifications sort by issue date only (expiration doesn't imply
    // "ongoing" the way it does for jobs/education, so recency = when earned).
    // Compared via inequality first, not subtraction — Infinity - Infinity is
    // NaN, which would silently break ties (see sortByRecency for the same fix).
    return certifications.slice().sort(function (a, b) {
        var aIssue = parseSortableDate(a.issueDate);
        var bIssue = parseSortableDate(b.issueDate);
        return aIssue === bIssue ? 0 : bIssue - aIssue;
    });
}

function importSkills(dirPath, warnings) {
    var filePath = findExportFile(dirPath, 'Skills.csv');
    if (!filePath) {
        warnings.push('Skills.csv not found in ' + dirPath + ' — skipping skills import, js/skillsData.js will only reflect scripts/skillsCategoryMap.js.');
        return mergeSkills([], categoryMap);
    }

    var rows = readCsv(filePath);
    var headerRow = rows.length ? Object.keys(rows[0]) : [];
    var nameCol = resolveColumn(headerRow, ['name', 'skill name', 'skill']);
    if (!nameCol) {
        warnings.push('Skills.csv found but no recognizable name column (looked for Name/Skill Name/Skill). Found columns: ' + headerRow.join(', '));
        return mergeSkills([], categoryMap);
    }

    var names = rows.map(function (row) { return row[nameCol]; });
    var result = mergeSkills(names, categoryMap);
    warnings.push.apply(warnings, result.warnings);
    return result.categories;
}

var ALL_CATEGORIES = ['experience', 'education', 'certifications', 'skills'];

function main() {
    var args = process.argv.slice(2);
    var dryRun = args.indexOf('--dry-run') !== -1;
    var onlyArg = args.find(function (a) { return a.indexOf('--only=') === 0; });
    var categories = onlyArg ? onlyArg.slice('--only='.length).split(',') : ALL_CATEGORIES;
    var dirPath = args.filter(function (a) { return a !== '--dry-run' && a.indexOf('--only=') !== 0; })[0];

    var invalidCategories = categories.filter(function (c) { return ALL_CATEGORIES.indexOf(c) === -1; });
    if (invalidCategories.length) {
        fail('Unknown --only categor' + (invalidCategories.length === 1 ? 'y' : 'ies') + ': ' + invalidCategories.join(', ') + '. Valid categories: ' + ALL_CATEGORIES.join(', '));
    }

    if (!dirPath) {
        fail('Usage: node scripts/import-linkedin-export.js <path-to-extracted-export-folder> [--dry-run] [--only=experience,education,certifications,skills]');
    }
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        fail('"' + dirPath + '" is not a directory.');
    }

    var warnings = [];
    var summaryParts = [];
    var writtenFiles = [];

    if (categories.indexOf('experience') !== -1) {
        var experience = importPositions(dirPath, warnings);
        var experienceSource = buildExperienceDataFileSource(experience);
        var experienceOutPath = path.join(__dirname, '..', 'js', 'experienceData.js');
        if (dryRun) {
            console.log('--- js/experienceData.js (dry run, not written) ---\n');
            console.log(experienceSource);
        } else {
            fs.writeFileSync(experienceOutPath, experienceSource);
            writtenFiles.push('js/experienceData.js');
        }
        summaryParts.push(experience.length + ' position(s)');
    }

    if (categories.indexOf('education') !== -1) {
        var education = importEducation(dirPath, warnings);
        var educationSource = buildEducationDataFileSource(education);
        var educationOutPath = path.join(__dirname, '..', 'js', 'educationData.js');
        if (dryRun) {
            console.log('--- js/educationData.js (dry run, not written) ---\n');
            console.log(educationSource);
        } else {
            fs.writeFileSync(educationOutPath, educationSource);
            writtenFiles.push('js/educationData.js');
        }
        summaryParts.push(education.length + ' education entr' + (education.length === 1 ? 'y' : 'ies'));
    }

    if (categories.indexOf('certifications') !== -1) {
        var certifications = importCertifications(dirPath, warnings);
        var certificationsSource = buildCertificationsDataFileSource(certifications);
        var certificationsOutPath = path.join(__dirname, '..', 'js', 'certificationsData.js');
        if (dryRun) {
            console.log('--- js/certificationsData.js (dry run, not written) ---\n');
            console.log(certificationsSource);
        } else {
            fs.writeFileSync(certificationsOutPath, certificationsSource);
            writtenFiles.push('js/certificationsData.js');
        }
        summaryParts.push(certifications.length + ' certification(s)');
    }

    if (categories.indexOf('skills') !== -1) {
        var skillCategories = importSkills(dirPath, warnings);
        var skillsSource = buildSkillsDataFileSource(skillCategories);
        var skillsOutPath = path.join(__dirname, '..', 'js', 'skillsData.js');
        if (dryRun) {
            console.log('--- js/skillsData.js (dry run, not written) ---\n');
            console.log(skillsSource);
        } else {
            fs.writeFileSync(skillsOutPath, skillsSource);
            writtenFiles.push('js/skillsData.js');
        }
        var skillCount = skillCategories.reduce(function (sum, c) { return sum + c.skills.length; }, 0);
        summaryParts.push(skillCount + ' skill(s) across ' + skillCategories.length + ' categories');
    }

    console.log((dryRun ? '[dry run] ' : '') + 'Imported ' + summaryParts.join(', ') + '.');

    if (warnings.length) {
        console.log('\nWarnings:');
        warnings.forEach(function (w) { console.log('  - ' + w); });
    }

    if (!dryRun && writtenFiles.length) {
        console.log('\nWrote ' + writtenFiles.join(', ') + '. Review the diff (git diff) before committing.');
    }
}

main();
