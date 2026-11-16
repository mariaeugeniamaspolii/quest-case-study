# AGENTS.md — Quest Case Study

Instructions for AI agents working in this repository.

## Context and goal

Static portfolio landing page presenting the **Quest** case study (parking app): UX/UI design and fullstack concept by María Eugenia Máspoli. The site is a single long-scroll page in Spanish and English for recruiters and hiring managers.

This is a **simple landing**, not a product app. Do not over-architecture it.

## Stack

| Layer | Technology |
|-------|------------|
| Markup | Static HTML (two pages: ES + EN) |
| Styles | SCSS → compiled `css/styles.css` |
| Behavior | Vanilla JS (`js/main.js`) |
| Motion | GSAP 3.12.2 + ScrollTrigger (CDN) |
| Icons | Lucide 1.49.0 (CDN, `<i data-lucide>` placeholders) |
| Fonts | Space Grotesk (Google Fonts) |
| Images | Local WebP in `assets/img/` |

**Not present:** `package.json`, TypeScript, frameworks, bundlers, linters, tests, CI.

## Project structure

```
quest-case-study/
├── index.html              # Spanish page (also embeds EN copy via data-lang)
├── en/index.html           # English page (pure EN, almost no data-lang)
├── css/
│   └── styles.css          # compiled (committed)
│   └── styles.css.map      # gitignored
├── scss/
│   ├── styles.scss         # import barrel only
│   ├── _variables.scss     # design tokens + breakpoints + mixins
│   ├── _base.scss          # reset, typography, container, section, fades
│   ├── _buttons.scss       # generic .btn
│   ├── _ui.scss            # generic .section-label, .tag, .lang-toggle
│   ├── _nav.scss           # generic bottom pill nav
│   ├── _hero.scss          # section-specific
│   ├── _problem.scss
│   ├── _solution.scss
│   ├── _process.scss
│   ├── _audience.scss
│   ├── _profiles.scss
│   ├── _empathy.scss
│   ├── _research.scss
│   ├── _competitors.scss
│   ├── _value.scss
│   ├── _journey.scss
│   ├── _ia.scss
│   ├── _benchmark.scss
│   ├── _vision.scss
│   ├── _design.scss
│   ├── _features.scss
│   ├── _learnings.scss
│   ├── _cta.scss
│   └── _footer.scss
├── js/main.js
├── assets/img/*.webp
├── vercel.json
├── docs/DESIGN.md          # design token / visual system reference
└── AGENTS.md               # this file
```

### SCSS file rules

- **Generic / shared UI** → generic partials (`_buttons`, `_ui`, `_nav`, shared bits in `_base`).
- **Section-specific** → **one partial per section**, matching the HTML `section` class.
- Never dump multiple unrelated sections into one file.
- `styles.scss` only lists `@import`s in page order. `_variables` is imported once via `_base`.

## Architecture and patterns

### Sections (page order)

`hero → problem → solution → process → audience → profiles → empathy → research → competitors → value → journey → ia → benchmark → vision → design → features → learnings → cta` + `footer`.

Each section: `<section class="block section" id="block">` + `div.container`.

### Internationalization (i18n)

**One single toggle button** (top-right), label = **target language** (`EN` while reading ES, `ES` while reading EN). Two delivery models:

1. **`index.html` (ES page)** — bilingual DOM. Every meaningful text node is duplicated:
   - `data-lang="es"` visible by default
   - `data-lang="en" style="display: none;"` hidden
   - Single button (`.lang-btn[data-lang-btn]`, no `data-lang` on it) toggles `display` on `[data-lang]` in place — no reload; label flips EN↔ES.
2. **`en/index.html` (EN page)** — English only. No `data-lang` on content. Single ES button (`.lang-btn` + inline `onclick`) navigates to `../index.html`.

**Always update ES and EN together** when copy or structure changes.

**Do not translate the author name.** `María Eugenia Máspoli` stays as-is on both pages.

### Navigation (intentional IA — not tech debt)

Fixed bottom pill with **exactly 5 links** (case-study narrative):

| # | ES label | EN label | Anchor | Rationale |
|---|----------|----------|--------|-----------|
| 1 | Resumen | Summary | `#problem` | Opening / problem framing |
| 2 | Proceso | Process | `#process` | Method |
| 3 | Investigación | Research | `#research` | Evidence |
| 4 | Resultados | Outcomes | `#learnings` | Learnings / results |
| 5 | Prototipo | Prototype | `#design` | Final UI — **always last** |

Do not add nav links without an explicit user request. Full section list remains scrollable.

### Footer year

Copyright year is **dynamic**: elements with class `js-year` are set to `new Date().getFullYear()` in JS. Static fallback in HTML is the current year at edit time. Hero meta “Year: 2022” is the **project year** and must stay 2022.

### Icons (Lucide via CDN)

All content icons come from **Lucide** (pinned `lucide@1.49.0` UMD on jsDelivr), loaded the same way as GSAP:

- Markup: `<i data-lucide="name" aria-hidden="true"></i>` — one placeholder per icon, identical on ES and EN pages.
- `lucide.createIcons({ attrs: { 'stroke-width': 1.5 } })` runs once on `DOMContentLoaded` (guarded — page renders fine if the CDN fails, same as GSAP).
- To swap an icon, change the `data-lucide` name (catalog: https://lucide.dev/icons). **Always update ES and EN together.**
- Inline SVG kept in the CTA: `linkedin` and `github` (Lucide has no brand icons). CTA `mail` is Lucide with `stroke-width="2"` on the element, matching its Feather-style siblings.

## Code conventions

- **HTML:** semantic sections, one `h1`, BEM class names, comments `<!-- Section Name -->`.
- **BEM:** `block__element--modifier` (e.g. `solution__item-desc`, `competitors__badge--inactive`).
- **JS:** plain script, object modules with `init()`, wired on `DOMContentLoaded`. No build step, no ESM bundler.
- **No inline styles** except the i18n pattern `style="display: none;"` on hidden language nodes.

## Style and design rules

Full token catalog and visual system: **`docs/DESIGN.md`**.

Summary of hard rules:

1. Colors, font sizes, weights, spacing, radii, shadows, z-index, transitions, letter-spacing → **only CSS custom properties** defined in `_variables.scss`.
2. New color → new token in `_variables.scss`, never a raw hex in a section file.
3. Layout geometry (icon box sizes, max-widths, transforms) may use `px` literals as the project already does.
4. Responsive via `@include respond-to($breakpoint-*)` only — breakpoints live in `_variables.scss`.
5. **Do not change visual decisions** (colors, type, spacing, layout, components, motion, images, responsive behavior) without explicit user instruction.
6. If a task needs an undefined design decision, **ask the user**.

See `docs/DESIGN.md` for palette, type scale, components, and motion.

## Reuse before create

- Prefer existing patterns: section shell, cards, `.section-label`, icon boxes, `.btn`, badges, fades.
- Avoid duplicating style blocks that already exist in another partial — extract to a generic partial only if truly shared by 2+ sections.
- Do not introduce new dependencies without a clear need and user approval.
- Do not change project configuration (gitignore, vercel.json, etc.) without need.
- Keep the architecture; only change it when the task explicitly requires it.

## Accessibility and performance baseline

- Keep `lang` attribute correct per page.
- Keep meaningful `alt` on content images.
- Prefer `aria-label` on icon-only links.
- External `target="_blank"` → add `rel="noopener noreferrer"` when touching those links.
- Decorative icons: keep `aria-hidden="true"` on `<i data-lucide>` placeholders and inline CTA SVGs.
- Do not remove existing landmarks (`nav`, `footer`).

## Relevant commands

Compile SCSS (from repo root):

```bash
sass "scss/styles.scss" "css/styles.css" --style compressed
```

- Prefer **dart-sass** if both Ruby Sass and npm sass are on PATH (`npx sass` or `C:\Users\maria\AppData\Roaming\npm\sass`).
- Always commit updated `css/styles.css` with SCSS changes.
- `css/styles.css.map` is gitignored.

There are **no** lint, test, or typecheck scripts.

## Workflow for any task

1. **Analyze** existing HTML, SCSS, and JS conventions first.
2. **Identify** files and sections involved.
3. **Reuse** existing components/patterns when possible.
4. **Ask** if there is functional or design ambiguity.
5. **Implement** only with enough context.
6. **Validate** against the checklist below.

## Definition of done

- [ ] ES and EN HTML kept in sync (structure + copy).
- [ ] Author name untranslated; footer year uses `js-year` if footer touched.
- [ ] All new/changed colors and type sizes use tokens.
- [ ] Section styles live in the matching SCSS partial; generics in generic partials.
- [ ] Naming follows BEM; responsive uses existing breakpoints.
- [ ] No visual change unless the user asked for it.
- [ ] Sass compiled; `css/styles.css` updated and not stale.
- [ ] No new deps or config changes unless required and justified.
- [ ] User-facing ambiguities resolved with the user, not guessed.

## Known issues (document only — do not fix unless asked)

- `--color-white-a70` referenced in `.value` without being defined (falls back).
- `assets/img/quest2.webp` is unused.
- Font loaded twice (HTML `<link>` + SCSS `@import`).
- Several `target="_blank"` lack `rel="noopener noreferrer"`.
- `device-frame` class in HTML mostly has no visual frame styles (only width under `.features`).
