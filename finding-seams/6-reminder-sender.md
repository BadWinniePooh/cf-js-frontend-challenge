# Finding seams – Reminder Sender

[..go back](./README.md)

## Step 6 **Test ReminderSender#sendAll**

**Background**: Last year, many people forgot to bring needed gear for the conference!

In the retrospective last year, participants wanted to have a reminder to be sent one week before the conference,
just to be sure to pack all the relevant clothes on carry-on rather than in the checked-in luggage.

For that reason, we have introduced a 'reminderSender' logic that sends all the reminders that should be sent. But we 
have lately seen that the code fails at times in the CI pipelines. Help us fixing the tests!

**Task**: Test the reminder sending logic, make sure it's always green. 

1. Run the tests, see how it fails occasionally. You will need to modify this test case later to make it pass, but 
   do it so that you don't modify the expectations, but the setup.
2. Go to the code, find out what makes the class difficult to test. Imagine a box. And use that as
   your thinking tool. What's inside the box?
3. Figure out how to inject dependenc(y/ies). 
   - maybe similarly as in [Badge Printing](./2-task-badge-printing.md), extracting a shape and using a 
     [Slide Statement](https://refactoring.com/catalog/slideStatements.html) to move the shape at the top?
   - but here, think of another way. If variables are initialized far away from their usage, that's another 
     code smell. So, try to find another way of introducing a seam.
4. Write tests that exercise:
   - you inject the json content into `Something` that gets it to the system under test
   - you can add a few test cases to cover some scenarios (incl. sorting)

**Notes**

**Acceptance Criteria:**

- `sendAll` is covered by tests that run fast

**Conclusions**:

- How do you separate slowness from synchronous code? 
- How do you test each part separately?

## Finished?

[Back to readme](./README.md)
