// Generic two-sided card with a 3-D flip animation.
// Knows nothing about sessions — only about geometry and timing.
//
// Slots:
//   <* slot="front">  — visible face in resting state
//   <* slot="back">   — visible face when flipped
//
// Public API:
//   flip()              — expand to center and rotate to back face
//   unflip(callback?)   — rotate back and shrink; callback fires after animation

const SHADOW_CSS = `
    :host {
        display: block;
    }

    /* Enables position + size transitions once JS starts the animation */
    :host(.is-flipping) {
        border-radius: 0.5rem;
        box-shadow:    0 12px 40px rgba(0, 0, 0, 0.25);
        transition:
            top    0.45s cubic-bezier(0.4, 0, 0.2, 1),
            left   0.45s cubic-bezier(0.4, 0, 0.2, 1),
            width  0.45s cubic-bezier(0.4, 0, 0.2, 1),
            height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .scene {
        perspective: 1200px;
    }

    /* Propagate host's explicit height into the scene when flipping */
    :host(.is-flipping) .scene,
    :host(.is-flipping) .inner {
        height: 100%;
    }

    .inner {
        position:        relative;
        transform-style: preserve-3d;
        transition:      transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host(.is-flipped) .inner {
        transform: rotateY(180deg);
    }

    .face {
        backface-visibility:         hidden;
        -webkit-backface-visibility: hidden;
    }

    /* Back face starts rotated away; fills the host when expanded */
    .face--back {
        position:   absolute;
        inset:      0;
        transform:  rotateY(180deg);
        overflow-y: auto;
        border-radius: 0.5rem;
    }
`

export class CfbFlipCard extends HTMLElement {
    static elementName = 'cfb-flip-card'

    #backdrop  = null
    #savedRect = null

    constructor() {
        super()
        const root = this.attachShadow({ mode: 'open' })
        root.innerHTML = `
            <style>${SHADOW_CSS}</style>
            <div class="scene">
                <div class="inner">
                    <div class="face face--front">
                        <slot name="front"></slot>
                    </div>
                    <div class="face face--back">
                        <slot name="back"></slot>
                    </div>
                </div>
            </div>
        `
    }

    disconnectedCallback() {
        this.#backdrop?.remove()
    }

    // ── Public API ────────────────────────────────────────────────

    flip() {
        this.#savedRect = this.getBoundingClientRect()
        const { top, left, width, height } = this.#savedRect

        // Backdrop — lives in the light DOM so external CSS can style it.
        this.#backdrop = document.createElement('div')
        this.#backdrop.className = 'cfb-card-flip__backdrop'
        document.body.appendChild(this.#backdrop)
        this.#backdrop.addEventListener('click', () => this.unflip())

        // Pin at current screen position (taken out of flow).
        Object.assign(this.style, {
            position: 'fixed',
            top:      `${top}px`,
            left:     `${left}px`,
            width:    `${width}px`,
            height:   `${height}px`,
            zIndex:   '200',
            margin:   '0',
        })
        this.classList.add('is-flipping')

        // Force reflow so the browser commits the start state before transitioning.
        this.offsetHeight

        const targetW = Math.min(400, window.innerWidth  * 0.92)
        const targetH = Math.min(560, window.innerHeight * 0.88)
        const targetL = (window.innerWidth  - targetW) / 2
        const targetT = Math.max(16, (window.innerHeight - targetH) / 2)

        requestAnimationFrame(() => {
            Object.assign(this.style, {
                top:    `${targetT}px`,
                left:   `${targetL}px`,
                width:  `${targetW}px`,
                height: `${targetH}px`,
            })
            this.classList.add('is-flipped')
            this.#backdrop.classList.add('is-visible')
        })
    }

    unflip(callback = null) {
        this.classList.remove('is-flipped')
        this.#backdrop?.classList.remove('is-visible')

        const { top, left, width, height } = this.#savedRect ?? {}
        if (top != null) {
            requestAnimationFrame(() => {
                Object.assign(this.style, { top: `${top}px`, left: `${left}px`,
                                            width: `${width}px`, height: `${height}px` })
            })
        }

        // Listen directly on the inner element — it owns the transform transition.
        const inner = this.shadowRoot.querySelector('.inner')
        const onDone = () => {
            inner.removeEventListener('transitionend', onDone)

            this.style.cssText = ''
            this.classList.remove('is-flipping')
            this.#backdrop?.remove()
            this.#backdrop  = null
            this.#savedRect = null

            callback?.()
        }
        inner.addEventListener('transitionend', onDone)
    }
}
