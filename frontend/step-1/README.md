# Step 1 — Your First Board Atom: `<cfb-tag>`

One cornerstone of the W3C Web Components approach is **custom elements**: HTML whose behaviour is defined in
JavaScript. In this step you build `<cfb-tag>` — an example of the smallest building blocks (**atom**) of the CodeFreeze
Board: the colored badge on every session card.

```html
<cfb-tag data-label="Keynote" data-color="blue"></cfb-tag>
```

> **Before you start:** make sure the page loads over HTTP — see [getting-started.md](./getting-started.md).

### Async / solo

These steps are written for **async, often solo** work. Where the README says *“in pairs”* or *“compare with someone”*,
use one of these instead: write in [your Step 1 learning log](./learning-log.md) as your stand-in partner, post one line
in your team channel, or book 10 minutes with a colleague. **Short timeboxes** matter more than the social format.

---

## Learning goal

By the end of this step, you can:

- Build your first custom HTML element (`<cfb-tag>`).
- Demonstrate how to see its behaviour in the browser (lifecycle, attribute changes).

---

## 1) Connections

Do these in order; capture answers in [your Step 1 learning log](./learning-log.md).

1. **Solo, ~2 min — “What runs first?”**  
   Before reading the Concepts section, write one guess: if you create an element with
   `document.createElement('cfb-tag')`, set `data-label`, then append it to the body, which runs first —
   `connectedCallback` or `attributeChangedCallback`? (You will revisit this in Conclusions.)

2. **Solo + log, ~3 min — Framework lifecycles**  
   In the learning log, compare **React / Vue / Angular** lifecycle ideas to **custom elements**: how do “mount /
   update” style hooks map to `connectedCallback` and `attributeChangedCallback`?

3. **Solo, ~3 min — Bridge from Step 0**  
   Open **your** Step 0 board (`step-0/index.html` or wherever you finished Step 0). Find **one** tag atom written as
   `<span class="cfb-tag …">…</span>`.
   In [your learning log — Bridge from Step 0](./learning-log.md#step-1-bridge-step-0), write:
    - the **visible label text** on that atom;
    - the **full `class` value** on that `<span>` (including the colour modifier, if any);
    - one line: what moves from “classes + inner text” into **`<cfb-tag data-label="…" data-color="…">`** in this step?
      If you skipped Step 0, use the shared static board in [`../step-0/index.html`](../step-0/index.html) (or [
      `../index.html`](../index.html)) and pick any `<span class="cfb-tag …">` atom there instead.

5. **Solo, ~2 min — Topic link (you, not the abstract “learner”)**  
   In [your learning log — Topic link](./learning-log.md#step-1-topic-link), answer **one** of these (whichever is
   easier):
    - **A)** Name a small presentational piece of UI you have built before (badge, atom, tag, pill, status dot, etc.)
      and what stack it lived in (React, Vue, Svelte, plain HTML/CSS, design system, …). One sentence: what did *that*
      component “own”?
    - **B)** If nothing comes to mind: open [Step 0 — Top takeaways](../step-0/learning-log.md#step-0-top-takeaways).
      Which goal you marked is **most** served by learning `<cfb-tag>` now — and why, in one sentence?

---

## 2) Concepts

Custom elements expose lifecycle callbacks you hook into at key moments:

1. **`connectedCallback`** — the custom element was inserted into the document
   (use to initialise, render, subscribe to events).
2. **`disconnectedCallback`** — the element is removed from the document
   (use to clean up listeners, timers, etc.).
3. **`attributeChangedCallback`** — an **observed** attribute was added, removed, or changed. Declare which attributes
   count via static **`observedAttributes`**.
   (use to track changes to the data)
4. **`adoptedCallback`** — moved to another document (e.g. `adoptNode`).
   (Not used in these challenges.)

These callbacks can run in **different orders** depending on whether you set attributes before or after the element
is added to DOM.

### Scenario 1: `connected` → `disconnected` (no attribute changes)

```plaintext
+-------------------+        +----------------------+
| connectedCallback | -----> | disconnectedCallback |
+-------------------+        +----------------------+
```

**When:** The element is in the DOM (added as static HTML, `appendChild`, or `innerHTML`) and
**no observed attribute changes** happen after connect. In this scenario, the `attributeChangedCallback` never is
executed.

### Scenario 2: `connected` → `attributeChanged` → `disconnected`

```plaintext
+-------------------+        +--------------------------+        +----------------------+
| connectedCallback | -----> | attributeChangedCallback | -----> | disconnectedCallback |
+-------------------+        +--------------------------+        +----------------------+
```

**When:** The element is connected first; later an observed attribute is updated (e.g. `setAttribute('data-label', …)`).

### Scenario 3: `attributeChanged` → `connected` → `disconnected`

```plaintext
+--------------------------+        +-------------------+        +----------------------+
| attributeChangedCallback | -----> | connectedCallback | -----> | disconnectedCallback |
+--------------------------+        +-------------------+        +----------------------+
```

**When:** You set attributes on a **disconnected** node, then append it. `attributeChangedCallback` can run **before**
`connectedCallback`.

### Key takeaways

- Order depends on **when** the element is connected **relative to** when observed attributes change.
- **Scenario 1:** connect only — typical for static markup with no post-connect attribute updates;
  `attributeChangedCallback` may never run.
- **Scenario 2:** connect, then attribute updates while in the document.
- **Scenario 3:** attribute updates on a disconnected node, then connect. Typical scenario when building dynamically
  the board.

---

### Concept check — Myth or fact (~4 min)

In [your learning log](./learning-log.md#step-1-myth-or-fact), mark each **M** (myth) or **F** (fact) *before* you peek
at any docs; later, fix any you got
wrong in one line each.

---

### Ideas this step is built on

To show the newly built custom web component, we'll do all the following steps;

- **Custom element lifecycle** — defining `connectedCallback` to render the whole tag as a static element.
- **Reactive attributes** — using `observedAttributes` + `attributeChangedCallback` to make UI adaptive to
  changes when when `data-label` or `data-color` changes.
- **Data → presentation** — use `data-color` to map it to existing CSS modifier `cfb-tag--{color}`
  (supported colors: `red | orange | green | blue | purple`).
- **Registration** — Register the custom web component for DOM by calling `customElements.define('cfb-tag', CfbTag)`.
  This tells the browser to link the web component behavior to the said html tag.

**Atomic Design** — `<cfb-tag>` is an **atom**: it should not know about cards, columns, or the board.

---

## 3) Concrete practice

(for help, see [Tips](./tips.md) later in this document)

Build `<cfb-tag>` so that you can **show** all of the following:

- [ ] Create `step-1/cfb-tag.js` and register the element from `index.js`.
- [ ] Make the element to display a hard-coded <span> element (for quick feedback)
- [ ] Render a styled badge using the existing `cfb-tag` CSS classes (see the index.html on the classes used).
- [ ] Read `data-label` and show it as the badge text.
- [ ] Read `data-color` and apply `cfb-tag--{color}`.
- [ ] Render on connect (`connectedCallback`).
- [ ] Re-render when `data-label` or `data-color` change after mount (`observedAttributes` +
  `attributeChangedCallback`).
- [ ] Replace placeholder `<span class="cfb-tag …">` tags in `index.html` with `<cfb-tag …>` and verify in the browser.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only — no frameworks or libraries.
- Aim for about **30 minutes** on the core challenge.

**Extras** (if you finish early)

- [ ] Shadow DOM (`attachShadow({ mode: 'open' })`) to encapsulate tag styles.
- [ ] `data-count` for a small number badge (e.g. `Keynote ×3`).
- [ ] Unknown or missing `data-color` falls back to the default `cfb-tag` style.

---

### One minute review

In [your learning log](./learning-log.md#step-1-one-minute-review), review what surprised you on building your first
web component in CFB board?

---

## 4) Conclusions

Before moving to Step 2, use [your Step 1 learning log](./learning-log.md).

### 1) Component ownership — learning log

Write **one or two sentences**:

- What does **this component own**?
- What is the **behaviour** on connect and on attribute change?

### 2) Quick check

- In DevTools, can you point to where the class is defined and where `customElements.define` runs?
- In one line: what is one difference between “static span + classes” and “`<cfb-tag>` + attributes”?

### 3) Loop back to Connections

Open your answer to **“What runs first?”** from Connections. Update it if your understanding changed. One line in the
log is enough.

### 4) One commitment (~2 min)

Complete in the learning log:

> *Next time I build a presentational custom element, I will ___.*

### 5) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-1-key-takeaway) so you can
scan the whole challenge later without opening every step’s detailed log.

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note the problem in your learning log or ping your facilitator.

---

## Extras

If you finish early:

- [ ] make sure you don't add a class 'cfb-card--' if there is no data-color attribute set.
- [ ] use both `dataset` and `getAttribute` to get the data-attributes.

---

### End result (skills you can demonstrate)

- Define a custom element with `customElements.define()`.
- Use `connectedCallback` when the element enters the DOM.
- Use `observedAttributes` and `attributeChangedCallback` for attribute-driven updates.
- Map `data-*` attribute values to CSS modifier classes.
