export class CfbBoardOrchestrator extends HTMLElement {
  #sessions = [{
    'title': 'Opening Keynote',
    'day': 'Wednesday',
    'tags': [{ 'label': 'Keynote', 'color': 'blue' }],
    'attendees': [{ 'name': 'Aino Korhonen', 'initials': 'AK' }, { 'name': 'Jukka Leinonen', 'initials': 'JL' }]
  }]

  connectedCallback() {
    if(this.#sessions.length > 0) {
      // initial render with existing session(s)
      this.#updateSchedule();
    }
    
    this.addEventListener('sessionAdded', this.#onSessionAdded);
    this.addEventListener('sessionsCleared', this.#onSessionsCleared);
  }

  disconnectedCallback() {
    this.removeEventListener('sessionAdded', this.#onSessionAdded);
    this.removeEventListener('sessionsCleared', this.#onSessionsCleared);
  }

  #onSessionAdded = (event) => {
    this.#sessions.push(event.detail);
    this.#updateSchedule();
  }

  #onSessionsCleared = () => {
    this.#sessions = [];
    this.#updateSchedule();
  }

  #updateSchedule() {
    this.querySelector('cfb-schedule').setAttribute('data-sessions', JSON.stringify(this.#sessions));
  }
}
