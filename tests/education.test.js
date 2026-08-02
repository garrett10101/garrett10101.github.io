const { renderEducationItemHTML, renderEducationList } = require('../js/education');

describe('renderEducationItemHTML', () => {
  test('renders school, degree, dates, and bullets', () => {
    const html = renderEducationItemHTML({
      school: 'Texas State University',
      degree: 'Bachelor of Science - BS',
      startDate: '08/2020',
      endDate: '12/2023',
      bullets: ['Studied things.'],
    });

    expect(html).toContain('Texas State University');
    expect(html).toContain('Bachelor of Science - BS');
    expect(html).toContain('08/2020 - 12/2023');
    expect(html).toContain('Studied things.');
  });

  test('renders school-only entries without a degree line breaking', () => {
    const html = renderEducationItemHTML({
      school: 'Jack C Hays High School',
      degree: '',
      startDate: '2011',
      endDate: '2015',
      bullets: [],
    });

    expect(html).toContain('Jack C Hays High School');
    expect(html).not.toContain('<ul>');
  });

  test('escapes HTML in entry fields', () => {
    const html = renderEducationItemHTML({
      school: '<b>School</b>',
      degree: 'A & B',
      startDate: '2011',
      endDate: '2015',
      bullets: ['<script>alert(1)</script>'],
    });

    expect(html).toContain('&lt;b&gt;School&lt;/b&gt;');
    expect(html).toContain('A &amp; B');
    expect(html).not.toContain('<script>alert(1)</script>');
  });
});

describe('renderEducationList', () => {
  test('renders one item per entry', () => {
    const container = { innerHTML: '' };
    renderEducationList(container, [
      { school: 'A', degree: 'X', startDate: '2011', endDate: '2015', bullets: [] },
      { school: 'B', degree: 'Y', startDate: '2015', endDate: '2019', bullets: [] },
    ]);
    expect((container.innerHTML.match(/experience-item/g) || []).length).toBe(2);
  });
});
