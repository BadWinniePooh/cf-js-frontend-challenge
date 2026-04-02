import { CfbTag } from "../../step-1/cfb-tag.js";
import { CfbSessionCard } from "../../step-2/cfb-session-card.js";
import { expect } from "chai";
import { fixture, cleanup } from "./helpers/fixture.js";
import { validateSessionDetails } from "./helpers/session-details-contract.js";
//import { sessionDetails } from '../../step-2/builds-session-details.js'
//import { Randomizer } from './helpers/randomizer.js'

customElements.define("cfb-tag", CfbTag);
customElements.define("cfb-session-card", CfbSessionCard);

const SESSION = {
  title: "Opening Keynote",
  tags: [
    { label: "Keynote", color: "blue" },
    { label: "Frontend", color: "green" },
  ],
  attendees: [
    { name: "Alice Kent", initials: "AK" },
    { name: "James Smith", initials: "JS" },
    { name: "Maria R", initials: "MR" },
  ],
};

describe("<cfb-session-card>", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      `<cfb-session-card data-session-details='${JSON.stringify(SESSION)}'></cfb-session-card>`,
    );
  });

  afterEach(cleanup);

  describe("title", () => {
    it("renders the title", async () => {
      const titleEl = el.querySelector(".cfb-card__title");
      expect(titleEl).to.exist;
      expect(titleEl.textContent).to.equal(SESSION.title);
    });
    it("updates the title when data-session-details changes", async () => {
      const updated = { ...SESSION, title: "Updated Title" };

      el.setAttribute(
        CfbSessionCard.definedAttributes.details,
        JSON.stringify(updated),
      );

      const titleEl = el.querySelector(".cfb-card__title");
      expect(titleEl).to.exist;
      expect(titleEl.textContent).to.equal(updated.title);
    });
  });

  describe("tags", () => {
    it("renders the tags", async () => {
      const tagEls = el.querySelectorAll("cfb-tag");
      expect(tagEls.length).to.equal(SESSION.tags.length);
    });
    it("updates the tags when data-session-details changes", async () => {
      const updated = {
        ...SESSION,
        tags: [...SESSION.tags, { label: "New Tag", color: "red" }],
      };
      el.setAttribute(
        CfbSessionCard.definedAttributes.details,
        JSON.stringify(updated),
      );
    });
  });

  describe("attendees", () => {
    it("renders the attendees", async () => {
      const attendeeEls = el.querySelectorAll(".cfb-avatar");
      expect(attendeeEls.length).to.equal(SESSION.attendees.length);
    });
    it("updates the attendees when data-session-details changes", async () => {
      const updated = {
        ...SESSION,
        attendees: [
          ...SESSION.attendees,
          { name: "New Attendee", initials: "NA" },
        ],
      };

      el.setAttribute(
        CfbSessionCard.definedAttributes.details,
        JSON.stringify(updated),
      );

      const attendeeEls = el.querySelectorAll(".cfb-avatar");
      expect(attendeeEls.length).to.equal(updated.attendees.length);
    });

    it("renders one avatar chip per attendee", async () => {
      expect(el.querySelectorAll(".cfb-avatar").length).to.equal(
        SESSION.attendees.length,
      );
    });

    SESSION.attendees.forEach(({ name, initials }) => {
      it(`displays initials "${initials}" for attendee ${name}`, async () => {
        const avatars = Array.from(el.querySelectorAll(".cfb-avatar"));
        const match = avatars.find((a) => a.textContent === initials);
        expect(match, `expected an avatar chip with text "${initials}"`).to
          .exist;
      });
    });
  });

  describe("SessionDetails contract", () => {
    it("validates a correct SessionDetails object", () => {
      expect(validateSessionDetails(SESSION)).to.be.empty;
    });

    it("detects missing title", () => {
      const invalid = { ...SESSION, title: "" };
      const errors = validateSessionDetails(invalid);
      expect(errors).to.include("Title must be a non-empty string");
    });

    it("detects non-array tags", () => {
      const invalid = { ...SESSION, tags: "not an array" };
      const errors = validateSessionDetails(invalid);
      expect(errors).to.include("Tags must be an array");
    });

    it("detects non-array attendees", () => {
      const invalid = { ...SESSION, attendees: "not an array" };
      const errors = validateSessionDetails(invalid);
      expect(errors).to.include("Attendees must be an array");
    });

    it("detects invalid tag objects", () => {
      const invalid = { ...SESSION, tags: [{ label: "", color: "" }] };
      const errors = validateSessionDetails(invalid);
      expect(errors).to.include("Tag at index 0 must have a non-empty string label");
      expect(errors).to.include("Tag at index 0 must have a non-empty string color");
    });

    it("detects invalid attendee objects", () => {
      const invalid = { ...SESSION, attendees: [{ name: "", initials: "" }] };
      const errors = validateSessionDetails(invalid);
      expect(errors).to.include("Attendee at index 0 must have a non-empty string name");
      expect(errors).to.include("Attendee at index 0 must have a non-empty string initials");
    });

  });
});
