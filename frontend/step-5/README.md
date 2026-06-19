# Step 5 — Add a Session · HTML Form Elements

In Step 4 you persisted sessions in **IndexedDB** and refreshed the board with a **signal** (`cfb-sessions-loaded-to-idb`
→ **`data-latest-updated-at`** → schedule **pulls** rows). This step swaps the **random generator** for a 
**real HTML form**: native constraints, **`FormData`**, and the **same** **`cfb-session-created`** pipeline so storage 
and schedule stay boring.

**Brain-friendly (solo / async):** this README uses **short sections** and **different** activity types in \
[your Step 5 learning log](./learning-log.md) — writing, a quick **sketch**, myth/fact, quiz, ticket out — inspired 
by **Training from the Back of the Room** where they still fit without a live room.

> **Before you start:** branch, HTTP server, same origin for IDB — see [getting-started.md](./getting-started.md).

### Async / solo

Use [your Step 5 learning log](./learning-log.md), a short note to your facilitator, or a sync when the README says
“compare.” **Timeboxes** beat polish.

---

## Learning goal

By the end of this step, you can:

- Build **`<cfb-add-session-form>`** that owns a **`<form>`** (and in this repo, a **`<dialog>`** shell):
  **required** / **`minlength`** / **`type="time"`** on the right controls, **`<fieldset>`** + **`<legend>`** for groups.
- On submit: **`preventDefault`**, **`checkValidity`** + **`reportValidity`**, **`new FormData(form)`**, build a 
  **session** object with **`crypto.randomUUID()`** for **`id`** (never a user field), dispatch **`cfbSessionCreated`** 
  (same contract as Step 3/4).
- Explain why the **store → `cfb-sessions-loaded-to-idb` → orchestrator → `data-latest-updated-at`** path still works 
  when the **only** UI change is the form.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 5 learning log](./learning-log.md).

1. **Solo, ~2 min — Think → ink (submit guess)**  
   [Submit guess](./learning-log.md#step-5-connections-submit-guess) *(revisit in [Loop back — submit guess](./learning-log.md#step-5-loop-back-submit-guess)).*

2. **Solo, ~3 min — Bridge from Step 4**  
   [Bridge from Step 4](./learning-log.md#step-5-connections-bridge-step4).

3. **Solo, ~1 min — Who owns the `id`?**  
   [Who owns the `id`?](./learning-log.md#step-5-connections-id-owner).

4. **Solo, ~3 min — Surprise or compare**  
   [Surprise or compare](./learning-log.md#step-5-connections-surprise).

5. **Solo, ~2 min — Where do you stand**  
   [Where do you stand](./learning-log.md#step-5-connections-where-stand) **A** or **B**.

---

## 2) Concepts

### Native validation vs your submit handler

The browser enforces **`required`**, **`minlength`**, **`type`**, and radio **group** rules. Your job is a **thin bridge**:
**`form.checkValidity()`** (boolean guard) and **`form.reportValidity()`** (surface native messages). 
Avoid duplicating those rules in **`if (title.length < 5)`**-style JS.

A **text** field with constraints might look like this — notice **`name`**: that string becomes the **key** in **`FormData`**,
not the **`id`** (the **`id`** is for **`label for="…"`** and anchors, not for submit keys).

```html
<label for="titleData">Title</label>
<input id="titleData" name="title" type="text" required minlength="5">
```

### `FormData` — one readout

**`new FormData(form)`** walks the form’s **subtree** and collects **successful controls** that have a **`name`**. 
Each entry is **`(name, value)`** — the **`name`** is the dictionary key in JS. An example could be: 
```js
const form = this.querySelector('form') // this is a <cfb-add-session-form>
const data = new FormData(form)
const title = data.get('title')
const sessionType = data.get('session-type')
```

**`name` vs `id`**

To understand some of the differences between **`name`** and **`id`** attributes in HTML forms, let's break down their roles and usage scenarios:

| Attribute   | Typical job                                                                                                                                       |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **`name`**  | **`FormData`** key; **radio** siblings share one **`name`** so the browser treats them as one group and only the **checked** option is submitted. |
| **`id`**    | Pair a `` `<label for="…">` `` with a control, deep-linking, **`getElementById`**                                                                 |

As seen from the table above, **`name`** is the **key** in **`FormData`**. The **`id`** is for **deep linking** and **labelling**. 
Do not assume **`name`** and **`id`** are the same string.

**Text + select** — each control that should appear in the payload needs its own **`name`** (often matching the field you map into the session object):

```html
<input name="title" type="text" required minlength="5">

<select name="day" required>
  <option value="Wednesday">Wednesday</option>
  <option value="Thursday">Thursday</option>
  <option value="Friday">Friday</option>
</select>
```

**Radio group** — same **`name`** on every option; the **`value`** on each **`<input>`** is what**`FormData.get('session-type')`** returns for the selected one:

```html
<fieldset>
  <legend>Session type</legend>
  <label><input type="radio" name="session-type" value="Talk" required> Talk</label>
  <label><input type="radio" name="session-type" value="Workshop"> Workshop</label>
  <label><input type="radio" name="session-type" value="Keynote"> Keynote</label>
</fieldset>
```

**FormData with elements that does not have data:**. If control does not have **`name`**, is `disabled`, or unchecked checkboxes
are omitted from the formData payload

### `<dialog>` as chrome, `<form>` as contract

The trigger opens **`showModal()`**; cancel/close resets UI. The **persistence contract** is still the **session object**
+ **`cfb-session-created`**, not the dialog markup.

### End-to-end flow (reference)

Legend:
- ✅ This is already provided
- 🚧 Partly done, part of this exercise
- ✨ New features, core of the exercise

```
user fills in the form and presses "Add session"
    │
    ▼
✨ <cfb-add-session-form>  (new this step)
    Internally calls 'checkValidity' and 'reportValidity'
    builds a FormData object
    crypto.randomUUID()  — generate the ID in the form and pass it to the backend.
    │  fires cfb-session-created ↑
    ▼
✅ <cfb-session-store> (supports now SessionUpdated event) 
    Updates data (create, update, delete) to IndexedDB, then 
    │ fires cfb-sessions-loaded-to-idb ↑
    ▼
✅ <cfb-board-orchestrator> (unchanged from step-4)
    pushes data-sessions ↓
    │
    ▼
<cfb-schedule>          (unchanged)
    re-renders the board
```

Event **strings** and factories: re-exported from Step 4 in [`events.js`](./lib/events.js); **`cfb-session-updated`** is 
the Step 5 extra for edit flows (see **Extras**).

---

### Sketch path (**Images** trump)

Complete [Sketch the signal path](./learning-log.md#step-5-concepts-sketch) in your learning log **before** you rely only on scrolling code.

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-5-concepts-one-minute) in your learning log.

---

### Concept check — quiz + myth/fact

Do [Mini quiz + myth or fact](./learning-log.md#step-5-concept-quiz) in your learning log **before** you treat the implementation as obvious.

Then continue to **Concrete practice**.

---

## 3) Concrete practice

To finish this exercise, you need to (detailed help below the table)

| File                                                     | Focus                                              |
|----------------------------------------------------------|----------------------------------------------------|
| ✨ [`cfb-add-session-form.js`](./cfb-add-session-form.js) | Handles dialog element, renders a `<form>` element |
| 🚧 [`index.html`](./index.html)                          | replace generator with the new form component      |
| ✅ [`index.js`](./index.js)                               | Registers elements                                 |
| ✅ [`events.js`](./events.js)                             | `cfbSessionUpdated` is added to events             |
| 🚧 [`cfb-session-store.js`](./cfb-session-store.js)      | Implement support for updating a session.          |

### ✨ `cfb-add-session-form.js` — new custom element

- [x] Renders a button to open the form
- [x] when pressing button, opens a `dialog` component (and supports closing it)
- [ ] Render a `<form>` with these fields inside `connectedCallback`
    - **Title** — `<input type="text">`, `required`, `minlength="5"`
    - **Day** — `<select>` (Wednesday / Thursday / Friday), `required`
    - **Room** — `<input type="text">` with a `<datalist>`, `required`
    - **Session type** — four `<input type="radio">` (Talk / Workshop / Keynote / Lightning Talk), `required`
    - **Tags** — **optional list of tags** via text input + `<datalist>` suggestions.
      The UI can show selected tags as chips; submit value is serialized as one
      comma-separated string for `FormData`.
    - **Speaker** — `<input type="text">` (optional)
- [ ] Group related fields into `<fieldset>` + `<legend>` blocks
- [ ] Listen for `submit` in `connectedCallback`; remove the listener in `disconnectedCallback`
- [ ] On submit:
    1. `evt.preventDefault()` to stay on the page
    2. `form.checkValidity()` + `form.reportValidity()` if invalid
    3. `new FormData(form)` — read every field with `data.get('field-name')`
    4. Build a session object and call `crypto.randomUUID()` for the `id`
    5. `this.dispatchEvent(cfbSessionCreated(session))` — same event shape as before
    6. `form.reset()` to clear the fields

### 🚧 `cfb-session-store.js`

- [ ] listen for **`cfbSessionUpdated`** event
- [ ] update session on IDB

### After building these, you can:

- [ ] Add a custom form element that handles validation and submission.
- [ ] use Native input types (`select`, `datalist`, `radio`, `time`)
- [ ] Built-in constraint validation (`required`, `minlength`) — no JS if/else
- [ ] Demonstrate how to use **`reportValidity`** to surface native messages. 
- [ ] Build forms with **multiple fields** and **groups** of fields.
- [ ] **`FormData` API** — extract all named fields in a single call with `new FormData(form)`
- [ ] `form.checkValidity()` and `form.reportValidity()`
- [ ] `<fieldset>` + `<legend>` for semantic grouping

**Constraints**

- HTML, JavaScript, and CSS only — no frameworks.
- Aim for about **30–45 minutes** on the core path; the learning log activities add **short** bursts on top.

**Definition of done**

- you can add a new session to the board.
- you can edit a new session to the board.

In [Question for your facilitator](./learning-log.md#step-5-facilitator-question), ask one question and capture the answer. Complete [Myth & fact → facilitator](./learning-log.md#step-5-myth-fact-facilitator) as well.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log — Quick check](./learning-log.md#step-5-conclusions-quick-check).

### 3) Loop back

Update [Submit guess](./learning-log.md#step-5-loop-back-submit-guess) after you have tried an invalid submit in the browser.

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-5-key-takeaway).


## Wrapup — What have we learned?

**Forms and the platform**
- **Built-in validation** (`required`, `minlength`, `type="time"`, etc.) can
  carry most of the burden — `checkValidity()` / `reportValidity()` are the
  small JS bridge, not a hand-rolled rules engine.
- **`FormData`** is a practical one-shot readout of everything named in the
  form, including the selected radio value.

**Composition and architecture**

- **Lists in the form** (e.g. tags) can have a nicer UI (chips) while still
  submitting a **single serialised value** (comma-separated) that `FormData`
  understands.
- **Add vs edit** can be **two UIs** (dialog vs flip-card) and still use the
  **same session payload** and one store, with **distinct event types**
  (`cfb-session-created` vs `cfb-session-updated`) if you want updates to be
  observable separately (`put()` with the same `id` = update).
- **Shadow DOM + slots**: the flip "chrome" can live in the shadow tree while
  the **article and form stay in the light DOM**, so your existing CSS keeps
  working — slots **project** children; they don't move them into the shadow
  root.

In short: you learned to lean on the browser for validation and `FormData` for
collection, and to **separate** optional UI chrome (flip, dialog) from the
**same** session payload the rest of the app persists — whether you use one or
two custom event types for add vs update.

---

### Demos / issues

- Share a short screen recording if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### FormData — collect all fields in one call

```js
const data = new FormData(form)
const title = data.get('title')
const sessionType = data.get('session-type')
```
Every `<input>`, `<select>`, and `<textarea>` with a `name` attribute is
included automatically — including the selected radio button value. For tags,
the hidden/input value represents the full selected list (serialized).

### Built-in constraint validation

Add attributes; let the browser do the work:

```html
<input name="title" type="text" required minlength="5" />
<select name="day" required>…</select>
<input name="start-time" type="time" required />
```

`form.checkValidity()` returns `false` if any constraint is violated.
`form.reportValidity()` shows the browser's native error bubbles.

### Generating the ID

The session `id` must be unique and should **not** be editable by the user.
Generate it in JavaScript at submit time:

```js
const session = {
  id: crypto.randomUUID(),
  // … other fields from FormData
}
```

### Tags — optional list with suggestions

Treat tags as a **list**, not a single scalar value. A common pattern is:

- one input for choosing/typing tags
- datalist for known suggestions
- chip UI for currently selected tags (Hint: AI makes a nice UX for this)
- one serialized form value (comma-separated) for submit

### Datalist — free-text + suggestions

```html
<input name="room" list="room-options" required />
<datalist id="room-options">
  <option value="Main Hall">
  <option value="Track A">
  <option value="Track B">
</datalist>
```

The `<datalist>` provides autocomplete suggestions while still allowing any
value. The browser renders a native dropdown — no JS needed.

### Add form vs edit form — reuse or separate?

Both are valid. Pick based on UX complexity:

- **Reuse one component** when add and edit are almost the same UI and behavior.
- **Use separate components** when one flow has different container/UX mechanics
  (for example: add opens a `<dialog>`, edit lives in a flip-card back face).

A practical rule: if the component starts collecting many `if (isEdit)` branches
for layout and behavior, split it. Keep data/event contracts shared instead
(`cfb-session-created`) while allowing different UI containers.

### Session shape (unchanged from Step 4)

Aligned with **`sessionDetails`** from [`../step-3/lib/builds-session-details.js`](../step-3/lib/builds-session-details.js)
— same card contract as earlier steps.

```js
{
  id:          'cf25-…',          // crypto.randomUUID()
  title:       'My Talk',
  day:         'Wednesday',
  room:        'Track A',
  sessionType: 'Talk',
  startTime:   '10:00',
  tags:        [{ label: 'Frontend', color: 'green' }],
  attendees:   [{ initials: 'AK', name: 'Alice Kent' }],
}
```

## Extras

If you finish early:

- [ ] Trace **edit**: **`cfb-menu`** on **`cfb-session-card`** → **`cfb-edit-session-form`** → **`cfbSessionUpdated`** → **`cfb-session-store`** → same **`cfb-sessions-loaded-to-idb`** refresh.
- [ ] Read **`cfb-flip-card.js`** — how **slots** keep light-DOM forms stylable.
- [ ] **Distinct update event**: preserve **`id`** on edit; IDB **`put`** upserts.

---

### End result (skills you can demonstrate)

- Native input types (**`select`**, **`datalist`**, **`radio`**, **`time`**) and grouping (**`fieldset`** / **`legend`**)
- Constraint validation as platform work; **`checkValidity`** / **`reportValidity`** as glue
- **`FormData`** one-shot collection; **`crypto.randomUUID()`** for **`id`**
- Custom element as **form + dialog owner**; **`disconnectedCallback`** hygiene for listeners
- Same **IDB refresh pipeline** as Step 4 after **`cfb-session-created`**
