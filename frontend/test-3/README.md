# Test Step T-3 — Pub/Sub · `sessionAdded` Event Flow

In T-2 you tested a molecule by querying its rendered output. This step goes further:
the three components under test **communicate through DOM events** without holding
direct references to each other.

The challenge is to verify the *contracts* between them:

- `<cfb-session-generator>` fires a `cfb-session-created` event when its button is clicked
- `<cfb-board-orchestrator>` accumulates sessions and updates `<cfb-schedule>` via
  a `data-sessions` attribute on each event

**Goal**: Test the custom event flow from Step 3 — verify that
`<cfb-session-generator>` fires the right event, that
`<cfb-board-orchestrator>` accumulates sessions and pushes them down, and
that `<cfb-schedule>` renders correctly from its `data-sessions` attribute (this 
test case is already provided for reference).

```
[button click]
      │
      ▼
cfb-session-generator  dispatches cfb-session-created {bubbles: true}
      │  bubbles UP
      ▼
cfb-board-orchestrator  pushes data-sessions='[…]' DOWN onto cfb-schedule
      │  attribute change
      ▼
cfb-schedule  re-renders session cards
```

---

## What to build

- [ ] Write `test/cfb-session-generator.test.js` — publisher contract
- [ ] Write `test/cfb-board-orchestrator.test.js` — orchestrator contract
- [ ] Consider how to verify that the data sent by the random generator 
      provides valid and sound data.

### Two sides of every event

| Side                                          | What to test                                                                                                                                                |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Publisher** (`<cfb-session-generator>`)     | Does clicking the button dispatch `EventTypes.SESSION_CREATED` with a valid detail? Does it bubble? Is the `id` unique per click?                           |
| **Orchestrator** (`<cfb-board-orchestrator>`) | Does it accumulate sessions and set `data-sessions` on the element with class `cfb-updates-schedule`?                                                       |
| **Subscriber** (`<cfb-schedule>`)             | Does it render one card per session? Does it group by day? Does it sort columns? Does it show a placeholder when empty? Does it react to attribute changes? |

How could these contracts be tested? Consider that part, too.

## Constraints

- Do **not** assert on `innerHTML` or implementation internals.
- Assert only on observable contracts: event type, `bubbles`, `detail` shape, attribute changes.
- Max **30 minutes**.

---

## Tips

### Registering elements

Register each element at the top of its test file:

```js
import { expect } from 'chai'
import { CfbSessionGenerator } from '../../step-3/cfb-session-generator.js'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-session-generator', CfbSessionGenerator)
```

### Capturing an event in a test

Attach a listener *before* triggering the action, then assert on the captured event:

```js
// Arrange
let captured = null
el.addEventListener('cfb-session-created', (e) => { captured = e })

// Act
el.querySelector('button').click()

// Assert
// [Add code here]
```

### Dispatching events to test the orchestrator

You do not need to click a real button to test `<cfb-board-orchestrator>`. Dispatch
the event directly onto the orchestrator element — it only needs to receive the event:

```js
const el = await fixture(`
  <cfb-board-orchestrator>
    <div class="cfb-updates-schedule"></div>
  </cfb-board-orchestrator>
`)

el.dispatchEvent(new CustomEvent('cfb-session-created', {
  bubbles: true,
  detail: { id: 's1', title: 'Test Session', /* … */ },
}))

const sessions = JSON.parse(
  el.querySelector('.cfb-updates-schedule').getAttribute('data-sessions')
)
expect(sessions.some(s => s.id === 's1')).to.be.true
```

---

## Extras

- [ ] Test that dispatching two events accumulates both sessions (does not replace)
- [ ] Test the `detail` shape against the session schema from `test-2/contracts/`
- [ ] Test that a disconnected orchestrator no longer responds to events
- [ ] How did the contract change now? Day/Room became optional parameters for the session
      How should that change things?

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to test an event **contract** — type, `bubbles`, and `detail` shape — in isolation
- How to dispatch synthetic events onto an element to drive an orchestrator test
  without needing the full component tree
- Why testing through observable output (attributes, DOM counts) is more durable
  than asserting on internal state
