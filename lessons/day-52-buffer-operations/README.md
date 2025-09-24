# Day 52: Buffer Operations - Advanced Multi-File Command Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master :bufdo, :windo, and :tabdo for batch operations
- Execute commands across multiple scopes efficiently
- Build complex multi-file transformation workflows
- Understand scope differences and when to use each
- Create powerful automation with buffer operations
- Integrate batch commands with macros and functions

## The Operation Scopes Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VIM OPERATION SCOPES                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    :bufdo scope                       │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │  │
│  │  │ Buf 1  │ │ Buf 2  │ │ Buf 3  │ │ Buf 4  │ ...   │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │  │
│  │  Operates on: ALL BUFFERS (loaded files)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    :windo scope                       │  │
│  │  ┌──────────┬──────────┐                            │  │
│  │  │ Window 1 │ Window 2 │  Currently visible         │  │
│  │  ├──────────┼──────────┤  windows only              │  │
│  │  │ Window 3 │ Window 4 │                            │  │
│  │  └──────────┴──────────┘                            │  │
│  │  Operates on: ALL WINDOWS (current tab)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    :tabdo scope                       │  │
│  │  [Tab 1] [Tab 2] [Tab 3] [Tab 4]                    │  │
│  │  Operates on: ALL TABS (and current window in each) │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    :argdo scope                       │  │
│  │  [Arg 1] [Arg 2] [Arg 3]                            │  │
│  │  Operates on: ARGUMENT LIST (subset of buffers)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    :cdo/:cfdo scope                   │  │
│  │  [QF 1] [QF 2] [QF 3] ...                           │  │
│  │  Operates on: QUICKFIX LIST entries/files           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Buffer Operation Commands

### :bufdo - Buffer Do

```vim
" Execute command in all buffers
:bufdo command
:bufdo set expandtab       " Set option in all buffers
:bufdo %s/old/new/g       " Replace in all buffers
:bufdo normal @a          " Run macro in all buffers
:bufdo write              " Save all buffers

" With update (auto-save if changed)
:bufdo %s/old/new/g | update
:bufdo normal gg=G | up   " Format all buffers

" Conditional execution
:bufdo if &modifiable | %s/old/new/g | update | endif
:bufdo if &ft == 'python' | %s/print/logging.info/g | up | endif

" Suppress output
:silent bufdo %s/old/new/g
:bufdo silent %s/pattern/replacement/g
```

### :windo - Window Do

```vim
" Execute command in all windows
:windo command
:windo set scrollbind     " Sync scrolling
:windo set number         " Line numbers in all
:windo diffthis          " Diff all windows
:windo normal gg         " Go to top in all

" Layout adjustments
:windo resize 10          " Set all heights to 10
:windo vertical resize 40 " Set all widths to 40
:windo set wrap          " Enable wrap in all

" Content operations
:windo %s/TODO/DONE/g    " Replace in visible files
:windo normal zz         " Center cursor in all

" Conditional
:windo if &ft == 'help' | q | endif  " Close help windows
```

### :tabdo - Tab Do

```vim
" Execute command in all tabs
:tabdo command
:tabdo cd /project/path   " Change dir in all tabs
:tabdo windo set nu      " Numbers in all windows of all tabs
:tabdo close              " Close current window in each tab
:tabdo only               " Keep only one window per tab

" Complex operations
:tabdo windo %s/old/new/g | up  " Replace in all windows of all tabs
:tabdo NERDTreeClose      " Close NERDTree in all tabs
:tabdo bufdo write        " Save all buffers in all tabs

" Tab-specific settings
:tabdo set guitablabel=%t " Set tab labels
:tabdo let t:project_root = getcwd()
```

### :argdo - Argument Do (Review)

```vim
" Execute on argument list
:argdo command
:args **/*.js             " Set argument list
:argdo %s/var/const/g | up  " Process all JS files

" Versus bufdo
:bufdo                    " ALL loaded buffers
:argdo                    " Only argument list files
```

### :cdo / :cfdo - Quickfix Do

```vim
" Execute on quickfix entries
:vimgrep /TODO/ **/*.py   " Populate quickfix
:cdo s/TODO/FIXME/       " Change each occurrence
:cfdo %s/TODO/FIXME/g | up  " Change in each file

" Difference:
:cdo                      " Each quickfix entry
:cfdo                     " Each file in quickfix

" Location list versions
:ldo                      " Each location entry
:lfdo                     " Each file in location list
```

## Advanced Operation Patterns

### 1. Project-Wide Refactoring

```vim
" Method 1: Using bufdo
:bufdo %s/\<oldClass\>/newClass/g | update

" Method 2: Using argdo with specific files
:args src/**/*.java
:argdo %s/\<oldClass\>/newClass/g | up

" Method 3: Using quickfix
:vimgrep /oldClass/ **/*.java
:cfdo %s/\<oldClass\>/newClass/g | up

" Method 4: Combined approach
:bufdo if expand('%:e') == 'java' |
    \ %s/\<oldClass\>/newClass/g | update | endif
```

### 2. Format and Clean All Files

```vim
" Clean trailing whitespace
:bufdo %s/\s\+$//e | up

" Fix indentation
:bufdo normal gg=G | up

" Convert tabs to spaces
:bufdo set expandtab | retab | up

" Run external formatter
:bufdo %!prettier --write % | up

" Combined cleaning
function! CleanAllBuffers()
    bufdo %s/\s\+$//e |           " Trailing whitespace
        \ %s/\r//ge |              " Windows line endings
        \ normal gg=G |            " Fix indentation
        \ update
endfunction
command! CleanAll call CleanAllBuffers()
```

### 3. Multi-Window Operations

```vim
" Sync all windows
:windo set scrollbind cursorbind

" Compare files
:windo diffthis
:windo diffoff

" Adjust layout
:windo resize +5          " Increase all heights
:windo vertical resize -10  " Decrease all widths

" Search in all visible
:windo /pattern
:windo normal n          " Next match in all

" Set window options
:windo setlocal number relativenumber cursorline
```

### 4. Tab Management

```vim
" Setup development tabs
:tabnew | e src/main.js | vsp src/test.js
:tabnew | e docs/README.md
:tabnew | terminal

" Apply settings to all tabs
:tabdo windo set colorcolumn=80
:tabdo cd `git rev-parse --show-toplevel`

" Clean up tabs
:tabdo if tabpagenr('$') > 3 | tabclose | endif
```

## Practical Workflows

### 1. Code Review Workflow

```vim
" Load changed files
:args `git diff --name-only main`

" Open in splits for review
:all

" Apply review settings
:windo set number | set cursorline

" Search for issues
:windo /console\.log
:windo /TODO\|FIXME\|XXX

" Add review comments
:bufdo %s/REVIEW:/REVIEWED:/g | up
```

### 2. Multi-Language Project

```vim
" Python files
:bufdo if &ft == 'python' |
    \ %s/print(\(.*\))/logging.debug(\1)/g | up | endif

" JavaScript files
:bufdo if &ft == 'javascript' |
    \ %s/var /const /g | up | endif

" Markdown files
:bufdo if &ft == 'markdown' |
    \ %s/\[\([^\]]*\)\](\([^)]*\))/<a href="\2">\1<\/a>/g | up | endif

" Apply language-specific settings
:bufdo if &ft == 'python' | set expandtab shiftwidth=4 |
    \ elseif &ft == 'javascript' | set expandtab shiftwidth=2 | endif
```

### 3. Debugging Setup

```vim
" Create debugging layout
:e main.py
:vsp debug.log
:sp output.txt
:bot sp | terminal python -m pdb main.py

" Apply debug settings
:windo set autoread      " Auto-reload changed files
:windo set number        " Line numbers for reference

" Monitor all files
:bufdo if &ft != 'terminal' | set autoread | endif

" Search for breakpoints
:bufdo /breakpoint\|pdb\.set_trace\|debugger
```

### 4. Documentation Update

```vim
" Load all docs
:args docs/**/*.md

" Update copyright year
:argdo %s/Copyright 2023/Copyright 2024/g | up

" Update version numbers
:bufdo %s/v1\.0\.0/v2.0.0/g | up

" Fix markdown formatting
:argdo %s/^#\([^# ]\)/# \1/g | up  " Fix heading spacing

" Generate TOC for each file
:argdo if search('^## Table of Contents') == 0 |
    \ normal gg | put ='## Table of Contents' | put ='' | endif | up
```

## Performance Optimization

### 1. Efficient Batch Processing

```vim
" Disable expensive features during processing
function! FastBufferDo(command)
    let saved_ei = &eventignore
    let saved_ut = &updatetime
    set eventignore=all
    set updatetime=9999999

    execute 'bufdo ' . a:command

    let &eventignore = saved_ei
    let &updatetime = saved_ut
endfunction

command! -nargs=+ FastBufDo call FastBufferDo(<q-args>)
```

### 2. Selective Processing

```vim
" Process only modified buffers
:bufdo if &modified | %s/old/new/g | update | endif

" Process only visible buffers
:windo %s/old/new/g | update

" Process specific file types
:bufdo if index(['js', 'ts', 'jsx', 'tsx'], expand('%:e')) >= 0 |
    \ %s/;$//g | update | endif
```

### 3. Progress Feedback

```vim
" Show progress during long operations
function! BufDoWithProgress(command)
    let total = len(getbufinfo({'buflisted': 1}))
    let current = 0

    bufdo let current += 1 |
        \ echo 'Processing buffer ' . current . '/' . total . ': ' . expand('%') |
        \ execute a:command
endfunction

command! -nargs=+ BufDoProgress call BufDoWithProgress(<q-args>)
```

## Common Pitfalls and Solutions

### 1. Losing Current Position
**Problem**: :bufdo changes current buffer
```vim
" Solution: Save and restore position
let save_buf = bufnr('%')
bufdo command
execute 'buffer ' . save_buf
```

### 2. Operating on Wrong Scope
**Problem**: Using wrong do-command
```vim
" Understand the difference:
:bufdo   " ALL buffers (even hidden)
:windo   " Visible windows only
:argdo   " Argument list only
:tabdo   " All tabs

" Choose appropriately for your task
```

### 3. Forgetting to Save
**Problem**: Changes not persisted
```vim
" Always include update/write
:bufdo %s/old/new/g | update
" Not just:
:bufdo %s/old/new/g  " Changes lost!
```

### 4. Performance Issues
**Problem**: Slow on many buffers
```vim
" Solutions:
:set hidden           " Allow hidden modified buffers
:set noautocmd       " Disable autocmds temporarily
:silent bufdo command " Suppress output

" Or use functions with optimization
```

## Integration with Previous Lessons

### With Macros (Day 31)
```vim
" Record macro
qa
/pattern
cwreplacement<Esc>
q

" Apply to all buffers
:bufdo normal @a
:bufdo 100@a  " Run 100 times in each buffer
```

### With Visual Mode (Day 32)
```vim
" Visual block in all windows
:windo normal ggVG  " Select all in each window
:windo normal ggyG  " Yank all content
```

### With Search (Day 33)
```vim
" Search and replace across scopes
:bufdo %s/\<old\>/new/g | up
:windo %s/\<old\>/new/g
:argdo %s/\<old\>/new/g | up
```

### With Quickfix (Day 47)
```vim
" Process quickfix results
:vimgrep /error/ **/*.log
:cfdo %s/error/ERROR/g | up
```

## Quick Reference Card

```
Buffer Operations
═════════════════
:bufdo cmd          Execute in all buffers
:windo cmd          Execute in all windows
:tabdo cmd          Execute in all tabs
:argdo cmd          Execute in argument list
:cdo cmd            Execute on quickfix entries
:cfdo cmd           Execute on quickfix files

Common Patterns
═══════════════
:bufdo %s/old/new/g | up     Global replace
:windo set option             Set in all windows
:tabdo windo cmd              All windows, all tabs
:argdo normal @a | up         Macro on arglist
:cfdo %s/pat/rep/g | up       Fix quickfix matches

Optimization
════════════
:silent bufdo       Suppress output
:bufdo! cmd         Force execution
set hidden          Allow unsaved buffers
set eventignore=all Disable events

Conditionals
════════════
:bufdo if &ft == 'python' | cmd | endif
:bufdo if &modified | write | endif
:windo if winnr() > 2 | close | endif

Scope Selection
═══════════════
bufdo  → All loaded files
windo  → Visible windows
tabdo  → All tab pages
argdo  → Argument list subset
cdo    → Each quickfix entry
cfdo   → Each quickfix file
```

## Practice Goals

### Beginner (10 minutes)
- [ ] Use bufdo for simple replacements
- [ ] Apply settings with windo
- [ ] Understand scope differences
- [ ] Save changes with update

### Intermediate (20 minutes)
- [ ] Combine multiple operations
- [ ] Use conditional processing
- [ ] Create format-all workflow
- [ ] Handle different file types

### Advanced (30 minutes)
- [ ] Build complex refactoring commands
- [ ] Optimize for large buffer counts
- [ ] Create progress indicators
- [ ] Integrate with other features

## Mastery Checklist

- [ ] Choose correct scope instantly (bufdo/windo/argdo)
- [ ] Chain multiple operations efficiently
- [ ] Handle conditional processing fluently
- [ ] Never lose work with proper saving
- [ ] Create project-specific batch commands
- [ ] Optimize performance for large operations
- [ ] Integrate with quickfix and location lists
- [ ] Build reusable operation functions

Remember: Buffer operations are your force multipliers. They transform single-file edits into project-wide changes. Master the scopes, and you'll handle any scale of modification with ease!