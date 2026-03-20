# Test Step T-1 — Atom Behaviour · `<cfb-tag>`

In T-0 you got the toolchain running. Now it is time to write tests that
actually mean something.

This step tests the `<cfb-tag>` atom from Step 1. The goal is **not** to assert
on HTML strings or implementation details — it is to verify observable DOM
behaviour: the text that appears, the CSS classes that are applied, and how the
element reacts when its attributes change.

---

## The `fixture` helper

> This is what AI did, it can be helpful, though I never used a `fixture` like this. 
> (Aki Salmi)

Mounting a custom element inside a test requires a bit of ceremony. You need a
container node that is actually attached to the live `document`, because Custom
Elements only upgrade (and fire `connectedCallback`) once they are part of the
DOM.

Create `test/helpers/fixture.js`:

```js
export async function fixture(html) {
  const container = document.createElement('div')
  container.id = 'testRoot'
  container.innerHTML = html
  document.body.appendChild(container)
  await customElements.whenDefined(container.firstElementChild.localName)
  return container.firstElementChild
}

export function cleanup() {
  const root = document.getElementById('testRoot')
  if (root) root.remove()
}
```

A few things worth understanding here:

**Why a container `<div>` and not `document.body.innerHTML = html`?**  
`@web/test-runner` injects its own `<script>` tags into `document.body`. Setting
`body.innerHTML` nukes those scripts and breaks the runner. Always append a
container and remove just that container in cleanup.

**Why `customElements.whenDefined()`?**  
Even though you import and register the element at the top of the test file, the
Promise-based API gives you a safe hook to wait until the browser has finished
upgrading. When the element is already registered it resolves on the next
microtask, so there is no real cost — but without it you can hit a race where
your assertion runs before `connectedCallback` fires.

**Why `afterEach(cleanup)` and not `afterEach(() => document.body.innerHTML = '')`?**  
Same reason as above — nuking `body.innerHTML` removes WTR's injected scripts.

---

## What to build

- [x] Copy the `package.json`, `test/web-test-runner.config.mjs` from `test-0`
      (or share them — they're identical)
- [x] Create `test/helpers/fixture.js`
- [x] Register `<cfb-tag>` at the top of the test file
- [x] Write tests for rendering and attribute reactivity

## Constraints

- Do **not** assert on `innerHTML` or snapshot output.
- Assert only on text content, class presence, and child element counts.
- Max **30 minutes**.

---

## Tips

### Registering the element

`cfb-tag.js` exports `CfbTag` but does not call `customElements.define` itself
— that is intentional, so the component stays reusable across steps. Register
it once at the top of your test file:

```js
import { CfbTag } from '../../step-1/cfb-tag.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}

afterEach(cleanup)
```

The `if (!customElements.get(...))` guard prevents a `NotSupportedError` if the
test file is somehow loaded twice.

### Where does the CSS class actually land?

Open `step-1/cfb-tag.js` and look at what `attributeChangedCallback` writes:

```js
this.innerHTML = `<span class="cfb-tag cfb-tag--${this.#color}">${this.#label}</span>`
```

The colour class is on the **inner `<span>`**, not on the `<cfb-tag>` element
itself. So `el.classList.contains('cfb-tag--green')` will always be `false`.
Use a query instead:

```js
// correct
expect(el.querySelector('.cfb-tag--green')).to.not.be.null

// or equivalently
expect(el.querySelector('span').classList.contains('cfb-tag--green')).to.be.true
```

This is a good example of why you should read the implementation *once* before
writing the tests — not to copy it, but to know where in the DOM to look.

### No `connectedCallback`?

You might notice that `cfb-tag.js` has no `connectedCallback`. The element
renders entirely inside `attributeChangedCallback`. That means:

- When the HTML parser encounters `<cfb-tag data-label="X">`, it creates the
  element and calls `attributeChangedCallback` for each attribute **before**
  the element is connected to the DOM.
- By the time `fixture()` resolves, both callbacks have already fired and the
  inner `<span>` is there.
- If you create a `<cfb-tag>` with **no attributes** and append it, nothing
  renders — worth a test!

### Flushing attribute changes

After you call `el.setAttribute(...)`, the `attributeChangedCallback` runs
synchronously. No microtask flush is needed. However, if you ever port these
tests to an element that renders asynchronously, `await Promise.resolve()` is
the minimal one-microtask flush:

```js
el.setAttribute('data-label', 'After')
await Promise.resolve() // flush microtask queue — not required here, but a good habit
expect(el.textContent.trim()).to.equal('After')
```

### The test file

```js
import { CfbTag } from '../../step-1/cfb-tag.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}

afterEach(cleanup)

describe('<cfb-tag>', () => {
  describe('rendering', () => {
    it('displays the label text', async () => {
      const el = await fixture('<cfb-tag data-label="Keynote" data-color="blue"></cfb-tag>')
      expect(el.textContent.trim()).to.equal('Keynote')
    })

    it('applies the colour modifier class to the inner span', async () => {
      const el = await fixture('<cfb-tag data-label="Workshop" data-color="green"></cfb-tag>')
      expect(el.querySelector('.cfb-tag--green')).to.not.be.null
    })

    it('renders nothing visible when no attributes are given', async () => {
      const el = await fixture('<cfb-tag></cfb-tag>')
      expect(el.querySelector('span')).to.be.null
    })
  })

  describe('attribute reactivity', () => {
    it('updates the label when data-label changes', async () => {
      const el = await fixture('<cfb-tag data-label="Before" data-color="blue"></cfb-tag>')
      el.setAttribute('data-label', 'After')
      expect(el.textContent.trim()).to.equal('After')
    })

    it('swaps the colour class when data-color changes', async () => {
      const el = await fixture('<cfb-tag data-label="X" data-color="blue"></cfb-tag>')
      el.setAttribute('data-color', 'red')
      expect(el.querySelector('.cfb-tag--red')).to.not.be.null
      expect(el.querySelector('.cfb-tag--blue')).to.be.null
    })
  })
})
```

---

## Extras

- [x] Parameterise the colour test: loop over `['red', 'orange', 'green', 'blue', 'purple']`
      and assert each modifier class is applied correctly
- [x] Test that `data-count` shows a number badge when the attribute is set
      (if you implemented that extra in Step 1)
- [ ] Test with Shadow DOM: if your `<cfb-tag>` uses `attachShadow`, query into
      `el.shadowRoot` instead of `el`

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

```
❯ npm run test

> cfb-test-1@1.0.0 test
> web-test-runner "test/**/*.test.js" --node-resolve --config test/web-test-runner.config.mjs


Chrome: |██████████████████████████████| 1/1 test files | 11 passed, 0 failed

Finished running tests in 0.5s, all tests passed! 🎉
```

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to mount a custom element into the live `document` from a test
- Why `cleanup()` must remove a specific container — not wipe `body.innerHTML`
- How `customElements.whenDefined()` safely awaits element registration
- That `attributeChangedCallback` fires during HTML parsing — before
  `connectedCallback`
- How to find where a CSS class actually lands in the DOM before asserting on it
- The difference between testing the element's **observable output** and testing
  its **internal implementation**
