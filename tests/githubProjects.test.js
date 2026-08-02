const {
  filterAndSortRepos,
  mapRepoToViewModel,
  renderRepoCardHTML,
  renderFallbackHTML,
  readGithubCache,
  writeGithubCache,
  fetchGithubRepos,
  GITHUB_CACHE_KEY,
  GITHUB_CACHE_TTL_MS,
} = require('../js/githubProjects');

function makeRepo(overrides) {
  return Object.assign(
    {
      name: 'sample-repo',
      description: 'A sample repo',
      fork: false,
      archived: false,
      language: 'JavaScript',
      stargazers_count: 3,
      updated_at: '2026-01-15T00:00:00Z',
      html_url: 'https://github.com/garrett10101/sample-repo',
    },
    overrides
  );
}

describe('filterAndSortRepos', () => {
  test('excludes forks, archived repos, and the portfolio repo itself', () => {
    const repos = [
      makeRepo({ name: 'a', fork: true }),
      makeRepo({ name: 'b', archived: true }),
      makeRepo({ name: 'garrett10101.github.io' }),
      makeRepo({ name: 'keep-me' }),
    ];
    const result = filterAndSortRepos(repos);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('keep-me');
  });

  test('sorts by updated_at descending and caps at 6', () => {
    const repos = Array.from({ length: 8 }, (_, i) =>
      makeRepo({ name: `repo-${i}`, updated_at: new Date(2026, 0, i + 1).toISOString() })
    );
    const result = filterAndSortRepos(repos);
    expect(result).toHaveLength(6);
    expect(result[0].name).toBe('repo-7');
    expect(result[5].name).toBe('repo-2');
  });
});

describe('mapRepoToViewModel', () => {
  test('maps fields and falls back for missing description/language', () => {
    const vm = mapRepoToViewModel(makeRepo({ description: null, language: null }));
    expect(vm.description).toBe('No description provided.');
    expect(vm.language).toBeNull();
    expect(vm.stars).toBe(3);
    expect(vm.url).toBe('https://github.com/garrett10101/sample-repo');
  });
});

describe('renderRepoCardHTML', () => {
  test('escapes HTML in name/description and includes language + stars', () => {
    const html = renderRepoCardHTML(
      mapRepoToViewModel(makeRepo({ name: '<script>', description: 'a & b' }))
    );
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('a &amp; b');
    expect(html).toContain('JavaScript');
    expect(html).toContain('★ 3');
  });
});

describe('renderFallbackHTML', () => {
  test('links out to the GitHub profile', () => {
    expect(renderFallbackHTML()).toContain('github.com/garrett10101');
  });
});

describe('github cache', () => {
  function makeStorage() {
    let store = {};
    return {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
      setItem: (k, v) => { store[k] = v; },
    };
  }

  test('writeGithubCache then readGithubCache round-trips fresh data', () => {
    const storage = makeStorage();
    const data = [makeRepo()];
    writeGithubCache(storage, data);
    expect(readGithubCache(storage)).toEqual(data);
  });

  test('readGithubCache returns null when expired', () => {
    const storage = makeStorage();
    storage.setItem(
      GITHUB_CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now() - (GITHUB_CACHE_TTL_MS + 1000), data: [makeRepo()] })
    );
    expect(readGithubCache(storage)).toBeNull();
  });

  test('readGithubCache returns null for malformed entries', () => {
    const storage = makeStorage();
    storage.setItem(GITHUB_CACHE_KEY, 'not json');
    expect(readGithubCache(storage)).toBeNull();
  });
});

describe('fetchGithubRepos', () => {
  test('resolves with parsed JSON on ok response', async () => {
    const fakeFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([makeRepo()]),
    });
    const repos = await fetchGithubRepos(fakeFetch);
    expect(repos).toHaveLength(1);
    expect(fakeFetch).toHaveBeenCalledWith(expect.stringContaining('api.github.com/users/garrett10101/repos'));
  });

  test('rejects when response is not ok', async () => {
    const fakeFetch = jest.fn().mockResolvedValue({ ok: false, status: 403 });
    await expect(fetchGithubRepos(fakeFetch)).rejects.toThrow('403');
  });
});
