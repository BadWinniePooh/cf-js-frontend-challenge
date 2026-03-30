# Test Step T-1 — Atom Behaviour · `<cfb-tag>`

In T-0 you got the toolchain running. Now it is time to write tests that
actually mean something.

This step tests the `<cfb-tag>` atom from Step 1. The goal is **not** to assert
on HTML strings or implementation details — it is to verify observable DOM
behaviour: the text that appears, the CSS classes that are applied, and how the
element reacts when its attributes change.

**Goal**: Test the rendered output and attribute-reactivity of the `<cfb-tag>`
atom from Step 1, focusing on observable DOM behaviour — not implementation
details.

---

## The `fixture` helper

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

## What to test

- [ ] Copy the `package.json`, `test/web-test-runner.config.mjs` from `test-0`
  (or share them — they're identical)
- [ ] Create `test/helpers/fixture.js`
- [ ] Register `<cfb-tag>` at the top of the test file
- [ ] Write tests for rendering and attribute reactivity

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
import { expect } from 'chai'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-tag', CfbTag)
```

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
expect(el.querySelector('.cfb-tag--green'))// add rest here

// or equivalently, but bit worse, because it get's to inner element type (span)
expect(el.querySelector('span').classList.contains('cfb-tag--green')).to.be.true
```

This is a good example of why you should read the implementation *once* before
writing the tests — not to copy it, but to know where in the DOM to look.

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

### What to assert

| Group                | What to verify                                                                                                                                                 |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Rendering            | `textContent` shows the `data-label` value; the `cfb-tag--{color}` class is present on the inner element; element renders nothing when no attributes are given |
| Attribute reactivity | Changing `data-label` updates the displayed text; changing `data-color` swaps the modifier class                                                               |

---

## Extras

- [ ] Parameterise the colour test: loop over `['red', 'orange', 'green', 'blue', 'purple']`
  and assert each modifier class is applied correctly
- [ ] Test that `data-count` shows a number badge when the attribute is set
  (if you implemented that extra in Step 1)
- [ ] Test with Shadow DOM: if your `<cfb-tag>` uses `attachShadow`, query into
  `el.shadowRoot` instead of `el`
- [ ] Run tests with manual flag, opening Browser to see the tests running

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

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
