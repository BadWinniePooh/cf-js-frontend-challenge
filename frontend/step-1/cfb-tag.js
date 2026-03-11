class CfbTag extends HTMLElement {
    connectedCallback() {
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
