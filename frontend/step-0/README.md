# Step 0 — The Static Board

Welcome to the weekly frontend challenges: a gradual path toward a conference board using **modern HTML**,
**vanilla JavaScript**, and **Web Components**. Each step has a `README.md` with the same rhythm — learning goal,
then **Connections → Concepts → Concrete practice → Conclusions** (Training from the Back of the Room style).

This step is **structure only**: semantic HTML and the shared `cfb-` CSS. There is **no JavaScript** and no `<cfb-*>`
custom tags in your deliverable in this step. Actually, there is no deliverable except for getting to know the flow
of the exercises.

> **Before you start:** branch, local server, quick visual check — see [getting-started.md](./getting-started.md).

### Async / solo

These challenges are written for **async, often solo** work. Where you see “discuss with a pair,” use
[your Step 0 learning log](./learning-log.md), a short post to your facilitator or team channel, or a 10-minute sync with a colleague.
**Short timeboxes** beat perfect prose.

---

## Learning goal

By the end of this step, you can:

- Explain semantic HTML using the Atomic Design hierarchy used in this challenge.
- Document your personal learning goals for this challenge journey.
- Create a git branch and publish your starting point to your chosen repository.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 0 learning log](./learning-log.md).

1. **Solo, ~1 min — Think it, then ink it**  
   Open [Think it and ink it](./learning-log.md#step-0-think-it-and-ink-it). Answer the motivation question there.

2. **Solo, ~5 min — Top takeaways**  
   In [Top takeaways](./learning-log.md#step-0-top-takeaways), read the nine journey goals and mark **exactly two** with `[x]` — the most relevant for you *right now*.

3. **Optional pair / async, ~3 min**  
   If you have a peer: share which two goals you picked and one sentence why each. If solo: add one line in the log —
   *“The goal I’m most curious about later in the journey is ___.”*

4. **Solo, ~2 min — Bridge toward Step 1**  
   In [Bridge toward Step 1](./learning-log.md#step-0-bridge-step-1), think of the static [index.html](./index.html) page.
   What could be a simple enough structure to make the first custom web component of?
   **Do not** implement custom elements yet.

---

## 2) Concepts

### Atomic Design in this challenge — the foundation of everything we build

All steps follow **Atomic Design** (Brad Frost): organising UI from small pieces up to page layout. This repo uses **four** layers:

```
Atoms  ──►  Molecules  ──►  Organisms  ──►  Templates
```

### Atoms

The smallest building blocks. They cannot be broken down further without losing their meaning.

Examples in the board:

- `<span class="cfb-tag">` — a single colored badge
- `<div class="cfb-avatar">` — a single person's initials’ chip
- CSS custom properties (`--color-background`, `--font-size-base`) — design tokens

### Molecules

Groups of atoms working together as a single, reusable unit.

Examples in the board:

- `<article class="cfb-card">` — a session card (title + tags + avatars)
- `<nav class="cfb-navigation">` — the top bar (logo area + user identity)
- `<div class="cfb-avatars">` — the stacked avatar group

### Organisms

Complex sections assembled from molecules (and atoms). They form a distinct, self-contained region of the UI.

Examples in the board:

- `<section class="cfb-column">` — a day column (heading + stack of cards)
- `<div class="cfb-board">` — the full horizontally scrolling schedule grid

### Templates

Page-level skeletons that place organisms into a layout. In this project the template is the `<body>` and `<header>` / `<main>`
structure together with `cfb-layout.css`.

### Why it matters for this journey

Later steps introduce **custom elements** (`<cfb-tag>`, `<cfb-session-card>`, …). Each maps to a layer so you can decide
boundaries and responsibilities.

| Step | Element                    | Layer    |
|------|----------------------------|----------|
| 1    | `<cfb-tag>`                | Atom     |
| 2    | `<cfb-session-card>`       | Molecule |
| 3    | `<cfb-board-orchestrator>` | Organism |
| 4    | `<cfb-session-store>`      | Organism |
| 5–6  | data + form elements       | Molecule |
| 7    | `<cfb-updates-sessions>`   | Organism |
| 8    | `<cfb-session-listener>`   | Organism |

**Step 0 scope:** your HTML uses **semantic elements and `cfb-` classes only** — no `<cfb-*>` tags and no JavaScript.
The table above is a **roadmap**; you are not building those custom tags until the matching step.

Keeping this hierarchy in mind helps decide where a component lives, what it should know about, and what it should leave
to its parent. For example:
- A card should not know about the board
- A tag should not know about the card.

In short, Atomic Design can be **thought of** as:

- **Atoms**: smallest units (for example, tag chip, avatar chip, design tokens).
- **Molecules**: groups of atoms (for example, session card, navigation row).
- **Organisms**: larger sections (for example, day column, board region).
- **Templates**: page-level structure (`body`, `header`, `main` layout).

### Together with atomic design, we use BEM as a naming convention for CSS classes.

**BEM** appears in every `cfb-block__element` / `cfb-block--modifier` class name — structure and visual variants stay
predictable as the board grows.

Based on feedback and experience from earlier cohorts, towards the end of the journey, the BEM naming convention is
becoming the standard, and you might be surprised to see how things just end up working with it.

A lot of the CSS is already in place, but you can add more classes as you need them.

---

### Concept check — Myth or fact (~4 min)

In [your learning log — Myth or fact](./learning-log.md#step-0-myth-or-fact), mark each line **M** or **F** *before* you change any code; then fix any
you got wrong in one line each.

---

## 3) Concrete practice

1. Create a branch for this learning step (if you have not already — see [getting-started.md](./getting-started.md)).
2. Add or update [`learning-log.md`](./learning-log.md) in **this folder** (`step-0/`).
3. Open [`index.html`](./index.html) and map the board structure (see [Tips](#tips) if needed):
   - header / navigation,
   - day columns,
   - session cards.
4. In DevTools (or by reading the file), verify you can point to **one** example each of an **atom**, a **molecule**,
   an **organism**, and **template**-level structure.
5. In [your learning log — Concrete practice: your myth or fact](./learning-log.md#step-0-concrete-your-myth-fact),
   write **one** myth-or-fact style question of your own and **ask your facilitator** (PR, chat, or sync).
   Paste their reply or your notes in the log.

**Constraints**

- HTML and CSS only — **no** `<script>`, **no** `<cfb-*>` custom elements.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- You can **show** in the browser where atoms, molecules, organisms, and template pieces live in **your** `index.html`.
- Your branch exists and the board renders with the shared stylesheet.
- You have **put one myth/fact question to your facilitator** and captured the answer (or your notes) in the learning log.

---

## 4) Conclusions

Before moving to Step 1, complete these closure checks.

### 1) Quick check

- Can you open your board over HTTP (see [getting-started.md](./getting-started.md))?
- In one breath: what is the difference between a **molecule** and an **organism** on *your* board?

### 2) Myth or Fact revisited — Atomic Design + BEM

You already captured **Myth or fact** in the [learning log](./learning-log.md#step-0-myth-or-fact). Skim your answers:
did anything change after you mapped real HTML?

### 3) Learning log — wrap up

In [your Step 0 learning log](./learning-log.md):

- confirm the **two** outcomes you marked as most important,
- finish **Atomic Design notes** (three key points you want to remember),
- confirm your **own myth/fact question to the facilitator** is written and answered (see [concrete practice](./learning-log.md#step-0-concrete-your-myth-fact)).

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-0-key-takeaway) so your future self (and your facilitator) can
scan the whole journey without opening every detailed log.

---

## Tips

### Structure map

Use the comment block at the top of [`index.html`](./index.html) as a cheat sheet for which regions are atoms, molecules,
organisms, and template-level layout.

### Local server

Commands and folder paths live in [getting-started.md](./getting-started.md). Prefer serving from **`frontend/step-0`** so `../styles.css`
resolves correctly.

---

### End result (skills you can demonstrate)

- Semantic HTML5 landmarks and content sections (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, …).
- BEM-style class names with the `cfb-` prefix.
- Atomic Design vocabulary applied to a real page structure.
