# Step 0 — The Static Board

Pure HTML + CSS. No JavaScript, no build step, no dependencies.

Open `index.html`, read through it, and understand how the visual structure
maps to the design system before we add any behaviour in later steps.

---

## Atomic Design — the foundation of everything we build

All steps in this learning journey follow **Atomic Design**, a methodology
created by Brad Frost that organises UI components into five layers, from the
smallest indivisible pieces up to full pages.

We use four of those layers:

```
Atoms  ──►  Molecules  ──►  Organisms  ──►  Templates
```

### Atoms

The smallest building blocks. They cannot be broken down further without
losing their meaning.

Examples in the board:
- `<span class="cfb-tag">` — a single coloured badge
- `<div class="cfb-avatar">` — a single person's initials chip
- CSS custom properties (`--color-background`, `--font-size-base`) — design tokens

### Molecules

Groups of atoms working together as a single, reusable unit.

Examples in the board:
- `<article class="cfb-card">` — a session card (title + tags + avatars)
- `<nav class="cfb-navigation">` — the top bar (logo area + user identity)
- `<div class="cfb-avatars">` — the stacked avatar group

### Organisms

Complex sections assembled from molecules (and atoms). They form a
distinct, self-contained region of the UI.

Examples in the board:
- `<section class="cfb-column">` — a day column (heading + stack of cards)
- `<cfb-board-orchestrator>` - this is an orchestrator that is key of the pub/sub flow.
- `<div class="cfb-board">` — the full horizontally scrolling schedule grid

### Templates

Page-level skeletons that place organisms into a layout. In this project the
template is the `<body>` and `<header>` / `<main>` structure together with
`cfb-layout.css`.

---

### Why it matters for this journey

Every custom element we build from Step 1 onwards maps to one of these layers:

| Step | Element | Layer |
|------|---------|-------|
| 1 | `<cfb-tag>` | Atom |
| 2 | `<cfb-session-card>` | Molecule |
| 3 | `<cfb-column>` | Organism |
| 4–6 | data + form elements | Molecule |
| 7 | `<cfb-board-orchestrator>` | Organism |
| 8 | `<cfb-timeline>` | Molecule |
| 9 | `<cfb-occupancy-chart>` | Molecule |

Keeping this hierarchy in mind helps decide where a component lives,
what it should know about, and what it should leave to its parent.
A card should not know about the board; a tag should not know about the card.

---

## How to open Step 0

### Option 1 — Open directly in the browser

Just double-click `index.html`, or drag it into a browser tab.

This works because there is no JavaScript and no ES module imports — the browser
can load everything straight from the filesystem.

### Option 2 — Serve with `http-server`

A local HTTP server is closer to how a real site is served and avoids any
browser security restrictions on `file://` URLs.

**Install once** (requires Node.js):

```bash
npm install -g http-server
```

**Run from this folder:**

```bash
cd frontend/step-0
http-server .
```

Then open the URL printed in the terminal — usually [http://localhost:8080](http://localhost:8080).

**Tip:** add `-o` to open the browser automatically:

```bash
http-server . -o
```
