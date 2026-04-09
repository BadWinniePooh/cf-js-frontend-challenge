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

Legend:
✨: New features, core of the exercise
🚧: Partly done, part of this exercise
✅: This is already provided

```
[Add random session button click]
        │
        ▼
✨ cfb-session-generator
  dispatches sessionCreated {bubbles:true}
  detail: { session: { id, title, day, tags, attendees } }
        │  bubbles UP
        ▼
🚧 cfb-board-orchestrator
  adds session to #sessions array
  sets data-sessions='[…]' on <cfb-schedule>
        │  attribute change goes DOWN
        ▼
✅ cfb-schedule
  observedAttributes → data-sessions
  parses JSON → re-renders session cards
```

## What to build

### ✨ `cfb-session-generator`

- [x] Render an "Add random session" button on `connectedCallback`
- [x] On click, generate a random session object
      (`id`, `title`, `day`, `room`, `tags`, `attendees`) (you can use 
       [lib/generate-random-session.js](./lib/generate-random-session.js))
- [x] Dispatch a `sessionAdded` `CustomEvent` with `bubbles: true` and the
      session in `detail`

### 🚧 `cfb-board-orchestrator`

- [x] Listen for `sessionAdded` on itself (it bubbles up naturally)
- [x] Maintain an internal `#sessions` array
- [x] On each event: push the new session and update `data-sessions` on the
      child `<cfb-schedule>` element with the full JSON array
- [x] Remove the listener in `disconnectedCallback`

### ✅ `cfb-schedule`

- [x] This readily implemented for you, but please go through it, if you please. What it does is:
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

### addEventListener & removeEventListener

These two HtmlElement methods are crucial for this exercise. These provides a way to 
send a message from an HtmlElement to any of the ancestor HtmlElements, as long as 
there is an element in the hierarcy that has registered an event listener (with 
`addEventListener`) with the same event name/type - well, string.

And for not letting event listeners to stay in the memory, you have to remember to 
remove the event listeners at the end of component lifecycle. But sometimes, you might 
need to remove (and readd) event listeners in attributeChangedCallback, too.

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

The other way to make sure `this` is bound correctly in the event handler is to `bind` the 
eventHandler explicitly. If you ever encounter an issue that '#sessions' not found on 'undefined',
the problem most likely lies in `this`.

```js
class X extends HTMLElement{
  connectedCallback()    { this.addEventListener('sessionAdded', this.#onSessionAdded.bind(this)) }
  disconnectedCallback() { this.removeEventListener('sessionAdded', this.#onSessionAdded.bind(this)) }
  
  onSessionAdded(e) {
    this.#sessions.push(e.detail.session)
    this.#updateSchedule()
  }
}
```

### Generating a random session

Keep a small pool of titles, days, rooms and tags and pick randomly:

For this exercise, there is [a small helper](./lib/generate-random-session.js) 
to create a random session


### Rendering a JSON attribute

`cfb-schedule` only needs to react to one attribute:

```js
static get observedAttributes() { return ['data-sessions'] }

attributeChangedCallback(name, _old, newValue) {
    if (_old === newValue) return
    if (name === 'data-sessions') {
        this.#sessions = JSON.parse(newValue ?? '[]')
        this.#render()
    }
}
```

## Extras

Should you finish early, here are some ideas to go deeper:

- [x] Add a "Clear all" button that dispatches `sessionsCleared`; the
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
https://codepen.io/BadWinniePooh/pen/WbGoObd

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
