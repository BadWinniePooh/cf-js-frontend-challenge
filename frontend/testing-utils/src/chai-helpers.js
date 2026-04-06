/**
 * Wraps a schema validator to make the field optional.
 * An optional field is not required to be present in the object.
 * If it is present, the wrapped validator still runs.
 */
export function optional(validator) {
  const wrapped = (value) => { if (value !== undefined) validator(value) }
  wrapped._optional = true
  return wrapped
}

export function schemaMatcher(chai) {
  chai.Assertion.addMethod('matchSchema', function(schema) {
    // eslint-disable-next-line no-underscore-dangle,no-invalid-this
    const obj = this._obj

    // 1. Check that all schema keys are present and valid
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const validator = schema[key]
        const value = obj[key]

        // Assert that the key exists (skipped for optional fields)
        if (!validator._optional) {
          // eslint-disable-next-line no-invalid-this
          this.assert(
            Object.prototype.hasOwnProperty.call(obj, key),
            'expected #{this} to have property #{exp}',
            'expected #{this} to not have property #{exp}',
            key,
          )
        }

        // Run the custom validator function
        try {
          validator(value, key)
        } catch (e) {
          // Improve the error message
          // eslint-disable-next-line no-invalid-this
          this.assert(
            false,
            `Validation failed for key "${key}": ${e.message}`,
          )
        }
      }
    }

    // 2. (Optional) Check for extra keys in the object that are not in the schema
    const schemaKeys = Object.keys(schema)
    const objectKeys = Object.keys(obj)
    const extraKeys = objectKeys.filter(key => !schemaKeys.includes(key))

    // eslint-disable-next-line no-invalid-this
    this.assert(
      extraKeys.length === 0,
      `expected #{this} to not have extra keys, but found [${extraKeys.join(', ')}]`,
      'expected #{this} to have extra keys',
    )
  })
}
