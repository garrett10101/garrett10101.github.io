# garrett10101.github.io

Personal portfolio/resume site. Plain HTML/CSS/vanilla JS — no build step.

## Local preview

From the repo root, serve the directory with any static file server, e.g.:

```
python3 -m http.server 8000
```

or

```
npx serve .
```

Then open `http://localhost:8000` (or whatever port your server prints).

## Tests

```
npm install
npm test
```

Jest covers the pure/testable logic in `js/emailMe.js`, `js/experience.js`, `js/skills.js`, `js/githubProjects.js`, and the LinkedIn importer (`scripts/lib/linkedinImport.js`).

## Updating content

- **Experience & Skills sections**: sourced from `js/experienceData.js` and `js/skillsData.js`. There's no public LinkedIn API for individual developers to pull profile data live, so these files are the manual/semi-automated equivalent — see "Importing from LinkedIn" below for the scripted path, or just hand-edit either file directly (they're plain arrays, safe to edit by hand any time).
- **GitHub projects section**: fully automatic. It fetches your public repos live from the GitHub REST API (`js/githubProjects.js`) on page load and lists the 6 most recently updated (excluding forks, archived repos, and this portfolio repo itself). New/updated repos show up with no redeploy needed. Results are cached in `sessionStorage` for 30 minutes to stay well under GitHub's unauthenticated 60 requests/hour rate limit.
- **Resume**: replace `Garrett_DiPalma_Resume.pdf` with an updated file of the same name (or update the filename in `index.html`'s two resume links if you rename it).

## Importing from LinkedIn

LinkedIn has no public API individual developers can use to pull profile data live, and scraping the site violates their Terms of Service and breaks constantly — so there's no such thing as a true real-time LinkedIn sync. What *is* real: LinkedIn's own official data export.

1. On LinkedIn: **Settings → Data Privacy → Get a copy of your data**, request the export, and download the ZIP LinkedIn emails you.
2. Unzip it somewhere, e.g. `~/Downloads/linkedin-export/`.
3. Run:
   ```
   npm run import:linkedin -- ~/Downloads/linkedin-export --dry-run
   ```
   The `--dry-run` flag prints what would be generated without writing anything — review it, then drop `--dry-run` to actually write `js/experienceData.js` and `js/skillsData.js`.
4. Run `git diff` and review the changes before committing — the importer's description-to-bullets splitting is a heuristic, not real NLP, and LinkedIn's own CSV column names/date formats aren't versioned and can drift over time (the importer fails with a clear error naming the missing column if that happens, rather than silently producing garbage).
5. Skills new to LinkedIn that aren't already in `scripts/skillsCategoryMap.js` show up under an "Other" category with no icon, plus a warning in the script's output — add them to `scripts/skillsCategoryMap.js` (with a category + icon path) to categorize them properly, then re-run the import.

This is a manual, periodic workflow you re-run whenever your LinkedIn changes — never automatic, because nothing legitimate can be.

## Contact form (EmailJS) setup

The contact form is wired to send via [EmailJS](https://www.emailjs.com/) so messages reach your inbox without exposing your real email address in the page's source. Until it's configured, the form falls back to opening a pre-filled `mailto:` link instead — nothing breaks either way.

1. Create a free EmailJS account.
2. Add an email service (this is what actually delivers the mail — connect via Gmail/Outlook OAuth or SMTP).
3. Create an email template with variables `from_email`, `subject`, and `message` (these match `buildEmailJsParams` in `js/emailMe.js` — rename both together if you want different variable names).
4. **Masking**: in the template's "To Email" field, use a masked forwarding alias instead of your real address — e.g. a free [Firefox Relay](https://relay.firefox.com/), [duck.com](https://duckduckgo.com/email/) Email Protection, or [SimpleLogin](https://simplelogin.io/) alias that forwards to your real inbox. That way your personal address never has to be typed into a third-party dashboard, and you can disable/rotate the alias if it ever attracts spam.
5. Copy your **Public Key**, **Service ID**, and **Template ID** from the EmailJS dashboard — see "Keeping keys out of git history" below for where these actually go (not directly into `js/emailjsConfig.js`, which stays a safe placeholder in this repo).
6. **Restrict the public key to your domain**: in the EmailJS dashboard under Account → Security, add an authorized/allowed origin for `garrett10101.github.io` (and `localhost` while testing locally). This limits which sites can spend your send quota using this key — it does **not** hide or secure the key itself, since it's still visible in page source by design (that's EmailJS's intended model, the same one Stripe/Google Maps publishable keys use). Double-check this feature's exact location/availability in your own dashboard, since third-party UIs change.

### A note on "hiding" these credentials entirely

Since this is a fully static site with no server, there is no way to keep a value the browser needs to use out of page source once the site is live — that's true no matter where the value originally comes from, including a GitHub Actions secret injected at build time. Deploying from secrets (below) does **not** hide the key from site visitors; view-source on the live page will still show it. What it *does* do is keep the real value out of this repository's committed source and git history — it only ever exists in GitHub's encrypted secrets store and in the final deployed output, never in a commit you or anyone else can browse on GitHub. The only way to have a value the browser truly never sees at all is to run real server-side code that receives the form submission and makes the EmailJS/SMTP call itself (e.g. a Cloudflare Pages Function or Netlify Function) — a genuine architecture change beyond what this repo currently does.

### Keeping keys out of git history

`js/emailjsConfig.js` stays committed with `REPLACE_ME_*` placeholders — never hand-edit it with real values. Instead, add three **GitHub repository secrets** (do this in the GitHub web UI, or via `gh secret set NAME` in your own terminal — never paste real key values into a chat/AI assistant, since that becomes part of the conversation's stored history):

1. Repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Add: `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`

`.github/workflows/deploy.yml` reads these at deploy time and overwrites `js/emailjsConfig.js` *only in that deploy's temporary build environment* (via `scripts/generate-emailjs-config.js`) before publishing to Pages — the change is never committed back to git. If the secrets aren't set yet, the workflow deploys anyway with the placeholder file, and the contact form falls back to `mailto:` (nothing breaks either way). Once you add the three secrets, the next push picks them up automatically — no code change needed.

## Deployment

`.github/workflows/deploy.yml` deploys this site to GitHub Pages automatically on every push to `redesign/portfolio-v2`, via GitHub's official Pages Actions (`actions/deploy-pages`) — no `gh-pages` branch, no separate build artifact branch. It runs `npm test` first and injects EmailJS credentials from repository secrets as described above.

Two old workflows targeting an abandoned React rewrite (`react-branch`/`react-conversion`) were removed as part of setting this up — they hadn't run against real work in a long time and would only have caused confusion alongside this one.
