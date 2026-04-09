import { KNOWN_TAGS } from './label-to-color.js';

const DAYS = ['Wednesday', 'Thursday', 'Friday'];
const ROOMS = ['Main Hall', 'Track A', 'Track B', 'Workshop Room'];
const SESSION_TYPES = ['Talk', 'Workshop', 'Keynote', 'Lightning Talk'];

/**
 * Returns the shared inner field HTML for a session form.
 *
 * @param {string} idPrefix  - unique prefix for `id` attributes, e.g. 'cfb-add' or 'cfb-edit'
 * @param {string} cssPrefix - BEM block prefix, e.g. 'cfb-add-session-form' or 'cfb-edit-session-form'
 */
export function sessionFormFields(idPrefix, cssPrefix) {
  const p = cssPrefix;
  return `
    <div class="${p}__field">
      <label for="${idPrefix}-title" class="${p}__label">Title</label>
      <input id="${idPrefix}-title" class="${p}__input"
        name="title" type="text" required minlength="5" />
    </div>

    <div class="${p}__field">
      <label for="${idPrefix}-day" class="${p}__label">Day</label>
      <select id="${idPrefix}-day" class="${p}__select" name="day" required>
        <option value="">Select a day…</option>
        ${DAYS.map((d) => `<option value="${d}">${d}</option>`).join('')}
      </select>
    </div>

    <div class="${p}__field">
      <label for="${idPrefix}-room" class="${p}__label">Room</label>
      <input id="${idPrefix}-room" class="${p}__input"
        name="room" type="text" list="${idPrefix}-room-list" required autocomplete="off" />
      <datalist id="${idPrefix}-room-list">
        ${ROOMS.map((r) => `<option value="${r}"></option>`).join('')}
      </datalist>
    </div>

    <fieldset class="${p}__fieldset">
      <legend class="${p}__legend">Session type</legend>
      ${SESSION_TYPES.map((t, i) => `
        <label class="${p}__radio-label">
          <input type="radio" name="sessionType" value="${t}"${i === 0 ? ' required' : ''} /> ${t}
        </label>`).join('')}
    </fieldset>

    <div class="${p}__field">
      <label for="${idPrefix}-tag-input" class="${p}__label">
        Tags <span class="${p}__optional">(optional)</span>
      </label>
      <div class="${p}__tag-row">
        <input id="${idPrefix}-tag-input" class="${p}__input"
          type="text" list="${idPrefix}-tag-list" placeholder="Add a tag…" autocomplete="off"
          data-tag-input />
        <datalist id="${idPrefix}-tag-list">
          ${KNOWN_TAGS.map((t) => `<option value="${t.label}"></option>`).join('')}
        </datalist>
        <button type="button" class="${p}__add-tag-btn" data-tag-add>Add</button>
      </div>
      <div class="${p}__tag-chips" data-tag-chips></div>
      <input type="hidden" name="tags" value="" />
    </div>

    <div class="${p}__field">
      <label for="${idPrefix}-speaker" class="${p}__label">
        Speaker <span class="${p}__optional">(optional)</span>
      </label>
      <input id="${idPrefix}-speaker" class="${p}__input" name="speaker" type="text" />
    </div>
  `;
}
