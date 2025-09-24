# Day 48: Location List - Window-Local Error Navigation

## Learning Objectives

By the end of this lesson, you will:
- Master the location list for window-specific navigation
- Understand when to use location list vs quickfix list
- Build workflows for file-specific operations
- Manage multiple location lists across windows
- Integrate location lists with advanced editing workflows

## Location List vs Quickfix List

```
┌────────────────────────────────────────────────────────────┐
│                      VIM INSTANCE                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │     WINDOW 1        │  │      WINDOW 2        │       │
│  │                     │  │                      │       │
│  │  file: main.js      │  │   file: test.js      │       │
│  │                     │  │                      │       │
│  │  LOCATION LIST 1:   │  │   LOCATION LIST 2:   │       │
│  │  - main.js:10       │  │   - test.js:5        │       │
│  │  - main.js:25       │  │   - test.js:18       │       │
│  │  - main.js:30       │  │   - test.js:45       │       │
│  └─────────────────────┘  └─────────────────────┘       │
│                                                            │
│  ┌────────────────────────────────────────────────┐      │
│  │           QUICKFIX LIST (GLOBAL)                │      │
│  │  - app.js:15                                   │      │
│  │  - utils.js:8                                  │      │
│  │  - config.json:3                               │      │
│  └────────────────────────────────────────────────┘      │
│                                                            │
│  Key Difference:                                          │
│  - Location List: Per-window, independent                 │
│  - Quickfix List: Global, shared                         │
└────────────────────────────────────────────────────────────┘
```

## Core Location List Commands

### Basic Commands (Parallel to Quickfix)

```vim
" Opening and viewing
:lopen [height]      " Open location window
:lclose             " Close location window
:lwindow [height]   " Open if entries exist
:ll [nr]            " Jump to entry [nr]
:llist              " List all entries
:llist!             " List with context

" Navigation
:ln[ext]            " Next entry
:lp[revious]        " Previous entry
:lnf[ile]           " Next file
:lpf[ile]           " Previous file
:lfir[st]           " First entry
:lla[st]            " Last entry

" History
:lnewer             " Newer location list
:lolder             " Older location list
:lhistory           " Show location list stack
```

### Comparison Table: Quickfix vs Location

```
Operation          Quickfix        Location List
─────────────────────────────────────────────────
Open window        :copen          :lopen
Close window       :cclose         :lclose
Next item          :cn             :ln
Previous item      :cp             :lp
Jump to item       :cc [nr]        :ll [nr]
List items         :clist          :llist
First item         :cfirst         :lfirst
Last item          :clast          :llast
Newer list         :cnewer         :lnewer
Older list         :colder         :lolder
Grep               :grep           :lgrep
Vimgrep           :vimgrep        :lvimgrep
Make              :make           :lmake
Do (execute)      :cdo            :ldo
File do           :cfdo           :lfdo
```

## Populating Location Lists

### Local Grep Operations

```vim
" Search in current file only
:lvimgrep /pattern/ %
:lopen

" Search in specific files
:lvimgrep /TODO/ src/*.js
:lwindow

" Local grep with external tool
:lgrep -n "function" %
:lopen

" Add to existing list
:lvimgrepadd /FIXME/ %
```

### Window-Specific Analysis

```vim
" Analyze current file
:lmake %            " Build/lint current file
:lopen              " View results

" Function list in current file
:lvimgrep /^\s*function/ %
:lopen              " Jump between functions

" TODO list for current file
:lvimgrep /TODO\|FIXME\|XXX/ %
:lopen
```

### Manual Population

```vim
" Set location list for current window
:call setloclist(0, [
    \ {'lnum': 10, 'text': 'First issue'},
    \ {'lnum': 20, 'text': 'Second issue'},
    \ {'lnum': 30, 'text': 'Third issue'}
    \ ])

" Add to existing list
:laddexpr 'file.js:10:Error here'

" Load from file
:lfile errors.txt

" Get current location list
:echo getloclist(0)
```

## Practical Location List Workflows

### 1. File-Specific Refactoring

```vim
" Find all functions in current file
:lvimgrep /^function\|^class\|^const.*=.*=>/ %
:lopen

" Navigate and refactor
:ll 1               " First function
ciw newName         " Rename
:ln                 " Next function
.                   " Repeat rename if needed
```

### 2. Multiple Window Investigation

```vim
" Window 1: Main file investigation
:e src/main.js
:lvimgrep /apiCall/ %
:lopen 5

" Window 2: Test file investigation
:vsp test/main.test.js
:lvimgrep /expect.*apiCall/ %
:lopen 5

" Each window has independent navigation
Ctrl-w h :ln        " Next in window 1
Ctrl-w l :ln        " Next in window 2
```

### 3. Comparative Analysis

```vim
" Compare TODOs in different files
:e old_version.js
:lvimgrep /TODO/ %
:let old_todos = getloclist(0)

:vsp new_version.js
:lvimgrep /TODO/ %
:let new_todos = getloclist(0)

" Each window shows its own TODOs
:lopen              " Current window's list
```

### 4. Build Output Per File

```vim
" Set up per-file linting
function! LintCurrentFile()
    let &l:makeprg = 'eslint --format unix %'
    :lmake
    :lwindow
endfunction

:nnoremap <Leader>l :call LintCurrentFile()<CR>

" Each window can have different lint results
```

## Advanced Location List Techniques

### Window-Local Settings

```vim
" Different error formats per window
:setlocal errorformat=%f:%l:%c:\ %m  " JavaScript
:vsp
:setlocal errorformat=%f:%l:\ %m     " Python

" Window-specific make programs
:setlocal makeprg=npm\ test
:vsp
:setlocal makeprg=python\ -m\ pytest
```

### Synchronizing with Quickfix

```vim
" Copy quickfix to location list
:call setloclist(0, getqflist())

" Copy location to quickfix
:call setqflist(getloclist(0))

" Filter quickfix to location
:call setloclist(0, filter(getqflist(), 'v:val.bufnr == bufnr("%")'))
```

### Multiple Location Lists

```vim
" Save and restore location lists
function! SaveLocationList()
    let w:saved_loclist = getloclist(0)
endfunction

function! RestoreLocationList()
    if exists('w:saved_loclist')
        call setloclist(0, w:saved_loclist)
    endif
endfunction

" Use different lists for different purposes
:lvimgrep /function/ %  " Functions
:call SaveLocationList()
:lvimgrep /TODO/ %      " TODOs
" ... work with TODOs ...
:call RestoreLocationList()  " Back to functions
```

## Location List in Multi-Window Workflows

### Split-Screen Development

```vim
" Left: Implementation
:e implementation.js
:lvimgrep /^export/ %
:lopen 5

" Right: Tests
:vsp tests.js
:lvimgrep /^test\|^it\|^describe/ %
:lopen 5

" Bottom: Documentation
:sp README.md
:lvimgrep /^##/ %
:lwindow 3

" Each window navigates independently
```

### Parallel Debugging

```vim
" Window 1: Error locations
:e app.js
:lvimgrep /console\.error/ %

" Window 2: Warning locations
:vsp app.js
:lvimgrep /console\.warn/ %

" Window 3: Debug statements
:sp app.js
:lvimgrep /console\.log\|debugger/ %

" Clean up each category independently
```

## Practical Exercises

### Exercise 1: Basic Location List

```bash
# Create test file
cat > exercise.js << 'EOF'
function first() {
    // TODO: implement first function
    console.log("first");
}

function second() {
    // FIXME: broken logic here
    return undefined;
}

function third() {
    // TODO: add validation
    // NOTE: performance issue
    for(let i = 0; i < 1000000; i++) {}
}
EOF
```

Practice:
1. `vim exercise.js`
2. `:lvimgrep /TODO\|FIXME/ %`
3. `:lopen`
4. `:ll 1` - Jump to first
5. `:ln` - Next entry
6. `:lp` - Previous entry
7. Fix issues and navigate

### Exercise 2: Multi-Window Location Lists

```vim
" Setup two windows with different searches
:e file1.js
:lvimgrep /function/ %
:lopen 5

:vsp file2.js
:lvimgrep /class/ %
:lopen 5

" Navigate independently
Ctrl-w h
:ln  " Next in left window

Ctrl-w l
:ln  " Next in right window
```

### Exercise 3: File Analysis

```vim
" Create a file outline using location list
:lvimgrep /^function\|^class\|^const.*=/ %
:lopen

" Use as navigation sidebar
" Click on entries to jump
" Keep location window open for reference
```

### Exercise 4: Comparative Workflow

```bash
# Create two versions
cat > v1.js << 'EOF'
function old() {
    // TODO: refactor this
    return "old";
}
EOF

cat > v2.js << 'EOF'
function updated() {
    // TODO: optimize performance
    // TODO: add error handling
    return "new";
}
EOF
```

Practice:
1. `vim v1.js`
2. `:lvimgrep /TODO/ %`
3. `:lopen`
4. `:vsp v2.js`
5. `:lvimgrep /TODO/ %`
6. `:lopen`
7. Compare TODOs in each version

## Common Pitfalls and Solutions

### 1. Confusion with Quickfix
**Problem**: Using wrong commands (`:cn` instead of `:ln`)
```vim
" Solution: Remember the 'l' prefix
:lnext    not :cnext
:lopen    not :copen
:ll       not :cc

" Create mappings for consistency
nnoremap ]l :lnext<CR>
nnoremap [l :lprevious<CR>
```

### 2. Lost Location List
**Problem**: Location list cleared when switching windows
```vim
" Solution: Each window maintains its own
" Save before switching if needed
:let w:saved = getloclist(0)
" Later restore:
:call setloclist(0, w:saved)
```

### 3. Wrong Window Context
**Problem**: Location list shows wrong file's results
```vim
" Solution: Always check current window
:pwd      " Current directory
:echo bufname('%')  " Current file
:llist    " Verify entries are correct
```

### 4. Empty Location List
**Problem**: `:lopen` does nothing
```vim
" Solution: Check if populated
:echo len(getloclist(0))  " Should be > 0
:lvimgrep /pattern/ %      " Repopulate if needed
```

## Mental Models

### The Personal Assistant Model
```
Location List = Personal Assistant per Window
- Each window has its own assistant
- Tracks window-specific tasks
- Independent of other windows
- Remembers history per window
```

### The Notebook Model
```
Each Window = Different Notebook
- Location list = bookmarks in that notebook
- Switch notebooks (windows) = different bookmarks
- Can copy bookmarks between notebooks
```

### The Local vs Global Model
```
Location List = Local variables
Quickfix List = Global variables
- Local: window-specific scope
- Global: application-wide scope
```

## When to Use Location vs Quickfix

### Use Location List When:
- Working on single file analysis
- Need different result sets per window
- Performing file-specific operations
- Want independent navigation per split

### Use Quickfix List When:
- Project-wide operations
- Build/compilation errors
- Global search and replace
- Want unified navigation

## Integration with Previous Lessons

### With Windows (Day 44)
```vim
" Each split has its own location list
:vsp file1.js
:lvimgrep /TODO/ %
:sp file2.js
:lvimgrep /FIXME/ %
" Three independent location lists
```

### With Buffers (Day 43)
```vim
" Location list per buffer/window combo
:e file1.js
:lvimgrep /pattern/ %
:e file2.js  " Same window
:lvimgrep /pattern/ %  " Replaces previous
```

### With Quickfix (Day 47)
```vim
" Convert between lists
:copen
:call setloclist(0, getqflist())
:lopen  " Now have local copy
```

## Quick Reference Card

```
Location List Commands
══════════════════════
:lopen              Open location window
:lclose             Close location window
:ll [nr]            Jump to entry
:ln                 Next entry
:lp                 Previous entry
:lfirst             First entry
:llast              Last entry
:llist              List all entries

Population
══════════
:lvimgrep /pat/ %   Search current file
:lgrep pattern %    External grep
:lmake %            Build current file
:lfile file         Load from file
:laddexpr "..."     Add expression

Management
══════════
:lnewer            Newer list
:lolder            Older list
:lhistory          Show history
:ldo {cmd}         Execute on entries
:lfdo {cmd}        Execute on files

Window Operations
════════════════
getloclist(0)      Get current window's list
setloclist(0, list) Set current window's list
:lwindow           Open if entries exist
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Create location list with lvimgrep
- [ ] Navigate with :ln and :lp
- [ ] Open/close location window
- [ ] Understand difference from quickfix

### Intermediate (10 minutes)
- [ ] Use multiple location lists in splits
- [ ] Filter and manage location entries
- [ ] Switch between location list history
- [ ] Convert between quickfix and location

### Advanced (15 minutes)
- [ ] Build file-specific workflows
- [ ] Manage independent investigations
- [ ] Create custom location list functions
- [ ] Master window-local operations

## Mastery Checklist

- [ ] Understand location vs quickfix use cases
- [ ] Navigate location lists efficiently
- [ ] Maintain multiple independent lists
- [ ] Use location lists for file analysis
- [ ] Integrate with split workflows
- [ ] Never confuse location with quickfix commands
- [ ] Can explain window-local vs global scope
- [ ] Build sophisticated multi-window workflows

Remember: Location lists are your window-specific navigation tool. They allow independent investigation in each split, perfect for comparing files or analyzing different aspects of your code simultaneously!