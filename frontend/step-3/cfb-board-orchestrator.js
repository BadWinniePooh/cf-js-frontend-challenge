export class CfbBoardOrchestrator extends HTMLElement {
  #sessions = [{
    'title': 'Opening Keynote',
    'day': 'Wednesday',
    'tags': [{ 'label': 'Keynote', 'color': 'blue' }],
    'attendees': [{ 'name': 'Aino Korhonen', 'initials': 'AK' }, { 'name': 'Jukka Leinonen', 'initials': 'JL' }]
  }]

  connectedCallback() {
    // TODO: Here you should add event listeners for the events you want to listen to.
    // [code here]

    // TODO: Add with initial data, to fake that there's something
    // [code here]
  }

  disconnectedCallback() {
    // TODO: Here you should remove event listeners you added in connectedCallback.
  }
}
