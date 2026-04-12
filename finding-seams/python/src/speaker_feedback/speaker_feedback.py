from __future__ import annotations

from typing import Literal, TypedDict

from speaker_feedback.feedback_sensor import FeedbackSensor


class EvaluateSpeakerResult(TypedDict):
    status: Literal["ALERT", "BOOK_AGAIN", "OK"]
    averageScore: float | None


class SpeakerFeedbackService:
    def __init__(self) -> None:
        self._sensor = FeedbackSensor()
        self._alert_threshold = 2.2

    def evaluate_speaker(self) -> EvaluateSpeakerResult:
        """
        Collect scores from the unreliable sensor, retrying on failures,
        and classify the speaker.

        Returns an object like:
        { status: 'ALERT' | 'BOOK_AGAIN' | 'OK', averageScore: number | null }
        """
        scores = self._sensor.read_scores()

        if not scores or len(scores) == 0:
            return {
                "status": "ALERT",
                "averageScore": None,
            }

        valid_scores = [
            score
            for score in scores
            if isinstance(score, (int, float)) and 1 <= int(score) <= 5
        ]

        if len(valid_scores) == 0:
            return {
                "status": "ALERT",
                "averageScore": None,
            }

        total = sum(int(s) for s in valid_scores)
        average = total / len(valid_scores)

        if average < self._alert_threshold:
            return {
                "status": "ALERT",
                "averageScore": average,
            }

        return {
            "status": "OK",
            "averageScore": average,
        }
