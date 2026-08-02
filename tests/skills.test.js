const { renderSkillChipHTML, renderSkillCategoryHTML, renderSkillsSection } = require('../js/skills');

describe('renderSkillChipHTML', () => {
  test('renders an img chip when an icon is present', () => {
    const html = renderSkillChipHTML({ name: 'Python', icon: 'img/icons/python.png' });
    expect(html).toContain('data-tooltip="Python"');
    expect(html).toContain('<img src="img/icons/python.png" alt="Python">');
  });

  test('renders a text fallback chip when icon is null', () => {
    const html = renderSkillChipHTML({ name: 'Quantum Computing', icon: null });
    expect(html).toContain('icon-fallback');
    expect(html).toContain('Quantum Computing');
    expect(html).not.toContain('<img');
  });

  test('escapes HTML in skill names', () => {
    const html = renderSkillChipHTML({ name: '<b>X</b>', icon: null });
    expect(html).toContain('&lt;b&gt;X&lt;/b&gt;');
    expect(html).not.toContain('<b>X</b>');
  });
});

describe('renderSkillCategoryHTML', () => {
  test('renders a category heading and all its chips', () => {
    const html = renderSkillCategoryHTML({
      category: 'Languages',
      skills: [{ name: 'Python', icon: 'img/icons/python.png' }, { name: 'C', icon: 'img/icons/c.webp' }],
    });
    expect(html).toContain('<h3>Languages</h3>');
    expect(html).toContain('Python');
    expect(html).toContain('C');
  });
});

describe('renderSkillsSection', () => {
  test('renders one category block per entry', () => {
    const container = { innerHTML: '' };
    renderSkillsSection(container, [
      { category: 'Languages', skills: [{ name: 'Python', icon: 'p.png' }] },
      { category: 'Tools', skills: [{ name: 'Git', icon: 'g.png' }] },
    ]);
    expect((container.innerHTML.match(/skills-category/g) || []).length).toBe(2);
    expect(container.innerHTML).toContain('Languages');
    expect(container.innerHTML).toContain('Tools');
  });
});
