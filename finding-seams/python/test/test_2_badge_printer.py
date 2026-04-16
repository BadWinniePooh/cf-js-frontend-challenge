import pytest

from badge_printing.badge_printing import BadgePrinting


@pytest.mark.skip(reason="Exercise: finding seams — enable when working on badge printing")
def test_prints_a_badge() -> None:
    badge_dispenser = BadgePrinting()

    badge = badge_dispenser.create_badge("Test person", "they/them")

    assert {"id": badge.id, "name": badge.name, "pronouns": badge.pronouns} == {
        "id": "CONF-1",
        "name": "Test person",
        "pronouns": "they/them",
    }


@pytest.mark.skip(reason="Exercise: finding seams — enable when working on badge printing")
def test_prints_second_badge() -> None:
    badge_dispenser = BadgePrinting()

    badge = badge_dispenser.create_badge("Test person", "they/them")

    assert {"id": badge.id, "name": badge.name, "pronouns": badge.pronouns} == {
        "id": "CONF-2",
        "name": "Test person",
        "pronouns": "they/them",
    }
