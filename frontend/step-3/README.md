# Step 3 - `<cfb-board-orchestrator>` · Pub/Sub

In Step 2 you rendered one **molecule** (`<cfb-session-card>`) from session data. Now the board becomes **live**: a
control can announce “new session” and **other** components update - **without** importing each other’s classes.

This step is about **events bubbling up** and **state pushed down** through attributes. The exact event name, payload
shape, and wiring live in **Concepts** and **`events.js`** - after you’ve done **Connections** - so your first guesses
in the learning log stay honest.

> **Before you start:** branch, HTTP server, clean console - see [getting-started.md](./getting-started.md).

### Async / solo

These challenges are written for **async, often solo** work. Use [your Step 3 learning log](./learning-log.md), a short
message to your facilitator or team, or a brief sync when the README says “pair.” **Short timeboxes** matter more than 
the format.

---

## Learning goal

By the end of this step, you can:

- Dispatch a **`CustomEvent`** that **bubbles** so a deep child can signal an ancestor **without imports**.
- Implement an **orchestrator** that listens on itself, keeps internal state of  **`#sessions`**, and pushes
  **`data-sessions`** down to `<cfb-schedule>`.
- Explain why **`observedAttributes` + `attributeChangedCallback`** act like simple **parent → child** data binding for
  the schedule.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 3 learning log](./learning-log.md).

1. **Solo, ~2 min - How does the button reach the board?**
   [How does the button reach the board?](./learning-log.md#step-3-connections-how-notify) *(Revisit in Conclusions.)*

2. **Solo, ~3 min - Bridge from Step 2**  
   [Bridge from Step 2](./learning-log.md#step-3-bridge-step-2): single card vs dynamic list.

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-3-compare-surprise):

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-3-topic-link): **A** or **B**.

---

## 2) Concepts

HTML is by default a pub/sub system. An HTML element can publish an event while any other HTML element up the tree can
listen for it. To pass data down from a parent to a child, the parent can always find a child, e.g. by its id or class.
When a parent has a reference to a child, it can pass data down to the child via **attributes** (what we have done the
previous steps).

### Events up, state down

To publish an event, a component calls **`dispatchEvent`** on itself. To listen for an event, an ancestor element calls
**`addEventListener`** on itself with reference to the event type.

In short in this exercise:

- **Up:** [`CfbSessionGenerator`](cfb-session-generator.js) calls **`dispatchEvent`** on itself with a
  `cfbSessionCreated` event. The event walks toward `document`;
  The [`CfbBoardOrchestrator`](cfb-board-orchestrator.js) listens for `cfb-session-created` events and acts on the
  event.'
- **Handling the event:** The orchestrator listens to the event, and whenever it sees a new session added to the
  schedule, it needs to do few things:
    - it calls `preventDefault()` to prevent the default browser behavior, and `stopPropagation()` to prevent the event
      from bubbling up to the document.
    - it adds the session to the internal **`#sessions`** array. ...and
    - it updates the **`data-sessions`** attribute on `<cfb-schedule>` with the new array, which is the next step in the
      flow.
- **Down:** the orchestrator keeps track of *sessions* locally and whenever an event is dispatched, it pushes the state
  down to [`CfbSchedule`](cfb-schedule.js) by changing the **`data-sessions`** attribute. The schedule declares
  **`observedAttributes`** and **re-renders** when that attribute changes.
  Note how the CfbSchedule has no direct reference to [CfbSessionCard](../step-2/cfb-session-card.js) from Step-2, but
  it just works by adding `<cfb-session-card data-session-details='${sessionJson}'></cfb-session-card>` into the HTML.
  (this is the magic of the custom web components and registering them.)

Neither the generator nor the schedule needs to **`import`** the orchestrator’s class. The **DOM tree** is the wiring
that is part of the **pub/sub** system.

### The event details: `sessionDetails` and `cfb-session-created`

From this exercise onwards, we're having a session data shape as follows (and this resembles the contract
between frontend and backend in these exercises):

```typescript
 {
    id: string
    title: string
    day: string
    room: string
    tags: Array<string>
    attendees: Array<{ initials: string, name: string }>
    sessionType: string
}
```

In [lib](./lib) folder, there are two related files, [`events.js`](./lib/events.js) which creates a custom event to be
dispatched (that ensures the event details are of correct shape by calling a factory function defined in
[`builds-session-details.js`](./lib/builds-session-details.js).

The pattern of building sessionDetails and event through factories is a good pattern to make sure the shape of the data
is consistent and easy to maintain. In [test-3](../test-3/README.md), this pattern is used to make contract tests. In
that test-step, we'll learn to test the shape of the return value of [
`generateRandomSession`](./lib/generate-random-session.js).

#### Building event details

To build the details of a session, it's useful to have a factory function that will build the shape of the data with
good default values (if any). This is done in [`builds-session-details.js`](./lib/builds-session-details.js). It does
not have any validation, but does create a valid session shape with a default id.

see [builds-session-details](./lib/builds-session-details.js) for more details. This too, is tested in 'test-3'

#### Buidling the event

For events, it's useful to have a factory function to guarantee valid shape of events. To build a custom event, it needs
a type and payload. The first parameter is the type, and the second contains the payload and other important properties.

The shape of a custom event is:

 ```javascript
new CustomEvent("EventName", {
  /* Event properties */
  bubbles: true, // This is crucial for the pub/sub system to work
  /* The 'detail' property is a custom key that holds the payload */
  detail: { /* the payload */ }
})
```

This repo uses [`events.js`](./lib/events.js) to build the event:

- it exports a function `cfbSessionCreated` that takes _data_ as parameter, and returns a `CustomEvent` with type of
  `EventTypes.SESSION_CREATED` and follows a shape of the CustomEvents described above. It also makes sure that the
  detail is build with the event details factory method.
- the `_type` field of the `detail` is set to same as the type of the custom event. This most likely is unnecessary.

### End-to-end flow (reference)

Legend:

- [ ] ✨ you implement / finish
- [ ] 🚧 partly provided
- [ ] ✅ read & trace for understanding

```
[Click “Add random session”]
        │
        ▼
✨ cfb-session-generator
  dispatches cfb-session-created { bubbles: true, composed: true }
  detail: sessionDetails(session) + _type
        │  bubbles UP
        ▼
🚧 cfb-board-orchestrator
  ✨ listens for cfb-session-created
  ✨ pushes session into #sessions
  ✨ sets data-sessions='[…]' on <cfb-schedule class="cfb-updates-schedule">
        │  attribute goes DOWN
        ▼
✅ cfb-schedule
  observedAttributes → data-sessions
  parses JSON → groups by day → renders <cfb-session-card> per session
```

### Orchestrator role

- The orchestrator has **one job:** to coordinate data flow - it merges incoming sessions and **fan out** changes to
  state to `CfbSchedule` element(s) via **attributes**.
- The orchestrator **does not** know about the schedule - it must not have any reference to it.

### Listener hygiene

Use a **stable** function reference for **`addEventListener`** / **`removeEventListener`** (e.g. a **bound** method or
a **class field arrow**). Remove listeners in **`disconnectedCallback`** to avoid memory leaks. This is one of the
drawbacks of Javascript and custom elements - how `this` is bound in functions.

---

### One-minute review (~1 min)

After reading the sections above, complete [One-minute review](./learning-log.md#step-3-concepts-one-minute) in your
learning log.

---

### Concept check

Do **two** short activities in your [learning log](./learning-log.md).

1. **Mini quiz** - Open [Mini quiz](./learning-log.md#step-3-concept-quiz) and answer the three questions there *before*
   you rely on copy-paste from the source files.
2. **Flow sketch** - Then open [Flow sketch](./learning-log.md#step-3-concept-flow-sketch) and draw the four-step
   pipeline
   (boxes + arrow labels). Paper is fine; paste a photo or ASCII into the log if you like.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

Now it's time to make the pub/sub board live. To have a live board -> where you can add new (random) sessions

### Files to work in

| File                                                       | Role                                                                                                  |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| [`cfb-session-generator.js`](./cfb-session-generator.js)   | Button → **`cfbSessionCreated`** with random session data                                             |
| [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) | Listen · maintain **`#sessions`** · **`setAttribute('data-sessions', …)`** on `.cfb-updates-schedule` |
| [`cfb-schedule.js`](./cfb-schedule.js)                     | **Read** implementation: **`data-sessions`**, grouping, cards                                         |

Build so you can **show**:

- [ ] **`cfb-session-generator`**: button in **`connectedCallback`**; click builds a session
  (use **`generateRandomSession`**) and dispatches **`cfbSessionCreated(...)`** from **`events.js`**
- [ ] **`cfb-board-orchestrator`**: register a listener on **self** for **`EventTypes.SESSION_CREATED`** (event string
  **`cfb-session-created`**); on each event, append to **`#sessions`** and set **`data-sessions`** on
  **`querySelectorAll('.cfb-updates-schedule')`**.
- [ ] **Remove** the same listener in **`disconnectedCallback`**.
- [ ] **`cfb-schedule`**: trace **`observedAttributes`**, **`attributeChangedCallback`**, **`#render`**, and how it
  emits **`<cfb-session-card data-session-details='…'>`**.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only - no frameworks.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- Clicking **Add random session** adds a visible card (or updates the list) **without** any component `import`ing
  another’s class for wiring.
- **`data-sessions`** on `<cfb-schedule>` updates and the schedule re-renders.
- You can name the event type **`cfb-session-created`** and point to **`sessionDetails`** / **`events.js`** in one
  sentence.

In [Question for your facilitator](./learning-log.md#step-3-concrete-facilitator-question), ask one real question and
capture the answer.

---

## 4) Conclusions

Now you've learned how the pub/sub system works in HTML pages. Time for a **short** summary.

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-3-conclusions-quick-check):

- Where is **`cfb-session-created`** defined, and who **dispatches** it?
- In one line: what travels **up** vs **down** in this step?

### 2) Loop back

Update [How does the button reach the board?](./learning-log.md#step-3-loop-back-notify).

### 3) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-3-key-takeaway).

---

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Extras

If you finish early:

- [ ] Dispatch **`sessionsCleared`** (or similar); orchestrator resets **`#sessions`** and pushes **`[]`** down.
- [ ] Animate new cards with **`@keyframes`** when a card appears.
- [ ] A small **session count** badge elsewhere: listen for **`cfb-session-created`** without importing the
  orchestrator.
- [ ] Compare this in-memory list with **Step 4** (IndexedDB): what does persistence buy you?
- [ ] **Self-study (optional, not part of this step’s scope):** Dig into how **`this`** is bound in JavaScript - plain
  functions vs **arrow functions**, **`.bind(this)`**, and object methods. It explains why **`removeEventListener`**
  must receive the **same** function reference you passed to **`addEventListener`
  ** ([listener hygiene above](#stable-listener-references)). [MDN:
  `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is a solid starting point.

---

### End result (skills you can demonstrate)

- **`CustomEvent`** + **`cfb-session-created`** with **`bubbles: true`** / **`composed: true`**
- **Orchestrator / mediator** - coordinate without coupling class names
- **Push state down** via **`data-sessions`** + **`attributeChangedCallback`**
- **Clean teardown** - **`removeEventListener`** in **`disconnectedCallback`**
- **`sessionDetails`** as the shared session shape from **`events.js`**
