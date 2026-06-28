// Form-associated custom element - session type as selectable tiles.
// Uses ElementInternals so the value joins FormData and participates in
// constraint validation (required + native reportValidity).

const OPTIONS = [
  { value: 'Talk',           label: 'Talk',           emoji: '💬' },
  { value: 'Workshop',       label: 'Workshop',       emoji: '🔧' },
  { value: 'Keynote',        label: 'Keynote',        emoji: '🎤' },
  { value: 'Lightning Talk', label: 'Lightning Talk', emoji: '⚡' },
]

const VALIDATION_MESSAGE = 'Please select a session type.'


export class CfbSessionType extends HTMLElement {
  static elementName = 'cfb-session-type'
  // TODO: This is your magic


  // Here is example of the styled component that has emojis for session types
  #render() {
    this.innerHTML = `
            <div class="cfb-session-type__group" role="radiogroup" aria-label="Session type">
                ${OPTIONS.map(t => `
                    <button type="button" role="radio" class="cfb-session-type__tile"
                        data-value="${escapeAttr(t.value)}"
                        aria-checked="false"
                        tabindex="-1">
                        <span class="cfb-session-type__emoji" aria-hidden="true">${t.emoji}</span>
                        <span class="cfb-session-type__label">${t.label}</span>
                    </button>
                `).join('')}
            </div>
        `
  }
}
