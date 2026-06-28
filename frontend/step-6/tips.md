# Tips

## Make the element form-associated

```js
class CfbSessionType extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this.#internals = this.attachInternals()
  }
}
```

Without **`formAssociated`** + **`attachInternals()`**, the element is invisible to the form.

## Write value to `FormData`

```js
this.#internals.setFormValue(this.#value ?? null)
```

Use **`null`** when no value is selected so the field is omitted or empty in the form’s model, matching how you treat
“no selection”.

### Required validation with a custom message

```js
if (this.dataset.required && !this.#value) {
  this.#internals.setValidity(
    { valueMissing: true },
    'Please select a session type.'
  )
} else {
  this.#internals.setValidity({})
}
```

Pair this with the parent **`form.checkValidity()`** / **`form.reportValidity()`** so submit behaviour matches native
controls.

## Reset behaviour

```js
formResetCallback()
{
  this.#value = ''
  this.#internals.setFormValue(null)
  this.#internals.setValidity({})
  this.render()
}
```

Implement lifecycle callbacks early; they prevent subtle bugs in edit/reset flows.

---