# Tips

## Stable listener references

How Javascripts binds 'this' is a mystery. And you can google for many resources on the topic - or ask AI. However, a
rule of thumb for custom elements is to always use a **stable reference** to the listener function. To do that, the
handler should be a **private method** of the element (or a reference to a method with a name).

```js
export class CfbBoardOrchestrator extends HTMLElement {
  connectedCallback() {
    this.addEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated) // references to a private method.
  }

  disconnectedCallback() {
    this.removeEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
    // references the same method. If both would make an arrow function like
    // this.removeEventListener(EventTypes.SESSION_CREATED, (evt) => {/* logic here */})
    //, it would reference different functions, and  hence cause a possible memory leak.
  }

  // see below on why using an arrow function instead of a named function (like connectedCallback)
  #onSessionCreated = (e) => {
    /* This is the logic of the function */
  }
}
```

If you use **`.bind(this)`**, you must **remove** the **same** function reference - otherwise **`removeEventListener`**
won’t match.

Curious why? See **Extras** at the end of the README - optional self-study on **`this`** binding.

### Correct 'binding of this'

Let's imagine a custom element like below:

```js
export class CfbCustomElement extends HTMLElement {
  #privateMember = 'private'

  connectedCallback() {
    this.addEventListener('event-1', this.#handleEvent1)
    this.addEventListener('event-2', this.#handleEvent2)
    this.addEventListener('event-3', this.#handleEvent1.bind(this))
    this.addEventListener('event-4', this.#handleEvent2.bind(this))
  }

  #handleEvent1(e) {
    console.log(evt.type, this.#privateMember)
  }

  #handleEvent2 = (e) => {
    console.log(evt.type, this.#privateMember)
  }
}
```

When the given events are fired from a child component, like a press of a button triggering it, and the listeners are
called, three of the listeners will log the private member value, while one of them will log `undefined`. Can you say
which?

Let me explain:

When an event is dispatched from the child component, `this` is bound to the child component (like a `button`). The key
to understand the behavior of `this` in the event listener function `#handleEvent`.

#### 'event-1'

when in the `#handleEvent` function after reacting to `event-1`, the `#handleEvent` function is bound to the target of
the event, meaning the `button` element. This means that `this.#privateMember` will be `undefined`.

#### 'event-2'

the `handleEvent2` is so-called '(fat) arrow function', which means that `this` is bound to the parent element, which in
this case is the custom element. When the event is dispatched from the child component, and handled in the
`#handleEvent2`
function, `this.#privateMember` will be `private` - so it will work as expected.

#### 'event-3'

because of the implicit binding of `this` (`this.#handleEvent1.bind(this)`), when the event is handled in the
`#handleEvent1` function, `this.#privateMember` will be `private` - so it will work as expected. The second and third
are basically the same.

#### 'event-4'

The `bind(this)` is not necessary here, because of the arrow function in the function declaration. This has same
behavior as 'event-2'

## Schedule attribute

`cfb-schedule` listens for **`data-sessions`** - a **JSON array** of session objects (each compatible with *
*`sessionDetails`** / card **`data-session-details`**).

```javascript
export class CfbBoardOrchestrator extends HTMLElement {
  static get observedAttributes() {
    return ['data-sessions']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    if (name === 'data-sessions') {
      this.#sessions = JSON.parse(newValue ?? '[]')
      this.#render()
    }
  }
}
```

