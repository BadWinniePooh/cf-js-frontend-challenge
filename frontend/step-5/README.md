# Step 5 — Add a Session · HTML Form Elements

In the previous step you loaded sessions from IndexedDB and could add random
ones by clicking a button. Now you will replace that random generator with a
**real HTML form** — using built-in browser validation and the `FormData` API
to collect all values at once.

**Learning goal:** To build a form and control validation, to dispatch a custom
event on submit. Maybe use a `dialog` HTML element for the actual form.
---

## The data flow

```
user fills in the form and presses "Add session"
    │
    ▼
✨ <cfb-add-session-form>  (new this step)
    Make a form for all the data required,
    browser validates all :required fields and minlength automatically
    form.checkValidity() — guard for programmatic safety
    new FormData(form)   — collect every named field in one call
    crypto.randomUUID()  — generate the ID in the form and pass it to the backend.
    │  fires cfb-session-created ↑
    ▼
✅ <cfb-session-store>     (  Just added 'Session_Updated' handler for Extras )
    Updated data (create, update, delete) to IndexedDB, then 
    │ fires cfb-sessions-loaded-to-idb ↑
    ▼
✅ <cfb-board-orchestrator> (unchanged from step-4)
    pushes data-sessions ↓
    │
    ▼
<cfb-schedule>          (unchanged)
    re-renders the board
```

---

## What to build

### `cfb-add-session-form.js` — new custom element

- [x] Renders a button to open the form
- [x] when pressing button, opens a `dialog` component (and supports closing it)
- [x] Render a `<form>` with these fields inside `connectedCallback`
  - **Title** — `<input type="text">`, `required`, `minlength="5"`
  - **Day** — `<select>` (Wednesday / Thursday / Friday), `required`
  - **Room** — `<input type="text">` with a `<datalist>`, `required`
  - **Session type** — four `<input type="radio">` (Talk / Workshop / Keynote / Lightning Talk), `required`
  - **Tags** — **optional list of tags** via text input + `<datalist>` suggestions.
    The UI can show selected tags as chips; submit value is serialized as one
    comma-separated string for `FormData`.
  - **Speaker** — `<input type="text">` (optional)
- [x] Group related fields into `<fieldset>` + `<legend>` blocks
- [x] Listen for `submit` in `connectedCallback`; remove the listener in `disconnectedCallback`
- [x] On submit:
  1. `evt.preventDefault()` to stay on the page
  2. `form.checkValidity()` + `form.reportValidity()` if invalid
  3. `new FormData(form)` — read every field with `data.get('field-name')`
  4. Build a session object and call `crypto.randomUUID()` for the `id`
  5. `this.dispatchEvent(cfbSessionCreated(session))` — same event shape as before
  6. `form.reset()` to clear the fields

### `index.html`

- [x] Replace `<cfb-session-generator>` with `<cfb-add-session-form>` — nothing else changes - NOTE: was already present

### `index.js`

- [x] Import and register `CfbAddSessionForm`; remove the `CfbSessionGenerator` import - NOTE: was already present

---

## Constraints

- HTML, JavaScript and CSS only. No frameworks.
- No custom JS validation logic — rely on `required`, `minlength`, and `type` attributes.
- Max 30 minutes.

---

## Tips

### FormData — collect all fields in one call

Instead of querying every input individually, pass the form element to `FormData`:

```js
const data = new FormData(form)

const title   = data.get('title')        // string
const day     = data.get('day')          // string
const tags    = data.get('tags') ?? ''   // serialized list, e.g. "Frontend, Accessibility"
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
- chip UI for currently selected tags
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

---

## Extras

### Core form extras

- [ ] Add an 'Edit form' functionality on the Menu.
  The work is mostly done in the `cfb-session-card.js` and `cfb-edit-session-form.js`
- [ ] See how the `cfb-flip-card` uses `slot`s for the animation purpose of a flip
- [ ] populate the edit form with the data from the session.
- [ ] **Distinct update event**: edit flow dispatches `cfb-session-updated`
  (`EventTypes.SESSION_UPDATED`); `<cfb-session-store>` in step-5 handles it
  alongside `cfb-session-created`, then broadcasts `sessionsLoaded` as before.
- [ ] Preserve update semantics by keeping the original session `id` on edit
  (IndexedDB `put()` upserts by key).

---

## Learning goals

- Native input types (`select`, `datalist`, `radio`, `time`)
- Built-in constraint validation (`required`, `minlength`) — no JS if/else
- **`FormData` API** — extract all named fields in a single call with `new FormData(form)`
- `form.checkValidity()` and `form.reportValidity()`
- `<fieldset>` + `<legend>` for semantic grouping
- `crypto.randomUUID()` — generating IDs in the browser
- Custom web component as a form owner (renders and owns the `<form>` element)

---

## Issues / notes

If you get stuck, note down the problem here so we can discuss it together.

---

## End result — What have we learned?

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
