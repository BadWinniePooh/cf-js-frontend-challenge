# Step 5 - Add a Session · HTML Form Elements

In Step 4 you persisted sessions in **IndexedDB** and refreshed the board with a **signal** (
`cfb-sessions-loaded-to-idb`
→ **`data-latest-updated-at`** → schedule **pulls** rows). This step swaps the **random generator** for a
**real HTML form**. For the form we use few nice HTML features like: native constraints, - **`FormData`**, all while
the **same** **`cfb-session-created`** pipeline so storage and schedule stay boring.

> **Before you start:** branch, HTTP server, same origin for IDB - see [getting-started.md](./getting-started.md).

### Async / solo

Use [your Step 5 learning log](./learning-log.md), a short note to your facilitator, or a sync when the README says
“compare.” **Timeboxes** beat polish.

---

## Learning goal

By the end of this step, you can:

- Build a custom form element that wraps a `<form>` and `<dialog>` elements.
- Use native constraints for input elements (like _minlength_, _type=time_, _required_)
- Demonstrate use of `<fieldset>` to group related concepts together
- Show an example of showing input errors 'on submit'.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 5 learning log](./learning-log.md).

1. **Solo, ~2 min - Think → ink (submit guess)**  
   [Submit guess](./learning-log.md#step-5-connections-submit-guess) (revisit
   in [Loop back - submit guess](./learning-log.md#step-5-loop-back-submit-guess)).

2. **Solo, ~3 min - Bridge from Step 4**  
   [Bridge from Step 4](./learning-log.md#step-5-connections-bridge-step4).

3. **Solo, ~1 min - Who owns the `id`?**  
   [Who owns the `id`?](./learning-log.md#step-5-connections-id-owner).

4. **Solo, ~3 min - Surprise or compare**  
   [Surprise or compare](./learning-log.md#step-5-connections-surprise).

5. **Solo, ~2 min - Where do you stand**  
   [Where do you stand](./learning-log.md#step-5-connections-where-stand) **A** or **B**.

---

## 2) Concepts

In this exercise, we focus mostly on the functionality of the form, and additionally (you can skip it), we discuss about
semantic HTML and some of the elements of semantic HTML (like fieldset, legend, etc)

A form typically has three responsibilities:

- **Displaying the UI** (what the user sees)
- **Managing the value** (what data the component represents)
- **Participating in the form** (validating, submitting, resetting.)

To start with, we can go through the responsibility of **displaying the UI**. For this exercise, a base setup for a form
is ready in [`cfb-add-session-form`](./cfb-add-session-form.js) component: Let's go through all the concepts:

### Using a Button and a Dialog HTML elements

In this board, clicking the '+ Add Session' button, it opens a modal. Both the button and the Dialog modal is set up for
you.
Notice also the `closedby="any"` attribute, which means that if you click outside of the dialog, it closes it
automatically. With this setup, the basic layout for interacting with modal should be there. Basically, you should be
able to open and close the 'add session modal'

```javascript
export class CfbAddSessionForm extends HTMLElement {
  #render() {
    this.innerHTML = `
            <button class="cfb-add-session-form__trigger" aria-haspopup="dialog" >
                + Add Session
            </button>
            <dialog class="cfb-add-session-form__dialog" aria-label="Add a new session" closedby="any">
                <div class="cfb-add-session-form__card">
                    <p>Add Form here</p>
                </div>
            </dialog>
        `
  }
}
```

To open the modal, it needs to be done by JS, as seen in the following snippet:

```javascript
export class CfbAddSessionForm extends HTMLElement {
  connectedCallback() {
    this.#render()
    this.#trigger().addEventListener('click', this.#onTriggerClick)
  }

  disconnectedCallback() {
    this.#trigger().removeEventListener('click', this.#onTriggerClick)
  }

// ── DOM helpers ───────────────────────────────────────────────

  #dialog = () => this.querySelector('dialog')
  #trigger = () => this.querySelector('.cfb-add-session-form__trigger')

// ── Dialog open / close ───────────────────────────────────────

  #onTriggerClick = () => this.#dialog().showModal()
}
```

This works as follows: When rendered, the component registers event listeners on the `click` event for the button. That
uses a arrow function (see [Correct Binding of this in tips in step-3](../step-3/tips.md#correct-binding-of-this)) to
have the correct behavior (binding) of `this`. It uses a helper to find the `dialog` element.

With these basic building blocks, you can see the basic flow of opening/closing the dialog

### Form UI (what does the form data represent)

In this, we start adding basic form data for a session, so that we can follow the shape of the event form, as defined
in [`generate-random-session.js`](../step-3/lib/generate-random-session.js). Below is a list of most likely types used:

| key         | type               | validations   | required?        |
|-------------|--------------------|---------------|------------------|
| title       | text               | minlength='5' | true             |
| day         | select             |               | true             |
| room        | from selected list |               | true             |
| tags        | list tags          |               | true             |
| speaker     | text               |               | false            |
| sessionType | radio button       |               | true             |
| startTime   | time               |               | (you can choose) |

"

To handle the tags, you need to add a bit more code. In the [Tips.md](./tips.md), there is an example on how to actually
use the `cfb-tag` chip done in step-1 could be used to display the selected tags. The handling of tags overall is a bit
more tricky, as it is not just a list of strings that needs to be stored, but it's an object (and the reason is to serve
as a challenge and something worth to put a bit effort into)

### FormData (retrieving the values)

The **FormData** interface provides a way to construct a set of key/value pairs representing form fields and their
values. FormData is simply the data (that has a 'name' associated to it) that will be submitted by a form .

For example:

```HTML

<form>
    <input name="email" value="john@example.com">
    <input name="age" value="25">
</form>
```

produces

```
email = john@example.com
age = 25
```

**`new FormData(form)`** walks the form’s **subtree** and collects **successful controls** that have a **`name`**.
Each entry is **`(name, value)`** - the **`name`** is the dictionary key in JS. An example could be:

```js
const form = this.querySelector('form') // this is a <cfb-add-session-form>
const data = new FormData(form)
const email = data.get('email')
const age = data.get('age')
```

The important part of `FormData` is that it works on `name` attribute instead of `id` attribute. Let's see the
difference: **`name` vs `id`**.

To understand the difference let's break down their roles and usage scenarios:

| Attribute  | Typical job                                                                  |
|------------|------------------------------------------------------------------------------|
| **`name`** | **`FormData`** key;                                                          |
| **`id`**   | Pair `<label for="…">` with a control and deep-linking, **`getElementById`** |

As seen from the table above, **`name`** is the **key** in **`FormData`**. The **`id`** is for **deep linking** and
**labelling**. Do not assume **`name`** and **`id`** are the same string.

### Form elements and their counter parts in FormData

**Text + select** - each control needs their own **`name`** (often matching the field you map into the session object):

```html
<input name="title" type="text" required minlength="5">

<select name="day" required>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
</select>
```

**Radio group** - requires that each option has the same **`name`**, the **`value`** on each **`<input>`** is what
**`FormData.get('session-type')`** returns for the selected one.

```html

<fieldset>
    <legend>Session type</legend>
    <label><input type="radio" name="session-type" value="Talk" required> Talk</label>
    <label><input type="radio" name="session-type" value="Workshop"> Workshop</label>
    <label><input type="radio" name="session-type" value="Keynote"> Keynote</label>
</fieldset>
```

**FormData with elements that does not have data:**. If control does not have **`name`**, is `disabled`, or unchecked
checkboxes are omitted from the formData payload

### Form behavior - validations

Browsers enforce **`required`**, **`minlength`**, **`type`**, and radio **group** rules in forms by default. For this
exercise, you don't need to do anything special - which shows the benefits of using standard HTML elements. No need to
custom JS code with `if(title.length < 5)`, all this is provided.

### On Semantic HTML.

In [Tips](./tips.md), there is an example of the form you can use (if you wish) - but it might be better to first try
building your own. It also shows examples of semantic HTML forms, using `fieldset` to group thematically related
controls. To use a `fieldset`, it must contain first child named `legend`, as the sort of title of the controls.

In a form, a `<fieldset>` groups thematically related controls (like address details, payment info, or radio buttons).
The `<legend>` serves as the overarching title for that specific group. The behavior of `<fieldset>` in browsers
typically is:

- **Visual Rendering**: Browsers place the `<legend>` directly over the top-left border of the `<fieldset>` container.
- **Accessibility**: Screen readers announce the `<legend>` text before they read the inputs inside it, ensuring users
  understand the context of the fields.
- **Usage Rule**: The `<legend>` must be the very first child of the `<fieldset>`.

An example could be (for a nice grouping of possible session types):

```HTML

<fieldset class="cfb-add-session-form__group">
    <legend>Session type *</legend>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-type" value="Talk" required/> Talk
    </label>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-type" value="Workshop"/> Workshop
    </label>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-type" value="Keynote"/> Keynote
    </label>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-type" value="Lightning Talk"/> Lightning Talk
    </label>
</fieldset>
```

Notice how the '*' character in the legend looks almost like showing a 'mandatory field' (which it actually is)

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-5-concepts-one-minute) in your learning log.

---

### Concept check - quiz + myth/fact

Do [Mini quiz + myth or fact](./learning-log.md#step-5-concept-quiz) in your learning log **before** you treat the
implementation as obvious.

Then continue to **Concrete practice**.

---

## 3) Concrete practice

Your job is to implement a 'Add Session' form with basic HTML elements.

### End-to-end flow (reference)

The flow of this exercise is

Legend:

- ✅ This is already provided
- 🚧 Partly done, part of this exercise
- ✨ New features, core of the exercise

```
user fills in the form and presses "Add session"
    │
    ▼
✨ <cfb-add-session-form>  (new this step)
    builds a FormData object
    crypto.randomUUID()  - generate the ID in the form and pass it to the backend.
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

Complete [Sketch the signal path](./learning-log.md#step-5-concepts-sketch) in your learning log **before** you rely
only on scrolling code.

---

To finish this exercise, you need to (detailed help below the table)

| File                                                     | Focus                                              |
|----------------------------------------------------------|----------------------------------------------------|
| ✨ [`cfb-add-session-form.js`](./cfb-add-session-form.js) | Handles dialog element, renders a `<form>` element |
| 🚧 [`index.html`](./index.html)                          | replace generator with the new form component      |
| ✅ [`index.js`](./index.js)                               | Registers elements                                 |
| ✅ [`events.js`](./events.js)                             | `cfbSessionUpdated` is added to events             |
| 🚧 [`cfb-session-store.js`](./cfb-session-store.js)      | Implement support for updating a session.          |

### ✨ `cfb-add-session-form.js` - new custom element

- [x] Renders a button to open the form
- [x] when pressing button, opens a `dialog` component (and supports closing it)
- [ ] Render a `<form>` with these fields inside `connectedCallback`
    - **Title** - `<input type="text">`, `required`, `minlength="5"`
    - **Day** - `<select>` (Wednesday / Thursday / Friday), `required`
    - **Room** - `<input type="text">` with a `<datalist>`, `required`
    - **Session type** - four `<input type="radio">` (Talk / Workshop / Keynote / Lightning Talk), `required`
    - **Tags** - **optional list of tags** via text input + `<datalist>` suggestions.
      The UI can show selected tags as chips; submit value is serialized as one
      comma-separated string for `FormData`.
    - **Speaker** - `<input type="text">` (optional)
- [ ] Group related fields into `<fieldset>` + `<legend>` blocks
- [ ] Listen for `submit` in `connectedCallback`; remove the listener in `disconnectedCallback`
- [ ] On submit:
    1. `evt.preventDefault()` to stay on the page
    2. `form.checkValidity()` + `form.reportValidity()` if invalid
    3. `new FormData(form)` - read every field with `data.get('field-name')`
    4. Build a session object and call `crypto.randomUUID()` for the `id`
    5. `this.dispatchEvent(cfbSessionCreated(session))` - same event shape as before
    6. `form.reset()` to clear the fields

### 🚧 `cfb-session-store.js`

- [ ] listen for **`cfbSessionUpdated`** event
- [ ] update session on IDB

### After building these, you can:

- [ ] Add a custom form element that handles validation and submission.
- [ ] use Native input types (`select`, `datalist`, `radio`, `time`)
- [ ] Built-in constraint validation (`required`, `minlength`) - no JS if/else
- [ ] Demonstrate how to use **`reportValidity`** to surface native messages.
- [ ] Build forms with **multiple fields** and **groups** of fields.
- [ ] **`FormData` API** - extract all named fields in a single call with `new FormData(form)`
- [ ] `form.checkValidity()` and `form.reportValidity()`
- [ ] `<fieldset>` + `<legend>` for semantic grouping

**Constraints**

- HTML, JavaScript, and CSS only - no frameworks.
- Aim for about **30–45 minutes** on the core path; the learning log activities add **short** bursts on top.

**Definition of done**

- you can add a new session to the board.
- you can edit a new session to the board.

In [Question for your facilitator](./learning-log.md#step-5-facilitator-question), ask one question and capture the
answer. Complete [Myth & fact → facilitator](./learning-log.md#step-5-myth-fact-facilitator) as well.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-5-conclusions-quick-check).

### 3) Loop back

Update [Submit guess](./learning-log.md#step-5-loop-back-submit-guess) after you have tried an invalid submit in the
browser.

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-5-key-takeaway).

## Wrapup - What have we learned?

**Forms and the platform**

- **Built-in validation** (`required`, `minlength`, `type="time"`, etc.) can
  carry most of the burden.
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
  working - slots **project** children; they don't move them into the shadow
  root.

In short: you learned to lean on the browser for validation and `FormData` for
collection, and to **separate** optional UI chrome (flip, dialog) from the
**same** session payload the rest of the app persists - whether you use one or
two custom event types for add vs update.

---

### Demos / issues

- Share a short screen recording if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---
## Extras

If you finish early:

- [ ] Implement the 'edit' flow for the cards.
- [ ] Read **`cfb-flip-card.js`** - how **slots** keep light-DOM forms stylable.
- [ ] Implement an upsert to indexedDB -> Update or Insert
- [ ] In indexedDB, make sure that 'update' only works if the session exists in the IndexedDB

---

### End result (skills you can demonstrate)

- Native input types (**`select`**, **`datalist`**, **`radio`**, **`time`**) and thematical grouping of data using
  (**`fieldset`** / **`legend`**)
- **`FormData`** one-shot collection; **`crypto.randomUUID()`** for **`id`**
- Custom element as **form + dialog owner**; **`disconnectedCallback`** hygiene for listeners
- Same **IDB refresh pipeline** as Step 4 after **`cfb-session-created`**
