# Finding seams – Reminder Sender

[..go back](./README.md)

## Step 3 **Room availability**

**Background**: Surely organisers need to assign sessions to Rooms. Intorducing 'RoomService'

Adding a session into a room is a normal procedure for conference organisers. So is assigning a room into 
a service. This time we built a service that tries to add a session into a room, if the room has availability.

You can look at the `RoomService`, how it works

 - first it checks if the room is not reserved for the time slot.
 - if it's not reserved, it reserves the time slot
 - in the end, it always returns a result.

**Task**: Earlier, we made a small mistake, not using DateTime format, but a custom format for CET. 
For the future, to support other timezones, too - we want to start using a DateTime object in the room registry. 
To make this change, we want to cover the `RoomService` with tests, to make sure we don't break the production.

To finish this task, do the following:

1. Run the tests, and see the tests green. See that one test is skipped, because there is no way to reasonably test it.
2. Go to the code, find out what makes the class difficult to test. Imagine a box. And use that as
   your thinking tool. What's inside the box?
3. Figure out how to inject dependenc(y/ies). 
   - maybe similarly as in [Badge Printing](./2-task-badge-printing.md), extracting a shape and using a 
     [Slide Statement](https://refactoring.com/catalog/slideStatements.html) to move the shape at the top?
   - but here, think of another way. If variables are initialized far away from their usage, that's another 
     code smell. So, try to find another way of introducing a seam.
4. Write tests that exercise:
   - make sure the function you are testing gets the _shape of_ `RoomRegistry` injected (in either of the 2 methods)
   - in test case, inject overlapping sessions, and not overlapping sessions
   - write a few test cases.

**Notes**

 - find the shape of the collaborator for `placeSessionInRoom` function.
 - Give the collaborator a name - ask what role does that collaborator play?

**Acceptance Criteria:**

- `placeSessionInRoom` is covered by tests
- The tests are independent — no shared mutable state, no ordering dependency.
- You have not changed the constructor of `RoomService`.
- You have not used a module-mocking library (`jest`, `sinon`) to replace contents of `room-registry`

**Conclusions**:

- A this kind of seam relies on different dependency injection than previously. How does that differ from the *shape* metaphor from
  Step 2? Is this better or worse?
- 
## Finished?

[Recap learnings](./4-recap.md)
