# Read this after the session, this will be explaining the conceps

## Issue with testability


## Seams

## Dependency Injection

## Peel and Slice

## Imagining a box


## What happened in the exercise

You have now seen three injection styles, each with a different shape:

| Step | Technique | Shape |
|------|-----------|-------|
| 1 – SpeakerFeedback | Constructor injection | A dependency passed in when the object is created |
| 2 – BadgePrinting | Method injection | A collaborator passed in when the message is sent |
| 3 – ScheduleConverter | **Getter injection** | A method on the object itself that a subclass can override |

Getter injection doesn't require changing the constructor signature, and it doesn't add a
parameter to the public method — the seam is entirely inside the class.

The cost is that you're relying on inheritance to swap the behaviour. That's a trade-off.
Think about when that trade-off is worth it.
