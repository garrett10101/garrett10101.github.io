// Renders the CERTIFICATIONS data (js/certificationsData.js) into
// #certifications-grid as a compact chip list (same visual pattern as the
// Skills section) — with 28+ entries, individual detail cards would make the
// page very long, so name + issuer (on hover) + a verify link is enough.

function escapeCertificationsHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderCertificationChipHTML(entry) {
    var tooltip = entry.issuer
        ? entry.issuer + (entry.issueDate ? ' — ' + entry.issueDate : '')
        : (entry.issueDate || '');

    var label = '<span class="cert-chip-label">' + escapeCertificationsHtml(entry.name) + '</span>';
    var inner = entry.credentialUrl
        ? '<a href="' + escapeCertificationsHtml(entry.credentialUrl) + '" target="_blank" rel="noopener">' + label + '</a>'
        : label;

    return (
        '<div class="cert-chip" data-tooltip="' + escapeCertificationsHtml(tooltip) + '">' +
        inner +
        '</div>'
    );
}

function renderCertificationsGrid(containerEl, entries) {
    if (!entries || entries.length === 0) {
        containerEl.innerHTML = '<p class="cert-empty">No certifications listed yet.</p>';
        return;
    }
    containerEl.innerHTML = entries.map(renderCertificationChipHTML).join('');
}

function initCertifications() {
    var containerEl = document.getElementById('certifications-grid');
    if (!containerEl) return;

    var entries = (typeof module !== 'undefined' && typeof require === 'function')
        ? require('./certificationsData').CERTIFICATIONS
        : window.CERTIFICATIONS;

    if (!entries) return;
    renderCertificationsGrid(containerEl, entries);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initCertifications);
}

if (typeof module !== 'undefined') {
    module.exports = {
        renderCertificationChipHTML: renderCertificationChipHTML,
        renderCertificationsGrid: renderCertificationsGrid
    };
}
