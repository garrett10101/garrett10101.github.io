const {
  resolveColumn,
  normalizeLinkedInDate,
  splitDescriptionIntoBullets,
  normalizeSkillName,
  parseSortableDate,
  sortByRecency,
  buildExperienceDataFileSource,
  buildEducationDataFileSource,
  buildCertificationsDataFileSource,
  mergeSkills,
  buildSkillsDataFileSource,
} = require('../scripts/lib/linkedinImport');

describe('resolveColumn', () => {
  test('matches case-insensitively against aliases', () => {
    expect(resolveColumn(['Company Name', 'Title'], ['company name', 'company'])).toBe('Company Name');
    expect(resolveColumn(['company', 'Title'], ['company name', 'company'])).toBe('company');
  });

  test('returns null when nothing matches', () => {
    expect(resolveColumn(['Foo', 'Bar'], ['company name', 'company'])).toBeNull();
  });
});

describe('normalizeLinkedInDate', () => {
  test('parses "Mon YYYY" format', () => {
    expect(normalizeLinkedInDate('Feb 2023')).toEqual({ value: '02/2023', warning: null });
  });

  test('parses ISO YYYY-MM format', () => {
    expect(normalizeLinkedInDate('2023-02')).toEqual({ value: '02/2023', warning: null });
  });

  test('passes through already-MM/YYYY format', () => {
    expect(normalizeLinkedInDate('02/2023')).toEqual({ value: '02/2023', warning: null });
  });

  test('blank input means present', () => {
    expect(normalizeLinkedInDate('')).toEqual({ value: 'Present', warning: null });
    expect(normalizeLinkedInDate(undefined)).toEqual({ value: 'Present', warning: null });
  });

  test('unparseable input is kept as-is with a warning, never throws', () => {
    const result = normalizeLinkedInDate('sometime last year');
    expect(result.value).toBe('sometime last year');
    expect(result.warning).toMatch(/Could not confidently parse/);
  });

  test('blank input respects a custom blankValue (e.g. null for "no expiration")', () => {
    expect(normalizeLinkedInDate('', { blankValue: null })).toEqual({ value: null, warning: null });
    expect(normalizeLinkedInDate(undefined, { blankValue: null })).toEqual({ value: null, warning: null });
  });

  test('a real date still parses normally with a custom blankValue option set', () => {
    expect(normalizeLinkedInDate('Feb 2023', { blankValue: null })).toEqual({ value: '02/2023', warning: null });
  });

  test('accepts a bare year (common on older Education entries) without warning', () => {
    expect(normalizeLinkedInDate('2015')).toEqual({ value: '2015', warning: null });
  });
});

describe('parseSortableDate', () => {
  test('treats Present/null/undefined as most recent', () => {
    expect(parseSortableDate('Present')).toBe(Infinity);
    expect(parseSortableDate(null)).toBe(Infinity);
    expect(parseSortableDate(undefined)).toBe(Infinity);
  });

  test('parses MM/YYYY into a comparable number', () => {
    expect(parseSortableDate('02/2023')).toBeGreaterThan(parseSortableDate('01/2020'));
  });

  test('unparseable strings sort last', () => {
    expect(parseSortableDate('garbage')).toBe(-Infinity);
  });

  test('bare year strings are comparable against MM/YYYY strings', () => {
    expect(parseSortableDate('2019')).toBeGreaterThan(parseSortableDate('2015'));
    expect(parseSortableDate('01/2020')).toBeGreaterThan(parseSortableDate('2019'));
  });
});

describe('sortByRecency', () => {
  test('sorts ongoing (Present) entries before completed ones', () => {
    const entries = [
      { startDate: '01/2020', endDate: '01/2021' },
      { startDate: '01/2023', endDate: 'Present' },
    ];
    const sorted = sortByRecency(entries, 'startDate', 'endDate');
    expect(sorted[0].endDate).toBe('Present');
  });

  test('ties on end date are broken by start date descending', () => {
    const entries = [
      { startDate: '01/2020', endDate: 'Present' },
      { startDate: '06/2025', endDate: 'Present' },
    ];
    const sorted = sortByRecency(entries, 'startDate', 'endDate');
    expect(sorted[0].startDate).toBe('06/2025');
  });

  test('does not mutate the input array', () => {
    const entries = [{ startDate: '01/2020', endDate: '01/2021' }, { startDate: '01/2023', endDate: 'Present' }];
    const original = [...entries];
    sortByRecency(entries, 'startDate', 'endDate');
    expect(entries).toEqual(original);
  });
});

describe('splitDescriptionIntoBullets', () => {
  test('splits multi-line descriptions on newlines', () => {
    expect(splitDescriptionIntoBullets('Did thing one.\nDid thing two.')).toEqual([
      'Did thing one.',
      'Did thing two.',
    ]);
  });

  test('splits single-blob text on sentence boundaries', () => {
    const bullets = splitDescriptionIntoBullets('Did thing one. Did thing two. Did thing three.');
    expect(bullets).toEqual(['Did thing one.', 'Did thing two.', 'Did thing three.']);
  });

  test('strips leading bullet markers', () => {
    expect(splitDescriptionIntoBullets('- First item\n• Second item')).toEqual(['First item', 'Second item']);
  });

  test('returns empty array for blank input', () => {
    expect(splitDescriptionIntoBullets('')).toEqual([]);
    expect(splitDescriptionIntoBullets(undefined)).toEqual([]);
  });
});

describe('normalizeSkillName', () => {
  test('lowercases and trims', () => {
    expect(normalizeSkillName('  Python  ')).toBe('python');
  });
});

describe('buildExperienceDataFileSource', () => {
  test('generates source that round-trips through require()', () => {
    const experience = [
      { title: 'Engineer', company: 'Acme "Co"', startDate: '01/2020', endDate: 'Present', bullets: ['Did a thing', "Did another's thing"] },
    ];
    const source = buildExperienceDataFileSource(experience);
    expect(source).toContain('module.exports');
    expect(source).toContain('window.EXPERIENCE');

    const Module = require('module');
    const m = new Module('generated-experience-test');
    m._compile(source, 'generated-experience-test.js');
    expect(m.exports.EXPERIENCE).toEqual(experience);
  });
});

describe('buildEducationDataFileSource', () => {
  test('generates source that round-trips through require()', () => {
    const education = [
      { school: 'Texas State University', degree: 'Bachelor of Science - BS', startDate: '08/2020', endDate: '12/2023', bullets: [] },
    ];
    const source = buildEducationDataFileSource(education);
    expect(source).toContain('module.exports');
    expect(source).toContain('window.EDUCATION');

    const Module = require('module');
    const m = new Module('generated-education-test');
    m._compile(source, 'generated-education-test.js');
    expect(m.exports.EDUCATION).toEqual(education);
  });
});

describe('buildCertificationsDataFileSource', () => {
  test('generates source that round-trips through require(), including null fields', () => {
    const certifications = [
      {
        name: 'Procore Certified: Project Manager',
        issuer: 'Procore Technologies',
        issueDate: '02/2025',
        expirationDate: null,
        credentialUrl: 'https://verify.skilljar.com/c/example',
        licenseNumber: 'example',
      },
    ];
    const source = buildCertificationsDataFileSource(certifications);
    expect(source).toContain('module.exports');
    expect(source).toContain('window.CERTIFICATIONS');

    const Module = require('module');
    const m = new Module('generated-certifications-test');
    m._compile(source, 'generated-certifications-test.js');
    expect(m.exports.CERTIFICATIONS).toEqual(certifications);
  });
});

describe('mergeSkills', () => {
  const categoryMap = {
    CATEGORY_ORDER: ['Languages', 'Tools'],
    SKILL_CATEGORIES: {
      python: { name: 'Python', category: 'Languages', icon: 'img/icons/python.png' },
      git: { name: 'Git', category: 'Tools', icon: 'img/icons/git.png' },
    },
    SKILL_ALIASES: { github: 'git' },
  };

  test('includes every curated skill even if absent from the export', () => {
    const { categories } = mergeSkills([], categoryMap);
    const names = categories.flatMap((c) => c.skills.map((s) => s.name));
    expect(names).toEqual(expect.arrayContaining(['Python', 'Git']));
  });

  test('resolves aliases to their canonical category', () => {
    const { categories } = mergeSkills(['GitHub'], categoryMap);
    const tools = categories.find((c) => c.category === 'Tools');
    expect(tools.skills.map((s) => s.name)).toContain('Git');
  });

  test('unrecognized skills bucket into "Other" with no icon and a warning', () => {
    const { categories, warnings } = mergeSkills(['Quantum Computing'], categoryMap);
    const other = categories.find((c) => c.category === 'Other');
    expect(other.skills).toEqual([{ name: 'Quantum Computing', icon: null }]);
    expect(warnings[0]).toMatch(/Unrecognized skill "Quantum Computing"/);
  });
});

describe('buildSkillsDataFileSource', () => {
  test('generates source that round-trips through require()', () => {
    const categories = [
      { category: 'Languages', skills: [{ name: 'Python', icon: 'img/icons/python.png' }] },
    ];
    const source = buildSkillsDataFileSource(categories);
    const Module = require('module');
    const m = new Module('generated-skills-test');
    m._compile(source, 'generated-skills-test.js');
    expect(m.exports.SKILLS).toEqual(categories);
  });
});
