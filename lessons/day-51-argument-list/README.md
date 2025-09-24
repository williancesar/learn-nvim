# Day 51: Argument List - Batch File Operations Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master Vim's argument list for batch file operations
- Understand the difference between argument list and buffer list
- Execute commands across multiple files efficiently
- Build workflows for project-wide refactoring
- Create powerful file processing pipelines
- Integrate argument list with other Vim features

## The Argument List Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         VIM MEMORY                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │    ARGUMENT LIST       │  │      BUFFER LIST         │  │
│  ├────────────────────────┤  ├──────────────────────────┤  │
│  │  [1] main.js    ←──────┼──┼→ {1} main.js             │  │
│  │  [2] utils.js   ←──────┼──┼→ {2} utils.js            │  │
│  │  [3] config.json ←─────┼──┼→ {3} config.json         │  │
│  │                        │  │  {4} README.md           │  │
│  │                        │  │  {5} test.js             │  │
│  └────────────────────────┘  └──────────────────────────┘  │
│                                                              │
│  Argument List ⊆ Buffer List                                 │
│  - Focused subset for batch operations                       │
│  - Independent navigation                                    │
│  - Powerful :argdo command                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Argument List Commands

### Managing the Argument List

```vim
" Display argument list
:args               " Show current argument list
:ar                 " Short form

" Set argument list
:args file1 file2   " Set specific files
:args *.js          " Set with glob pattern
:args **/*.py       " Recursive glob
:args `find . -name "*.rb"`  " Command substitution

" Add to argument list
:argadd file.txt    " Add file to list
:arga file.txt      " Short form
:argadd *.css       " Add multiple files

" Remove from argument list
:argdelete file     " Remove file
:argd file          " Short form
:argd *.tmp         " Remove by pattern
:%argd              " Clear entire list
```

### Navigating the Argument List

```vim
" Movement commands
:next               " Go to next file in arglist
:n                  " Short form
:n!                 " Force (discard changes)
:wnext              " Write and next
:wn                 " Short form

:previous           " Go to previous file
:prev               " Short form
:N                  " Shorter form
:wprevious          " Write and previous

:first              " Go to first file
:rewind             " Alternative
:rew                " Short form

:last               " Go to last file

:argument N         " Go to Nth argument
:argu N             " Short form

" Quick navigation
:n3                 " Next 3 files
:3n                 " Same as above
```

### Argument List Information

```vim
" Current position
:args               " Shows [file] for current
:echo argc()        " Number of arguments
:echo argv()        " List of arguments
:echo argv(0)       " First argument
:echo argidx()      " Current index (0-based)

" Marks in arglist
[{                  " Jump to first line of previous file
]}                  " Jump to first line of next file
```

## The Power of :argdo

### Basic Batch Operations

```vim
" Execute command on all files
:argdo %s/old/new/g     " Replace in all files
:argdo %s/old/new/gc    " With confirmation
:argdo normal @a        " Run macro on all
:argdo write           " Save all files

" With update flag (auto-save)
:argdo %s/old/new/g | update
:argdo %s/old/new/g | up

" Conditional execution
:argdo if search('TODO') | echo expand('%') | endif
```

### Advanced Batch Processing

```vim
" Complex refactoring
:args **/*.js
:argdo %s/var /const /g | %s/function/const/g | update

" Add headers to all files
:argdo 0put ='// Copyright 2024' | update

" Format all files
:argdo normal gg=G | update

" Run external formatter
:argdo %!prettier --write % | update

" Selective processing
:argdo if &ft == 'javascript' | %s/;$//g | update | endif
```

## Practical Workflows

### 1. Project-Wide Refactoring

```vim
" Rename a function across project
:args **/*.py
:argdo %s/\<old_function\>/new_function/g | update

" Update import statements
:args src/**/*.js
:argdo %s/from 'old-module'/from 'new-module'/g | up

" Change API endpoints
:args **/*.{js,ts}
:argdo %s/api\/v1/api\/v2/g | update
```

### 2. Code Review Workflow

```vim
" Load files changed in branch
:args `git diff --name-only main`

" Review each file
:first              " Start at beginning
/TODO               " Search for TODOs
:wnext              " Save and next
/FIXME              " Search for FIXMEs
:wnext              " Continue...

" Add review comments
:argdo %s/TODO/TODO(reviewed)/g | up
```

### 3. Bulk File Processing

```vim
" Convert line endings
:args **/*.txt
:argdo set ff=unix | update

" Change file encoding
:args *.html
:argdo set fileencoding=utf-8 | update

" Remove trailing whitespace
:args **/*.{c,h}
:argdo %s/\s\+$//e | update

" Add file headers
:argdo 0put ='#!/usr/bin/env python3' | 1put ='' | update
```

### 4. Testing Workflow

```vim
" Load all test files
:args test/**/*_test.py

" Run tests and check output
:argdo !python % | grep FAIL

" Fix common test issues
:argdo %s/assertEquals/assertEqual/g | up

" Update test imports
:argdo %s/^import unittest/from unittest import TestCase/g | up
```

## Argument List vs Buffer List

### Key Differences

```vim
" Buffer list: All loaded files
:ls                 " Shows all buffers
:b name             " Jump by name/number
:bd                 " Delete buffer

" Argument list: Focused subset
:args               " Shows argument files
:n                  " Sequential navigation
:argd               " Remove from arglist

" Relationships
" - Files in arglist are also in buffer list
" - Not all buffers are in arglist
" - Arglist maintains order
" - Buffers have no inherent order
```

### When to Use Each

```vim
" Use BUFFERS when:
" - Jumping between files randomly
" - Keeping files open for reference
" - Working with unnamed buffers
:b config           " Quick jump to config

" Use ARGLIST when:
" - Processing files sequentially
" - Performing batch operations
" - Working through a specific set
:argdo %s/old/new/g | up  " Batch replace
```

## Advanced Argument List Techniques

### 1. Local Argument Lists

```vim
" Each window can have its own arglist
:split
:argl **/*.md       " Local arglist for this window
:n                  " Navigate markdown files

Ctrl-w w            " Other window
:argl **/*.js       " Different arglist here
:n                  " Navigate JavaScript files
```

### 2. Argument List Manipulation

```vim
" Reorder argument list
:args file3 file1 file2

" Filter argument list
:args `ls *.js | grep -v test`

" Expand argument list
:args *.js
:argadd *.css
:argadd *.html

" Create from buffer list
:bufdo argadd %

" Create from quickfix
:cdo argadd %
```

### 3. Integration with Shell Commands

```vim
" Process with external tools
:argdo !eslint %
:argdo !python -m py_compile %

" Collect results
:argdo !grep -n TODO % >> todos.txt

" Conditional processing
:argdo if system('file ' . expand('%')) =~ 'text' |
    \ %s/\r//g | update | endif
```

### 4. Custom Commands

```vim
" Define useful commands
command! -nargs=* ArgsFromGit args `git ls-files <args>`
command! ArgsFromModified args `git diff --name-only`
command! ArgsFromStaged args `git diff --cached --name-only`

" Usage
:ArgsFromGit *.js
:ArgsFromModified
:ArgsFromStaged
```

## Practical Exercises

### Exercise 1: Basic Argument List Navigation

```bash
# Setup files
for i in {1..5}; do echo "File $i content" > file$i.txt; done
```

Practice:
1. `vim file1.txt file2.txt file3.txt`
2. `:args` - View argument list
3. `:n` - Go to next file
4. `:N` - Go to previous
5. `:last` - Go to last file
6. `:first` - Go to first
7. `:argu 2` - Go to second file

### Exercise 2: Batch Search and Replace

```bash
# Create test files
echo "var x = 1;" > test1.js
echo "var y = 2;" > test2.js
echo "var z = 3;" > test3.js
```

Practice:
1. `vim *.js`
2. `:args` - Verify files loaded
3. `:argdo %s/var/const/g` - Replace in all
4. `:first` - Check first file
5. `:n` - Check others
6. `:argdo update` - Save all

### Exercise 3: Project Refactoring

```bash
# Create project structure
mkdir -p project/{src,test,docs}
echo "oldFunction()" > project/src/main.js
echo "oldFunction()" > project/src/utils.js
echo "test oldFunction" > project/test/test.js
```

Practice:
1. `vim`
2. `:args project/**/*.js`
3. `:argdo %s/oldFunction/newFunction/g`
4. `:argdo up`
5. Verify changes with `:!grep newFunction project/**/*.js`

### Exercise 4: Selective Processing

```vim
" Load mixed files
:args *.{js,html,css,md}

" Process only JavaScript files
:argdo if expand('%:e') == 'js' | %s/;$//g | update | endif

" Process only HTML files
:argdo if expand('%:e') == 'html' | %s/<br>/<br\/>/g | up | endif

" Add headers based on file type
:argdo if &ft == 'python' | 0put ='#!/usr/bin/env python3' |
    \ elseif &ft == 'sh' | 0put ='#!/bin/bash' | up | endif
```

### Exercise 5: Complex Workflow

```vim
" Code review workflow
:args `git diff --name-only HEAD~5`

" Check each file for issues
:argdo if search('console.log') |
    \ echo expand('%') . ' has console.log' | endif

" Fix issues
:argdo %s/console\.log/\/\/ console.log/g | up

" Generate report
:argdo !echo % >> review-report.txt &&
    \ grep -n 'TODO\|FIXME' % >> review-report.txt

" Final check
:n review-report.txt
```

## Common Pitfalls and Solutions

### 1. Losing Unsaved Changes
**Problem**: `:argdo` without update loses changes
```vim
" Wrong
:argdo %s/old/new/g
:next  " Changes lost!

" Correct
:argdo %s/old/new/g | update
```

### 2. Argument List Confusion
**Problem**: Mixing arglist and buffer commands
```vim
" Clarify your intent
:args               " Check what's in arglist
:ls                 " Check what's in buffers
:bufdo vs :argdo    " Choose appropriate command
```

### 3. Pattern Matching Issues
**Problem**: Glob patterns not matching expected files
```vim
" Debug patterns
:!ls *.js           " Test in shell first
:args *.js          " Then use in Vim

" Use ** for recursive
:args **/*.js       " All JS files recursively
```

### 4. Performance with Large Sets
**Problem**: Processing hundreds of files is slow
```vim
" Solutions:
" 1. Process in batches
:args `find . -name "*.js" | head -50`
:argdo command
:args `find . -name "*.js" | tail -50`

" 2. Use more specific patterns
:args src/**/*.js   " Not **/*.js

" 3. Disable syntax for speed
:argdo syntax off | command | syntax on
```

## Integration with Previous Lessons

### With Buffers (Day 43)
```vim
" Convert buffers to arglist
:bufdo argadd %

" Convert arglist to buffers
:argdo badd %
```

### With Windows (Day 44)
```vim
" View multiple arglist files
:all                " Open all args in windows
:vertical all       " Open all in vertical splits
:tab all           " Open all in tabs
```

### With Quickfix (Day 47)
```vim
" Create arglist from quickfix
:vimgrep /pattern/ **/*.js
:cdo argadd %

" Run grep on arglist
:argdo vimgrep /TODO/ %
```

### With Sessions (Day 50)
```vim
" Save arglist with session
:set sessionoptions+=globals
:let g:my_arglist = argv()
:mksession

" Restore arglist
:source Session.vim
:exe 'args ' . join(g:my_arglist)
```

## Quick Reference Card

```
Argument List Commands
══════════════════════
:args               Show argument list
:args files         Set argument list
:argadd file        Add to list
:argdelete file     Remove from list
:%argd              Clear list

Navigation
══════════
:next (:n)          Next file
:previous (:N)      Previous file
:first (:rew)       First file
:last               Last file
:argument N         Go to Nth file
:wnext              Write and next

Batch Operations
════════════════
:argdo cmd          Execute on all files
:argdo cmd | up     Execute and save
:windo argadd %     Window files to arglist
:bufdo argadd %     Buffer files to arglist

Information
═══════════
argc()              Number of arguments
argv()              List of arguments
argv(N)             Nth argument
argidx()            Current index

Patterns
════════
*.js                Match in current dir
**/*.js             Recursive match
*.{js,css}          Multiple extensions
`cmd`               Command substitution

Common Workflows
════════════════
:args **/*.py                      Load Python files
:argdo %s/old/new/g | up          Replace in all
:argdo normal @a | up             Run macro
:argdo !formatter % | up          External format
```

## Practice Goals

### Beginner (10 minutes)
- [ ] Navigate argument list with :n and :N
- [ ] Add and remove files from arglist
- [ ] Perform simple :argdo operations
- [ ] Understand args vs buffers difference

### Intermediate (20 minutes)
- [ ] Use glob patterns effectively
- [ ] Perform complex batch replacements
- [ ] Create project-wide refactoring workflow
- [ ] Integrate with version control

### Advanced (30 minutes)
- [ ] Build custom arglist commands
- [ ] Handle mixed file types intelligently
- [ ] Create code review workflow
- [ ] Optimize large-scale operations

## Mastery Checklist

- [ ] Can load any set of files into arglist instantly
- [ ] Perform batch operations without thinking
- [ ] Navigate argument list efficiently
- [ ] Understand when to use args vs buffers
- [ ] Create custom workflows with argdo
- [ ] Never manually edit multiple files again
- [ ] Integrate arglist with other Vim features
- [ ] Build project-specific batch commands

Remember: The argument list is your batch processor. While buffers are for random access, the argument list is for sequential processing. Master it, and transform repetitive edits into single commands!