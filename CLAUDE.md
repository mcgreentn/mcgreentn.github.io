# CLAUDE.md — mcgreentn.github.io

Personal portfolio/academic site for Michael Cerny Green (AI researcher). Static Jekyll site deployed via GitHub Pages. No build pipeline — all files are served directly.

---

## Project Structure

```
mcgreentn.github.io/
├── index.html          About/home page
├── research.html       Publications list (dynamic)
├── media.html          Media & presentations (dynamic)
├── blog.html           Blog posts (dynamic)
├── projects.html       Project showcase
├── play.html           Playable browser games index
├── dungen.html         Interactive dungeon generator demo
├── 404.html            Custom error page
├── assets/             Data files (JS objects used as JSON)
│   ├── research.js     Paper metadata
│   ├── blogs.js        Blog post metadata
│   └── media.js        Media entry metadata
├── css/
│   ├── home-redesign.css   Primary custom stylesheet (dark theme)
│   ├── research.css        Utility classes
│   └── bootstrap*.css      Bootstrap v5 (vendored)
├── js/
│   ├── bootstrap*.js       Bootstrap v5 bundle (vendored)
│   ├── jquery.js           jQuery (vendored)
│   ├── level_generator/    Dungeon generation algorithms
│   └── search/             A* pathfinding
├── papers/             PDF papers + CV (Current.pdf)
├── slides/             Presentation slides
├── posters/            Academic posters
├── images/             Project screenshots and GIFs
├── font-awesome/       Font Awesome 4 (vendored)
└── _config.yml         Jekyll config (minimal, uses jekyll-theme-cayman)
```

---

## Page Architecture

### Data-Driven Pages
`research.html`, `blog.html`, `media.html` all follow the same pattern:
- Content is defined in `/assets/*.js` as a JS object assigned to `data`
- jQuery loads on page ready and builds DOM from that data
- To add/update content on these pages, edit the corresponding asset file

### Static Pages
`index.html`, `projects.html`, `dungen.html` — content is hardcoded HTML.

### Navigation
All pages share the same fixed navbar at the top:
```
about | play | research | media | blog | projects | cv
```
- Active page gets `.active` class on its `<a>` tag
- `index.html` has a slightly different navbar layout (no brand name on left)
- CV links to `/papers/Current.pdf`

---

## Design System

### Colors (dark theme)
```css
Background:   #0c1017  (very dark blue-black)
Text:         #dde6f0  (light blue-gray)
Muted text:   #7a8fa3  (mid-gray)
Links:        #7ab8f5  (light blue)
Link hover:   #b0d4ff  (lighter blue)
```

### Typography
- **Headers / metadata**: JetBrains Mono (monospace, 400–700 weight, letter-spaced)
- **Body**: Arvo (serif)
- Fluid sizing via `clamp()` — e.g., `clamp(2.2rem, 5vw, 3.2rem)` for H1
- Both fonts loaded from Google Fonts CDN

### Layout
- Max content width: **760px**, centered
- Page padding: 64px top/bottom, 24px left/right
- Fixed navbar height: 56px
- Fixed footer: 56px padding-bottom to prevent content overlap

### Key CSS Classes
| Class | Purpose |
|---|---|
| `.page` | Main content wrapper |
| `.page-title` | H1 styled with JetBrains Mono |
| `.page-meta` | Metadata/subtitle text |
| `.contact-row` | Flex row of contact/action links |
| `.post` | Repeating blog/media entry block |
| `.paper` | Repeating research entry block |
| `.post-divider` / `.paper-divider` | Subtle `<hr>` between entries |

---

## External Dependencies

| Resource | URL |
|---|---|
| Google Fonts (JetBrains Mono) | `fonts.googleapis.com` |
| Google Fonts (Arvo) | `fonts.googleapis.com` |
| Google Analytics | `googletagmanager.com` (UA-54297010-6) |

All other libraries (Bootstrap 5, jQuery, Font Awesome 4) are **vendored** — do not add CDN links for these.

---

## Asset File Schemas

These are the most-edited files. Reference these schemas to avoid reading the files before making changes.

### `assets/research.js` — paper entry
```js
{
    "title": "...",                          // required
    "authors": "First Last, First Last",     // required
    "conference": "Full venue name",         // required
    "year": 2024,                            // required
    "link": "https://... or papers/x.pdf",  // required — primary PDF link
    "tier": "conference",                    // required — controls section grouping
    "video": "https://youtu.be/...",         // optional
    "slides": "slides/filename.pdf",         // optional
    "poster": "posters/filename.pdf",        // optional
    "code": "https://github.com/...",        // optional
    "blog": "https://...",                   // optional
    "demo": "https://..."                    // optional
}
```
Valid `tier` values (controls which section the paper appears in):
`"journal"` | `"conference"` | `"workshop"` | `"thesis"` | `"unpublished"`

### `assets/blogs.js` — blog post entry
```js
{
    "title": "...",
    "authors": "First Last",
    "publication": "Substack - Professor Green",
    "description": "One-sentence summary.",
    "link": "https://...",
    "date": "Month DD, YYYY",
    "tags": ["professional"]
}
```

### `assets/media.js` — media entry
```js
{
    "year": 2020,
    "author": "Author Name",
    "publication": "Publication Name",
    "title": "Article or video title",
    "link": "https://..."
}
```

---

## Navbar HTML Snippet

Copy this into every page. Update the `href` active link's class to `nav-link active` for the current page.

```html
<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
  <div class="container">
    <a class="navbar-brand" href="index.html">Michael Cerny Green</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="index.html">about</a></li>
        <li class="nav-item"><a class="nav-link" href="research.html">research</a></li>
        <li class="nav-item"><a class="nav-link" href="media.html">media</a></li>
        <li class="nav-item"><a class="nav-link" href="blog.html">blog</a></li>
        <li class="nav-item"><a class="nav-link" href="play.html">play</a></li>
        <li class="nav-item"><a class="nav-link" href="research.html">research</a></li>
        <li class="nav-item"><a class="nav-link" href="media.html">media</a></li>
        <li class="nav-item"><a class="nav-link" href="blog.html">blog</a></li>
        <li class="nav-item"><a class="nav-link" href="projects.html">projects</a></li>
        <li class="nav-item"><a class="nav-link" href="papers/Current.pdf">cv</a></li>
      </ul>
    </div>
  </div>
</nav>
```

---

## Common Edit Tasks

### Add a new paper
Edit `assets/research.js` — add an entry using the schema above.

### Add a blog post
Edit `assets/blogs.js` — add entry with date, title, authors, description, tags, and URL.

### Add a media entry
Edit `assets/media.js`.

### Update CV
Replace `/papers/Current.pdf`.

### Change site-wide styling
Primary stylesheet: `css/home-redesign.css`. Each HTML page also has an embedded `<style>` block for page-specific overrides.

### Add a new page
1. Create the HTML file, copying the navbar structure from an existing page
2. Set the correct `.active` class on the new page's nav link
3. Add a link to the new page in the navbar of **all other pages**

---

## What NOT to Change

- `bootstrap*.css` / `bootstrap*.js` — vendored, do not modify
- `jquery.js` — vendored
- `font-awesome/` — vendored
- `_config.yml` — minimal config, leave as-is unless changing Jekyll theme

---

## Files and Folders to Ignore

Do not read or search inside these — they are binary assets, vendored libraries, or auto-generated:

- `css/bootstrap*.css`, `js/bootstrap*.js`, `js/jquery.js` — vendored, large
- `font-awesome/` — vendored icon library
- `fonts/` — binary font files
- `images/` — binary image/GIF assets (reference by filename only)
- `papers/` — binary PDFs (reference by filename only)
- `slides/` — binary PDFs
- `posters/` — binary PDFs

When searching for code patterns, scope to `*.html`, `assets/`, `css/home-redesign.css`, and `js/level_generator/` or `js/search/` as appropriate.
