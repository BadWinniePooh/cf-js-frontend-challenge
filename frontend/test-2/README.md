# Test Step T-2 — Molecule Behaviour · `<cfb-session-card>`

In T-1 you tested a single atom. Now the component under test is a **molecule**
— `<cfb-session-card>` from Step 2 — which renders a full session card composed
of a title, `<cfb-tag>` atoms, and attendee avatar chips.

The testing approach shifts accordingly. Instead of asserting on exact HTML
strings, you focus on **counts and presence**: how many tags were rendered, is
the title in there, do the avatars match the attendee list? Tests written at
this level survive component refactors; snapshot tests don't.

**Goal**: Test the composite `<cfb-session-card>` from Step 2 by verifying
*how many* child elements are rendered — not their exact markup.
Behaviour tests survive refactors; snapshot tests don't.

---

## What to build

- [x] Copy `package.json` and `test/web-test-runner.config.mjs` from `test-1`
  (or `test-0` — they're identical)
- [x] Copy `test/helpers/fixture.js` from `test-1`
- [x] Register `<cfb-tag>` (from `step-1`) and `<cfb-session-card>` (from `step-2`)
- [x] Write tests for title, tags, attendees, and attribute reactivity

## Constraints

- No snapshot assertions — no `el.innerHTML ===`.
- Count elements, check text, verify presence. Max **30 minutes**.

---

## Tips

### Registering both elements

`<cfb-session-card>` uses `<cfb-tag>` in its rendered output, so both need to
be registered before your tests run:

```js
import { expect } from 'chai'
import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-tag', CfbTag)
customElements.define('cfb-session-card', CfbSessionCard)
```

### Test data

Define a shared session constant at the top of the test file:

```js
const SESSION = {
  title: 'Opening Keynote',
  tags: [
    { label: 'Keynote', color: 'blue' },
    { label: 'Frontend', color: 'green' },
  ],
  attendees: [
    { name: 'Alice Kent', initials: 'AK' },
    { name: 'James Smith', initials: 'JS' },
    { name: 'Maria R', initials: 'MR' },
  ],
}
```

⚠️ if you want to make the tests more robust, create a helper that randomizes the data
and where you can define only the things you need for your tests. ⚠️

### Querying child elements

`<cfb-session-card>` renders its children in the **light DOM** (via
`this.innerHTML`). `querySelectorAll` works on it directly:

```js
const tags = el.querySelectorAll('cfb-tag')
expect(tags.length).to.equal(SESSION.tags.length)

const avatars = el.querySelectorAll('.cfb-avatar')
expect(avatars.length).to.equal(SESSION.attendees.length)
```

### Testing reactivity

`attributeChangedCallback` fires synchronously when you call `setAttribute`,
so no microtask flush is needed:

```js
const updated = { ...SESSION, tags: [{ label: 'Solo', color: 'red' }] }
el.setAttribute(CfbSessionCard.definedAttributes.details, JSON.stringify(updated))
expect(el.querySelectorAll('cfb-tag').length).to.equal(1)
```

### What to assert

| Group      | What to verify                                                                                                               |
|------------|------------------------------------------------------------------------------------------------------------------------------|
| Title      | `textContent` includes the session title                                                                                     |
| Tags       | One `<cfb-tag>` per entry in `tags`; zero tags when the array is empty; each tag receives the correct `data-color` attribute |
| Attendees  | One `.cfb-avatar` chip per attendee in the `attendees` array                                                                 |
| Reactivity | Replacing `data-session-details` updates the rendered tag count                                                              |

---

## Extras

- [x] Test that each avatar chip displays the attendee's initials as text
- [ ] Test graceful handling of malformed JSON in `data-session-details` — does
  the component throw, or degrade quietly?
- [ ] If you added Shadow DOM to `<cfb-session-card>`, query via
  `el.shadowRoot.querySelectorAll(...)` instead
- [x] Consider how you could add contract test for the `SessionDetails` -shape

Adding contract tests is another story, and there is another session on the 'extras',
so focusing on that is not too important. But good to think how that could be done.

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to test a **molecule** by counting and querying its child elements
- Why asserting "how many?" is more durable than asserting "what does it
  look like?" — counts survive markup refactors; snapshots don't
- How tests can surface a bug (`connectedCallback` without a guard) that
  manual testing in the browser missed
- How to pass structured JSON data through a DOM attribute in test code
- The difference between querying **light DOM** (via `el.querySelectorAll`)
  and **Shadow DOM** (via `el.shadowRoot.querySelectorAll`)
