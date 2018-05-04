# Summary

This document summarize our options regarding the editor behaviour and how it interacts with the server.

Overall, we have 5 questions to answer:

1.  What is the equivalent of the server in an offline project?

    * The server represents the OS file system in regular projects
    * The server represents a source management system
    * The server represents the best of both? Something better?

2.  What do we do for anonymous users

    * Anonymous users are not allowed to save projects in the database
    * Anonymous users are allowed to save projects

3.  How do we deal with project versioning/releasing

    * Manual versioning: users create releases
    * Automatic versioning: new version on each save
    * Semi automatic versioning: saves can be grouped in commits
    * Multiple options

4.  What do we do when updating other people's project

    * New URL on each save (either new version + version in URL or new project)
    * New project for each user

5.  What do we do when anonymous users (with projects) log in / create acount
    * Copy all their projets
    * Change the project's users

# Editor Actions

## Option 1

In this option, the server is the OS file system.
Global actions are any actions except editing the content of a file.

Local actions (nothing gets updated on the server)

* edit file

Global actions (the server gets updated)

* create file
* delete file
* rename file
* move file
* rename project
* import npm package
* import project
* save all sources
* run/debug project (run or save & run?)

Advantages

* No need to hit "save" after each change
* May be slightly more familiar to users?
* Less information to display in UI for un-saved changes

### Un-saved changes

In this option, the only possible unsaved change is: file edited by the user
This simplifies the display of such changes.

## Option 2

In this option, the server represents the source management system.
Only the "push" action updates the server.

Local actions (nothing gets updated on the server)

* import npm package
* import project
* create file
* delete file
* rename file
* move file
* edit file
* run/debug project (run or save & run?)

Global actions (the server gets updated)

* save project
* rename project

Advantages

* PRO: code less complicated
* PRO: actions are all instantaneous
* PRO: cost slightly lower

### Un-saved changes

In this option, there are several possible unsaved changes:

* file content edited by the user or an import
* file created by the user or an import
* file deleted by the user or an import
* file renamed/moved by the user (probably not easily detectable on import)

# Editor States

* closed: editor not opened
* editing: regular editing mode
* read-only: editing a project you don't have permission for
* local-only: project not saved yet

2 options for local-only and read-only

* global actions may set id/project owner automatically
* extra user action needed

2 options when creating new project

* save to database if possible
* always create in "local-only" state

## State transitions

## Option 1

In this option, the server is the OS file system, there is no local-only state.

| Action                     | State Before | State After | Comment             |
| -------------------------- | ------------ | ----------- | ------------------- |
| global action              | not closed   | editing     |                     |
| open own project           | closed       | editing     |                     |
| open other project         | closed       | read-only   |                     |
| create project (logged in) | closed       | editing     |                     |
| create project (anonymous) | closed       | editing     | With anonymous user |
| fork project               | read-only    | editing     |                     |
| fork project               | editing      | editing     |                     |
| log in                     | editing      | editing     | See note 1          |
| log in                     | read-only    | read-only   |                     |
| log out                    | editing      | read-only   |                     |
| log out                    | read-only    | read-only   |                     |

## Option 2

In this option the server is the source management system.

| Action                     | State Before | State After | Comment    |
| -------------------------- | ------------ | ----------- | ---------- |
| global action              | not closed   | editing     |            |
| open own project           | closed       | editing     |            |
| open other project         | closed       | read-only   |            |
| create project (logged in) | closed       | local-only  | Diff       |
| create project (anonymous) | closed       | local-only  | Diff       |
| fork project               | local-only   | n.a.        | disabled   |
| fork project               | read-only    | editing     |            |
| fork project               | editing      | editing     |            |
| log in                     | editing      | editing     | See note 1 |
| log in                     | read-only    | read-only   |            |
| log in                     | local-only   | local-only  | Diff       |
| log out                    | editing      | read-only   |            |
| log out                    | read-only    | read-only   |            |
| log out                    | local-only   | local-only  | Diff       |

## Notes

1.  Since we may use anonymous users,
    In this case, we have many more options that that, we can mix and match

# Saving, Versioning & Releasing Project

## Saving a project

We must define what a "save" is in our case, compared to project on hard drive

* save to hard drive
* git commit
* git push

## Version vs Release

| Version                                                          | Release                      |
| ---------------------------------------------------------------- | ---------------------------- |
| automatic (on each save)<br/>semi automatic (on each `git push`) | manual                       |
| auto generated UUID or number                                    | named X.Y.Z maybe with title |
| may include short commit text (only if semi automatic)           | includes release notes       |

## Multiple users on one project

What happens if they all are allowed to work on a project? -> Out of scope for now
What happens if they are not? -> automatic forks
