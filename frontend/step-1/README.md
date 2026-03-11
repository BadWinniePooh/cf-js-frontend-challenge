# Step 1 — Your First Board Atom: `<cfb-tag>`

One of the cornerstones of the W3C Web Components approach is the ability to
create **custom elements** — HTML elements whose behaviour is defined through
JavaScript and that extend the native set of elements available in the browser.

In this step you will create your first custom element: `<cfb-tag>`.
It is the smallest building block (an **atom**) of the CodeFreeze Board —
the little coloured badge you see on every session card.

```html
<cfb-tag data-label="Keynote" data-color="blue"></cfb-tag>
```

## What to build

Create a `<cfb-tag>` custom element that:

- [x] Renders a styled badge using the existing `cfb-tag` CSS classes
- [x] Reads a `data-label` attribute and displays its value as the badge text
- [x] Reads a `data-color` attribute (`red | orange | green | blue | purple`)
      and applies the matching `cfb-tag--{color}` CSS modifier class
- [x] Renders itself when connected to the DOM (`connectedCallback`)
- [x] Re-renders when either attribute changes after the element is already in
      the DOM (`observedAttributes` + `attributeChangedCallback`)

Once it works, open `index.html` and replace the placeholder `<span>` tags
with your new `<cfb-tag>` elements.

## Constraints

- Use only HTML, JavaScript and (optionally) CSS.
- Do **not** use any frameworks or libraries.
- Do **not** spend more than 30 minutes on the challenge.

## Tips

### Keep your component in its own file

Put your element class in a dedicated file, e.g. `cfb-tag.js`.
Then import and register it from `index.js`:

```js
// index.js
import './cfb-tag.js'
```

Inside `cfb-tag.js`, define and register the element at the bottom of the file:

```js
// cfb-tag.js
class CfbTag extends HTMLElement {
    // ...
}

customElements.define('cfb-tag', CfbTag)
```

### Local web server

Because `index.html` loads `index.js` as an ES module (`type="module"`),
browsers block it on `file://` URLs. You need a local server.

**Option A** — install once, run anywhere:
```bash
npm install -g http-server
http-server . -o
```

**Option B** — VS Code [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
(right-click `index.html` → *Open with Live Server*).

## Extras

Should you finish early, here are some ideas to go deeper:

- [ ] Use Shadow DOM (`this.attachShadow({ mode: 'open' })`) to encapsulate
      the tag's styles so they can't be accidentally overridden from outside
- [ ] Support a `data-count` attribute that shows a small number badge next
      to the label (e.g. `Keynote ×3`)
- [ ] Handle the case where `data-color` is absent or unknown — fall back
      to the default `cfb-tag` style gracefully

## Demos

If you complete the challenge, share a short screen recording or a
[CodePen](https://codepen.io) link here.

## Issues

If you get stuck, note down the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to define a custom element with `customElements.define()`
- The `connectedCallback` lifecycle hook — called when the element enters the DOM
- How to declare `observedAttributes` and react to changes with `attributeChangedCallback`
- How to map `data-*` attribute values to CSS modifier classes
