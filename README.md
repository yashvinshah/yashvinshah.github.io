<h1 align="center">Academic Homepage Template</h1>

<p align="center">
  A clean, modern, mobile-friendly Jekyll template for academic personal websites.<br>
  Designed for researchers, Ph.D. students, and academics who want a polished online presence with minimal effort.
</p>

<p align="center">
  <a href="https://steven068zzy.github.io/stevenZYzhao.github.io/" target="_blank"><strong>🌐 Live Demo →</strong></a>
  &nbsp;·&nbsp;
  <a href="#quick-start">Quick Start</a>
  &nbsp;·&nbsp;
  <a href="#configuration">Configuration</a>
  &nbsp;·&nbsp;
  <a href="#adding-content">Adding Content</a>
</p>

<p align="center">
  <sub>Template created by <a href="https://steven068zzy.github.io/stevenZYzhao.github.io/">Ziyuan Zhao (Steven)</a> — Ph.D. student at Texas A&M University</sub>
</p>

---

## Preview

### Desktop

![Desktop view](docs/screenshot-desktop.png)

### Publications section

![Publications section](docs/screenshot-publications.png)

### Mobile

<p align="center">
  <img src="docs/screenshot-mobile.png" alt="Mobile view" width="320">
</p>

---

## Features

- **Responsive design** — looks great on desktop, tablet, and mobile
- **Sidebar author profile** — avatar, bio, and social links (40+ platforms supported)
- **Publication cards** — `paper-box` component with image, badge, title, and abstract
- **Section anchors** — About, Education, Publications, Experience, Projects, Awards, and more
- **Book shelf** — visual reading list with cover images and tags
- **Auto citation stats** — Google Scholar citation count via GitHub Actions crawler
- **Frosted-glass navigation** — sticky header with smooth scroll
- **Card animations** — staggered entrance animations, hover lift effects
- **Gradient design layer** — polished UI with dot-grid background and gradient text headings
- **Back-to-top button** — smooth scroll with visibility toggle
- **SEO ready** — sitemap, Open Graph, and verification tag support
- **Google Analytics** — plug in your ID to enable

---

## Quick Start

### Option 1 — Use as a GitHub Template (recommended)

1. Click **"Use this template"** → **"Create a new repository"**
2. Name your repo `YOUR_GITHUB_USERNAME.github.io`
3. Go to **Settings → Pages** and set Source to `main` branch
4. Your site will be live at `https://YOUR_GITHUB_USERNAME.github.io` within 2 minutes

### Option 2 — Fork

1. Fork this repository
2. Rename it to `YOUR_GITHUB_USERNAME.github.io`
3. Enable GitHub Pages as above

### Run locally

```bash
# Install Ruby + Bundler first, then:
bundle install
bash run_server.sh
# Visit http://localhost:4000
```

---

## Configuration

All site-wide settings live in `_config.yml`. Open it and fill in the placeholders:

```yaml
title       : "Jane Smith"
repository  : "janesmith/janesmith.github.io"

author:
  name      : "Jane Smith"
  avatar    : "images/avatar.jpg"     # ← add your photo here
  bio       : "Ph.D. candidate in Computer Vision @ MIT"
  location  : "Cambridge, MA, USA"
  googlescholar : "https://scholar.google.com/citations?user=XXXX"
  linkedin  : "jane-smith"
  github    : "janesmith"
  email     : "jane@mit.edu"
```

> **Restart** `jekyll serve` after editing `_config.yml`.

### Social links

Supported platforms include Google Scholar, LinkedIn, GitHub, Twitter/X, ORCID, ResearchGate, DBLP, Email, and 30+ more. Simply fill in the corresponding field in `_config.yml`; leave it blank to hide it.

### Timezone

Change `timezone` in `_config.yml` to your local timezone (e.g., `Asia/Shanghai`, `Europe/London`).  
Full list: [Wikipedia — tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

## Adding Content

All page content lives in `_pages/about.md`. Edit it with any text editor or directly in GitHub's web editor.

### Add a publication (with image)

```html
<div class='paper-box'>
  <div class='paper-box-image'>
    <div>
      <div class="badge">Nature 2024</div>
      <img src='images/paper-fig.png' alt="paper preview" width="100%">
    </div>
  </div>
<div class='paper-box-text' markdown="1">

[Your Paper Title](https://doi.org/your-doi)

**Jane Smith**, Co-author A, Corresponding Author<sup>*</sup>

- One-sentence summary of the key contribution.
</div>
</div>
```

### Add a publication (text only)

```markdown
[Paper Title](https://link-to-paper)

**Jane Smith**, Co-author A, Co-author B

- *Under Review* / *Journal Name, Year*
```

### Add an experience or project entry

Use the same `paper-box` structure — place a company logo or project screenshot in `images/` and fill in the text side.

### Add a news item

```markdown
# 🔥 News
- *Jan 2025* — Paper accepted at CVPR 2025!
- *Sep 2024* — Started Ph.D. at MIT.
```

### Add a book to the reading list

Copy any `.book-card` block in the Reading List section and fill in:
- `img src` — path to cover image in `images/` (optional; a color placeholder shows if the image is missing)
- `book-ph-initial` — 2-letter initials (shown as fallback)
- `book-title`, `book-author`, `book-tag` spans

---

## Google Scholar Citation Auto-update

This template includes a GitHub Actions workflow that automatically fetches your citation count from Google Scholar and updates a badge on your page.

**Setup:**
1. Set `repository` in `_config.yml` to `YOUR_GITHUB_USERNAME/YOUR_GITHUB_USERNAME.github.io`
2. Set `googlescholar` to your Google Scholar profile URL
3. Enable **GitHub Actions** in your repo settings
4. The workflow runs daily and commits updated stats to a `google-scholar-stats` branch

---

## Project Structure

```
.
├── _config.yml          ← Site settings & author profile
├── _pages/
│   └── about.md         ← All your page content goes here
├── _layouts/            ← Page templates (no need to edit)
├── _includes/           ← Reusable HTML components
├── _sass/               ← Stylesheet source files
├── assets/
│   ├── css/main.scss    ← Custom styles (edit to customize look)
│   └── js/              ← JavaScript enhancements
├── images/              ← Your photos, paper figures, project screenshots
│   └── avatar.jpg       ← ← ← Put your profile photo here
├── google_scholar_crawler/  ← Citation crawler (auto-runs via GitHub Actions)
└── Gemfile              ← Ruby dependencies
```

---

## Customization

### Colors

Edit the CSS custom properties at the top of `assets/css/main.scss`:

```css
:root {
  --accent-1:   #1e40af;   /* primary blue */
  --accent-2:   #2563eb;   /* secondary blue */
  --accent-sky: #38bdf8;   /* highlight */
  --bg-page:    #f4f7fb;   /* page background */
}
```

### Sections

Each section has an anchor ID (e.g., `<span class='anchor' id='publications'></span>`).  
To **hide a section**, simply delete it from `about.md`.  
To **reorder sections**, cut and paste the blocks.

---

## Credits

- Built on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) by [Yi Ren](https://github.com/RayeRen)
- Based on [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) Jekyll theme by [Michael Rose](https://mademistakes.com/)
- Mobile optimization, design layer, and template by [Ziyuan Zhao (Steven)](https://steven068zzy.github.io/stevenZYzhao.github.io/)

---

## License

MIT License — free to use for personal and academic purposes.  
If you find this template helpful, a ⭐ star is appreciated!
