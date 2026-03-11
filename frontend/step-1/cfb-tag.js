class CfbTag extends HTMLElement {
    connectedCallback() {
        const span = document.createElement('span');
        span.textContent = "Hello World";
        span.classList.add('cfb-tag');
        span.classList.add(`cfb-tag--blue`);
        
        this.replaceChildren(span);
    }
}

customElements.define('cfb-tag', CfbTag);
