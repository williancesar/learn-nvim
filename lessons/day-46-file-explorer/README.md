# Day 46: File Explorer - Netrw Navigation Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master Netrw, Vim's built-in file explorer
- Navigate directory structures efficiently without leaving Vim
- Perform file operations (create, delete, rename, move)
- Customize Netrw for optimal workflow
- Build mental models for file system navigation in Vim

## Understanding Netrw

Netrw (Network oriented Reading, Writing, and browsing) is Vim's built-in file explorer. It's powerful, always available, and doesn't require plugins.

```
┌────────────────────────────────────────────────────────┐
│                    NETRW EXPLORER                      │
├────────────────────────────────────────────────────────┤
│  " ============================================        │
│  " Netrw Directory Listing                            │
│  " /home/user/project/src                             │
│  " Sorted by: name                                    │
│  " Quick Help: <F1>:help                              │
│  " ============================================        │
│                                                        │
│  ../                                                   │
│  components/                                           │
│  utils/                                                │
│  ├── helpers.js         2.3 KB   Oct 20 14:30        │
│  ├── validators.js      1.8 KB   Oct 20 13:15        │
│  └── constants.js       0.9 KB   Oct 19 10:00        │
│  app.js                 5.2 KB   Oct 21 09:45        │
│  index.js               3.1 KB   Oct 21 08:30        │
│  config.json            1.2 KB   Oct 20 16:00        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Opening Netrw

### Basic Commands

```vim
:Ex[plore]           " Open explorer in current window
:Sex[plore]          " Open in horizontal split
:Vex[plore]          " Open in vertical split
:Tex[plore]          " Open in new tab
:Lex[plore]          " Open in left sidebar (project drawer)

" With size control
:20Lex               " Left explorer, width 20
:15Sex               " Horizontal split, height 15
:30Vex               " Vertical split, width 30

" Directory specific
:Ex .                " Current directory
:Ex ~/projects       " Specific directory
:Ex %:h              " Directory of current file
```

### From Command Line

```bash
vim .                " Open Vim with Netrw
vim ~/projects       " Open specific directory
```

## Netrw Navigation

### Basic Movement

```vim
" Navigation (same as normal Vim)
j, k                 " Up and down
h                    " Go to parent directory
l or <Enter>         " Open file/directory
-                    " Go up one directory

" Advanced navigation
^                    " Go to beginning of line
$                    " Go to end of line
gg                   " First file
G                    " Last file
/pattern             " Search for file/directory
n, N                 " Next/previous search result
```

### Opening Files

```vim
<Enter>              " Open in current window
o                    " Open in horizontal split
v                    " Open in vertical split
t                    " Open in new tab
p                    " Preview file
P                    " Open in previous window

" Multiple files
mf                   " Mark file
mt                   " Mark target
mm                   " Move marked files to target
mc                   " Copy marked files to target
mu                   " Unmark all
```

## File Operations

### Creating Files and Directories

```vim
%                    " Create new file
d                    " Create new directory

" Example workflow:
d                    " Press d
newdir              " Type directory name
<Enter>             " Create it

%                    " Press %
newfile.txt         " Type filename
<Enter>             " Create it
```

### Renaming and Moving

```vim
R                    " Rename file/directory

" Rename workflow:
" 1. Navigate to file
" 2. Press R
" 3. Edit the name
" 4. Press Enter
```

### Deleting

```vim
D                    " Delete file/directory

" Delete workflow:
" 1. Navigate to file
" 2. Press D
" 3. Confirm with 'y'
```

### Copying

```vim
" Mark and copy workflow:
mf                   " Mark file(s) to copy
mt                   " Mark target directory
mc                   " Copy marked to target

" Local copy:
R                    " Rename (can use for copy)
" Enter new name in same directory
```

## Netrw Display Modes

### View Styles

```vim
i                    " Cycle through view modes:
                    " 1. Thin (one file per line)
                    " 2. Long (detailed list)
                    " 3. Wide (multiple columns)
                    " 4. Tree (hierarchical)

" Permanent setting:
let g:netrw_liststyle = 0  " Thin
let g:netrw_liststyle = 1  " Long
let g:netrw_liststyle = 2  " Wide
let g:netrw_liststyle = 3  " Tree
```

### Sorting Options

```vim
s                    " Cycle sort order:
                    " - name
                    " - time
                    " - size
                    " - extension

r                    " Reverse sort order

" Permanent settings:
let g:netrw_sort_by = "name"
let g:netrw_sort_by = "time"
let g:netrw_sort_by = "size"
```

### Hiding Files

```vim
a                    " Cycle hiding modes:
                    " - show all
                    " - hide dotfiles
                    " - hide by pattern

gh                   " Toggle hidden files
I                    " Toggle banner

" Custom hide pattern:
let g:netrw_list_hide = '\.swp$,\.pyc$,__pycache__'
```

## Advanced Netrw Features

### Bookmarks

```vim
mb                   " Bookmark current directory
gb                   " Go to bookmark
qb                   " List bookmarks
mB                   " Delete bookmark

" Bookmark workflow:
" 1. Navigate to important directory
" 2. Press mb
" 3. From anywhere, press gb to return
```

### Remote Browsing

```vim
" Browse remote systems
:e scp://user@host/path/
:e ftp://user@host/path/
:e http://website.com/

" Example:
:e scp://server//home/user/
```

### File Information

```vim
qf                   " Display file info
!command             " Execute shell command

" Examples:
!file %              " Show file type
!wc -l %            " Count lines
!git status         " Git status in directory
```

## Netrw Configuration

### Essential Settings

```vim
" Make Netrw more usable
let g:netrw_banner = 0       " Hide banner
let g:netrw_liststyle = 3    " Tree view
let g:netrw_browse_split = 4  " Open in previous window
let g:netrw_winsize = 25      " Width 25%
let g:netrw_altv = 1         " Split to the right
let g:netrw_alto = 1         " Split below

" File operations
let g:netrw_keepdir = 0      " Change directory as you browse
let g:netrw_localcopydircmd = 'cp -r'  " Recursive copy
```

### Project Drawer Setup

```vim
" Create IDE-like project drawer
function! ToggleNetrw()
    if exists("g:netrw_buffer") && bufexists(g:netrw_buffer)
        exe g:netrw_buffer . "bwipeout"
        unlet g:netrw_buffer
    else
        Lexplore
        let g:netrw_buffer = bufnr("%")
    endif
endfunction

" Map to leader-e
nnoremap <Leader>e :call ToggleNetrw()<CR>
```

### Custom Mappings

```vim
" Better navigation in Netrw
autocmd FileType netrw nmap <buffer> h -
autocmd FileType netrw nmap <buffer> l <Enter>
autocmd FileType netrw nmap <buffer> . gh
autocmd FileType netrw nmap <buffer> P <C-w>z

" Quick operations
autocmd FileType netrw nmap <buffer> ff %
autocmd FileType netrw nmap <buffer> dd d
autocmd FileType netrw nmap <buffer> DD D
autocmd FileType netrw nmap <buffer> rn R
```

## Practical Workflows

### 1. Project Navigation

```vim
" Setup project explorer
:20Lex               " Open left sidebar
let g:netrw_liststyle = 3  " Tree view

" Navigation pattern
j/k                  " Browse files
<Enter>              " Open file
Ctrl-w h             " Back to explorer
/test                " Find test files
<Enter>              " Open test
```

### 2. File Management

```vim
" Organize project structure
:Ex .                " Open current directory
d                    " Create directory
src<Enter>           " Name it 'src'
l                    " Enter directory
%                    " Create file
index.js<Enter>      " Name it
i                    " Back to explorer
```

### 3. Batch Operations

```vim
" Mark multiple files
mf                   " Mark first file
j mf                 " Mark second
j mf                 " Mark third
mt                   " Mark target directory
mm                   " Move all marked
```

### 4. Quick File Creation

```vim
" Rapid file scaffolding
:Ex .
% component.js<Enter>
% component.css<Enter>
% component.test.js<Enter>

" Open all in tabs
mf j mf j mf         " Mark all three
:argadd              " Add to argument list
:tab all             " Open in tabs
```

## Common Patterns and Solutions

### Pattern 1: IDE-Style Layout

```vim
" Left sidebar explorer
:20Lex

" Configure for IDE feel
let g:netrw_winsize = 20
let g:netrw_banner = 0
let g:netrw_liststyle = 3
let g:netrw_browse_split = 4
```

### Pattern 2: Quick Directory Jump

```vim
" Bookmark frequently used directories
" In project root:
mb

" In deep subdirectory:
gb                   " Jump back to bookmarked root

" Alternative: use marks
" In Netrw:
ma                   " Mark directory
'a                   " Jump back
```

### Pattern 3: File Comparison

```vim
" Compare two files
:Ex
v                    " Open first file in vsplit
j                    " Navigate to second file
<Enter>              " Open second file
:windo diffthis      " Enable diff mode
```

## Practical Exercises

### Exercise 1: Basic Navigation

```bash
# Setup test directory
mkdir -p ~/test-netrw/{src,docs,tests}/{components,utils}
touch ~/test-netrw/src/index.js
touch ~/test-netrw/src/components/{Button,Form,Modal}.js
touch ~/test-netrw/docs/README.md
```

Practice:
1. `vim ~/test-netrw`
2. Navigate with `j`, `k`, `l`, `-`
3. Open files with `<Enter>`, `o`, `v`, `t`
4. Use `/` to search for files
5. Cycle views with `i`
6. Toggle hidden files with `gh`

### Exercise 2: File Operations

```vim
" In Netrw:
% newfile.txt        " Create file
d newfolder          " Create directory
R                    " Rename file
D                    " Delete file

" Batch operations:
mf                   " Mark multiple files
mt                   " Mark destination
mc                   " Copy marked files
```

### Exercise 3: Project Workflow

```vim
" 1. Create project structure
:Ex .
d src
l
d components
d utils
-
d tests

" 2. Create files
l                    " Enter src
% app.js
% config.json
-                    " Back up
l                    " Enter tests
% app.test.js

" 3. Navigate efficiently
gb                   " If bookmarked
/app                 " Search for app files
```

### Exercise 4: Advanced Features

```vim
" 1. Setup sidebar
:30Vex

" 2. Configure view
i i i                " Try different styles
s                    " Change sort
r                    " Reverse order

" 3. Bookmarks
mb                   " Bookmark current
cd ~                 " Change directory
gb                   " Go back to bookmark

" 4. Multi-file operations
mf j mf j mf         " Mark files
:argadd              " Add to args
:tab all             " Open in tabs
```

## Common Pitfalls and Solutions

### 1. Lost in Directories
**Problem**: Can't find way back
```vim
" Solutions:
-                    " Go up one level
:Ex .                " Return to current file's directory
gb                   " Go to bookmark
:cd -                " Previous directory
```

### 2. Accidental Deletions
**Problem**: Deleted wrong file with D
```vim
" Prevention:
set confirm          " Ask for confirmation
" Or use trash instead:
let g:netrw_localrmdir='trash'
```

### 3. Banner Taking Space
**Problem**: Banner wastes screen space
```vim
" Solution:
let g:netrw_banner = 0  " Disable permanently
I                        " Toggle temporarily
```

### 4. Can't Open Files
**Problem**: Files open in wrong window
```vim
" Solution:
let g:netrw_browse_split = 0  " Same window
let g:netrw_browse_split = 1  " Horizontal split
let g:netrw_browse_split = 2  " Vertical split
let g:netrw_browse_split = 3  " New tab
let g:netrw_browse_split = 4  " Previous window
```

## Mental Models

### The File Cabinet Model
```
Netrw = File Cabinet
Directories = Drawers
Files = Documents
- = Pull out of drawer
l = Look into drawer/document
```

### The Tree Climbing Model
```
Directory Tree Navigation:
j/k = Move along branches
l = Climb down into branch
h/- = Climb back up
/ = Spot specific branch
```

### The Window Shopping Model
```
Browse → Select → Act
i = Change display style
s = Sort products
<Enter> = Pick item
o/v/t = Different checkout options
```

## Integration with Previous Lessons

### With Buffers (Day 43)
```vim
" Open multiple files from Netrw
mf j mf j mf         " Mark files
:argadd              " Add to buffer list
:b <Tab>             " Access via buffer commands
```

### With Windows (Day 44)
```vim
:Vex                 " Vertical explorer
v                    " Open file in split
Ctrl-w w             " Switch between explorer and file
```

### With Tabs (Day 45)
```vim
:Tex                 " Explorer in new tab
t                    " Open file in new tab
gt                   " Switch between tabs
```

## Quick Reference Card

```
Opening Netrw
═════════════
:Ex              Explore current window
:Sex             Horizontal split
:Vex             Vertical split
:Lex             Left sidebar
:Tex             New tab

Navigation
══════════
j/k              Up/down
h/-              Parent directory
l/<Enter>        Open file/directory
o/v/t            Open in split/vsplit/tab

File Operations
═══════════════
%                Create file
d                Create directory
R                Rename
D                Delete
mf               Mark file
mt               Mark target
mc/mm            Copy/move marked

Display
═══════
i                Cycle view styles
s                Cycle sort order
r                Reverse sort
a                Cycle hide patterns
gh               Toggle hidden files
I                Toggle banner

Bookmarks
═════════
mb               Bookmark directory
gb               Go to bookmark
qb               List bookmarks
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Open Netrw and navigate directories
- [ ] Create, rename, and delete files
- [ ] Open files in different windows
- [ ] Try different view styles with `i`

### Intermediate (10 minutes)
- [ ] Setup project drawer with `:Lex`
- [ ] Use bookmarks for quick navigation
- [ ] Perform batch file operations
- [ ] Configure Netrw settings

### Advanced (15 minutes)
- [ ] Build complete project structure
- [ ] Integrate Netrw with workflow
- [ ] Create custom mappings
- [ ] Master mark and move operations

## Mastery Checklist

- [ ] Navigate any directory structure quickly
- [ ] Perform all file operations without leaving Vim
- [ ] Configure Netrw for personal workflow
- [ ] Use bookmarks effectively
- [ ] Integrate explorer with splits/tabs
- [ ] Never need external file manager
- [ ] Can explain when to use Netrw vs `:e` vs `:b`
- [ ] Build project structures rapidly

Remember: Netrw is always available - no plugins needed! Master it, and you'll never need to leave Vim for file management. Think of it as your built-in project navigator!