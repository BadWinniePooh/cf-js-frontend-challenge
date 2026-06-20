# Tips

[Back to concrete practice](#3-concrete-practice)

## Keep the component in its own file

Put the class in `cfb-tag.js`, then import and register from `index.js`:

```js
// index.js
import { CfbTag } from './cfb-tag.js'

customElements.define('cfb-tag', CfbTag)
```

```js
// cfb-tag.js
export class CfbTag extends HTMLElement {
  // ...
}
```

*(Alternatively `import './cfb-tag.js'` if the module self-registers - pick one style and stay consistent.)*

## Fake it until you make it.

To start with, it might be useful to just render an example tag as it is:

```javascript
export class CfbTag extends HTMLElement {

  connectedCallback() {
    this.innerHTML = '<span class="cfb-tag cfb-tag--orange">Example</span>'
  }
}
```

This way you can first see that you can render an element in the page. This is the smallest step.

## To get the data-attributes, use dataset of getAttribute

To get the data value, you can either use the `dataset` property (that only works, if you have the attribute defined
with 'data-' prefix) or 'getAttribute' function

```javascript
  #render()
{
  const color = this.getAttribute('data-color') // using getAttribute
  const label = this.dataset.label // or dataset - an observed attribute named 'data-label'
  this.innerHTML = `<span class="cfb-tag cfb-tag--${color}">${label}</span>`
}
```

