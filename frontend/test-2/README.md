# Test Step T-2 — Molecule Behaviour · `<cfb-session-card>`

In T-1 you tested a single atom. Now the component under test is a **molecule**
— `<cfb-session-card>` from Step 2 — which renders a full session card composed
of a title, `<cfb-tag>` atoms, and attendee avatar chips.

The testing approach shifts accordingly. Instead of asserting on exact HTML
strings, you focus on **counts and presence**: how many tags were rendered, is
the title in there, do the avatars match the attendee list? Tests written at
this level survive component refactors; snapshot tests don't.

---

## Read the component before you write the tests

Open `step-2/cfb-session-card.js` and note two things before you start.

### 1. The attribute name is `data-session-details`

```js
static definedAttributes = { details: 'data-session-details' }
```

Your fixture HTML must match:

```js
`<cfb-session-card data-session-details='${JSON.stringify(session)}'></cfb-session-card>`
```

### 2. The data shape for `attendees`

The shape of the attendees is:

```js
attendees: [
  { name: 'Alice Kent',   initials: 'AK' },
  { name: 'James Smith',  initials: 'JS' },
]
```

Getting either of these wrong causes a runtime error that looks like a test
failure but is actually a data mismatch. Check the shape first.

---

## What to build

- [ ] Copy `package.json` and `test/web-test-runner.config.mjs` from `test-1`
      (or `test-0` — they're identical)
- [ ] Copy `test/helpers/fixture.js` from `test-1`
- [ ] Register `<cfb-tag>` (from `step-1`) and `<cfb-session-card>` (from `step-2`)
- [ ] Write tests for whatever you see fit
- [ ] Document in result video/message what you tested and why

## Constraints

- No snapshot assertions — no `el.innerHTML ===`.
- Count elements, check text, verify presence. 
- Max **30 minutes**.

---

## Tips

### Registering both elements

`<cfb-session-card>` uses `<cfb-tag>` in its rendered output, so both need to
be registered before your tests run:

```js
import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}
if (!customElements.get(CfbSessionCard.elementName)) {
  customElements.define(CfbSessionCard.elementName, CfbSessionCard)
}
```

`CfbSessionCard.elementName` is `'cfb-session-card'` — using the constant
avoids a typo.

### Test data

> AI did this - I always use builders with good defaults 
> (Aki Salmi)

Define a shared session constant at the top of the test file:

```js
const SESSION = {
  title: 'Opening Keynote',
  tags: [
    { label: 'Keynote',  color: 'blue'  },
    { label: 'Frontend', color: 'green' },
  ],
  attendees: [
    { name: 'Alice Kent',  initials: 'AK' },
    { name: 'James Smith', initials: 'JS' },
    { name: 'Maria R',     initials: 'MR' },
  ],
}
```

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

### The test file

```js
import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}
if (!customElements.get(CfbSessionCard.elementName)) {
  customElements.define(CfbSessionCard.elementName, CfbSessionCard)
}

afterEach(cleanup)

const SESSION = {
  title: 'Opening Keynote',
  tags: [
    { label: 'Keynote',  color: 'blue'  },
    { label: 'Frontend', color: 'green' },
  ],
  attendees: [
    { name: 'Alice Kent',  initials: 'AK' },
    { name: 'James Smith', initials: 'JS' },
    { name: 'Maria R',     initials: 'MR' },
  ],
}

const sessionHtml = (session = SESSION) =>
  `<cfb-session-card data-session-details='${JSON.stringify(session)}'></cfb-session-card>`

describe('<cfb-session-card>', () => {
  // add tests here
})
```

---

## Extras

- [ ] Test that each avatar chip displays the attendee's initials as text
- [ ] Instead of hard-coded test data, use a builder-like function for creating test case specific data.
- [ ] Test graceful handling of malformed JSON in `data-session-details` — does
      the component throw, or degrade quietly?
- [ ] If you added Shadow DOM to `<cfb-session-card>`, query via
      `el.shadowRoot.querySelectorAll(...)` instead

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
- How to pass structured JSON data through a DOM attribute in test code
- The difference between querying **light DOM** (via `el.querySelectorAll`)
  and **Shadow DOM** (via `el.shadowRoot.querySelectorAll`)
