// Pure builder for js/emailjsConfig.js's generated form. Used by
// scripts/generate-emailjs-config.js in CI (see .github/workflows/deploy.yml)
// to inject real EmailJS credentials from GitHub Actions secrets at deploy
// time — the committed copy of js/emailjsConfig.js keeps safe REPLACE_ME
// placeholders and is never overwritten in git history.

function buildEmailJsConfigSource(publicKey, serviceId, templateId) {
    return (
        '// Generated at deploy time from GitHub Actions secrets — see .github/workflows/deploy.yml\n' +
        "// and scripts/generate-emailjs-config.js. This overwrite happens only in the CI runner's\n" +
        '// working directory and is never committed back to git — the checked-in version of this\n' +
        '// file keeps REPLACE_ME placeholders for local development.\n\n' +
        'var EMAILJS_PUBLIC_KEY = ' + JSON.stringify(publicKey) + ';\n' +
        'var EMAILJS_SERVICE_ID = ' + JSON.stringify(serviceId) + ';\n' +
        'var EMAILJS_TEMPLATE_ID = ' + JSON.stringify(templateId) + ';\n\n' +
        "if (typeof module !== 'undefined') {\n" +
        '    module.exports = {\n' +
        '        EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY,\n' +
        '        EMAILJS_SERVICE_ID: EMAILJS_SERVICE_ID,\n' +
        '        EMAILJS_TEMPLATE_ID: EMAILJS_TEMPLATE_ID\n' +
        '    };\n' +
        '}\n'
    );
}

if (typeof module !== 'undefined') {
    module.exports = { buildEmailJsConfigSource: buildEmailJsConfigSource };
}
