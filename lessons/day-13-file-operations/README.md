# Day 13: File Operations - Managing Your Workspace

## Learning Objectives

By the end of this lesson, you will:
- Master essential file commands: `:w`, `:q`, `:wq`, `:e`
- Understand command-line mode and Ex commands
- Navigate multiple files and buffers efficiently
- Handle file operation edge cases and errors
- Build confidence in file management without leaving Vim

## Theory & Concepts

### Command-Line Mode

The `:` key enters command-line mode, where you execute Ex commands for file operations, search/replace, and system integration.

```
Vim Modes with Command-Line:
┌─────────────┐
│ Normal Mode │ ←── Esc ──┐
└──────┬──────┘           │
       │                  │
       : (colon)          │
       │                  │
       ▼                  │
┌─────────────┐           │
│Command Mode │ ─ Enter ──┘
└─────────────┘
```

### File Operation Hierarchy

```
File Operations
├── Writing (Saving)
│   ├── :w        - Write current buffer
│   ├── :w!       - Force write
│   └── :w [file] - Write to specific file
├── Quitting
│   ├── :q        - Quit (if no changes)
│   ├── :q!       - Force quit (discard changes)
│   └── :qa       - Quit all buffers
├── Combined
│   ├── :wq       - Write and quit
│   ├── :x        - Write (if changed) and quit
│   └── ZZ        - Same as :x (normal mode)
└── Opening/Editing
    ├── :e [file] - Edit file
    ├── :e!       - Reload current file
    └── :e #      - Edit alternate file
```

### Buffer vs File vs Window

```
File:   Physical file on disk
Buffer: In-memory text (may be modified)
Window: Viewport into a buffer

One file → One or more buffers → One or more windows
```

## Key Commands Reference

### Basic File Operations
| Command | Action | Mnemonic |
|---------|--------|----------|
| `:w` | Write (save) current file | **w**rite |
| `:q` | Quit Vim | **q**uit |
| `:wq` | Write and quit | **w**rite + **q**uit |
| `:x` | Write if modified, then quit | e**x**it |
| `ZZ` | Same as :x (from normal mode) | Fast exit |
| `ZQ` | Same as :q! (from normal mode) | Fast force quit |

### Advanced Writing
| Command | Action | Use Case |
|---------|--------|----------|
| `:w filename` | Write to new file | Save as |
| `:w!` | Force write (override readonly) | Permission issues |
| `:w >>file` | Append to file | Add to existing |
| `:1,10w file` | Write lines 1-10 to file | Partial save |
| `:'<,'>w file` | Write visual selection | Export selection |
| `:sav filename` | Save as and switch | New version |

### Advanced Quitting
| Command | Action | Use Case |
|---------|--------|----------|
| `:q!` | Force quit without saving | Abandon changes |
| `:qa` | Quit all buffers | Close everything |
| `:qa!` | Force quit all buffers | Abandon all |
| `:cq` | Quit with error code | Script integration |
| `:wqa` | Write all and quit | Save everything and exit |

### File Editing/Opening
| Command | Action | Use Case |
|---------|--------|----------|
| `:e filename` | Edit file | Open new file |
| `:e!` | Reload current file | Discard changes |
| `:e #` | Edit alternate file | Toggle files |
| `:e %` | Re-edit current file | Refresh |
| `:enew` | Edit new unnamed buffer | Scratch buffer |
| `:view file` | Open in readonly | Safe viewing |

### File Information
| Command | Action | Information |
|---------|--------|-------------|
| `:f` or `Ctrl-g` | File info | Name, line count, position |
| `:pwd` | Print working directory | Current location |
| `:cd path` | Change directory | Navigate filesystem |
| `:lcd path` | Local cd for window | Window-specific path |

## Step-by-Step Exercises

### Exercise 1: Basic Save and Quit Flow
```
Tasks:
1. Create new file: vim test1.txt
2. Enter insert mode (i)
3. Type: "Hello, Vim!"
4. Exit insert mode (Esc)
5. Save file (:w)
6. Observe "written" message
7. Quit Vim (:q)
8. Reopen and verify saved content
```

### Exercise 2: Save As Operations
```
Starting file: document.txt
Content: Original content here

Tasks:
1. Open file: vim document.txt
2. Modify content
3. Save as new file: :w document_backup.txt
4. Continue editing
5. Save original: :w
6. Save specific lines: :1,5w excerpt.txt
7. Check all files exist with :!ls
```

### Exercise 3: Force Operations
```
Tasks:
1. Create readonly file: touch readonly.txt && chmod 444 readonly.txt
2. Open in vim: vim readonly.txt
3. Try to edit (notice [readonly] indicator)
4. Force write: :w!
5. Make changes
6. Try :q (will warn about unsaved changes)
7. Force quit: :q! (discards changes)
```

### Exercise 4: Working with Multiple Files
```
Tasks:
1. Open file: vim file1.txt
2. Write some content and save (:w)
3. Open another file: :e file2.txt
4. Write content and save
5. Switch back: :e # (alternate file)
6. List buffers: :ls
7. Switch to buffer 2: :b2
8. Save all and quit: :wqa
```

### Exercise 5: Emergency Recovery
```
Scenario: Accidentally closed without saving

Tasks:
1. Create file with content
2. Make changes but don't save
3. Quit with :q! (force quit)
4. Reopen file - changes lost
5. Repeat but use :q (will warn)
6. Save with :w, then :q works
7. Learn about swap files (.swp)
```

### Exercise 6: Advanced File Operations
```
Tasks:
1. Visual select text (V)
2. Write selection to file: :'<,'>w selection.txt
3. Write with line range: :10,20w lines.txt
4. Append to file: :w >> append.txt
5. Save as new and switch: :sav newversion.txt
6. Reload current file: :e!
7. Open readonly: :view important.txt
```

## Common Mistakes to Avoid

### 1. Confusing :w and :wq
- `:w` only saves, stays in Vim
- `:wq` saves AND quits
- `:x` quits only if there are changes

### 2. Lost Work from :q!
- `:q!` discards ALL unsaved changes
- No undo after quitting
- Use `:q` first to check for changes

### 3. Forgetting to Save
- Vim doesn't auto-save
- Set up auto-save if needed
- Check with `:ls` for modified buffers [+]

### 4. Wrong File Saved
- `:w` saves current buffer
- `:w filename` saves to different file
- `:sav` switches to new file

### 5. Permission Issues
- Can't write to protected files
- `:w!` might not work without permissions
- Use `:w ~/temp.txt` then move file

## Real-World Applications

### Quick Edits
```bash
# Fast edit and save
vim config.json
# Make changes
# ZZ to save and quit (faster than :wq)
```

### Backup Before Major Changes
```vim
:w backup_%:t.bak
" % expands to current filename
" :t gets just the filename (tail)
```

### Partial File Export
```vim
" Export function to new file
:/^function/,/^}/w function.js

" Export TODO comments
:g/TODO/w todos.txt
```

### Recovery from Crashes
```vim
" If Vim crashes, recover with:
vim -r filename
" Or check swap files:
:recover
```

### Multiple File Workflow
```vim
" Open multiple files
vim file1.js file2.js file3.js

" Navigate with:
:n    " next file
:prev " previous file
:last " last file
:first " first file
```

## Practice Goals

### Beginner (10 mins)
- [ ] Save 10 files with :w
- [ ] Quit with :q and :wq 10 times
- [ ] Use :e to open 5 different files
- [ ] Complete Exercises 1-2

### Intermediate (15 mins)
- [ ] Use force operations (:w!, :q!) safely
- [ ] Save partial files with ranges
- [ ] Work with multiple buffers
- [ ] Complete Exercises 1-4 smoothly

### Advanced (20 mins)
- [ ] Master all save variations
- [ ] Handle permission issues
- [ ] Use advanced Ex commands
- [ ] Complete all exercises in 12 minutes

## Quick Reference Card

```
ESSENTIAL SAVES & QUITS
┌─────────────────────────────┐
│ :w      - Save file         │
│ :q      - Quit (if saved)   │
│ :wq     - Save and quit     │
│ :x      - Save (if needed) & quit│
│ ZZ      - Same as :x        │
│ :q!     - Force quit        │
│ :w!     - Force save        │
└─────────────────────────────┘

FILE NAVIGATION
┌─────────────────────────────┐
│ :e file  - Edit file        │
│ :e!      - Reload file      │
│ :e #     - Alternate file   │
│ :ls      - List buffers     │
│ :b{n}    - Buffer n         │
│ :bn/:bp  - Next/prev buffer │
└─────────────────────────────┘

ADVANCED OPERATIONS
┌─────────────────────────────┐
│ :w new.txt - Save as        │
│ :sav new   - Save as & switch│
│ :1,10w     - Save lines 1-10│
│ :'<,'>w    - Save selection │
│ :wa        - Write all      │
│ :qa        - Quit all       │
└─────────────────────────────┘

FILE INFO & SYSTEM
┌─────────────────────────────┐
│ Ctrl-g    - File info       │
│ :pwd      - Current dir     │
│ :cd path  - Change dir      │
│ :!ls      - Shell command   │
│ :r file   - Read file in    │
│ :r !cmd   - Read command    │
└─────────────────────────────┘
```

## Tips for Mastery

1. **Use :x Instead of :wq**: Saves a keystroke and only writes if needed
2. **Learn ZZ and ZQ**: Fastest save/quit from normal mode
3. **Master :e #**: Quick toggle between two files
4. **Understand [+] in :ls**: Shows modified unsaved buffers
5. **Use :wa Before :qa**: Save all before quitting all
6. **Remember Swap Files**: .swp files save you from crashes

## Connection to Previous Lessons

- **Day 01-02**: Navigate to review before saving
- **Day 05**: Search before saving to verify changes
- **Day 08**: Undo changes before saving if needed
- **Day 10**: Visual select text to save portions
- **Day 11**: Change text then save efficiently

## Preview of Next Lesson

Tomorrow (Day 14), we'll review all Week 2 concepts with combined practice exercises, cementing your understanding of undo/redo, character search, visual modes, change operations, numbers, and file management.

---

*Remember: File operations are the bridge between Vim and your filesystem. Master these commands to work seamlessly without ever leaving your editor.*