# Step 3 — `<cfb-board-orchestrator>` · Pub/Sub

In Step 2 you composed atoms into a molecule. Now it is time to make components
**talk to each other without knowing about each other**.

This step introduces the **orchestrator / mediator** pattern using plain DOM
events. A generator button fires an event **up** through the DOM tree; an
orchestrator catches it in the middle and pushes state **down** to all relevant 
components (located with a specific css class); a schedule component reacts and re-renders.

```html
<cfb-board-orchestrator>
    <cfb-session-generator></cfb-session-generator>
    <cfb-schedule class="cfb-updates-schedule"></cfb-schedule>
</cfb-board-orchestrator>
```

## The data flow

```
[Add random session button click]
        │
        ▼
cfb-session-generator
  dispatches sessionAdded {bubbles:true}
  detail: { session: { id, title, day, tags, attendees } }
        │  bubbles UP
        ▼
cfb-board-orchestrator
  adds session to #sessions array
  sets data-sessions='[…]' on <cfb-schedule>
        │  attribute change goes DOWN
        ▼
cfb-schedule
  observedAttributes → data-sessions
  parses JSON → re-renders session cards
```

## What to build

### `cfb-session-generator`

- [ ] Render an "Add random session" button on `connectedCallback`
- [ ] On click, generate a random session object
      (`id`, `title`, `day`, `room`, `tags`, `attendees`)
- [ ] Dispatch a `sessionAdded` `CustomEvent` with `bubbles: true` and the
      session in `detail`
- [ ] Remove the listener in `disconnectedCallback`

### `cfb-board-orchestrator`

- [ ] Listen for `sessionAdded` on itself (it bubbles up naturally)
- [ ] Maintain an internal `#sessions` array
- [ ] On each event: push the new session and update `data-sessions` on the
      child `<cfb-schedule>` element with the full JSON array
- [ ] Remove the listener in `disconnectedCallback`

### `cfb-schedule`

- [ ] This readily implemented for you, but please go through it, if you please. What it does is:
- [x] Declares `data-sessions` in `observedAttributes`
- [x] In `attributeChangedCallback`: parses the JSON, group sessions by `day`,
      renders one column per day, one card per session
- [x] Shows a "No sessions yet" placeholder until the first session arrives
- [x] Re-uses `<cfb-session-card>` from Step 2 for sessions

## Constraints

- Use only HTML, JavaScript and (optionally) CSS.
- Do **not** use any frameworks or libraries.
- Do **not** spend more than 30 minutes on the challenge.

## Tips

### Events travel in one direction — and that is the point

`cfb-session-generator` dispatches with `bubbles: true`. It does not import
`cfb-board-orchestrator`; it does not know an orchestrator exists. The
orchestrator is just an ancestor that happens to be listening.

Likewise, the orchestrator does not import `cfb-schedule`. It just looks for
a child matching `querySelector('.cfb-updates-schedule')` and sets an attribute on it.

Neither publisher nor subscriber needs to know the other's class name.

### Stable listener references

Arrow-function class fields give you a stable reference to pass to both
`addEventListener` and `removeEventListener`:

```js
#onSessionAdded = (e) => {
    this.#sessions.push(e.detail.session)
    this.#updateSchedule()
}

connectedCallback()    { this.addEventListener('sessionAdded', this.#onSessionAdded) }
disconnectedCallback() { this.removeEventListener('sessionAdded', this.#onSessionAdded) }
```

### Generating a random session

Keep a small pool of titles, days, rooms and tags and pick randomly:

```js
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const session = {
    id: crypto.randomUUID(),
    title: pick(TITLES),
    day:   pick(DAYS),
    room:  pick(ROOMS),
    tags:  [pick(TAGS)],
    attendees: [pick(INITIALS), pick(INITIALS)],
}
```

### Rendering a JSON attribute

`cfb-schedule` only needs to react to one attribute:

```js
static get observedAttributes() { return ['data-sessions'] }

attributeChangedCallback(name, _old, newValue) {
    if (name === 'data-sessions') {
        const sessions = JSON.parse(newValue ?? '[]')
        this.#render(sessions)
    }
}
```

## Extras

Should you finish early, here are some ideas to go deeper:

- [ ] Add a "Clear all" button that dispatches `sessionsCleared`; the
      orchestrator resets `#sessions` and pushes an empty array down
- [ ] Animate new cards in with a CSS `@keyframes` slide-down triggered by
      adding a class right after insertion
- [ ] Show a live session count somewhere outside the orchestrator — it only
      needs to listen for `sessionAdded` events too
- [ ] Compare this pattern with the Step 10 version: what does IndexedDB buy
      you that an in-memory array cannot?

## Demos

If you complete the challenge, share a short screen recording or a
[CodePen](https://codepen.io) link here.

## Issues

If you get stuck, note down the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How `CustomEvent` with `bubbles: true` lets a child signal an ancestor
  **without importing it**
- The **orchestrator / mediator** pattern: one parent coordinates many
  children that never talk to each other directly
- How `observedAttributes` + `attributeChangedCallback` act as a simple
  **data-binding** mechanism from parent to child
- The asymmetry of events: they travel **up** via bubbling; state travels
  **down** via attributes
- Why removing listeners in `disconnectedCallback` prevents memory leaks
