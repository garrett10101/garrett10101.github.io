// Renders the EDUCATION data (js/educationData.js) into #education-list.

function escapeEducationHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderEducationItemHTML(entry) {
    var bulletsHtml = entry.bullets && entry.bullets.length
        ? '<ul>' + entry.bullets.map(function (bullet) {
            return '<li>' + escapeEducationHtml(bullet) + '</li>';
        }).join('') + '</ul>'
        : '';

    var degreeLine = entry.degree
        ? '<h4>' + escapeEducationHtml(entry.degree) + ' &mdash; ' + escapeEducationHtml(entry.school) + '</h4>'
        : '<h4>' + escapeEducationHtml(entry.school) + '</h4>';

    return (
        '<li class="experience-item">' +
        degreeLine +
        '<span class="experience-dates">' + escapeEducationHtml(entry.startDate) + ' - ' + escapeEducationHtml(entry.endDate) + '</span>' +
        bulletsHtml +
        '</li>'
    );
}

function renderEducationList(containerEl, entries) {
    containerEl.innerHTML = entries.map(renderEducationItemHTML).join('');
}

function initEducation() {
    var containerEl = document.getElementById('education-list');
    if (!containerEl) return;

    var entries = (typeof module !== 'undefined' && typeof require === 'function')
        ? require('./educationData').EDUCATION
        : window.EDUCATION;

    if (!entries) return;
    renderEducationList(containerEl, entries);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initEducation);
}

if (typeof module !== 'undefined') {
    module.exports = {
        renderEducationItemHTML: renderEducationItemHTML,
        renderEducationList: renderEducationList
    };
}
