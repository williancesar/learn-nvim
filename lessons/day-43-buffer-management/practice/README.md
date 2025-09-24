# Buffer Management Practice Files

This directory contains interconnected files designed to practice buffer navigation and management in Vim.

## File Structure

```
practice/
├── project_main.js    # Entry point - start here
├── config.json        # Configuration - frequently referenced
├── router.js          # Routes - jumps to db.js and models
├── db.js              # Database - references config.json
├── error.js           # Error handling - used everywhere
└── models/
    └── user.js        # User model - validation logic
```

## Practice Exercises

### Exercise 1: Basic Buffer Navigation

1. Open Vim with: `vim project_main.js`
2. Load all JavaScript files: `:args *.js **/*.js`
3. List buffers: `:ls`
4. Navigate to each file using:
   - `:b2`, `:b3`, `:b4` (by number)
   - `:b router`, `:b db`, `:b error` (by name)
5. Use `:bn` and `:bp` to cycle through files
6. Use `Ctrl-^` to toggle between two most recent files

### Exercise 2: Following Code References

1. Start in `project_main.js`
2. Find the TODO comment about config.json
3. Jump to config: `:b config`
4. Check database settings
5. Jump to db.js: `:b db`
6. Find the connect() method
7. Jump back to main: `:b main`
8. Continue following the code flow

### Exercise 3: Multi-File Editing

1. Open all files: `vim -o *.js`
2. Make these edits:
   - In config.json: Change port to 3001
   - In router.js: Add a new route
   - In db.js: Add a console.log
   - In error.js: Add a new error type
3. Check modified buffers: `:ls` (look for + signs)
4. Save all: `:wa`

### Exercise 4: Project Workflow Simulation

1. Start with: `vim router.js`
2. Working flow:
   - See getUsers() method needs implementation
   - Jump to db.js: `:b db`
   - Find getUsers() implementation
   - Copy method signature
   - Back to router: `:b router`
   - Implement the method
   - Need user model: `:b user`
   - Check validation rules
   - Back to router: `:b#`

### Exercise 5: Buffer Management

1. Load all files: `vim *.js **/*.js config.json`
2. List all: `:ls`
3. Delete config.json buffer: `:bd config`
4. Delete multiple: `:bd 2 3`
5. Add file back: `:badd config.json`
6. Navigate to it: `:b config`
7. Clear all except current: `:%bd|e#`

### Exercise 6: Advanced Navigation Patterns

1. Setup a working set:
   ```vim
   :e project_main.js
   :e router.js
   :e db.js
   :e models/user.js
   ```

2. Create marks in different buffers:
   - In main.js: `ma` at initialize()
   - In router.js: `mb` at setupRoutes()
   - In db.js: `mc` at connect()

3. Jump between marked locations:
   - `'a` - jumps to buffer and mark
   - `'b` - jumps to router.js
   - `'c` - jumps to db.js

### Exercise 7: Search Across Buffers

1. Load all files
2. Search pattern in all buffers: `:bufdo /TODO/`
3. Collect results: `:copen`
4. Navigate through results

### Exercise 8: Refactoring Practice

1. Rename "users" to "members" across files:
   ```vim
   :bufdo %s/users/members/gc | update
   ```

2. Add logging to all methods:
   ```vim
   :bufdo %s/^    \(async \w\+\)(/ \1(/
        console.log('Calling: \1');
   ```

## Tips for Practice

- Use `:set hidden` to allow switching with unsaved changes
- Create aliases: `:cmap <C-b> buffer<Space>`
- Use tab completion: `:b rout<Tab>`
- Remember `:b#` toggles between last two buffers
- Use `:ls!` to see hidden buffers too

## Navigation Map

```
main.js ←→ config.json
   ↓           ↑
router.js ←→ db.js
   ↓           ↑
user.js ←→ error.js
```

Follow the references between files to understand the codebase structure!