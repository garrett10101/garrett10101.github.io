const {
  resolveColumn,
  normalizeLinkedInDate,
  splitDescriptionIntoBullets,
  normalizeSkillName,
  buildExperienceDataFileSource,
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
