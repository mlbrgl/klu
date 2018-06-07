![](https://user-images.githubusercontent.com/13406362/41087255-7b2b6f68-6a3c-11e8-8a38-e57ce1ebd9ea.png)

# Biologically aligned task focuser for process-oriented, proudly mono-tasking ~~robots~~ mortals.
Klu allows you to tackle your todos, favouring important over urgent. It does this by allowing you to arbitrary define important projects, how many tasks you want to address within those projects every day (contracts), while respecting external time constraints (start and due dates) **as well as your biological rhythm**. You end up with one task in front of your eyes, in big letters. No distractions. No endless lists. No stats. **Just your most important tasks, one at a time.**

You can check whether this is for you, read the full story behind it, as well as dive into Klu's core concepts [here](https://www.matthieubergel.org/klu.html).

## Installation
Klu only comes in the shape of a [chrome extension](https://chrome.google.com/webstore/detail/klu/mgbcgeghbmhjgkenjpbiiipjeoaipike) at this stage.

## Usage

### Basic

![](https://user-images.githubusercontent.com/13406362/41087350-b30c9056-6a3c-11e8-895b-20b15a15db50.png)

- **Create a new task**: type into the omnibox and press `enter`.
- **Select a task**: use your mouse or the `tab`key to move the keyboard focus onto the task.
- **Edit a task**: select it and modify in place. This will also promote the task to the first spot in the list.
- **Search through tasks**: type into the omnibox. Tasks are filtered in realtime. When no search is active, only the last 20 edited tasks are shown to preserve a smooth experience.
- **Delete a task**: select the task and press `cmd` (or `ctrl` on windows) + `backspace` then `enter` to confirm or `esc` to cancel. Alternative: place the focus at the beginning of the task, and press `left arrow`.
- **Mark a task done**: `cmd` (or `ctrl` on windows) + `enter`.
- **Cycle through biorhythm categories**: either "peak", "trough" or "recovery". Move the focus at the end of the task and press `right arrow`. Note that uncategorised (aka "inbox") items are displayed in yellow as a way to create a somewhat unsettling feeling, triggering a prompt categorisation :) 
- **Filter tasks**: use the filter boxes
- 1. past: show / hide done tasks
  2. present: show / hide active tasks
  3. future: show / hide tasks with a start date in the future

### Dates

- **Set a start date**: place the focus at the beginning of the task and press `cmd` (or `ctrl` on widows) + `up arrow` or `down arrow` to move the date respectively into the future or the past. Note: as filters are re-evaluated in realtime, setting a start date in the future without the "future" filter will make the task disappear. Activate the "future" filter to see it again.
- **Set a due date**: same as "set start date", except focus needs to be placed at the end of the task. 
- **Remove a date**: click on it.

Tip: use `cmd` + `right arrow` or `left arrow` to quickly move between the beginning and the end of a task and set dates faster.

### Focus

- **Switch between current focus and tasks view**: press `esc` (works anywhere in the app). Useful to make a quick edit before going back to the current focus.
- **Focus on selected task**: press `enter`.
- **"next up?"**: cycle through highest priority tasks (there might just be one).
- **"did it!"**: mark the current task done and focus on the next highest priority one.
- **"done & waiting"**: mark the current task done and create a clone for follow-up.  

### Projects

![](https://user-images.githubusercontent.com/13406362/41087388-d85d3d7e-6a3c-11e8-8e14-278ae79042ac.png)

- **Attach a new (or existing) project to a task**: type " +nameoftheproject" at the end of a task (without the quotes, but with the leading space).
- **Remove project from a task**: delete the mention " +nameoftheproject" at the end of a task.
- **Delete a project**: a project only exists by virtue of being attached to tasks. Remove all mentions of that project on tasks and the project disappears.
- **Set / edit project contract**: [projects view] click on the "+" and "-" buttons next to that project.
- **"anything left?"**: [projects view]
  - "yep": create new task automatically attached to current project.
  - "nothing for now": marks the project "paused". To resume a project, simple create a new task attached to that project.
  - "nothing at all": marks the project "completed". To resume a project, simple create a new task attached to that project.
- **Set project filter**: select a task belonging to that project and press `cmd` (or `ctrl` on windows) + `enter`. Alternative: [projects view] click on project.
- **Remove project filter**: click on the project filter in the omnibox.

## Task selection algorithm

*To fully understand this section, it is recommended to read about Klu's core concepts [here](https://www.matthieubergel.org/klu.html).*

What happens when "next up?" is clicked? Klu will first locate the biggest remaining project, which is computed from the frequency (set on the projects view) for that project minus any task done in that project for the current day. Within that project, it will either find:

- **tasks matching the current biorhythm**. At the moment, "peak" time is between 4 am and 2 pm, "trough" between 2 pm and 5 pm and recovery between 5pm and 4 am. This rhythm is reflecting an early riser.

- OR **all tasks of that project, irrespective of the current biorhythm.**

*Please note that done tasks or tasks with a start date into the future are ignored.*

From that first selection, it will apply a time filter to return either (in that order):

- **overdue tasks** (due date in the past)
- OR **tasks due either today or tomorrow**
- OR **tasks due in the next two weeks**
- OR **any random task**

The idea behind this coarse filter is to randomly work on not-so-urgent (and yet important) tasks to avoid living in a contant state of emergency.

## Stuff you might want to know

Klu does not require or use any external services. This is good news for privacy as your data never leaves your computer. On the other hand, you won't be able to access your data from another computer or device. This might change in the future.

One thing you should also know is that there is no easy way of exporting your data just yet. This is not a shameless vendor lock-in, but simply a feature that hasn't made it to the top yet.
