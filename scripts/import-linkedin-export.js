#!/usr/bin/env node
// CLI: node scripts/import-linkedin-export.js <path-to-extracted-export-folder> [--dry-run]
//
// Reads Positions.csv and Skills.csv from LinkedIn's official "Get a copy of
// your data" export (Settings -> Data Privacy -> Get a copy of your data)
// and regenerates js/experienceData.js and js/skillsData.js. This is a
// manual, periodic workflow, not a live sync -- see README.md.

var fs = require('fs');
var path = require('path');
var parse = require('csv-parse/sync').parse;

var {
    resolveColumn,
    normalizeLinkedInDate,
    splitDescriptionIntoBullets,
    buildExperienceDataFileSource,
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

    return experience;
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

function main() {
    var args = process.argv.slice(2);
    var dryRun = args.indexOf('--dry-run') !== -1;
    var dirPath = args.filter(function (a) { return a !== '--dry-run'; })[0];

    if (!dirPath) {
        fail('Usage: node scripts/import-linkedin-export.js <path-to-extracted-export-folder> [--dry-run]');
    }
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        fail('"' + dirPath + '" is not a directory.');
    }

    var warnings = [];
    var experience = importPositions(dirPath, warnings);
    var skillCategories = importSkills(dirPath, warnings);

    var experienceSource = buildExperienceDataFileSource(experience);
    var skillsSource = buildSkillsDataFileSource(skillCategories);

    var experienceOutPath = path.join(__dirname, '..', 'js', 'experienceData.js');
    var skillsOutPath = path.join(__dirname, '..', 'js', 'skillsData.js');

    if (dryRun) {
        console.log('--- js/experienceData.js (dry run, not written) ---\n');
        console.log(experienceSource);
        console.log('--- js/skillsData.js (dry run, not written) ---\n');
        console.log(skillsSource);
    } else {
        fs.writeFileSync(experienceOutPath, experienceSource);
        fs.writeFileSync(skillsOutPath, skillsSource);
    }

    var skillCount = skillCategories.reduce(function (sum, c) { return sum + c.skills.length; }, 0);
    console.log(
        (dryRun ? '[dry run] ' : '') +
        'Imported ' + experience.length + ' position(s), ' + skillCount + ' skill(s) across ' + skillCategories.length + ' categories.'
    );

    if (warnings.length) {
        console.log('\nWarnings:');
        warnings.forEach(function (w) { console.log('  - ' + w); });
    }

    if (!dryRun) {
        console.log('\nWrote js/experienceData.js and js/skillsData.js. Review the diff (git diff) before committing.');
    }
}

main();
