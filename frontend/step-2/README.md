# Step 2 — Composing a Molecule: `<cfb-session-card>`

In Step 1 you built the smallest building block of the board — the `<cfb-tag>`
atom. Now it is time to **compose** atoms into something larger.

A **molecule** is a component that is made up of smaller atoms working together.
In this step you will build `<cfb-session-card>`: the full session card you see
in every column of the CodeFreeze Board.

```html
<cfb-session-card>
 // [data omitted, as that's for you to define]
</cfb-session-card>
```

## What to build

Create a `<cfb-session-card>` custom element that:

- [x] Renders like in [the static html](../step-0/index.html)
- [x] Re-renders when any relevant attribute changes
- [x] Has internal data structure for the data
- [x] Renders itself when connected to the DOM (`connectedCallback`)
- [x] Then pass on the relevant data to the component from the outside

The expected shape of the data structure is

```json
{
  "title": "Opening Keynote",
  "tags": [
    { "label": "Keynote", "color": "blue" }
  ],
  "attendees": ["AK", "JS"]
}
```

Once the component works, open `index.html` and replace the static card HTML
with your new `<cfb-session-card>` elements.

## Constraints

- Use only HTML, JavaScript and (optionally) CSS.
- Do **not** use any frameworks or libraries.
- Do **not** spend more than 30-45 minutes on the challenge.

## Tips

### Reuse `<cfb-tag>` from Step 1

`index.js` already imports and registers `<cfb-tag>` for you, so you can use
it directly inside `cfb-session-card.js`:

```js
// cfb-session-card.js
connectedCallback() {
    const session = JSON.parse(this.dataset.session ?? '{}')
    this.innerHTML = `
        <article class="cfb-card">
            <header class="cfb-card__header">
             <!-- add header here -->
            </header>
            <div class="cfb-card__tags">
             <!-- add tags here -->
            </div>
            <footer class="cfb-card__footer">
             <!-- add footer here -->
            </footer>
        </article>
    `
}
```

### Keep your component in its own file

Define your component in `cfb-session-card.js` file

```js
class CfbSessionCard extends HTMLElement {
    // ...
}
```

Then import it and register the component in  `index.js`:

```js
// index.js
import {CfbSessionCard} from './cfb-session-card.js'
customElements.define('cfb-session-card', CfbSessionCard)
```

## Extras

Should you finish early, here are some ideas to go deeper:

- [x] **Pass data in other ways** — figure out 2–3 alternative ways to get
      session data into the component
- [x] **Named slots** — try using `<template>` and `slot` elements for the inner structure.
      How does that affect the code? What do you learn from that?
- [x] **Travel variant** — support a `data-variant="travel"` attribute that
      applies the blue left-border card style (`cfb-card--travel`)
- [ ] **Shadow DOM** — Learn about shadow dom vs. full dom (not sure of the naming here, please correct me). 

## Demos

If you complete the challenge, share a short screen recording or a
[CodePen](https://codepen.io) link here.

- Status Step 2: [codepen.io/BadWinniePooh](http://codepen.io/BadWinniePooh/pen/WbGoObd)

## Issues

If you get stuck, note down the problem here so we can discuss it together.
- Shadow Dom, don't really understand whats going on with that and how to correctly use it...
- Before we had aria labels on the speaker tags, I hope they will return, with the propose JSON structure they got lost.

---

### End result

After completing this step you will have learned:

- How to **compose** one custom element inside another (`<cfb-tag>` inside `<cfb-session-card>`)
- How to pass structured data to a component via a **JSON attribute**
- How `innerHTML` templating works inside a custom element
- The basics of **Light DOM slots** (`<slot name="...">`) as an alternative data-passing strategy
- The parent → child **data flow** pattern used across the whole board
