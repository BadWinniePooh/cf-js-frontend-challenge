# Instructions for the exercise

## Getting started

When I'm working on any project - or a language - first thing I try to do is to create a virtual environment for that 
language. I use tools like `nvm` for TypeScript, `rvm` for Ruby, `jenv` for Java - and `virtualenv` for Python.

### Requirements (optional, but useful)

Install `virtualenv` and `pipenv` for your computer. This way anything we install on this repository does not
mess up any other Python project.


## Before the first session

Make sure you can run the test cases. Steps for doing it:

 - clone this repository
 - run `pipenv shell` on the root of the repo
 - run `pipenv install` on the root of the repo (install dependencies)
 - run `pytest` on the root of the repo.

You should see few test cases failing. If that's the case, you are good to go.
