export class CfbSessionCard extends HTMLElement {

  static get observedAttributes() {
    return ['data-session', 'data-session-details'];
  }

  static get definedAttributes(){
    return {details: 'data-session-details'};
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }  

  #render(){
    const session = JSON.parse(this.dataset.sessionDetails);
    const title = session ? session.title : 'Session Title';
    const tags = session ? session.tags : [];
    const attendees = session ? session.attendees : [];
    const travel = this.dataset.variant === 'travel' ? 'cfb-card--travel' : '';
    
    this.innerHTML = 
      `<article class="cfb-card ${travel}" role="article">
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
            ${attendees.map(attendee => `<div class="cfb-avatar" aria-label="${attendee.name}">${attendee.initials}</div>`).join('')}
          </div>
        </footer>
      </article>`;    
  }

  
}

export class CfbSessionCardAlt extends HTMLElement {
  static get observedAttributes() {
    return ['data-title', 'data-attendees'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const title = this.dataset.title ?? 'Session Title';
    const attendees = JSON.parse(this.dataset.attendees ?? '[]');
    const children = Array.from(this.querySelectorAll('cfb-tag'));
    const travel = this.dataset.variant === 'travel' ? 'cfb-card--travel' : '';

    this.innerHTML = 
      `<article class="cfb-card ${travel}" role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title">${title}</span>
            <button class="cfb-card__menu" aria-label="Card options">
              <span class="cfb-card__menu-icon"></span>
            </button>
        </header>
        <div class="cfb-card__tags">
          
        </div>
        <footer>
          <div class="cfb-avatars" aria-label="Speakers">
            ${attendees.map(attendee => `<div class="cfb-avatar" aria-label="${attendee}">${attendee}</div>`).join('')}
          </div>
        </footer>
      </article>`; 

    const tagsContainer = this.querySelector('.cfb-card__tags');
    children.forEach(child => tagsContainer.appendChild(child));
  }
}

export class CfbSessionCardAlt2 extends HTMLElement {
  static get observedAttributes() {
    return ['data-title', 'data-attendees'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const title = this.dataset.title ?? 'Session Title';
    const attendees = JSON.parse(this.dataset.attendees ?? '[]');
    const children = Array.from(this.querySelectorAll('cfb-tag'));
    const travel = this.dataset.variant === 'travel' ? 'cfb-card--travel' : '';

    this.innerHTML = 
      `<article class="cfb-card ${travel}" role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title">${title}</span>
            <button class="cfb-card__menu" aria-label="Card options">
              <span class="cfb-card__menu-icon"></span>
            </button>
        </header>
        <div class="cfb-card__tags">
          <template></template>
        </div>
        <footer>
          <div class="cfb-avatars" aria-label="Speakers">
            ${attendees.map(attendee => `<div class="cfb-avatar" aria-label="${attendee}">${attendee}</div>`).join('')}
          </div>
        </footer>
      </article>`; 

    const tagsContainer = this.querySelector('template');
    children.forEach(child => tagsContainer.parentNode.insertBefore(child, tagsContainer));
    tagsContainer.remove();
  }
}