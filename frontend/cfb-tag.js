class CfbTag extends HTMLElement{
    // Define which attributes to observe for change
    static get observedAttributes() {
        return ['data-label', 'data-color', 'data-count'];
    }
    
    // initial render
    connectedCallback() {
        this.#render();
    }

    // re-render on observed change
    attributeChangedCallback() {
        this.#render();
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