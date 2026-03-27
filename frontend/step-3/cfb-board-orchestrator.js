export class CfbBoardOrchestrator extends HTMLElement {
  #sessions = [{
    'title': 'Opening Keynote',
    'day': 'Wednesday',
    'tags': [{ 'label': 'Keynote', 'color': 'blue' }],
    'attendees': [{ 'name': 'Aino Korhonen', 'initials': 'AK' }, { 'name': 'Jukka Leinonen', 'initials': 'JL' }]
  }]
  #sessionUpdateListeners = [];

  connectedCallback() {
    this.#setupListeners();

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

  #setupListeners () {
    // setup listeners for any child component that wants to be notified of schedule updates
    const listeners = this.querySelectorAll('[listens-schedule-update]');
    listeners.forEach(listener => {
      if(!this.#sessionUpdateListeners.includes(listener)) {
        this.#sessionUpdateListeners.push(listener);
      }
    });
    // [Placeholder] setup listeners for any child component that wants to be notified of whatever
  }

  #updateSchedule() {
    this.#sessionUpdateListeners.forEach(listener => {
      this.querySelector(listener.tagName.toLowerCase()).setAttribute('data-sessions', JSON.stringify(this.#sessions));
    });
  }
}
