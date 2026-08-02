// Renders the EXPERIENCE data (js/experienceData.js) into #experience-list.

function escapeExperienceHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderExperienceItemHTML(entry) {
    var bulletsHtml = entry.bullets
        .map(function (bullet) {
            return '<li>' + escapeExperienceHtml(bullet) + '</li>';
        })
        .join('');

    return (
        '<li class="experience-item">' +
        '<h4>' + escapeExperienceHtml(entry.title) + ' &mdash; ' + escapeExperienceHtml(entry.company) + '</h4>' +
        '<span class="experience-dates">' + escapeExperienceHtml(entry.startDate) + ' - ' + escapeExperienceHtml(entry.endDate) + '</span>' +
        '<ul>' + bulletsHtml + '</ul>' +
        '</li>'
    );
}

function renderExperienceList(containerEl, entries) {
    containerEl.innerHTML = entries.map(renderExperienceItemHTML).join('');
}

function initExperience() {
    var containerEl = document.getElementById('experience-list');
    if (!containerEl) return;

    var entries = (typeof module !== 'undefined' && typeof require === 'function')
        ? require('./experienceData').EXPERIENCE
        : window.EXPERIENCE;

    if (!entries) return;
    renderExperienceList(containerEl, entries);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initExperience);
}

if (typeof module !== 'undefined') {
    module.exports = {
        renderExperienceItemHTML: renderExperienceItemHTML,
        renderExperienceList: renderExperienceList
    };
}
