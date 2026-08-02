// Fetches Garrett's public repos live from the GitHub API and renders them
// into #github-repo-list. No redeploy needed for new/updated repos to show up.

var GITHUB_USERNAME = 'garrett10101';
var GITHUB_API_URL = 'https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=10';
var GITHUB_CACHE_KEY = 'githubRepoCache';
var GITHUB_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
var GITHUB_MAX_REPOS = 6;

// Excluded because it's the portfolio site itself, not a project to showcase.
var EXCLUDED_REPO_NAMES = [GITHUB_USERNAME + '.github.io'];

function filterAndSortRepos(repos) {
    return repos
        .filter(function (repo) {
            return !repo.fork && !repo.archived && EXCLUDED_REPO_NAMES.indexOf(repo.name) === -1;
        })
        .sort(function (a, b) {
            return new Date(b.updated_at) - new Date(a.updated_at);
        })
        .slice(0, GITHUB_MAX_REPOS);
}

function formatUpdatedLabel(isoDate) {
    var updated = new Date(isoDate);
    return updated.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function mapRepoToViewModel(repo) {
    return {
        name: repo.name,
        description: repo.description || 'No description provided.',
        language: repo.language || null,
        stars: repo.stargazers_count || 0,
        updatedLabel: formatUpdatedLabel(repo.updated_at),
        url: repo.html_url
    };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderRepoCardHTML(viewModel) {
    var languageBadge = viewModel.language
        ? '<span>' + escapeHtml(viewModel.language) + '</span>'
        : '';
    return (
        '<div class="repo-card">' +
        '<h3><a href="' + viewModel.url + '" target="_blank" rel="noopener">' + escapeHtml(viewModel.name) + '</a></h3>' +
        '<p>' + escapeHtml(viewModel.description) + '</p>' +
        '<div class="repo-meta">' +
        languageBadge +
        '<span>★ ' + viewModel.stars + '</span>' +
        '<span>Updated ' + viewModel.updatedLabel + '</span>' +
        '</div>' +
        '</div>'
    );
}

function renderFallbackHTML() {
    return (
        '<p class="repo-fallback">Unable to load latest projects right now &mdash; ' +
        '<a href="https://github.com/' + GITHUB_USERNAME + '" target="_blank" rel="noopener">view them on GitHub</a>.</p>'
    );
}

function readGithubCache(storage) {
    try {
        var raw = storage.getItem(GITHUB_CACHE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.fetchedAt !== 'number' || !Array.isArray(parsed.data)) return null;
        if (Date.now() - parsed.fetchedAt > GITHUB_CACHE_TTL_MS) return null;
        return parsed.data;
    } catch (err) {
        return null;
    }
}

function writeGithubCache(storage, data) {
    try {
        storage.setItem(GITHUB_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: data }));
    } catch (err) {
        // Storage full/unavailable (e.g. private browsing) — safe to ignore, just skip caching.
    }
}

function fetchGithubRepos(fetchImpl) {
    return fetchImpl(GITHUB_API_URL).then(function (response) {
        if (!response.ok) {
            throw new Error('GitHub API responded with status ' + response.status);
        }
        return response.json();
    });
}

function renderGithubSection(containerEl, repos) {
    if (!repos || repos.length === 0) {
        containerEl.innerHTML = renderFallbackHTML();
        return;
    }
    var viewModels = filterAndSortRepos(repos).map(mapRepoToViewModel);
    containerEl.innerHTML = viewModels.map(renderRepoCardHTML).join('');
}

function initGithubProjects() {
    var containerEl = document.getElementById('github-repo-list');
    if (!containerEl) return;

    var storage = typeof sessionStorage !== 'undefined' ? sessionStorage : null;
    var cached = storage ? readGithubCache(storage) : null;

    if (cached) {
        renderGithubSection(containerEl, cached);
        return;
    }

    fetchGithubRepos(window.fetch.bind(window))
        .then(function (repos) {
            if (storage) writeGithubCache(storage, repos);
            renderGithubSection(containerEl, repos);
        })
        .catch(function () {
            containerEl.innerHTML = renderFallbackHTML();
        });
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initGithubProjects);
}

if (typeof module !== 'undefined') {
    module.exports = {
        filterAndSortRepos: filterAndSortRepos,
        mapRepoToViewModel: mapRepoToViewModel,
        renderRepoCardHTML: renderRepoCardHTML,
        renderFallbackHTML: renderFallbackHTML,
        readGithubCache: readGithubCache,
        writeGithubCache: writeGithubCache,
        fetchGithubRepos: fetchGithubRepos,
        renderGithubSection: renderGithubSection,
        GITHUB_CACHE_KEY: GITHUB_CACHE_KEY,
        GITHUB_CACHE_TTL_MS: GITHUB_CACHE_TTL_MS
    };
}
