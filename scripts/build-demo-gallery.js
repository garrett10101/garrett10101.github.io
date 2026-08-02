#!/usr/bin/env node
// Assembles all PNGs in scripts/.screenshots/ into one self-contained
// gallery.html (base64-inlined images) for side-by-side comparison.

var fs = require('fs');
var path = require('path');

var SCREENSHOTS_DIR = path.join(__dirname, '.screenshots');
var OUT_PATH = path.join(SCREENSHOTS_DIR, 'gallery.html');

var LABELS = {
    'live-dark-modern': 'Live: Dark Modern (current site)',
    'terminal': 'Demo 1: Terminal / Dev Console',
    'editorial': 'Demo 2: Editorial Light',
    'bento': 'Demo 3: Bento Grid / Glassmorphism',
    'brutalist': 'Demo 4: Brutalist / Bold Blocks'
};

var ORDER = ['live-dark-modern', 'terminal', 'editorial', 'bento', 'brutalist'];

function toDataUri(filePath) {
    var buf = fs.readFileSync(filePath);
    return 'data:image/png;base64,' + buf.toString('base64');
}

function main() {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
        console.error('No screenshots directory found — run `npm run demos:screenshot` first.');
        process.exit(1);
    }

    var files = fs.readdirSync(SCREENSHOTS_DIR).filter(function (f) { return f.endsWith('.png'); });

    var sections = ORDER.map(function (key) {
        var desktopFile = files.find(function (f) { return f === key + '-desktop.png'; });
        var mobileFile = files.find(function (f) { return f === key + '-mobile.png'; });
        if (!desktopFile && !mobileFile) return '';

        var desktopImg = desktopFile
            ? '<img src="' + toDataUri(path.join(SCREENSHOTS_DIR, desktopFile)) + '" alt="' + LABELS[key] + ' desktop">'
            : '<p class="missing">desktop screenshot missing</p>';
        var mobileImg = mobileFile
            ? '<img class="mobile" src="' + toDataUri(path.join(SCREENSHOTS_DIR, mobileFile)) + '" alt="' + LABELS[key] + ' mobile">'
            : '<p class="missing">mobile screenshot missing</p>';

        return (
            '<section class="variant">' +
            '<h2>' + LABELS[key] + '</h2>' +
            '<div class="shots"><div class="shot-desktop">' + desktopImg + '</div><div class="shot-mobile">' + mobileImg + '</div></div>' +
            '</section>'
        );
    }).join('\n');

    var html = (
        '<!doctype html><html><head><meta charset="utf-8">' +
        '<title>Portfolio Redesign Demos</title>' +
        '<style>' +
        'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0b0f14;color:#e8edf3;margin:0;padding:32px 24px;}' +
        'h1{font-size:1.6rem;margin-bottom:4px;}' +
        '.intro{color:#9aacc0;margin-bottom:32px;max-width:720px;}' +
        '.variant{margin-bottom:48px;border-top:1px solid #263140;padding-top:24px;}' +
        '.variant h2{font-size:1.1rem;margin-bottom:16px;}' +
        '.shots{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;}' +
        '.shot-desktop{flex:3;min-width:320px;}' +
        '.shot-mobile{flex:1;min-width:140px;max-width:220px;}' +
        'img{width:100%;height:auto;border-radius:8px;border:1px solid #263140;display:block;}' +
        '.missing{color:#f87171;font-size:0.85rem;}' +
        '</style></head><body>' +
        '<h1>Portfolio Redesign — Visual Direction Comparison</h1>' +
        '<p class="intro">Live site plus four alternate visual directions, each screenshotted headlessly at desktop (1440&times;900) and mobile (390&times;844) viewports.</p>' +
        sections +
        '</body></html>'
    );

    fs.writeFileSync(OUT_PATH, html);
    console.log('Wrote ' + OUT_PATH + ' (' + (fs.statSync(OUT_PATH).size / 1024 / 1024).toFixed(1) + ' MB)');
}

main();
