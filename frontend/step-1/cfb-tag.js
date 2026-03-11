class CfbTag extends HTMLElement {
    // Define which attributes to observe for changes
    static get observedAttributes() {
        return ['data-label', 'data-color'];
    }

    connectedCallback() {
        this.#render();
    }

    attributeChangedCallback() {
        this.#render(); // re-render the component when observed attributes change
    }

    #render() {
        const tagLabel = this.dataset.label ?? 'Default';
        const tagColor = this.dataset.color;

        const span = document.createElement('span');
        span.textContent = tagLabel;
        span.classList.add('cfb-tag');
        if (tagColor) {
            span.classList.add(`cfb-tag--${tagColor}`);
        }
        
        this.replaceChildren(span);
    }
}

customElements.define('cfb-tag', CfbTag);
