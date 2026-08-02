const { buildEmailJsConfigSource } = require('../scripts/lib/generateEmailjsConfig');

describe('buildEmailJsConfigSource', () => {
  test('generates source that round-trips through require()', () => {
    const source = buildEmailJsConfigSource('pub_123', 'service_abc', 'template_xyz');
    const Module = require('module');
    const m = new Module('generated-emailjs-config-test');
    m._compile(source, 'generated-emailjs-config-test.js');
    expect(m.exports).toEqual({
      EMAILJS_PUBLIC_KEY: 'pub_123',
      EMAILJS_SERVICE_ID: 'service_abc',
      EMAILJS_TEMPLATE_ID: 'template_xyz',
    });
  });

  test('safely escapes values containing quotes/special characters', () => {
    const source = buildEmailJsConfigSource(`pub"'; alert(1); //`, 'service_abc', 'template_xyz');
    const Module = require('module');
    const m = new Module('generated-emailjs-config-test-2');
    m._compile(source, 'generated-emailjs-config-test-2.js');
    expect(m.exports.EMAILJS_PUBLIC_KEY).toBe(`pub"'; alert(1); //`);
  });
});
