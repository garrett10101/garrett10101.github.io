const { renderExperienceItemHTML, renderExperienceList } = require('../js/experience');

describe('renderExperienceItemHTML', () => {
  test('renders title, company, dates, and bullets', () => {
    const html = renderExperienceItemHTML({
      title: 'IT Assistant',
      company: 'Meadows Center',
      startDate: '02/2023',
      endDate: 'Present',
      bullets: ['Did thing one.', 'Did thing two.'],
    });

    expect(html).toContain('IT Assistant');
    expect(html).toContain('Meadows Center');
    expect(html).toContain('02/2023 - Present');
    expect(html).toContain('Did thing one.');
    expect(html).toContain('Did thing two.');
  });

  test('escapes HTML in entry fields', () => {
    const html = renderExperienceItemHTML({
      title: '<b>Title</b>',
      company: 'A & B Co',
      startDate: '01/2020',
      endDate: '01/2021',
      bullets: ['<script>alert(1)</script>'],
    });

    expect(html).toContain('&lt;b&gt;Title&lt;/b&gt;');
    expect(html).toContain('A &amp; B Co');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
  });
});

describe('renderExperienceList', () => {
  test('renders one item per entry into the container', () => {
    const container = { innerHTML: '' };
    const entries = [
      { title: 'A', company: 'X', startDate: '01/2020', endDate: '01/2021', bullets: ['one'] },
      { title: 'B', company: 'Y', startDate: '01/2021', endDate: 'Present', bullets: ['two'] },
    ];

    renderExperienceList(container, entries);

    expect(container.innerHTML).toContain('A');
    expect(container.innerHTML).toContain('B');
    expect((container.innerHTML.match(/experience-item/g) || []).length).toBe(2);
  });
});
