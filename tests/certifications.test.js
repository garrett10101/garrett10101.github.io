const { renderCertificationChipHTML, renderCertificationsGrid } = require('../js/certifications');

describe('renderCertificationChipHTML', () => {
  test('wraps the name in a link when credentialUrl is present', () => {
    const html = renderCertificationChipHTML({
      name: 'Procore Certified: Project Manager',
      issuer: 'Procore Technologies',
      issueDate: '02/2025',
      expirationDate: null,
      credentialUrl: 'https://verify.skilljar.com/c/example',
      licenseNumber: 'example',
    });

    expect(html).toContain('<a href="https://verify.skilljar.com/c/example"');
    expect(html).toContain('Procore Certified: Project Manager');
    expect(html).toContain('data-tooltip="Procore Technologies — 02/2025"');
  });

  test('renders a plain (non-link) chip when there is no credentialUrl', () => {
    const html = renderCertificationChipHTML({
      name: 'Internal Training',
      issuer: '',
      issueDate: '01/2024',
      expirationDate: null,
      credentialUrl: null,
      licenseNumber: null,
    });

    expect(html).not.toContain('<a href');
    expect(html).toContain('Internal Training');
  });

  test('escapes HTML in entry fields', () => {
    const html = renderCertificationChipHTML({
      name: '<b>Cert</b>',
      issuer: 'A & B',
      issueDate: '01/2024',
      expirationDate: null,
      credentialUrl: null,
      licenseNumber: null,
    });

    expect(html).toContain('&lt;b&gt;Cert&lt;/b&gt;');
    expect(html).not.toContain('<b>Cert</b>');
  });
});

describe('renderCertificationsGrid', () => {
  test('renders one chip per entry', () => {
    const container = { innerHTML: '' };
    renderCertificationsGrid(container, [
      { name: 'A', issuer: '', issueDate: '01/2024', expirationDate: null, credentialUrl: null, licenseNumber: null },
      { name: 'B', issuer: '', issueDate: '01/2024', expirationDate: null, credentialUrl: null, licenseNumber: null },
    ]);
    expect((container.innerHTML.match(/cert-chip/g) || []).length).toBeGreaterThanOrEqual(2);
  });

  test('renders an empty-state message when there are no certifications', () => {
    const container = { innerHTML: '' };
    renderCertificationsGrid(container, []);
    expect(container.innerHTML).toContain('No certifications listed yet');
  });
});
