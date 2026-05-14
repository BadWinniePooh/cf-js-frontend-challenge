# Step 1 — Your First Board Atom: `<cfb-tag>`

One cornerstone of the W3C Web Components approach is **custom elements**: HTML whose behaviour is defined in JavaScript.
In this step you build `<cfb-tag>` — the smallest building block (**atom**) of the CodeFreeze Board: 
the coloured badge on every session card.

```html
<cfb-tag data-label="Keynote" data-color="blue"></cfb-tag>
```

> **Before you start:** make sure the page loads over HTTP — see [getting-started.md](./getting-started.md).

### Async / solo 

These steps are written for **async, often solo** work. Where the README says *“in pairs”* or *“compare with someone”*,
use one of these instead: write in [your Step 1 learning log](./learning-log.md) as your stand-in partner, post one line in your team channel,
or book 10 minutes with a colleague. **Short timeboxes** matter more than the social format.

---

## Learning goal

By the end of this step, you can:

- Build your first custom HTML element (`<cfb-tag>`).
- Demonstrate how to see its behaviour in the browser (lifecycle, attribute changes).

---

## 1) Connections

Do these in order; capture answers in [your Step 1 learning log](./learning-log.md).

1. **Solo, ~2 min — “What runs first?”**  
   Before reading the Concepts section, write one guess: if you create an element with `document.createElement('cfb-tag')`,
   set `data-label`, then append it to the body, which runs first — `connectedCallback` or `attributeChangedCallback`? 
   (You will revisit this in Conclusions.)

2. **Solo + log, ~3 min — Framework lifecycles**  
   In the learning log, compare **React / Vue / Angular** lifecycle ideas to **custom elements**: how do “mount / update” 
   style hooks map to `connectedCallback` and `attributeChangedCallback`?

3. **Optional pair / async, ~3 min**  
   If you have a peer: compare your answer from (2) in one sentence each. If solo: add one sentence in the log: 
   *“The biggest surprise for me was ___.”*

4. **Solo, ~3 min — Bridge from Step 0**  
   Open **your** Step 0 board (`step-0/index.html` or wherever you finished Step 0). Find **one** tag chip written as  
   `<span class="cfb-tag …">…</span>`. In [your learning log — Bridge from Step 0](./learning-log.md#step-1-bridge-step-0), write:
   - the **visible label text** on that chip;
   - the **full `class` value** on that `<span>` (including the colour modifier, if any);
   - one line: what moves from “classes + inner text” into **`<cfb-tag data-label="…" data-color="…">`** in this step?
   If you skipped Step 0, use the shared static board in [`../step-0/index.html`](../step-0/index.html) (or [`../index.html`](../index.html)) and pick any `<span class="cfb-tag …">` chip there instead.

5. **Solo, ~2 min — Topic link (you, not the abstract “learner”)**  
   In [your learning log — Topic link](./learning-log.md#step-1-topic-link), answer **one** of these (whichever is easier):
   - **A)** Name a small presentational piece of UI you have built before (badge, chip, tag, pill, status dot, etc.) 
     and what stack it lived in (React, Vue, Svelte, plain HTML/CSS, design system, …). One sentence: what did *that* component “own”?
   - **B)** If nothing comes to mind: open [Step 0 — Top takeaways](../step-0/learning-log.md#step-0-top-takeaways). 
     Which goal you marked is **most** served by learning `<cfb-tag>` now — and why, in one sentence?

---

## 2) Concepts

Custom elements expose lifecycle callbacks you hook into at key moments:

1. **`connectedCallback`** — the custom element was inserted into the document (initialise, render, subscribe).
2. **`disconnectedCallback`** — removed from the document (clean up listeners, timers, etc.).
3. **`attributeChangedCallback`** — an **observed** attribute was added, removed, or changed. Declare which attributes count via static **`observedAttributes`**.
4. **`adoptedCallback`** — moved to another document (e.g. `adoptNode`). Not used in these challenges.

These callbacks can run in **different orders** depending on whether you set attributes before or after the element is connected.

### Scenario 1: `connected` → `disconnected` (no attribute changes)

```plaintext
+-------------------+        +----------------------+
| connectedCallback | -----> | disconnectedCallback |
+-------------------+        +----------------------+
```

**When:** The element is in the DOM (static HTML, `appendChild`, or `innerHTML`) and **no observed attribute changes** happen after connect. Then `attributeChangedCallback` never runs.

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

**When:** You set attributes on a **disconnected** node, then append it. `attributeChangedCallback` can run **before** `connectedCallback`.

### Key takeaways

- Order depends on **when** the element is connected **relative to** when observed attributes change.
- **Scenario 1:** connect only — typical for static markup with no post-connect attribute updates; `attributeChangedCallback` may never run.
- **Scenario 2:** connect, then attribute updates while in the document.
- **Scenario 3:** attribute updates on a disconnected node, then connect.

---

### Concept check — Myth or fact (~4 min)

In [your learning log](./learning-log.md#step-1-myth-or-fact), mark each **M** (myth) or **F** (fact) *before* you peek at any docs; then fix any you got wrong in one line each.

1. `attributeChangedCallback` runs for every HTML attribute as soon as you set it, even if the name is not listed in `observedAttributes`.
2. If the element is only ever declared in HTML with fixed `data-*` values and you never change them from JS, `attributeChangedCallback` might never run.
3. `connectedCallback` is always guaranteed to run before any `attributeChangedCallback` for that element.

---

### Ideas this step is built on

- **Custom element lifecycle** — `connectedCallback` when the element enters the document (use it for first render if you need the element to be live in the tree).
- **Reactive attributes** — `observedAttributes` + `attributeChangedCallback` so the UI updates when `data-label` or `data-color` change.
- **Data → presentation** — map `data-color` to the existing CSS modifier `cfb-tag--{color}` (`red | orange | green | blue | purple`).
- **Registration** — `customElements.define('cfb-tag', CfbTag)` wires the class to the tag name.

**Atomic Design** — `<cfb-tag>` is an **atom**: it should not know about cards, columns, or the board.

---

## 3) Concrete practice

Build `<cfb-tag>` so that you can **show** all of the following:

- [ ] Create `step-1/cfb-tag.js` (or your folder’s equivalent) and register the element from `index.js`.
- [ ] Render a styled badge using the existing `cfb-tag` CSS classes.
- [ ] Read `data-label` and show it as the badge text.
- [ ] Read `data-color` and apply `cfb-tag--{color}`.
- [ ] Render on connect (`connectedCallback`).
- [ ] Re-render when `data-label` or `data-color` change after mount (`observedAttributes` + `attributeChangedCallback`).
- [ ] Replace placeholder `<span class="cfb-tag …">` tags in `index.html` with `<cfb-tag …>` and verify in the browser.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only — no frameworks or libraries.
- Aim for about **30 minutes** on the core challenge.

**Extras** (if you finish early)

- [ ] Shadow DOM (`attachShadow({ mode: 'open' })`) to encapsulate tag styles.
- [ ] `data-count` for a small number badge (e.g. `Keynote ×3`).
- [ ] Unknown or missing `data-color` falls back to the default `cfb-tag` style.

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

Open your answer to **“What runs first?”** from Connections. Update it if your understanding changed. One line in the log is enough.

### 4) One commitment (~2 min)

Complete in the learning log:

> *Next time I build a presentational custom element, I will ___.*

### 5) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-1-key-takeaway) so you can scan the whole challenge later without opening every step’s detailed log.

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note the problem in your learning log or ping your facilitator.

---

## Tips

### Keep the component in its own file

Put the class in `cfb-tag.js`, then import and register from `index.js`:

```js
// index.js
import { CfbTag } from './cfb-tag.js'

customElements.define('cfb-tag', CfbTag)
```

```js
// cfb-tag.js
export class CfbTag extends HTMLElement {
  // ...
}
```

*(Alternatively `import './cfb-tag.js'` if the module self-registers — pick one style and stay consistent.)*

### Local web server

See [getting-started.md](./getting-started.md) for commands. ES modules **do not** load from `file://`.

---

### End result (skills you can demonstrate)

- Define a custom element with `customElements.define()`.
- Use `connectedCallback` when the element enters the DOM.
- Use `observedAttributes` and `attributeChangedCallback` for attribute-driven updates.
- Map `data-*` attribute values to CSS modifier classes.
