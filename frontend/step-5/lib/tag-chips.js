/**
 * Manages a list of tag chips inside a form.
 *
 * The host element's template must contain:
 *   - [data-tag-input]   — the text input for typing a new tag
 *   - [data-tag-add]     — the "Add" button
 *   - [data-tag-chips]   — container where chip spans are rendered
 *   - input[name="tags"] — hidden input whose value is kept in sync
 */
export class TagChipController {
  #tags = [];
  #root;

  constructor(root) {
    this.#root = root;
  }

  get tags() {
    return [...this.#tags];
  }

  setTags(labels) {
    this.#tags = [...labels];
    this.#update();
  }

  reset() {
    this.#tags = [];
    this.#update();
  }

  bind() {
    this.#addBtn().addEventListener('click', this.#onAdd);
    this.#input().addEventListener('keydown', this.#onKeydown);
  }

  unbind() {
    this.#addBtn().removeEventListener('click', this.#onAdd);
    this.#input().removeEventListener('keydown', this.#onKeydown);
  }

  // ── Private ───────────────────────────────────────────────────

  #input  = () => this.#root.querySelector('[data-tag-input]');
  #chips  = () => this.#root.querySelector('[data-tag-chips]');
  #addBtn = () => this.#root.querySelector('[data-tag-add]');
  #hidden = () => this.#root.querySelector('input[name="tags"]');

  #onAdd = () => {
    const input = this.#input();
    const label = input.value.trim();
    if (!label || this.#tags.includes(label)) { input.value = ''; return; }
    this.#tags.push(label);
    input.value = '';
    this.#update();
  };

  #onKeydown = (evt) => {
    if (evt.key === 'Enter') { evt.preventDefault(); this.#onAdd(); }
  };

  #update() {
    const chips = this.#chips();
    if (!chips) return;
    chips.innerHTML = this.#tags
      .map((tag) => `
        <span class="cfb-chip" data-tag="${tag}">
          ${tag}
          <button type="button" class="cfb-chip__remove" aria-label="Remove ${tag}">×</button>
        </span>`)
      .join('');
    chips.querySelectorAll('.cfb-chip__remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.#tags = this.#tags.filter((t) => t !== btn.closest('[data-tag]').dataset.tag);
        this.#update();
      });
    });
    this.#hidden().value = this.#tags.join(',');
  }
}
