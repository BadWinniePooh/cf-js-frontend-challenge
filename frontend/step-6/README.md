# Step 6 - `<cfb-session-type>` · Form-associated custom element

In Step 5 you built add/edit forms with **native** controls and **`FormData`**. This week you replace **only** the
**session-type** radio group with **`<cfb-session-type>`** - a **form-associated** custom element - so the **same**
submit path, validation, and **`cfb-session-created`** / update pipeline stay intact.

The field must still **`name="session-type"`**, honour **`required`**, show up in **`FormData`**, and work in **both**
add and edit dialogs - without a **hidden** native radio as a cheat; the value is carried through **`ElementInternals`**.

> **Before you start:** branch, HTTP server, console clean - see [getting-started.md](./getting-started.md).

### Async / solo

These challenges are written for **async, often solo** work. Use [your Step 6 learning log](./learning-log.md), a short
message to your facilitator or team, or a brief sync when the README says “compare.” **Short timeboxes** matter more than
the format.

---

## Learning goal

By the end of this step, you can:

- Build **`<cfb-session-type>`** with **`static formAssociated = true`** and **`attachInternals()`** so it participates
  in **parent** **`<form>`** lifecycle and **`FormData`**.
- Drive **`required`** / **`valueMissing`** through **`setValidity`** and surface errors with **`reportValidity`** in line
  with the parent form’s **`checkValidity()`** / **`reportValidity()`** flow.
- **Preselect** session type in **edit** (attribute or property) and clear correctly on **reset** / **`formResetCallback`**.
- Explain how **one** swapped field keeps Step 5’s **store → schedule** behaviour unchanged.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 6 learning log](./learning-log.md).

1. **Solo, ~2 min - Think → ink (FormData guess)**  
   [FormData guess](./learning-log.md#step-6-connections-formdata-guess) *(revisit in [Loop back](./learning-log.md#step-6-loop-back-formdata-guess)).*

2. **Solo, ~3 min - Bridge from Step 5**  
   [Bridge from Step 5](./learning-log.md#step-6-bridge-step-5).

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-6-connections-surprise).

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-6-topic-link): answer **A** or **B**.

---

## 2) Concepts

### Form-associated custom elements

Making custom elements for a form is possible with WebComponents. What we'll learn now is how that is done. It requires
**two** things:

- **`static formAssociated = true`** tells the browser this element can participate in **form submission**, **reset**,
  and **constraint validation** like a built-in control.
- **`this.attachInternals()`** returns **`ElementInternals`** - the bridge for **`setFormValue`**, **`setValidity`**,
  **`reportValidity`**, and **form callback** hooks.

### Value and `FormData`

Setting value for the form (for FormData) is done with **`ElementInternals`**

- Call **`internals.setFormValue(value)`** when the user selects a tile; use **`null`** (or clear appropriately) when
  there is **no** value so the field behaves like an empty control in **`FormData`**.
- The **`name`** attribute on **`<cfb-session-type>`** is what **`FormData`** uses as the key - same contract as the old
  radios.

### Validation

For built-in browser validation, you must use **`setValidity`** and **`reportValidity`**:

- When **`required`** is set and nothing is selected, use **`setValidity({ valueMissing: true }, '…message…')`** so the
  browser’s validation model matches native controls.
- Clear validity with **`setValidity({})`** when a selection is valid.
- **`reportValidity()`** on the **internals** (or coordination with the **form**’s **`reportValidity()`**) surfaces the
  native error UI - keep one clear path so users are not double-spammed.

### Reset, disabled, edit

- Implement **`formResetCallback()`** (and **`formDisabledCallback(disabled)`** if you support disabled forms) so dialog
  close / **`form.reset()`** does not leave stale tiles or validity.
- For **edit**, mirror **`<input>`**: reflect **`value`** from an attribute or property so the correct tile is selected
  before the user interacts.

### No hidden radio fallback

- The **session-type** value must come from **`setFormValue`** on your custom element - **not** from a shadowed
  **`<input type="hidden">`** pretending to be the control. That keeps the learning goal honest.

### End-to-end flow (reference)

Legend:
- ✅ This is already provided
- 🚧 Partly done, part of this exercise
- ✨ New features, core of the exercise

```
user opens add/edit form and selects session type tile
    │
    ▼
✨ <cfb-session-type>       (new this step)
    the form is using this new form-associated custom element
    setFormValue(value) so FormData includes `session-type`
    setValidity/reportValidity so `required` behaves natively
    keyboard + click support for selection
    │ value is submitted with the parent form
    ▼
🚧 <cfb-add-session-form> / <cfb-edit-session-form>
    use <cfb-session-type name="session-type" required>
    collect with new FormData(form) (same as Step 5)
    │ dispatches cfb-session-created / cfb-session-updated
    ▼
✅ <cfb-session-store> (unchanged from step-5)
    persists to IndexedDB and rebroadcasts sessions
    │
    ▼
    ... (unchanged from before)
```

---

### One-minute review (~1 min)

After reading the sections above, complete [One-minute review](./learning-log.md#step-6-concepts-one-minute) in your
learning log.

---

### Concept check (Step 3 style)

Do **two** short activities in your [learning log](./learning-log.md).

1. **Mini quiz** - Open [Mini quiz](./learning-log.md#step-6-concept-quiz) and answer the three questions **before** you
   lean on copy-paste from source.
2. **Flow sketch** - Open [Flow sketch](./learning-log.md#step-6-concept-flow-sketch) and draw the pipeline (boxes +
   arrow labels). Paper is fine; ASCII or a photo pasted elsewhere is fine.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

### Files to work in

To finish this exercise, you need to (detailed help below the table)

| File                                                        | Role                                                                                       |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| ✨ [`cfb-session-type.js`](./cfb-session-type.js)            | New custom element, focus of this session                                                  |
| 🚧 [`cfb-add-session-form.js`](./cfb-add-session-form.js)   | Replace session-type **radios** with **`<cfb-session-type name="session-type" required>`** |
| 🚧 [`cfb-edit-session-form.js`](./cfb-edit-session-form.js) | Same replacement · **preselect** type for the session being edited                         |
| ✅ [`index.js`](./index.js)                                  | registers elements as before                                                               |
| ✅ [`index.html`](./index.html)                              | no changes from Step-5                                                                     |

### ✨ `cfb-session-type.js` - new custom element

- [ ] Create `<cfb-session-type>` with `static formAssociated = true`
- [ ] Call `this.attachInternals()` in the constructor and store internals
- [ ] Render selectable tiles (Talk / Workshop / Keynote / Lightning Talk)
- [ ] Keep selected value in component state and reflect it in the UI
- [ ] On selection, call `internals.setFormValue(selectedValue)`
- [ ] Handle validation:
    1. if `required` and empty -> `setValidity({ valueMissing: true }, 'Please select a session type.')`
    2. if valid -> `setValidity({})`
    3. call `reportValidity()` when appropriate (e.g. submit path)

### 🚧 `cfb-add-session-form.js`

- [ ] Replace session-type radio inputs with `<cfb-session-type name="session-type" required>`
- [ ] Keep submit flow unchanged: `checkValidity` / `reportValidity` / `FormData`

### 🚧 `cfb-edit-session-form.js`

- [ ] Replace session-type radio inputs with `<cfb-session-type name="session-type" required>`
- [ ] Ensure existing session type is preselected when editing

### 🚧 `index.js` and `index.html`

- [ ] Register/import the new element in step 6
- [ ] Keep board wiring and store flow unchanged from step 5

### **After building these, you can show:**

- [ ] **`<cfb-session-type>`** with **`static formAssociated = true`** and **`attachInternals()`** early in the instance
  lifecycle (e.g. **class field** or **`constructor`** - match one style on your team).
- [ ] **Tiles** for **Talk**, **Workshop**, **Keynote**, **Lightning Talk** (emoji or icons) with a clear **selected**
  state.
- [ ] **`internals.setFormValue(...)`** updates when the user selects a tile; empty / unselected state omits or clears
  per your **`FormData`** contract.
- [ ] **`required`**: invalid submit shows a **native-style** validation message; valid submit includes **`session-type`
  **
  in **`FormData`**.
- [ ] **Add form** and **edit form** both use the custom element; **edit** shows the existing type.
- [ ] **`formResetCallback`** (and **`formDisabledCallback`** if applicable) keep reset/disable flows correct.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only - no frameworks.
- **No** hidden native **`<input>`** as the real carrier for session type - **`ElementInternals`** owns the value.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- Submitting without a selection is **blocked** with a **browser validation** experience (not only a custom `alert`).
- After selecting a type, **`FormData`** from the parent form includes **`session-type`** with the expected string.
- **Edit** opens with the correct tile selected; **reset** clears selection and validity as users expect.

In [Question for your facilitator](./learning-log.md#step-6-concrete-facilitator-question), ask **one** real question
and capture the answer.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-6-conclusions-quick-check).

### 2) Loop back

Update [FormData guess](./learning-log.md#step-6-loop-back-formdata-guess) if your mental model changed.

### 3) Forms across Step 5 + Step 6

Complete [Forms across two steps](./learning-log.md#step-6-forms-two-steps) in your log.

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-6-key-takeaway).

---

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### Make the element form-associated

```js
class CfbSessionType extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }
}
```

Without **`formAssociated`** + **`attachInternals()`**, the element is invisible to the form.

### Write value to `FormData`

```js
this._internals.setFormValue(this._value ?? null)
```

Use **`null`** when no value is selected so the field is omitted or empty in the form’s model, matching how you treat
“no selection”.

### Required validation with a custom message

```js
if (this.required && !this._value) {
  this._internals.setValidity(
    { valueMissing: true },
    'Please select a session type.'
  )
} else {
  this._internals.setValidity({})
}
```

Pair this with the parent **`form.checkValidity()`** / **`form.reportValidity()`** so submit behaviour matches native
controls.

### Reset behaviour

```js
formResetCallback()
{
  this._value = ''
  this._internals.setFormValue(null)
  this._internals.setValidity({})
  this.render()
}
```

Implement lifecycle callbacks early; they prevent subtle bugs in edit/reset flows.

---

## Extras

If you finish early:

- [ ] React to **`required`** dynamically in **`attributeChangedCallback`** and re-sync validity.
- [ ] Custom validation copy via **`setValidity`** for more than **`valueMissing`**.
- [ ] **Keyboard**: **`tabIndex`**, **arrow** keys between tiles, **Enter** / **Space** to select; expose **`aria-selected`** / roles appropriately.
- [ ] Extract **tags** UI into its own form-associated or composite control and compare coupling trade-offs.
- [ ] Add lightweight tests for keyboard + validation (see other steps’ test folders for patterns).

---

### End result (skills you can demonstrate)

- **`ElementInternals`** and **`attachInternals()`**
- **`static formAssociated = true`**
- **`setFormValue`**, **`setValidity`**, **`reportValidity`**
- **`formResetCallback`** / **`formDisabledCallback`**
- **Accessible**, keyboard-friendly custom controls inside real **`<form>`**s
