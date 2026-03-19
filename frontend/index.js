// Update this to use all the components created after each step.
// This way the main 'index.html' can be modified at each step
import { CfbTag } from './step-1/cfb-tag.js';
import {CfbSessionCardAlt} from './step-2/cfb-session-card.js';

window.customElements.define('cfb-tag', CfbTag);
window.customElements.define('cfb-session-card', CfbSessionCardAlt);