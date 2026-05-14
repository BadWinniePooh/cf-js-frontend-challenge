# Step 2 — Composing a molecule: `<cfb-session-card>`

In Step 1 you built an **atom** — `<cfb-tag>`. Now you **compose** atoms into a **molecule**: the session card used in 
every column.

A molecule wraps smaller pieces (tags, avatars) behind one tag name and one rendering boundary. 
You will implement **`<cfb-session-card>`** — the finished markup, JSON attribute name, and **rich attendee** payload 
shape are spelled out in **[Concrete practice](#3-concrete-practice)** (after Connections and Concepts).

> **Before you start:** branch, HTTP server, console clean — see [getting-started.md](./getting-started.md).

### Async / solo

These challenges are written for **async, often solo** work. Use [your Step 2 learning log](./learning-log.md), 
a short message to your facilitator or team, or a brief sync when the README says “pair.” **Short timeboxes** matter 
more than the format.

---

## Learning goal

By the end of this step, you can:

- Build a **composite** custom element that outputs the same semantic card structure as [the static Step 0 board](../step-0/index.html).
- **Compose** one or more `<cfb-tag>` atoms inside the card’s tags row.
- Pass **structured session data** (including rich attendees) into the card and **re-render** when that input changes 

---

## 1) Connections

Do these **in order**; capture answers in [your Step 2 learning log](./learning-log.md).

1. **Solo, ~2 min — Where does session data live?**  
   Before Concepts: answer in [Where does session data live?](./learning-log.md#step-2-connections-where-data-lives). 
   *(You will revisit this in Conclusions.)*

2. **Solo, ~3 min — Bridge from Step 1**  
   In [Bridge from Step 1](./learning-log.md#step-2-bridge-step-1), relate one `<cfb-tag>` on your Step 1 page to the 
   tags row of the card.

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-2-connections-surprise): hardest part of composing components — one sentence.

4. **Solo, ~2 min — Topic link**  
   [Topic link](./learning-log.md#step-2-topic-link): answer **A** or **B**.

---

## 2) Concepts

### Molecule vs atom

- **`<cfb-session-card>`** owns the **card chrome**: layout regions (header, tags row, footer), the menu control, 
  and **mapping** session data → child tags / avatars.
- **`<cfb-tag>`** stays an atom: it only knows label + colour — the card passes those via attributes (and later might
  have some hover-over functionality, but that is the responsibility of that said **atom**).

### Data flow

- **Parent → children:** the card parses JSON and sets **`data-label` / `data-color`** on each `<cfb-tag>` 
  (or builds equivalent markup that sets those attributes).
- **Structured input:** keep session data in one attribute (`data-session-details`) as JSON — same pattern used later on
  the full board. Keep payloads reasonably small. Later we will learn other ways to pass data from parent to child.
  Passing throught attributes is not the only way, but the simplest

### Lifecycle

- Implement **`connectedCallback`** for first paint (often after reading attributes).
- Declare **`observedAttributes`** to include `data-session-details` (and any other `data-*` you observe).
- Use **`attributeChangedCallback`** to parse JSON and **re-render** when the attribute changes (e.g. DevTools edit or
  parent updates).

### Rendering notes

- **`innerHTML`** with strings that include `<cfb-tag>` is a common approach; the parser creates elements and custom 
  elements **upgrade** like any other HTML. (Alternatives: `document.createElement`, templates — see Extras.)
- **Slots** (`<slot>`) are an alternative way to project content without stuffing JSON into one attribute — optional 
  deeper dive in Extras.

### One-minute review (~1 min)

After you have read the Concepts sections above, capture a quick note in [your learning log — One-minute review](./learning-log.md#step-2-concepts-one-minute) (Training from the Back of the Room: land the ideas before Myth or fact).

---

### Concept check — Myth or fact (~4 min)

Complete [Myth or fact (composition + data)](./learning-log.md#step-2-myth-or-fact) in your learning log **before** you assume your implementation is done.

---

## 3) Concrete practice

### Reference — markup and session payload

Use **`data-session-details`** with JSON that matches the shape below. **Rich attendee** objects include **`name`** 
(full name, e.g. for `aria-label`) and **`initials`** (visible chip text).

```html
<cfb-session-card
  data-session-details='{"title":"Opening Keynote","tags":[{"label":"Keynote","color":"blue"}],"attendees":[{"name":"Aino Korhonen","initials":"AK"},{"name":"Jess Smith","initials":"JS"}]}'>
</cfb-session-card>
```

Build `<cfb-session-card>` so you can **show** all of the following:

- [ ] Create `cfb-session-card.js` and register **`cfb-session-card`** from `index.js` (alongside `<cfb-tag>` from
      Step 1 — see `index.js` import pattern).
- [ ] Render a card that visually matches the **static** session cards in [`../step-0/index.html`](../step-0/index.html): 
      header with **title** and **`⋯` menu** control, **tags row** using **`<cfb-tag>`**, **footer** with attendee 
      **initials** in `cfb-avatar` chips.
- [ ] Hold session data in a **small internal structure** first if you like, then drive the UI from a parsed 
      **`data-session-details`** JSON attribute.
- [ ] Use **`connectedCallback`** for initial render path.
- [ ] Use **`observedAttributes` + `attributeChangedCallback`** so changing `data-session-details` **re-renders** the card.
- [ ] Session JSON shape (minimum fields used in this step):

```json
{
  "title": "Opening Keynote",
  "tags": [{ "label": "Keynote", "color": "blue" }],
  "attendees": [
    { "name": "Aino Korhonen", "initials": "AK" },
    { "name": "Jess Smith", "initials": "JS" }
  ]
}
```

- [ ] Replace static `<article class="cfb-card">…` placeholders in [`index.html`](./index.html) with your `<cfb-session-card>` elements.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only — no frameworks.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- Editing **`data-session-details`** in DevTools (or in HTML) updates the visible title, tags, and avatars without a full page reload.
- At least **two** `<cfb-tag>` chips render from session `tags`.
- Avatars use **`initials`** visibly and expose **`name`** where appropriate (e.g. `aria-label` on the chip).

In [Concrete practice: myth or fact for the facilitator](./learning-log.md#step-2-concrete-facilitator-myth-fact), write one question of your own and **ask your facilitator**; capture the reply in the log.

---

## 4) Conclusions

### 1) Quick check

- Where is `CfbSessionCard` defined, and where is `customElements.define` called?
- In one line: who **owns** JSON parsing — the card or `<cfb-tag>`?

### 2) True / False — composition

Complete [True / False — duplicated markup](./learning-log.md#step-2-true-false-composition).

### 3) Loop back

Update [Where does session data live?](./learning-log.md#step-2-loop-back-data) if your answer changed.

### 4) Commitment

Complete [Commitment](./learning-log.md#step-2-commitment) in the log.

### 5) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-2-key-takeaway).

---

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### Import `<cfb-tag>` from Step 1

`index.js` should register **`cfb-tag`** before **`cfb-session-card`** so tags inside the card upgrade correctly. 
This repo imports from [`../step-1/cfb-tag.js`](../step-1/cfb-tag.js) — keep `step-1/` beside `step-2/` or adjust the path.

### Skeleton `innerHTML`

You can start from an `<article class="cfb-card">` shell matching Step 0 and fill header, `cfb-card__tags`, and footer 
- same structure as the static board.

```js
// Shape only — yours will call #render from lifecycle callbacks
const raw = this.getAttribute('data-session-details')
const session = raw ? JSON.parse(raw) : {}
```

---

## Extras

If you finish early:

- [ ] Name **2–3 other ways** to pass session data into the component (props object only in JS, separate attributes per
      field, slots, etc.) — trade-offs in one short paragraph in your log.
- [ ] Try **named `<slot>`** elements instead of (or alongside) JSON — what changes in coupling?
- [ ] Support **`data-variant="travel"`** → `cfb-card--travel` **modifier** on the article.
- [ ] Experiment with **Shadow DOM** for the card vs light DOM — what breaks or improves?

---

### End result (skills you can demonstrate)

- Compose **`<cfb-tag>` inside `<cfb-session-card>`**.
- Pass structured data via a **JSON `data-session-details`** attribute (**rich attendees**).
- Use **`observedAttributes` + `attributeChangedCallback`** to react to data changes.
- Explain **parent → child** data flow for tags and avatars on the board.
