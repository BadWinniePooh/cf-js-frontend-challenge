# Tips

## Connecting to WebSocket

First build the URL:

```javascript
const wsUrl = `${this.#wsBaseUrl}/${encodeURIComponent(eventId)}`
```

and then connect to it:

```javascript
const socket = new WebSocket(wsUrl)
this.#socket = socket
```

## Implement lifecycle events of the WebSocket

To implement lifecycle events of the WebSocket, add event listeners for `open`, `message`, `close`, and `error` events,
you can dos something like this (the actual domain code remains to be not implemented):

```javascript
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
```