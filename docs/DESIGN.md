# DESIGN.md — Quest Case Study Visual System

Source of truth for the existing visual design. **Do not change these decisions without explicit user instruction.**

All tokens live in `scss/_variables.scss`.

---

## 1. Color palette

### Solid tokens

| Token | Value | Role |
|-------|-------|------|
| `--color-primary` | `#1541B3` | Brand accent, labels, buttons, icons, links |
| `--color-primary-rgb` | `16 53 147` | For alpha compositing |
| `--color-primary-light` | `#AFC4F7` | IA second level (“section”), journey step detail |
| `--color-dark` | `#00081E` | Page background, dark section backgrounds, text on light |
| `--color-dark-rgb` | `0 8 30` | Alpha compositing |
| `--color-light` | `#F8F8F8` | Cards on white sections |
| `--color-white` | `#FFFFFF` | Text on dark, card fills, inverse buttons |
| `--color-white-rgb` | `255 255 255` | Alpha compositing |
| `--color-black` | `#000000` | Alpha only (shadows) |
| `--color-black-rgb` | `0 0 0` | Alpha compositing |
| `--color-gray` | `#6B7280` | Secondary text |
| `--color-gray-light` | `#E5E7EB` | Subtle borders, timeline track |

### Alpha tokens

Pattern: `rgb(var(--color-*-rgb) / N%)`.

- **Primary:** `a02`, `a05`, `a10`, `a15`, `a20`, `a30`, `a40`
- **White:** `a02`, `a03`, `a05`, `a10`, `a20`
- **Black:** `a05`, `a30`, `a40`, `a50`
- **Dark:** `a90` (nav background)

### Section background rhythm

Alternating dark / light / accent blocks:

| Background | Sections |
|------------|----------|
| Dark (`--color-dark`) | hero (inherits body), solution, audience, empathy, research, ia, vision, features, cta, footer |
| White | problem, process, profiles, competitors, journey, benchmark, design, learnings |
| Primary | value |
| Dark body default | — |

On white sections, `.section-label` and `h2` are forced to primary/dark as defined in each partial.

---

## 2. Typography

- **Family:** `'Space Grotesk', sans-serif` → `--font-primary`
- Loaded via Google Fonts (weights 300–700). Also `@import` in `_variables` (known duplicate with HTML `<link>`).

### Scale

| Token | Value |
|-------|--------|
| `--font-size-h1` | `clamp(2.5rem, 6vw, 4.5rem)` |
| `--font-size-h2` | `clamp(2rem, 4vw, 3rem)` |
| `--font-size-h3` | `clamp(1.25rem, 2vw, 1.5rem)` |
| `--font-size-body` | `clamp(1rem, 1.2vw, 1.125rem)` |
| `--font-size-lead` | `clamp(1.125rem, 1.5vw, 1.25rem)` |
| `--font-size-lg` | `1.125rem` |
| `--font-size-xl` | `1.25rem` |
| `--font-size-2xl` | `1.5rem` |
| `--font-size-md` | `1rem` |
| `--font-size-sm` | `0.9375rem` |
| `--font-size-xs` | `0.875rem` |
| `--font-size-2xs` | `0.8125rem` |
| `--font-size-3xs` | `0.75rem` |

### Weights, line-height, tracking

- Weights: `light 300` · `regular 400` · `medium 500` · `semibold 600` · `bold 700`
- Line-height: `tight 1.1` · `heading 1.2` · `snug 1.4` · `base 1.6` · `relaxed 1.7`
- Letter-spacing: `tight -0.02em` · `wide 0.05em` · `wider 0.1em`

### Hierarchy (from `_base.scss`)

- `h1`: bold, tight, tight tracking
- `h2`: semibold, heading, `margin-bottom: space-6`
- `h3`: medium, snug, `margin-bottom: space-4`
- `p`: body size, gray, relaxed line-height

Eyebrow/label style: `.section-label` — xs, medium, uppercase, wider tracking, primary color.

---

## 3. Spacing

| Token | Value |
|-------|--------|
| `--space-1` … `--space-6` | 0.25 → 1.5rem (quarter steps) |
| `--space-8` | 2rem |
| `--space-10` | 2.5rem |
| `--space-12` | 3rem |
| `--space-16` | 4rem |
| `--space-20` | 5rem |
| `--section-padding` | `clamp(60px, 10vw, 120px)` |
| `--container-padding` | `clamp(20px, 5vw, 40px)` |
| `--container-max` | `1200px` |

---

## 4. Radii, borders, shadows

### Radii

`sm 10` · `md 12` · `lg 16` · `xl 20` · `2xl 24` · `pill 50px` · `full 50%`  
Device tokens exist (`--radius-device`, `--radius-device-img`) but are **not applied** in current SCSS rules.

### Borders

`--border-width: 1px` · `--border-width-btn: 2px`

### Shadows

| Token | Value |
|-------|--------|
| `--shadow-btn` | `0 10px 30px primary-a30` |
| `--shadow-card` | `0 10px 30px black-a05` |
| `--shadow-card-hover` | `0 20px 40px black-a30` |
| `--shadow-card-lg` | `0 30px 60px black-a40` |
| `--shadow-device` | layered black-a50 + inset white-a10 (defined, currently unused) |

---

## 5. Layout and grid

- Single column container `max-width: 1200px`, horizontal padding clamp.
- Sections use padding via `.section` + `--section-padding`.
- Content grids are local to each section partial (CSS Grid), typically:
  - mobile: `1fr`
  - `md`: 2 columns
  - `lg`: 3–4 columns
- Hero / solution / research: 2-column at `lg`, content + visual.

---

## 6. Breakpoints and mixins

```scss
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

@mixin respond-to($breakpoint) { @media (min-width: $breakpoint) { @content; } }
```

Mobile-first only. Always use `respond-to`, never raw `@media` in section files.

---

## 7. Components and patterns

### Buttons (`.btn`, generic `_buttons.scss`)

- Pill, primary fill, white text, medium weight, `space-4` × `space-8` padding
- Hover: invert to white/dark, slight lift (`translateY(-2px)`), `--shadow-btn`
- Variant `--outline`: transparent + 2px white border (used on dark CTA)

### Section label (`.section-label`)

Uppercase, wide tracking, xs, primary — reused on almost every section header.

### Cards

**Light card** (white sections): `--color-light` fill, `radius-lg`, hover lift + `--shadow-card`.

**Dark glass card** (dark sections): gradient `white-a05 → white-a02`, border `white-a10`, `radius-xl`, hover border primary + stronger shadow.

### Icon boxes

Square 40–60px, primary background, `radius-md` or `full`, SVG stroke white (20–28px). Inverse variant on primary section (`.value__icon`): primary-a10 fill, primary stroke.

**Icon source:** Lucide (CDN 1.49.0) via `<i data-lucide="…">` placeholders rendered on `DOMContentLoaded`; global `stroke-width: 1.5`, `currentColor` inherits the box stroke color. CTA social icons use `stroke-width: 2` (`linkedin`/`github` remain inline Feather SVGs — Lucide has no brand icons).

### Badges / chips

- Tool chips (hero): primary-a20 fill, primary text, `radius-xl`, `xs`

### Navigation (`.nav`, `_nav.scss`)

- Fixed bottom center, pill, `dark-a90` + `blur(10px)`
- Links xs, gray → white on hover/active
- Gap/padding increase at `md`
- **Exactly 5 links** (see AGENTS.md IA table)

### Language toggle (`.ui` / `_ui.scss`)

Fixed top-right, **single pill button**, primary fill (always `active`), label = target language (`EN` on the ES page, `ES` on the EN page).

### Footer (`.footer`, `_footer.scss`)

Dark background, top border `white-a10`, centered xs text; year span uses `.js-year`.

---

## 8. Motion

| System | Mechanism |
|--------|-----------|
| Scroll reveal | `.fade-in`, `.fade-in-left`, `.fade-in-right` + `.is-visible` via IntersectionObserver |
| Hero load | GSAP timeline (label, title, subtitle, meta, tools, device, glow) |
| Process | GSAP ScrollTrigger: line height scrub, step enter, dot `.active` |
| Hover | `--transition-medium`, `translateY(-3px…-10px)`, border/shadow change |
| Glow | `@keyframes pulse` 4s infinite (hero) |
| Gallery | Horizontal scroll; drag-to-scroll JS below 992px |

Transitions tokens: `fast 0.2s` · `medium 0.4s` · `slow 0.6s` (all `ease`).

**No** `prefers-reduced-motion` support currently — do not add unless asked.

---

## 9. Imagery and devices

- Format: WebP in `assets/img/`, referenced relatively (`assets/…` or `../assets/…` from `/en/`).
- Screenshots sit inside `.device-frame` wrappers; visual frame styling is currently minimal (width constrained under `.features` only).
- Ambient glows: radial gradients with primary alphas + blur tokens (`--blur-glow`, `--blur-glow-lg`).

---

## 10. Z-index

| Token / value | Use |
|---------------|-----|
| `--z-nav: 100` | Bottom nav |
| `--z-lang: 1000` | Language toggle |
| `1` | Content above section pseudo-overlays |
| `-1` | Glow behind content |

---

## 11. Hard rule

**No visual change without explicit user instruction** — including colors, typography, sizes, spacing, layout, components, styles, animations, images, and responsive behavior.

When a design decision is not defined here or in the code, **ask the user** before choosing.
