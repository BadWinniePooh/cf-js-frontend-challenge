export async function fixture(html) {
  const container = document.createElement('div')
  container.id = 'testRoot'
  container.innerHTML = html
  document.body.appendChild(container)
  await customElements.whenDefined(container.firstElementChild.localName)
  return container.firstElementChild
}

export function cleanup() {
  const root = document.getElementById('testRoot')
  if (root) root.remove()
}

/**
 * Mounts html, waits for the named event to bubble up from the element,
 * and returns both the element and the event.
 *
 * Use this instead of fixture() when the element fires an async event
 * in connectedCallback (e.g. <cfb-session-loader>).
 */
export async function fixtureAndWaitFor(html, eventType) {
  const container = document.createElement('div')
  container.id = 'testRoot'

  const eventPromise = new Promise(resolve => {
    container.addEventListener(eventType, (e) => resolve(e), { once: true })
  })

  container.innerHTML = html
  document.body.appendChild(container)

  const event = await eventPromise
  return { el: container.firstElementChild, event }
}

/**
 * Returns a Promise that resolves the next time `target` emits `eventType`.
 */
export function waitForEvent(target, eventType) {
  return new Promise(resolve => {
    target.addEventListener(eventType, (e) => resolve(e), { once: true })
  })
}
