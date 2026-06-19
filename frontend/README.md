# CodeFreeze Board — Weekly Frontend Challenges

Welcome! This is a friendly, low-pressure series of weekly frontend challenges built around a real-world conference
scheduling board. Each week you get one small, focused task that fits comfortably inside **30–45 minutes** — no need to
block out your whole evening.

The goal is to learn by doing. Every step introduces one idea, builds on the last, and leaves you with something you can
actually open in a browser and show off.

This is now fully with JS and ES Modules, but the same principles can be applied if this would be done with TypeScript.
In fact, there is a planned advanced topic that focuses on introducing TypeScript to the project.

---

## What we're building

The end result is a fully interactive **conference board** — a weekly schedule grid where you can browse sessions, add
new ones, load and persist data, and receive live updates over the network.

We get there gradually:

- **Steps 0–2** lay the visual and structural foundation using plain HTML, CSS, and your first Web Components.
- **Steps 3–6** add behaviour: pub/sub events, IndexedDB, HTML forms, and form-associated custom elements.
- **Steps 7–8** integrate with the outside world: `fetch` + MSW mocks, then WebSocket live updates.

The shared stylesheet (`styles.css` and its `css/` imports) is yours from day one — you never have to worry about
styling from scratch. Use [`index.html`](./index.html) at the repo root of `frontend/` as the visual reference for the
finished board. Each challenge is about **HTML structure and JavaScript behaviour**.

**Optional extras** (SVG timeline, Canvas charts, design tokens, import maps, workers, view transitions) are documented
separately in [`PLAN-advanced.md`](./PLAN-advanced.md).

---

## Atomic Design — the mental model we use

Every component we build fits into a layered design system called **Atomic Design**, introduced by Brad Frost. Think of
it as a hierarchy from the tiniest UI pieces up to full page layouts:

```
Atoms  ──►  Molecules  ──►  Organisms  ──►  Templates
```

**Atoms** are the smallest indivisible building blocks — a coloured tag badge, a person's avatar chip, a form-associated
session-type picker.

**Molecules** are groups of atoms working together as one reusable unit — a session card (title + tags + avatars), the
add-session form.

**Organisms** are complete, self-contained sections of the UI assembled from molecules — the schedule grid, the board
orchestrator, live-update wiring.

**Templates** are the page-level skeletons that arrange organisms into a layout — the `<body>`, `<header>`, and `<main>`
structure.

Keeping this hierarchy in mind makes it easy to decide where a new component belongs, what it should know about, and
what it should leave to its parent. A tag shouldn't know about the card that contains it; a card shouldn't know about
the board.

---

## BEM — how we name CSS classes

All CSS classes in this project follow **BEM** (Block, Element, Modifier), prefixed with `cfb-` to keep everything
scoped to this design system.

```
cfb-block
cfb-block__element
cfb-block--modifier
cfb-block__element--modifier
```

**Block** is a standalone, self-contained component — e.g. `cfb-card`, `cfb-tag`, `cfb-column`.

**Element** (double underscore `__`) is a part of a block that has no meaning on its own — e.g. `cfb-card__title`,
`cfb-card__footer`.

**Modifier** (double dash `--`) describes a variation in appearance or state — e.g. `cfb-tag--blue`, `cfb-tag--red`,
`cfb-card--travel`.

A real example from the board:

```html

<article class="cfb-card cfb-card--travel">
    <header class="cfb-card__header">
        <h3 class="cfb-card__title">Opening Keynote</h3>
    </header>
    <div class="cfb-card__tags">
        <span class="cfb-tag cfb-tag--blue">Keynote</span>
    </div>
</article>
```

The modifier `cfb-card--travel` adds the blue left-border variant without touching the base `cfb-card` styles. The
element classes `cfb-card__header`, `cfb-card__title`, and `cfb-card__tags` describe parts that only make sense inside a
card.

This naming convention pays off as the component tree grows: you always know at a glance which block a class belongs to,
and modifiers never accidentally bleed into unrelated components.

---

Here's how each core step maps to a layer:

| Step | What you build                                                          | Layer                   |
|------|-------------------------------------------------------------------------|-------------------------|
| 0    | Static HTML board                                                       | Template                |
| 1    | `<cfb-tag>`                                                             | Atom                    |
| 2    | `<cfb-session-card>`                                                    | Molecule                |
| 3    | `<cfb-board-orchestrator>`, `<cfb-schedule>`, `<cfb-session-generator>` | Organism                |
| 4    | IndexedDB store + schedule rendering from persistence                   | Storage + Organism      |
| 5    | `<cfb-add-session-form>`                                                | Molecule                |
| 6    | `<cfb-session-type>` (form-associated)                                  | Atom                    |
| 7    | API loaders, orchestrator, MSW                                          | Organism / side-effects |
| 8    | `<cfb-live-updates>` (WebSocket + MSW)                                  | Organism                |

---

## The steps at a glance

| Step | Title                                      | Status   |
|------|--------------------------------------------|----------|
| 0    | The Static Board                           | ✅ done   |
| 1    | `<cfb-tag>` — Basic Web Component          | 🚧 ready |
| 2    | `<cfb-session-card>` — Composite Component | ⬜ todo   |
| 3    | `<cfb-board-orchestrator>` — Pub/Sub       | ⬜ todo   |
| 4    | Load from IndexedDB                        | ⬜ todo   |
| 5    | Add a Session — HTML Form Elements         | 🚧 ready |
| 6    | `<cfb-session-type>` — Custom Form Element | 🚧 ready |
| 7    | Load from Backend — `fetch` + MSW          | ⬜ todo   |
| 8    | Live Updates — WebSocket + MSW             | ⬜ todo   |

Each step has its own folder (`step-0/`, `step-1/`, … `step-8/`) with a **`README.md`** (goal, deliverables,
constraints, optional extras) and often a **`getting-started.md`** (branch, local server, first browser check).

| Step | One-line focus                                                              |
|------|-----------------------------------------------------------------------------|
| 0    | Replace custom tags with semantic HTML; no JavaScript.                      |
| 1    | First custom element: reactive `data-label` / `data-color`.                 |
| 2    | Compose `<cfb-tag>` inside a session card from JSON data.                   |
| 3    | Custom events bubble up; orchestrator pushes state down via attributes.     |
| 4    | Seed and read sessions from IndexedDB; render the board from storage.       |
| 5    | Native form validation and `FormData`; dispatch into the existing pipeline. |
| 6    | Form-associated custom control with `ElementInternals`.                     |
| 7    | Loaders `fetch` schedule + sessions; MSW stands in for the API.             |
| 8    | WebSocket pushes updates; same orchestrator refresh path as Step 7.         |

### Learning logs

- [`how-to.md`](./how-to.md) — how to move between each step’s **README** (guide) and **learning-log** (your answers)
  through the 4C flow.
- [`learning-log.md`](./learning-log.md) in `frontend/` is the **hub**: a short **key takeaway** per step plus links to
  every detailed log.
- Each `step-N/` folder has its own `learning-log.md` for longer notes and session prompts (Training from the Back of
  the Room style).

### Learning goals summary

[`learning-goals.md`](./learning-goals.md) lists the measurable outcomes per step in one place — useful when you are
choosing which steps to run in which week.

---

## Advanced topics (optional)

After the core arc (Steps 0–8), colleagues can pick up standalone sessions from [
`PLAN-advanced.md`](./PLAN-advanced.md):

| Topic | Title                            | Browser API                         |
|-------|----------------------------------|-------------------------------------|
| A     | `<cfb-timeline>` — SVG           | Inline SVG, SMIL                    |
| B     | `<cfb-occupancy-chart>` — Canvas | Canvas 2D, `requestAnimationFrame`  |
| C     | Design Tokens & Theming          | CSS custom properties, `@layer`     |
| C½    | Packaging & ES Modules           | Native modules, import maps         |
| D     | Import Maps                      | Module resolution without a bundler |
| E     | Web Workers                      | Off-main-thread work                |
| F     | View Transitions                 | `document.startViewTransition`      |
| G     | Shadow dom                       | Working with shadow dom             |
| H     | Slots                            | Working with slots                  |
| I     | Typescript                       | Using TypeScript instead of JS      |

These do not block the main weekly path; tackle them in any order.

---

## Testing track

Running alongside the component steps is a **companion testing track** — challenges focused on testing the same
components you build, using a real browser test runner instead of JSDOM.

See [`PLAN-TEST.md`](./PLAN-TEST.md) for the full plan. The testing steps live in their own folders (`test-0/`,
`test-1/`, …) and can be tackled in parallel with the matching component step or as a separate session.

| Test step | Title                                      | Mirrors | Extras           |
|-----------|--------------------------------------------|---------|------------------|
| T-0       | Setup — Web Test Runner                    | —       | -                |
| T-1       | Atom Behaviour — `<cfb-tag>`               | Step 1  | -                |
| T-2       | Molecule Behaviour — `<cfb-session-card>`  | Step 2  | -                |
| T-3       | Pub/Sub — `cfb-session-created` event flow | Step 3  | contract testing |
| T-4       | IndexedDB Store — async round-trips        | Step 4  | contract testing |
| T-5       | Form Validation — constraint API           | Step 5  | -                |
| T-6       | Custom Form Element — `ElementInternals`   | Step 6  | -                |
| T-7       | Loader Components — fetch stubbing         | Step 7  | -                |
| T-8       | Live Updates — WebSocket stub              | Step 8  | -                |

### Why test in a real browser?

JSDOM does not support Custom Elements or Shadow DOM, so standard Jest setups simply cannot run these tests.
`@web/test-runner` launches a real Chromium instance — the same engine your components run in — so
`customElements.define()`, `connectedCallback`, and Shadow DOM all work exactly as in production.

Start with **`test-0/`** to get the toolchain up and running (≈20 minutes), then pick up individual test steps as you
finish the matching component step.

---

## How to get started

Each step folder is self-contained. **Step 0** is HTML and CSS only — you can open `step-0/index.html` via a local
server or sometimes directly from disk. **From Step 1 onward**, serve the step folder over HTTP so ES modules load
correctly (`file://` blocks `type="module"`).

Every step’s **`getting-started.md`** has the exact commands for that week. The usual pattern:

**Install once** (requires Node.js) — optional if you prefer `npx`:

```bash
npm install -g http-server
```

**Run a step** (example — Step 1):

```bash
cd frontend
http-server . -o
```

That will open the static index.html in your browser. and that will have a quick access to any of the step-specific
pages for easy testing.

---

## A few friendly ground rules

- **Keep it to 30–45 minutes.** If you're not done, that's completely fine — pick it up next week or share what you
  have. The point is the learning, not the finish line.
- **No frameworks.** Each challenge uses plain HTML, CSS, and vanilla JavaScript only. This is intentional — it's how
  you build a solid understanding of the platform before layering abstractions on top.
- **Extras are optional.** Each step has a list of bonus tasks for those who finish early. They're there if you want
  them, not because you're expected to do them all.
- **Build on what you wrote.** Each step continues from the previous one. Keep your files week to week — by the end
  you'll have a working app you built yourself, piece by piece.
- **Share what you make.** A short screen recording or a CodePen link is always welcome. It's fun to see the same
  problem solved in different ways.

Happy coding!
