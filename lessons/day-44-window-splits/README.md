# Day 44: Window Splits - Multi-Pane Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master Vim's window split system for simultaneous file viewing
- Navigate efficiently between multiple windows
- Resize and arrange windows for optimal workflows
- Understand the window-buffer relationship
- Build complex multi-pane layouts for different tasks

## The Window System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     VIM INSTANCE                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┬─────────────────┬────────────────┐ │
│  │    WINDOW 1     │    WINDOW 2     │   WINDOW 3     │ │
│  │                 │                 │                │ │
│  │  Buffer: main.js│  Buffer: util.js│ Buffer: main.js│ │
│  │                 │                 │  (same buffer) │ │
│  │  Cursor: L15    │  Cursor: L42    │  Cursor: L200  │ │
│  │                 │                 │                │ │
│  ├─────────────────┴─────────────────┴────────────────┤ │
│  │                   WINDOW 4                          │ │
│  │                                                     │ │
│  │              Buffer: terminal                       │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  One Buffer → Multiple Windows ✓                        │
│  One Window → One Buffer (at a time) ✓                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Core Window Commands

### Creating Splits

```vim
" Horizontal splits (stacked)
:split [file]        " Split horizontally
:sp [file]          " Short form
:new                " New horizontal split with empty buffer
Ctrl-w s            " Split current window horizontally

" Vertical splits (side-by-side)
:vsplit [file]      " Split vertically
:vsp [file]         " Short form
:vnew               " New vertical split with empty buffer
Ctrl-w v            " Split current window vertically

" Split with commands
:10split            " Split with height 10
:30vsplit           " Split with width 30
:botright split     " Split at bottom
:topleft vsplit     " Split at top-left
```

### Window Navigation

```vim
" Directional movement
Ctrl-w h            " Move to left window
Ctrl-w j            " Move to window below
Ctrl-w k            " Move to window above
Ctrl-w l            " Move to right window

" Sequential movement
Ctrl-w w            " Cycle through windows
Ctrl-w W            " Cycle backwards
Ctrl-w p            " Go to previous window

" Direct movement
Ctrl-w t            " Go to top-left window
Ctrl-w b            " Go to bottom-right window
```

### Window Arrangement

```vim
" Rotating/swapping
Ctrl-w r            " Rotate windows downward
Ctrl-w R            " Rotate windows upward
Ctrl-w x            " Exchange with next window

" Moving windows
Ctrl-w H            " Move window to far left
Ctrl-w J            " Move window to bottom
Ctrl-w K            " Move window to top
Ctrl-w L            " Move window to far right

" Changing layout
Ctrl-w T            " Move window to new tab
```

### Window Sizing

```vim
" Resize height
Ctrl-w +            " Increase height by 1
Ctrl-w -            " Decrease height by 1
Ctrl-w _            " Maximize height
[N]Ctrl-w _         " Set height to N lines
:resize N           " Set height to N lines

" Resize width
Ctrl-w >            " Increase width by 1
Ctrl-w <            " Decrease width by 1
Ctrl-w |            " Maximize width
[N]Ctrl-w |         " Set width to N columns
:vertical resize N  " Set width to N columns

" Equalize
Ctrl-w =            " Make all windows equal size
```

### Closing Windows

```vim
:q                  " Quit current window
:close              " Close current window
Ctrl-w q            " Quit current window
Ctrl-w c            " Close current window
:only               " Close all other windows
Ctrl-w o            " Close all other windows
:qa                 " Quit all windows
:wa                 " Write all windows
```

## Advanced Window Layouts

### 1. The IDE Layout

```
┌──────────────┬─────────────────────────┬──────────────┐
│              │                         │              │
│   File       │      Main Editor        │   Outline    │
│   Explorer   │                         │              │
│              │                         │              │
├──────────────┤                         ├──────────────┤
│              │                         │              │
│   Search     │                         │   Terminal   │
│   Results    │                         │              │
│              │                         │              │
└──────────────┴─────────────────────────┴──────────────┘

" Create this layout:
:vsp | :vsp              " Three vertical panes
Ctrl-w h                 " Go to left pane
:sp                      " Split it horizontally
Ctrl-w l Ctrl-w l        " Go to right pane
:sp                      " Split it horizontally
```

### 2. The Compare Layout

```
┌─────────────────────────┬─────────────────────────┐
│                         │                         │
│      Original File      │      Modified File      │
│                         │                         │
│                         │                         │
├─────────────────────────┴─────────────────────────┤
│                    Diff Output                     │
│                                                    │
└────────────────────────────────────────────────────┘

" Create this layout:
:vsp modified.txt        " Split vertically
:sp                      " Split horizontally
:diffthis                " In original window
Ctrl-w l :diffthis       " In modified window
```

### 3. The Documentation Layout

```
┌─────────────────────────────────────────────────────┐
│                    Code File                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                 Documentation                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   Terminal/REPL                     │
└─────────────────────────────────────────────────────┘

" Create this layout:
:sp docs.md              " Split with docs
:sp                      " Split again
:terminal                " Open terminal
```

## Practical Workflows

### 1. Reference and Edit Pattern

```vim
" Open main file
:e main.js

" Split to see reference
:vsp reference.js

" Navigate and edit
Ctrl-w h                 " To main
" make edits
Ctrl-w l                 " To reference
" look up function
Ctrl-w h                 " Back to main
```

### 2. Test-Driven Development

```vim
" Setup TDD environment
:e src/feature.js        " Implementation
:vsp test/feature.test.js " Test file
:sp                      " Split for terminal
:terminal npm test       " Run tests

" Workflow
Ctrl-w k                 " To test file
" Write test
Ctrl-w h                 " To implementation
" Write code
Ctrl-w j                 " To terminal
i Ctrl-r              " Rerun tests
```

### 3. Multi-File Refactoring

```vim
" Open files to refactor
:e old_module.js
:vsp new_module.js
:sp usage_file.js

" Work pattern
Ctrl-w j                 " See usage
yy                      " Copy line
Ctrl-w k                 " To new module
p                       " Paste
Ctrl-w h                 " To old module
dd                      " Delete moved code
```

## Window Management Techniques

### Dynamic Resizing

```vim
" Create responsive layout
:vsp                     " Split vertically
30Ctrl-w <              " Make left pane narrower
:sp                      " Split bottom pane

" Quick resize patterns
Ctrl-w =                 " Equalize all
Ctrl-w _                 " Maximize current height
Ctrl-w |                 " Maximize current width
Ctrl-w 20+              " Increase by 20 lines
Ctrl-w 15>              " Increase by 15 columns
```

### Window Preservation

```vim
" Save layout
:mksession! ~/session.vim

" Restore layout
:source ~/session.vim

" Preserve on close
:set sessionoptions+=winsize,winpos
```

### Smart Navigation

```vim
" Quick window jumping
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" Resize shortcuts
nnoremap <Leader>+ :resize +5<CR>
nnoremap <Leader>- :resize -5<CR>
nnoremap <Leader>> :vertical resize +5<CR>
nnoremap <Leader>< :vertical resize -5<CR>
```

## Practical Exercises

### Exercise 1: Basic Split Operations

```bash
# Create test files
echo "Line 1\nLine 2\nLine 3" > file1.txt
echo "Data A\nData B\nData C" > file2.txt
echo "Code X\nCode Y\nCode Z" > file3.txt
```

Practice sequence:
1. `vim file1.txt`
2. `:vsp file2.txt` - Vertical split
3. `:sp file3.txt` - Horizontal split
4. Practice `Ctrl-w hjkl` navigation
5. Try `Ctrl-w w` to cycle
6. Resize with `Ctrl-w +` and `Ctrl-w >`
7. Swap with `Ctrl-w r` and `Ctrl-w x`
8. Close with `Ctrl-w c` and reopen

### Exercise 2: IDE-Style Layout

Create a development layout:
```vim
" 1. Start vim
vim main.js

" 2. Create file explorer (left)
:20vsp .

" 3. Create outline (right)
Ctrl-w l
:80vsp outline.md

" 4. Create terminal (bottom)
Ctrl-w h
:10sp
:terminal

" 5. Navigate practice
Ctrl-w k  " To main
Ctrl-w h  " To explorer
Ctrl-w l  " To main
Ctrl-w l  " To outline
Ctrl-w j  " To terminal
```

### Exercise 3: Comparison Workflow

```vim
" 1. Open original
:e original.txt

" 2. Split with modified
:vsp modified.txt

" 3. Enable diff mode
:windo diffthis

" 4. Navigate differences
]c  " Next difference
[c  " Previous difference

" 5. Merge changes
do  " Obtain (pull from other)
dp  " Put (push to other)

" 6. Disable diff
:diffoff!
```

### Exercise 4: Advanced Window Management

```vim
" Complex layout creation
:e file1.txt
:vsp file2.txt
:sp file3.txt
Ctrl-w l
:sp file4.txt

" Should have:
" [1][3]
" [2][4]

" Rearrange to:
" [1][2]
" [3][4]
Ctrl-w k  " To window 3
Ctrl-w x  " Swap with 2

" Make equal
Ctrl-w =

" Focus mode
Ctrl-w h
Ctrl-w _  " Maximize height
Ctrl-w |  " Maximize width

" Restore
Ctrl-w =
```

## Common Pitfalls and Solutions

### 1. Lost in Windows
**Problem**: Can't find the right window
```vim
" Solution: Use systematic navigation
Ctrl-w t  " Go to top-left
Ctrl-w w  " Cycle through all

" Or number your windows mentally
" Top-left = 1, Top-right = 2, etc.
```

### 2. Accidentally Closing Important Window
**Problem**: Closed window with unsaved changes
```vim
" Prevention:
:set confirm  " Ask before closing modified
:wa          " Write all before operations

" Recovery:
:e#          " Reopen last file
Ctrl-w v     " Resplit
```

### 3. Uneven Window Sizes
**Problem**: Windows become unbalanced
```vim
" Quick fixes:
Ctrl-w =     " Equalize all
:resize 20   " Set specific size
:vert res 80 " Set width
```

### 4. Too Many Windows
**Problem**: Screen too cluttered
```vim
" Solutions:
:only        " Keep only current
Ctrl-w o     " Same as :only
:close       " Close current systematically
```

## Mental Models for Window Management

### The Workspace Model
```
Your Screen = Physical Desktop
Windows = Papers on Desktop
Buffers = Stack of Papers
- Arrange papers (windows) as needed
- Same paper (buffer) can be visible multiple places
- Clear desk (:only) when overwhelmed
```

### The Grid Model
```
┌───┬───┬───┐
│ 1 │ 2 │ 3 │  Think in grid positions
├───┼───┼───┤  Ctrl-w hjkl = arrow keys
│ 4 │ 5 │ 6 │  Ctrl-w w = next cell
└───┴───┴───┘  Numbered mentally
```

### The Focus Model
```
Wide View: Multiple windows (Ctrl-w =)
Focus View: Maximize current (Ctrl-w _ |)
Toggle between views as needed
```

## Integration with Previous Lessons

### With Buffers (Day 43)
```vim
" Same buffer, multiple views
:e file.txt
:vsp         " Same file, different position
100G         " Go to line 100 in new window
Ctrl-w h     " Original window still at top
```

### With Marks (Day 21)
```vim
" Marks work across windows
ma           " Set mark a
Ctrl-w l     " Other window
'a           " Jump to mark (changes window!)
```

### With Visual Mode (Day 10)
```vim
" Copy between windows
viw          " Select word
y            " Yank
Ctrl-w l     " Other window
p            " Paste
```

## Quick Reference Card

```
Window Creation
═══════════════
:sp [file]      Horizontal split
:vsp [file]     Vertical split
Ctrl-w s        Horizontal split current
Ctrl-w v        Vertical split current
:new            New horizontal empty
:vnew           New vertical empty

Navigation
═══════════
Ctrl-w h/j/k/l  Move left/down/up/right
Ctrl-w w        Cycle windows
Ctrl-w p        Previous window
Ctrl-w t        Top-left window
Ctrl-w b        Bottom-right window

Sizing
══════
Ctrl-w +/-      Increase/decrease height
Ctrl-w >/<      Increase/decrease width
Ctrl-w _        Maximize height
Ctrl-w |        Maximize width
Ctrl-w =        Equalize all
:resize N       Set height to N
:vert res N     Set width to N

Management
══════════
Ctrl-w r/R      Rotate down/up
Ctrl-w x        Exchange windows
Ctrl-w H/J/K/L  Move to far left/bottom/top/right
Ctrl-w c        Close window
Ctrl-w o        Only (close others)
Ctrl-w q        Quit window
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Create horizontal and vertical splits
- [ ] Navigate with Ctrl-w hjkl (20 times)
- [ ] Close and reopen windows
- [ ] Practice Ctrl-w w cycling

### Intermediate (10 minutes)
- [ ] Create 4-window layout
- [ ] Resize windows dynamically
- [ ] Swap and rotate windows
- [ ] Work with same buffer in multiple windows

### Advanced (15 minutes)
- [ ] Build IDE-style layout
- [ ] Implement TDD workflow with splits
- [ ] Master quick resizing
- [ ] Create custom navigation mappings

## Mastery Checklist

- [ ] Can create any layout in under 10 seconds
- [ ] Navigate between 6+ windows without thinking
- [ ] Resize windows to exact proportions quickly
- [ ] Use same buffer in multiple windows effectively
- [ ] Integrate splits with buffers and marks
- [ ] Never lose track of window focus
- [ ] Can explain window vs buffer vs tab
- [ ] Build task-specific layouts automatically

Remember: Windows are viewports into buffers. Master window management, and you can see everything you need simultaneously. Think of Ctrl-w as your window commander - it's the prefix for almost all window operations!