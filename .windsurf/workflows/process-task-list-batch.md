---
description: Process task list in batch mode - complete entire main tasks (e.g., 4.0) without asking for permission on each subtask
---

# Batch Task List Processing

This workflow extends the standard task list processing by allowing you to complete entire main tasks without stopping for permission on each subtask.

## How It Works

- **Permission is requested only for main tasks** (e.g., 1.0, 2.0, 3.0, 4.0)
- **Subtasks are completed automatically** (e.g., 4.1, 4.2, 4.3) without stopping
- After completing all subtasks of a main task, pause and ask for permission to proceed to the next main task

## Workflow Steps

1. **Identify the next incomplete main task** (e.g., `- [ ] 4. Main Task Name`)

2. **Ask user for permission** to complete the entire main task:
   ```
   Ar galiu pradėti užduotį 4.0 "[Main Task Name]" ir atlikti visas jos sub-užduotis (4.1, 4.2, ...)?
   ```

3. **Upon approval, complete ALL subtasks sequentially:**
   - Implement subtask 4.1
   - Mark 4.1 as complete `[x]`
   - Implement subtask 4.2
   - Mark 4.2 as complete `[x]`
   - Continue until all subtasks are done
   - Mark main task 4.0 as complete `[x]`

4. **Update the task list file** with all completed tasks

5. **Report completion** and ask for permission to proceed to the next main task:
   ```
   ✅ Užduotis 4.0 "[Main Task Name]" baigta!
   
   Atliktos sub-užduotys:
   - [x] 4.1 ...
   - [x] 4.2 ...
   - [x] 4.3 ...
   
   Ar galiu tęsti su užduotimi 5.0 "[Next Main Task Name]"?
   ```

## Important Rules

- **All standard rules still apply:**
  - Mark tasks as completed (`[x]`)
  - Update "Relevant Files" section
  - Run tests after implementation
  - Follow Lithuanian UI text requirements
  - Use MCP tools as needed

- **Error handling within batch:**
  - If a subtask fails, document the issue and continue to the next subtask if possible
  - Report all issues at the end of the main task
  - If a critical blocker is encountered, stop and inform the user immediately

- **Verification:**
  - Verify each subtask before marking complete
  - Run full verification checklist at the end of the main task

## Usage

To use this workflow, say:
- "Naudok batch režimą" or
- "Atlik visą užduotį X.0" or
- "/process-task-list-batch"

## Example Session

```
User: Naudok batch režimą ir pradėk nuo užduoties 4.0

AI: Ar galiu pradėti užduotį 4.0 "User Authentication" ir atlikti visas jos sub-užduotis?

User: Taip

AI: [Implements 4.1, 4.2, 4.3, 4.4...]

AI: ✅ Užduotis 4.0 "User Authentication" baigta!

Atliktos sub-užduotys:
- [x] 4.1 Create login form component
- [x] 4.2 Implement authentication service
- [x] 4.3 Add session management
- [x] 4.4 Create protected routes

Ar galiu tęsti su užduotimi 5.0 "Dashboard Implementation"?
```
---
description: Process task list in batch mode - complete entire main tasks (e.g., 4.0) without asking for permission on each subtask
---

# Batch Task List Processing

This workflow extends the standard task list processing by allowing you to complete entire main tasks without stopping for permission on each subtask.

## How It Works

- **Permission is requested only for main tasks** (e.g., 1.0, 2.0, 3.0, 4.0)
- **Subtasks are completed automatically** (e.g., 4.1, 4.2, 4.3) without stopping
- After completing all subtasks of a main task, pause and ask for permission to proceed to the next main task

## Workflow Steps

1. **Identify the next incomplete main task** (e.g., `- [ ] 4. Main Task Name`)

2. **Ask user for permission** to complete the entire main task:
   ```
   Ar galiu pradėti užduotį 4.0 "[Main Task Name]" ir atlikti visas jos sub-užduotis (4.1, 4.2, ...)?
   ```

3. **Upon approval, complete ALL subtasks sequentially:**
   - Implement subtask 4.1
   - Mark 4.1 as complete `[x]`
   - Implement subtask 4.2
   - Mark 4.2 as complete `[x]`
   - Continue until all subtasks are done
   - Mark main task 4.0 as complete `[x]`

4. **Update the task list file** with all completed tasks

5. **Report completion** and ask for permission to proceed to the next main task:
   ```
   ✅ Užduotis 4.0 "[Main Task Name]" baigta!
   
   Atliktos sub-užduotys:
   - [x] 4.1 ...
   - [x] 4.2 ...
   - [x] 4.3 ...
   
   Ar galiu tęsti su užduotimi 5.0 "[Next Main Task Name]"?
   ```

## Important Rules

- **All standard rules still apply:**
  - Mark tasks as completed (`[x]`)
  - Update "Relevant Files" section
  - Run tests after implementation
  - Follow Lithuanian UI text requirements
  - Use MCP tools as needed

- **Error handling within batch:**
  - If a subtask fails, document the issue and continue to the next subtask if possible
  - Report all issues at the end of the main task
  - If a critical blocker is encountered, stop and inform the user immediately

- **Verification:**
  - Verify each subtask before marking complete
  - Run full verification checklist at the end of the main task

## Usage

To use this workflow, say:
- "Naudok batch režimą" or
- "Atlik visą užduotį X.0" or
- "/process-task-list-batch"

## Example Session

```
User: Naudok batch režimą ir pradėk nuo užduoties 4.0

AI: Ar galiu pradėti užduotį 4.0 "User Authentication" ir atlikti visas jos sub-užduotis?

User: Taip

AI: [Implements 4.1, 4.2, 4.3, 4.4...]

AI: ✅ Užduotis 4.0 "User Authentication" baigta!

Atliktos sub-užduotys:
- [x] 4.1 Create login form component
- [x] 4.2 Implement authentication service
- [x] 4.3 Add session management
- [x] 4.4 Create protected routes

Ar galiu tęsti su užduotimi 5.0 "Dashboard Implementation"?
```
