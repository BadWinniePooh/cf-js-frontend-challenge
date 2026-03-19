export class CfbSessionCard extends HTMLElement {

  static get observedAttributes() {
    return ['data-session'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }  

  #render(){
    const session = JSON.parse(this.dataset.session);
    const title = session ? session.title : 'Session Title';
    const tags = session ? session.tags : [];
    const attendees = session ? session.attendees : [];
    this.innerHTML = 
      `<article class="cfb-card" role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title">${title}</span>
            <button class="cfb-card__menu" aria-label="Card options">
              <span class="cfb-card__menu-icon"></span>
            </button>
        </header>
        <div class="cfb-card__tags">
          ${tags.map(tag => `<cfb-tag data-label="${tag.label}" data-color="${tag.color}"></cfb-tag>`).join('')}
        </div>
        <footer>
          <div class="cfb-avatars" aria-label="Speakers">
            ${attendees.map(attendee => `<div class="cfb-avatar" aria-label="${attendee}">${attendee}</div>`).join('')}
          </div>
        </footer>
      </article>`;    
  }

  
}

customElements.define('cfb-session-card', CfbSessionCard);