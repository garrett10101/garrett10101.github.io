#!/usr/bin/env node
// CI-only: overwrites js/emailjsConfig.js in the current working directory
// using EMAILJS_PUBLIC_KEY / EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID
// environment variables (populated from GitHub Actions secrets — see
// .github/workflows/deploy.yml). Never run this locally unless you intend to
// overwrite your local placeholder file; it is not committed back to git.

var fs = require('fs');
var path = require('path');
var { buildEmailJsConfigSource } = require('./lib/generateEmailjsConfig');

var publicKey = process.env.EMAILJS_PUBLIC_KEY;
var serviceId = process.env.EMAILJS_SERVICE_ID;
var templateId = process.env.EMAILJS_TEMPLATE_ID;

if (!publicKey || !serviceId || !templateId) {
    // Not configured yet — deploy anyway with the committed REPLACE_ME
    // placeholders so the site still works (contact form falls back to
    // mailto:). Once EMAILJS_PUBLIC_KEY / EMAILJS_SERVICE_ID /
    // EMAILJS_TEMPLATE_ID are added as repository secrets, the next deploy
    // picks them up automatically.
    console.log('EmailJS repository secrets not set — skipping config injection, deploying with placeholders.');
    process.exit(0);
}

var outPath = path.join(__dirname, '..', 'js', 'emailjsConfig.js');
fs.writeFileSync(outPath, buildEmailJsConfigSource(publicKey, serviceId, templateId));
console.log('Wrote ' + outPath + ' from environment secrets (not committed to git).');
