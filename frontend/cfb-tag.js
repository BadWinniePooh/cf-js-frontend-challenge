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
        
        const span = document.createElement('span');
        
        span.textContent = tagLabel + tagCount;
        span.classList.add('cfb-tag');
        
        if(tagColor){
            span.classList.add(`cfb-tag--${tagColor}`);
        }

        this.replaceChildren(span);
    }
}

customElements.define('cfb-tag', CfbTag);