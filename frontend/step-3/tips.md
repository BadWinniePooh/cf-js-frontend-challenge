# Tips

## Stable listener references

How Javascripts binds 'this' is a mystery. And you can google for many resources on the topic - or ask AI. However, a 
rule of thumb for custom elements is to always use a **stable reference** to the listener function. To do that, the 
handler should be a **private method** of the element (or a reference to a method with a name). 

```js
export class CfbBoardOrchestrator extends HTMLElement {
  connectedCallback() {
    this.addEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated) // references to a private method.
    // See, this does not make an arrow function here.
  }

  disconnectedCallback() {
    this.removeEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
    // references the same method. If both would make an arrow function, it would reference different functions, and 
    // hence cause a possible memory leak.
  }
  
  #onSessionCreated = (e) => {
    /* This is the logic of the function */
  }
}
```

If you use **`.bind(this)`**, you must **remove** the **same** function reference - otherwise **`removeEventListener`**
won’t match.

Curious why? See **Extras** at the end of the README - optional self-study on **`this`** binding.

## Schedule attribute

`cfb-schedule` listens for **`data-sessions`** - a **JSON array** of session objects (each compatible with *
*`sessionDetails`** / card **`data-session-details`**).

```javascript
static get observedAttributes(){
  return ['data-sessions']
}

attributeChangedCallback(name, oldValue, newValue){
  if (oldValue === newValue) return
  if (name === 'data-sessions') {
    this.#sessions = JSON.parse(newValue ?? '[]') 
    this.#render()
  }
}
```

