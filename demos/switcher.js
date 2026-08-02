// Temporary review aid: floating widget for jumping between the live site
// and the 4 redesign demos while comparing directions. Safe to delete this
// file (and its <script> tag on each page) once a direction is chosen.
(function () {
    var VARIANTS = [
        { name: 'Live (Dark Modern)', href: '/index.html' },
        { name: 'Terminal', href: '/demos/terminal/index.html' },
        { name: 'Editorial', href: '/demos/editorial/index.html' },
        { name: 'Bento', href: '/demos/bento/index.html' },
        { name: 'Brutalist', href: '/demos/brutalist/index.html' },
        { name: 'All demos', href: '/demos/index.html' },
        { name: '📱 Mobile preview', href: '/demos/mobile-preview.html' }
    ];

    var currentPath = window.location.pathname;

    var bar = document.createElement('div');
    bar.setAttribute('id', 'design-switcher');
    bar.style.cssText =
        'position:fixed;bottom:16px;right:16px;z-index:99999;' +
        'background:#111318;border:1px solid #333;border-radius:10px;' +
        'padding:8px;display:flex;gap:6px;flex-wrap:wrap;max-width:280px;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.4);';

    VARIANTS.forEach(function (variant) {
        var isCurrent = currentPath === variant.href;
        var link = document.createElement('a');
        link.href = variant.href;
        link.textContent = variant.name;
        link.style.cssText =
            'font-size:12px;padding:6px 10px;border-radius:6px;text-decoration:none;' +
            'white-space:nowrap;' +
            (isCurrent
                ? 'background:#2dd4bf;color:#04241f;font-weight:600;'
                : 'background:#1e222b;color:#e8edf3;');
        bar.appendChild(link);
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(bar);
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        document.body.appendChild(bar);
    }
})();
