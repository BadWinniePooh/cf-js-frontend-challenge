import random


class FeedbackSensor:
    """Simulate an unreliable external device / service."""

    def read_scores(self) -> list[int] | None:
        outcome = random.random()

        if outcome < 0.05:
            # 5%: simulate total failure
            raise RuntimeError("Sensor failure")

        if outcome < 0.1:
            # 5%: simulate returning nothing
            return None

        # Note: Random part here is to simulate a DB where results actually change.

        # return 1 to 5 evaluations
        length = 1 + int(random.random() * 5)
        scores: list[int] = []
        for _ in range(length):
            # score is anything from 1 to 5
            score = 1 + int(random.random() * 5)
            scores.append(score)

        return scores
