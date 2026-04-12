# Finding Seams

Imagine the background for each of the assignments is this:

> You need to change behavior of the system, but the system has no tests. In order to be safe, and sure,
  you want to add tests around the functions you are about to change. This is your starting point.

Take the learnings from [How to Test Anything](../01-how-to-test-anything), and ask the questions we learned: 

![How to Test Anything](../01-how-to-test-anything/images/questions.png)

Each exercise starts from code that is hard to test and refactor. The goal is to learn to experience the legacy code dilemma:

> When we change code, we should have tests in place. To put tests in place, we often have to change code.
> - Michael Feathers, Working Effectively with Legacy Code

Your main goal in every module is to **make the code testable by introducing seams**, and only then start improving the design.

### What is a seam?

A **seam** is a place in the code where you can **change behavior without editing the calling code** – for example by 
injecting a dependency, wrapping a global, or adding an interface. In practice, seams let you **replace real 
collaborators with test doubles**, control time, random values, I/O, and external services 
so that your tests are fast and deterministic.

For a short introduction, see Michael Feathers’ discussion of seams in the book “Working Effectively with Legacy Code”.

### Workflow for these exercises

Work through the exercises in this order (pick any of `javascript/`, `typescript/`, `python/`, `kotlin/`, or `csharp/` as you prefer):

1. **`speaker-feedback`**, [see instructions](1-speaker-feedback.md)  
2. **`badge-printer`**
3. **`schedule-converter`**
4. **`reminder-sender`**
5. **`room-availability`**
6. **`speaker-profile-service`**

For **each** module:

1. **Understand what makes it hard to test**
   - Look at the code on each assignment and think what is the thing that makes it hard to test. 
Or that makes tests brittle (where e.g. the execution order affects). Typically problem is a dependency issue 

2. **Identify and introduce a seam**
   - what are the ways to introduce seams? Identify at least 2 different options.
   - the goal is that you can control the behavior of the dependency in you test.
   
3. **For more challenging task**

   Imagine these are services used by numerous classes, not all of which are under your control. 
   Imagine too, that the choice of your language does not support optional arguments for constructor 
   (for constructor injection) - or that the constructor already has many optional dependencies. And you just 
   don't want to add an optional parameter.

   Thus,
   - you are **not allowed** to change the existing public interface by;
     - introducing a constructor injection (this is exactly what we'd do in production code)
     - add any optional (default) parameters to the public functions

## Tips

Here's some tips for the questions above:

1. **Understand what makes it hard to test**
    - Look for direct calls to time (`Date.now`, `new Date()`), randomness (`Math.random`), 
    I/O (console, file system, network), global state, or static singletons.
    - Notice long functions, hidden dependencies created inside methods, and code that mixes domain logic with side effects.

2. **Identify and introduce a seam**
    - Decide *where* you need control in tests (e.g. time, random, HTTP, sensors, registries).
    - Introduce a seam such as:
        - **Dependency injection** (pass in collaborators through parameters or constructors instead of creating them directly).
        - **Interfaces / adapters** that wrap external services or globals.
        - **Wrapper functions** around time, randomness, or global APIs that you can stub in tests.
    - After adding the seam, write at least one test that uses it (e.g. by stubbing/mocking the dependency) to prove the code is now testable.

And tips for refactorings:

## ready?

[Let's start](1-speaker-feedback.md)

1. speaker-feedback:
   - identify what is easy to test block
   - identify what is hard to test block
   - "Extract something somewhere" and test the easy to test code.

2. badge-printer:
   - use 'slide statement' to move dependency call to the boundary
   - do identify what code is 'easy-to-test' and what is 'hard-to-test', test the easy-to-test part.

3. schedule-converter:
   - reading a file in unit test makes it slow, and we want to get rid of this.
   - "Extract something somewhere" and make the easy test

..and so on and so forth.

"Extract something somewhere and"