# Tips

## Import `<cfb-tag>` from Step 1

`index.js` should register **`cfb-tag`** before **`cfb-session-card`** so tags inside the card upgrade correctly.
This repo imports from [`../step-1/cfb-tag.js`](../step-1/cfb-tag.js) — keep `step-1/` beside `step-2/` or adjust the path.

## Skeleton `innerHTML`

A good practice is to hard-code the HTML structure then starting to make it dynamic.
You can do this by copying the whole `article` from the static board - and then start making it dynamic by adding
`<cfb-tag>` elements.

```js
// Shape only — yours will call #render from lifecycle callbacks
const raw = this.getAttribute('data-session-details')
const session = raw ? JSON.parse(raw) : {}
```

---