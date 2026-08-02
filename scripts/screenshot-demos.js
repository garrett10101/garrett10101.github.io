#!/usr/bin/env node
// Screenshots the live site plus all demos/* visual-direction mockups,
// headlessly, at desktop and mobile widths. Writes PNGs to
// scripts/.screenshots/ (gitignored, regenerable).
//
// Uses Firefox's built-in `--headless --screenshot` CLI mode with an
// isolated temp profile (-profile/-no-remote), rather than a browser-testing
// library like Playwright: Playwright's browser binaries require a fresh
// download per environment, which was impractically slow here, whereas this
// machine already has a real Firefox install. The isolated temp profile
// means this never touches or interferes with your actual Firefox session
// (open tabs, logins, etc.) and never opens a visible window, since headless
// mode renders off-screen.
//
// Firefox's headless screenshot only captures the viewport, not the full
// scrollable page, so we render into a generously tall window and then trim
// the trailing blank space with ImageMagick's `convert -trim`.

var fs = require('fs');
var path = require('path');
var http = require('http');
var util = require('util');
var execFile = util.promisify(require('child_process').execFile);
var os = require('os');

var ROOT = path.join(__dirname, '..');
var OUT_DIR = path.join(__dirname, '.screenshots');

var TARGETS = [
    { name: 'live-dark-modern', url: '/index.html' },
    { name: 'terminal', url: '/demos/terminal/index.html' },
    { name: 'editorial', url: '/demos/editorial/index.html' },
    { name: 'bento', url: '/demos/bento/index.html' },
    { name: 'brutalist', url: '/demos/brutalist/index.html' }
];

// Rendered at a generous height, then trimmed to actual content height.
var VIEWPORTS = [
    { name: 'desktop', width: 1440, renderHeight: 7000 },
    { name: 'mobile', width: 390, renderHeight: 9000 }
];

var MIME_TYPES = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf'
};

function startServer() {
    var server = http.createServer(function (req, res) {
        var urlPath = decodeURIComponent(req.url.split('?')[0]);
        var filePath = path.join(ROOT, urlPath);
        if (!filePath.startsWith(ROOT)) {
            res.writeHead(403);
            res.end();
            return;
        }
        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end('Not found: ' + urlPath);
                return;
            }
            var ext = path.extname(filePath);
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
            res.end(data);
        });
    });
    return new Promise(function (resolve) {
        server.listen(0, '127.0.0.1', function () {
            resolve({ server: server, port: server.address().port });
        });
    });
}

// NOTE: must use the async execFile, not execFileSync — the static server
// below runs in this same process, and a *Sync spawn would freeze the event
// loop (including the HTTP server) while waiting for Firefox to exit, which
// deadlocks since Firefox is simultaneously trying to fetch from that server.
async function screenshotOne(url, width, renderHeight, rawOutPath, trimmedOutPath) {
    // A fresh profile per screenshot avoids cross-run slowdown/lock
    // contention observed when reusing one profile dir sequentially.
    var profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-screenshot-profile-'));
    try {
        await execFile('firefox', [
            '--headless',
            '--screenshot=' + rawOutPath,
            '--window-size=' + width + ',' + renderHeight,
            '-profile', profileDir,
            '-no-remote',
            url
        ], { timeout: 60000 });
    } finally {
        fs.rmSync(profileDir, { recursive: true, force: true });
    }

    await execFile('convert', [
        rawOutPath,
        '-fuzz', '3%',
        '-trim',
        '+repage',
        trimmedOutPath
    ], { timeout: 30000 });

    fs.unlinkSync(rawOutPath);
}

async function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });

    var { server, port } = await startServer();
    var baseUrl = 'http://127.0.0.1:' + port;

    try {
        for (var t = 0; t < TARGETS.length; t++) {
            var target = TARGETS[t];
            for (var v = 0; v < VIEWPORTS.length; v++) {
                var viewport = VIEWPORTS[v];
                var rawPath = path.join(OUT_DIR, target.name + '-' + viewport.name + '.raw.png');
                var outPath = path.join(OUT_DIR, target.name + '-' + viewport.name + '.png');
                try {
                    await screenshotOne(baseUrl + target.url, viewport.width, viewport.renderHeight, rawPath, outPath);
                    console.log('Wrote ' + outPath);
                } catch (err) {
                    console.warn('Warning: failed to screenshot ' + target.name + ' (' + viewport.name + '): ' + err.message);
                }
            }
        }
    } finally {
        server.close();
    }
}

main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
