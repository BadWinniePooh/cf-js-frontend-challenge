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
        const tagCount = this.dataset.count ?
            ` x${this.dataset.count}`
            : '';
        
        this.innerHTML = `<span class="cfb-tag${tagColor ? ` cfb-tag--${tagColor}` : ''}">${tagLabel}${tagCount}</span>`;
    }
}

customElements.define('cfb-tag', CfbTag);
