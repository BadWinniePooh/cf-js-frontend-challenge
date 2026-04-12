class BadgeIdGeneration:
    """Global singleton-style sequence generator with hidden state."""

    def __init__(self) -> None:
        self._sequence_number = 0

    def next_id(self) -> int:
        self._sequence_number += 1
        return self._sequence_number


badge_sequence = BadgeIdGeneration()
