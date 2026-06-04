export class CfbLiveSessionUpdates extends HTMLElement {
  static elementName = 'cfb-live-session-updates'

  /** @type {WebSocket | null} */
  #socket = null

  static get observedAttributes() {
    return ['data-event-id', 'data-url', 'data-reload-token']
  }

  connectedCallback() {
    this.#connect()
  }

  disconnectedCallback() {
    // TODO: Implement a WebSocket disconnection
    this.#socket?.close()
    this.#socket = null
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    if (name === 'data-event-id' || name === 'data-url') {
      this.#connect()
    }
  }

  #connect() {
    // TODO: Implement a WebSocket connection
    this.#socket?.close()
    this.#socket = null

    const eventId = this.dataset.eventId
    const baseUrl = this.dataset.url
    if (!eventId || !baseUrl) {
      this.#setStatus('error', 'missing data-event-id or data-url')
      return
    }

    const wsUrl = `${String(baseUrl).replace(/\/+$/, '')}/${encodeURIComponent(eventId)}`
    this.#setStatus('connecting', `connecting to ${wsUrl}…`)

    const socket = new WebSocket(wsUrl)
    this.#socket = socket

    socket.addEventListener('open', () => {
      this.#setStatus('open', `live feed open for "${eventId}"`)
    })

    socket.addEventListener('message', (e) => {
      this.#onMessage(e)
    })

    socket.addEventListener('close', () => {
      this.#setStatus('closed', `live feed closed for "${eventId}"`)
    })

    socket.addEventListener('error', () => {
      this.#setStatus('error', `live feed error for "${eventId}"`)
    })
  }

  #onMessage(event) {
    const { type, session, sessionId, eventId } = JSON.parse(event.data)

    if (type === 'sessionUpdated' && session) {
      this.dispatchEvent(
        new CustomEvent('liveSessionUpdated', {
          bubbles: true,
          composed: true,
          detail: { eventId: session.eventId, session },
        })
      )
      return
    }

    if (type === 'sessionRemoved' && sessionId && eventId) {
      this.dispatchEvent(
        new CustomEvent('liveSessionRemoved', {
          bubbles: true,
          composed: true,
          detail: { eventId, sessionId },
        })
      )
    }
  }

  #setStatus(state, message) {
    this.dataset.state = state
    this.textContent = `[live-updates] ${message}`
  }
}
