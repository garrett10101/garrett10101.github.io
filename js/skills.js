// Renders the SKILLS data (js/skillsData.js) into #skills-categories.

function escapeSkillsHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderSkillChipHTML(skill) {
    var img = skill.icon
        ? '<img src="' + skill.icon + '" alt="' + escapeSkillsHtml(skill.name) + '">'
        : '<span class="icon-fallback">' + escapeSkillsHtml(skill.name) + '</span>';
    return (
        '<div class="icon-background" data-tooltip="' + escapeSkillsHtml(skill.name) + '">' +
        img +
        '</div>'
    );
}

function renderSkillCategoryHTML(categoryEntry) {
    var chipsHtml = categoryEntry.skills.map(renderSkillChipHTML).join('');
    return (
        '<div class="skills-category">' +
        '<h3>' + escapeSkillsHtml(categoryEntry.category) + '</h3>' +
        '<div class="skills-grid">' + chipsHtml + '</div>' +
        '</div>'
    );
}

function renderSkillsSection(containerEl, categories) {
    containerEl.innerHTML = categories.map(renderSkillCategoryHTML).join('');
}

function initSkills() {
    var containerEl = document.getElementById('skills-categories');
    if (!containerEl) return;

    var categories = (typeof module !== 'undefined' && typeof require === 'function')
        ? require('./skillsData').SKILLS
        : window.SKILLS;

    if (!categories) return;
    renderSkillsSection(containerEl, categories);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initSkills);
}

if (typeof module !== 'undefined') {
    module.exports = {
        renderSkillChipHTML: renderSkillChipHTML,
        renderSkillCategoryHTML: renderSkillCategoryHTML,
        renderSkillsSection: renderSkillsSection
    };
}
