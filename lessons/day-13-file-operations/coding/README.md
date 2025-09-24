# Day 13: File Operations Practice

## Overview

This practice session focuses on mastering file operations in Vim/Neovim. You'll work with multiple interconnected files that simulate a real-world JavaScript application structure.

## Learning Objectives

- Master file opening and navigation (`:e`, `:split`, `:vsplit`)
- Practice buffer management (`:bn`, `:bp`, `:b#`)
- Learn efficient file saving operations (`:w`, `:wa`, `:wq`)
- Master tab management (`:tabnew`, `gt`, `gT`)
- Navigate between related files efficiently
- Work with multiple files simultaneously

## File Structure

```
coding/
├── main.js              # Main application entry point
├── userService.js       # User management service
├── dataProcessor.js     # Data processing utilities
├── config.json          # Application configuration
├── package.json         # Node.js package configuration
├── styles.css           # Application styles
└── README.md           # This documentation file
```

## Key Commands Reference

### File Opening
- `:e filename` - Edit/open file
- `:e!` - Reload current file (discard changes)
- `:enew` - Open new empty buffer

### Window Splitting
- `:split` or `:sp` - Horizontal split
- `:vsplit` or `:vsp` - Vertical split
- `:split filename` - Open file in horizontal split
- `:vsplit filename` - Open file in vertical split

### Window Navigation
- `Ctrl-w + h` - Move to left window
- `Ctrl-w + j` - Move to bottom window
- `Ctrl-w + k` - Move to top window
- `Ctrl-w + l` - Move to right window
- `Ctrl-w + w` - Cycle through windows
- `Ctrl-w + c` - Close current window
- `Ctrl-w + o` - Close all other windows

### Buffer Management
- `:ls` or `:buffers` - List all buffers
- `:bn` or `:bnext` - Next buffer
- `:bp` or `:bprev` - Previous buffer
- `:b#` - Switch to alternate buffer
- `:b filename` - Switch to buffer by name
- `:bd` - Delete current buffer

### Tab Management
- `:tabnew` - New tab
- `:tabnew filename` - Open file in new tab
- `gt` - Next tab
- `gT` - Previous tab
- `:tabclose` - Close current tab
- `:tabonly` - Close all other tabs

### File Saving
- `:w` - Save current file
- `:w filename` - Save as new filename
- `:wa` - Save all modified buffers
- `:wq` - Save and quit
- `:x` - Save (if modified) and quit
- `:q!` - Quit without saving

## Practice Exercises

### Exercise 1: Basic File Navigation
1. Start by opening `main.js`: `nvim main.js`
2. Open `userService.js`: `:e userService.js`
3. Open `config.json`: `:e config.json`
4. Navigate between files: `:b main.js`, `:b userService.js`
5. Use alternate buffer: `:b#`

### Exercise 2: Split Windows
1. Open `main.js` in horizontal split with `userService.js`: `:split userService.js`
2. Open `dataProcessor.js` in vertical split: `:vsplit dataProcessor.js`
3. Navigate between splits using `Ctrl-w + hjkl`
4. Close splits: `Ctrl-w + c`

### Exercise 3: Tab Management
1. Open each file in separate tabs:
   - `:tabnew main.js`
   - `:tabnew userService.js`
   - `:tabnew dataProcessor.js`
   - `:tabnew config.json`
2. Navigate between tabs: `gt` and `gT`
3. Practice switching to specific tabs

### Exercise 4: Buffer Operations
1. Open multiple files: `:e main.js`, `:e userService.js`, `:e config.json`
2. List buffers: `:ls`
3. Practice buffer navigation: `:bn`, `:bp`
4. Switch to specific buffers: `:b config.json`

### Exercise 5: Complex File Operations
1. Open `main.js` and split with `config.json` to view configuration while editing
2. Open `userService.js` in a new tab
3. Navigate to see the relationship between `UserService` import in `main.js`
4. Make changes across multiple files
5. Save all files: `:wa`

### Exercise 6: Real-world Workflow
1. Open the main application file: `main.js`
2. Follow import statements to open related files
3. Use splits to compare implementations
4. Create new files referenced in comments (e.g., `:e routes.js`)
5. Practice saving and testing workflow

## File Relationships

Understanding how these files connect will help you practice navigation:

### main.js
- Imports from `userService.js` and `dataProcessor.js`
- References `config.json` for configuration
- References `styles.css` for styling
- Uses `package.json` for scripts

### userService.js
- Provides user management functionality
- Called by methods in `main.js`
- References validation and security modules (practice creating these)

### dataProcessor.js
- Provides data processing utilities
- Called by methods in `main.js`
- References analytics and processing modules

### config.json
- Contains application configuration
- Used by both `main.js` and service files
- Practice viewing this while editing other files

## Advanced Practice

### Sequential File Creation
Follow the comments in the code to create additional files:
1. `:e database.js` - Database connection
2. `:e validation.js` - Validation utilities
3. `:e routes.js` - API routes
4. `:e middleware.js` - Express middleware
5. `:e security/passwordValidator.js` - Password validation

### Workflow Efficiency
1. Set up your ideal window layout with splits
2. Keep configuration files open in tabs
3. Use buffer commands for quick navigation
4. Practice the save-all workflow before testing

## Tips for Efficient File Operations

1. **Use tab completion** - Type `:e conf<Tab>` to complete filenames
2. **Leverage buffer history** - `:b#` quickly switches between recent files
3. **Split for comparison** - Use splits when you need to see multiple files
4. **Save frequently** - Use `:w` often, `:wa` for multiple files
5. **Learn the relationships** - Understanding file connections improves navigation

## Common Workflows

### Development Workflow
1. Open main file
2. Split with configuration file for reference
3. Open related service files in tabs
4. Make changes across multiple files
5. Save all and test

### Debugging Workflow
1. Open the problematic file
2. Split with related files to see connections
3. Check configuration in another split
4. Make fixes across multiple files
5. Save and test

### Code Review Workflow
1. Open files in tabs
2. Compare implementations using splits
3. Navigate through related files
4. Document findings in new files

Practice these workflows with the provided files to build muscle memory for efficient file operations in Vim/Neovim.