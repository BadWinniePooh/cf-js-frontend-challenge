# Tips

## What happens when user presses 'submit'?

When the user clicks a submit button on form that only uses native form elements (or presses Enter in a field, or you
call form.requestSubmit()), the browser runs constraint validation before firing
submit. [see MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)

**So for an invalid form:**

1. Browser validates
2. invalid fires on offending control(s)
3. Browser shows native error UI (focus + bubble)
4. submit does not fire → your handler never runs

**For a valid form:**

1. Browser validates (passes)
2. submit fires
3. Your handler runs
4. At that point form.checkValidity() will always be true

In Step-6, we learn how to add a custom element that behaves like a form control, where you need to add a custom
validation for the element

## FormData - collect all fields in one call

```javascript
const data = new FormData(form)
const title = data.get('title')
const sessionType = data.get('session-type')
// etc.
```

Every `<input>`, `<select>`, and `<textarea>` with a `name` attribute is
included automatically - including the selected radio button value. For tags,
the hidden/input value represents the full selected list (serialized).

## Built-in constraint validation

Add attributes; let the browser do the work:

```html
<input name="title" type="text" required minlength="5"/>
<select name="day" required>…</select>
<input name="start-time" type="time" required/>
```

These will automatically be validated when you submit the form (for more information when the validation **does not**
happen, is discussed in [step-6](../step-6/README.md))

## Generating the ID

The session `id` must be unique and should **not** be editable by the user.
Generate it in JavaScript at submit time:

```js
const session = {
  id: crypto.randomUUID(),
  // … other fields from FormData
}
```

Quite often this is the responsibility of the backend - but then the backend must return the Id in 'Location header', or
in the payload. If the UI, instead, is responsible for setting the ID, this complexity is gone from the system.

## Tags - optional list with suggestions

Treat tags as a **list**, not a single scalar value. A common pattern is:

- one input for choosing/typing tags
- datalist for known suggestions
- you can display tags as chip UI for currently selected tags (Hint: AI makes a nice UX for this - also see below)
- one serialized form value (comma-separated) for submit

## Datalist - free-text + suggestions

```html
<input name="room" list="room-options" required/>
<datalist id="room-options">
    <option value="Main Hall">
    <option value="Track A">
    <option value="Track B">
</datalist>
```

The `<datalist>` provides autocomplete suggestions while still allowing any value. The browser renders a native
dropdown - no JS needed. This is a very good option for a thing like 'tags', where new tags could be added into the
backend by each call

## Add form vs edit form - should we reuse same component, or build separate forms?

Both are valid. Pick based on UX complexity:

- **Reuse one component** when add and edit are almost the same UI and behavior.
- **Use separate components** when one flow has different container/UX mechanics
  (for example: add opens a `<dialog>`, edit lives in a flip-card back face).

A practical rule: if the component starts collecting many `if (isEdit)` branches for layout and behavior, split it. Keep
data/event contracts shared instead (`cfb-session-created`) while allowing different UI containers.

## Session shape (unchanged from Step 4)

Aligned with **`sessionDetails`** from [ `../step-3/lib/builds-session-details.js`](../step-3/lib/builds-session-details.js)

```javascript
const details = {
    id:          'cf25-…',          // crypto.randomUUID()
    title : 'My Talk',
    day : 'Wednesday',
    room : 'Track A',
    sessionType : 'Talk',
    startTime : '10:00',
    tags : [{ label: 'Frontend', color: 'green' }],
    attendees : [{ initials: 'AK', name: 'Alice Kent' }],
}
```

## An example form HTML structure.

You can use the following form structure as your base, if you wish. It has styles ready

```HTML

<dialog class="cfb-add-session-form__dialog" aria-label="Add a new session" closedby="any">
    <div class="cfb-add-session-form__card">

        <div class="cfb-add-session-form__header">
            <h2 class="cfb-add-session-form__title">Add Session</h2>
            <button type="button" class="cfb-add-session-form__close" aria-label="Close dialog">✕</button>
        </div>

        <form class="cfb-add-session-form__form">

            <fieldset class="cfb-add-session-form__group">
                <legend>Session details</legend>

                <label for="cfb-title" data-required>Title</label>
                <input id="cfb-title" name="title" type="text" required minlength="5"
                       placeholder="e.g. Web Components Deep Dive"/>

                <label for="cfb-day" data-required>Day</label>
                <select id="cfb-day" name="day" required>
                    <option value="">- select a day -</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                </select>

                <label for="cfb-room" data-required>Room</label>
                <input id="cfb-room" name="room" type="text"
                       list="cfb-room-options" required placeholder="e.g. Track A"/>
                <datalist id="cfb-room-options">
                    <option value="Main Hall">
                    <option value="Track A">
                    <option value="Track B">
                    <option value="Workshop Room">
                    <option value="Lounge">
                </datalist>

                <label for="cfb-start-time" data-required>Start time</label>
                <input id="cfb-start-time" name="start-time" type="time" required/>
            </fieldset>

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

            <fieldset class="cfb-add-session-form__group">
                <legend>Additional info</legend>

                <label for="cfb-tag-input">Tags</label>
                <div class="cfb-add-session-form__tag-picker">
                    <div class="cfb-add-session-form__tag-chips"></div>
                    <input id="cfb-tag-input" class="cfb-add-session-form__tag-input"
                           type="text" list="cfb-tag-options"
                           placeholder="Pick or type a tag…" autocomplete="off"/>
                    <datalist id="cfb-tag-options">
                        <option value="Frontend">
                        <option value="Backend">
                        <option value="Architecture">
                        <option value="Testing">
                        <option value="Keynote">
                        <option value="Workshop">
                        <option value="A11y">
                        <option value="Data">
                        <option value="Talk">
                    </datalist>
                </div>
                <input type="hidden" name="tags"/>

                <label for="cfb-speaker">Speaker</label>
                <input id="cfb-speaker" name="speaker" type="text"
                       placeholder="e.g. Alice Kent"/>
            </fieldset>

            <div class="cfb-add-session-form__actions">
                <button type="button" class="cfb-add-session-form__cancel">Cancel</button>
                <button type="submit" class="cfb-add-session-form__submit">+ Add session</button>
            </div>

        </form>
    </div>
</dialog>
```

## Display 'cfb-tag' as tags

Conceptually, it would look nice if the tags in the form looked like tags in the Session Cards. Below is one example on
how that can be achieved - works as having the tags as internal data structure (`#tags`), and for each selected _Tag_,
it renders the `cfb-tag` to provide a nice visual. This does have a small UX bug (what happens if you choose a '
non-existing tag), but that's something left for you to fix,

```javascript
 // ── Tag picker ────────────────────────────────────────────────

#onTagKeydown = (evt) => {
  if (evt.key !== 'Enter') return
  evt.preventDefault()
  this.#addTag(this.#tagInput().value)
}

#onTagInput = (evt) => {
  const labelValue = evt.target.value.trim()
  const isKnown = isKnownTag(labelValue)
  if (isKnown) this.#addTag(labelValue)
}

#onChipRemove = (evt) => {
  const btn = evt.target.closest('.cfb-add-session-form__tag-remove')
  if (!btn) return
  this.#tags = this.#tags.filter(t => t.label !== btn.dataset.label)
  this.#syncChips()
}

#addTag(raw)
{
  const label = raw.trim()
  if (!label) return
  if (this.#tags.some(t => t.label.toLowerCase() === label.toLowerCase())) return
  this.#tags.push({ label, color: labelToColor(label) })
  this.#tagInput().value = ''
  this.#syncChips()
}

#syncChips()
{
  this.#tagsHidden().value = this.#tags.map(t => t.label).join(',')
  this.#tagChips().innerHTML = this.#tags.map(t => `
            <span class="cfb-tag cfb-tag--${t.color} cfb-add-session-form__chip">
                ${t.label}
                <button
                    type="button"
                    class="cfb-add-session-form__tag-remove"
                    data-label="${t.label}"
                    aria-label="Remove ${t.label}"
                >×</button>
            </span>
        `).join('')
}
```