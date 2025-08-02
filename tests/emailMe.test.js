const { buildMailtoLink } = require('../js/emailMe');

describe('buildMailtoLink', () => {
  test('returns mailto link with encoded subject and body', () => {
    const link = buildMailtoLink('user@example.com', 'Hello World', 'This is a message');
    const expected = 'mailto:garrettdipalma2@gmail.com?subject=' +
      encodeURIComponent('Hello World') +
      '&body=' + encodeURIComponent('This is a message\n\nFrom: user@example.com');
    expect(link).toBe(expected);
  });

  test('encodes special characters', () => {
    const link = buildMailtoLink('tester@example.com', 'Hello & Welcome', 'Line1\nLine2?');
    const expected = 'mailto:garrettdipalma2@gmail.com?subject=' +
      encodeURIComponent('Hello & Welcome') +
      '&body=' + encodeURIComponent('Line1\nLine2?\n\nFrom: tester@example.com');
    expect(link).toBe(expected);
  });
});
