import pytest

from speaker_feedback.speaker_feedback import SpeakerFeedbackService


@pytest.mark.skip(reason="Exercise: finding seams — enable when working on speaker feedback")
def test_calculates_average_score() -> None:
    speaker_feedback = SpeakerFeedbackService()

    result = speaker_feedback.evaluate_speaker()

    assert result == {"status": "OK", "averageScore": 3.6}
