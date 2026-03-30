import { getAllSessions } from './session-store.js'

// Single responsibility: read sessions from IndexedDB and announce them.
// This component never stores, never renders — it only fires one event.
export class CfbSessionLoader extends HTMLElement {
    async connectedCallback() {
        const sessions = await getAllSessions()

        this.dispatchEvent(new CustomEvent('sessionsLoaded', {
            bubbles: true,
            detail: { sessions },
        }))
    }
}
