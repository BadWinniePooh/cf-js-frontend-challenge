import { EventTypes } from "../step-4/events.js";

const TITLES = [
  "Opening Keynote",
  "Web Components Deep Dive",
  "TDD in the Browser",
  "IndexedDB Patterns",
  "Accessibility by Default",
  "Progressive Enhancement",
  "State of the Web Platform",
  "CSS Architecture at Scale",
  "TypeScript Without the Pain",
  "Testing Custom Elements",
];

const DAYS = ["Wednesday", "Thursday", "Friday"];

const ROOMS = ["Main Hall", "Track A", "Track B", "Workshop Room"];

const TAGS = [
  { label: "Keynote", color: "blue" },
  { label: "Frontend", color: "green" },
  { label: "Workshop", color: "orange" },
  { label: "Testing", color: "purple" },
  { label: "A11y", color: "green" },
  { label: "Data", color: "red" },
  { label: "Talk", color: "orange" },
];

const INITIALS_AND_NAMES = [
  { initials: "AK", name: "Alice Kent" },
  { initials: "JS", name: "James Smith" },
  { initials: "MR", name: "Maria Rodriguez" },
  { initials: "TL", name: "Thomas Lee" },
  { initials: "PK", name: "Priya Kapoor" },
  { initials: "HV", name: "Henry Vance" },
  { initials: "JO", name: "Julia Owen" },
  { initials: "LM", name: "Liam Miller" },
  { initials: "KR", name: "Kara Reed" },
  { initials: "SS", name: "Sophia Scott" },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export class CfbSessionGenerator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <button class="cfb-session-generator__btn">
                + Add random session
            </button>
            <button class="cfb-session-clear__btn">
                - Clear All Sessions
            </button>
        `;
    this.querySelector(".cfb-session-generator__btn").addEventListener(
      "click",
      this.#onClick,
    );
    this.querySelector(".cfb-session-clear__btn").addEventListener(
      "click",
      this.#onClear,
    );
  }

  disconnectedCallback() {
    this.querySelector(".cfb-session-generator__btn").removeEventListener(
      "click",
      this.#onClick,
    );
    this.querySelector(".cfb-session-clear__btn").removeEventListener(
      "click",
      this.#onClear,
    );
  }

  #onClick = () => {
    const session = {
      id: crypto.randomUUID(),
      title: pick(TITLES),
      day: pick(DAYS),
      room: pick(ROOMS),
      tags: [pick(TAGS)],
      attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
        (v, i, a) => a.indexOf(v) === i, // deduplicate
      ),
    };
    // TODO: Send the event to the orchestrator here.
    this.dispatchEvent(
      new CustomEvent(EventTypes.SESSION_CREATED, { detail: session, bubbles: true }),
    );
  };

  #onClear = () => {
    this.dispatchEvent(new CustomEvent("sessionsCleared", { bubbles: true }));
  };
  // TODO: Send the event to the orchestrator here.
}
