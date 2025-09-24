# Day 34: Global Commands - Power Operations

## Learning Objectives

By the end of this lesson, you will:
- Master the `:global` and `:vglobal` commands
- Understand how global commands execute operations on pattern matches
- Learn to combine global with other Ex commands
- Build complex multi-step text processing workflows
- Create powerful filtering and transformation operations

## The Global Command Architecture

### Mental Model: Pattern-Driven Command Executor

The global command is a **pattern-driven command executor**. Think of it as:
- **Line Scanner**: Examines every line in range
- **Pattern Matcher**: Tests each line against a pattern
- **Command Executor**: Runs commands on matching lines
- **Workflow Engine**: Chains operations for complex transformations

```
┌────────────────────────────────────────────┐
│         GLOBAL COMMAND FLOW                │
├────────────────────────────────────────────┤
│  :[range]g/pattern/command                 │
│                                            │
│  1. Scan lines in range                   │
│     ↓                                      │
│  2. Mark lines matching pattern           │
│     ↓                                      │
│  3. Execute command on marked lines       │
│                                            │
│  :g  → Execute on matching lines          │
│  :v  → Execute on NON-matching lines      │
│      (equivalent to :g!)                  │
└────────────────────────────────────────────┘
```

## Core Global Command Patterns

### 1. Basic Global Operations

```vim
" Syntax: :[range]g/pattern/command

" Delete all lines containing 'TODO'
:g/TODO/d

" Delete all blank lines
:g/^$/d

" Delete lines NOT containing 'keep'
:v/keep/d
" or
:g!/keep/d

" Print all lines with 'error' (with line numbers)
:g/error/p
:g/error/#      " Just line numbers
```

### 2. Global with Different Commands

```vim
" Move commands
:g/^Chapter/m0          " Move chapters to top
:g/^Section/m$          " Move sections to bottom

" Copy commands
:g/pattern/t$           " Copy matching lines to end
:g/^test/t0            " Copy test lines to beginning

" Substitute on matching lines only
:g/class/s/old/new/g    " Replace only in lines with 'class'

" Normal mode commands
:g/TODO/normal A - URGENT    " Append to TODO lines
:g/^/normal I// " Comment out error lines
```

### 3. Inverse Operations with :v (vglobal)

```vim
" :v is :g! (inverse global)
" Operates on lines NOT matching pattern

" Keep only lines with pattern
:v/pattern/d            " Delete all except pattern lines

" Add to lines missing something
:v/;$/normal A;         " Add semicolon where missing

" Process non-empty lines
:v/^$/s/^/# /          " Add # to non-empty lines
```

### 4. Range Control

```vim
" Global with different ranges
:10,20g/pattern/d       " In lines 10-20
:.,$g/pattern/d         " From current to end
:'a,'bg/pattern/d       " Between marks
:g/start/,/end/d        " Delete blocks from start to end

" Nested ranges
:g/^class/+1,/^}/d      " Delete class bodies
```

## Advanced Global Workflows

### Workflow 1: Code Organization

```vim
" Sort functions alphabetically
:g/^function/,/^}/.!sort

" Move all imports to top
:g/^import/m0

" Group similar lines
:g/^const/m/^const/-1    " Group all const declarations

" Extract all functions to new file
:g/^function/,/^}$/w functions.js
```

### Workflow 2: Data Processing

```vim
" Process log file
:g/ERROR/w errors.log     " Extract errors
:g/WARNING/d              " Remove warnings
:g/^2024/s/^/[NEW] /     " Mark 2024 entries

" Format data
:g/^\d/s/^/Line /         " Add prefix to numbered lines
:g/^/s/$/,/              " Add comma to line ends
:g/,$/s/,$//             " Remove trailing commas
```

### Workflow 3: Code Analysis

```vim
" Find and number all TODOs
:let n=1 | g/TODO/s/TODO/\='TODO['.n.']'/ | let n+=1

" Count occurrences
:let count=0 | g/pattern/let count+=1 | echo count

" Collect matching lines in register
:let @a='' | g/pattern/y A

" Show context around matches
:g/error/-1,+1p          " Show line before and after
```

## Complex Global Operations

### 1. Chained Commands

```vim
" Multiple commands with |
:g/pattern/d | s/old/new/g | normal gUU

" Complex processing
:g/^function/+1 mark a | /^}/-1 mark b | 'a,'b>

" Conditional operations
:g/TODO/if getline('.') =~ 'URGENT' | d | endif
```

### 2. Global with Substitution

```vim
" Different substitution per pattern
:g/^#/s/$/  <!-- heading -->/
:g/^-/s/^/  * /           " Convert - lists to * lists

" Incremental numbering
:let n=1 | g/^Item/s/^/\=n.'. '/ | let n+=1

" Context-aware replacement
:g/function/s/var/let/g   " Only in functions
```

### 3. Global for Navigation

```vim
" Create quickfix list from matches
:g/pattern/caddexpr expand('%').':'.line('.').':'.getline('.')

" Jump between matches
:g/pattern/mark A        " Mark all matches
'A                       " Jump to marks

" List all matches with context
:g/pattern/?^function?;+5p
```

### 4. Recursive Global

```vim
" Delete paragraphs containing word
:g/badword/,/^$/d

" Process nested structures
:g/{/+1,/}/-1>          " Indent between braces

" Clean up multiple blank lines
:g/^$/,/\S/-1d          " Reduce to single blank

" Remove code blocks with pattern
:g/deprecated/normal {V}d
```

## Practical Examples

### Example 1: Comment Management

```vim
" Remove all single-line comments
:g/^\s*\/\//d

" Convert single to multi-line comments
:g/^\/\//s/\/\//\/* /|s/$/ *\//

" Extract all comments to review
:g/\/\//y A
:new | put a

" Toggle comments
:g/^/s/^/\/\/ /         " Comment all
:g/^\/\/ /s/\/\/ //     " Uncomment all
```

### Example 2: Code Refactoring

```vim
" Convert old-style to new-style
:g/^var /s/var/const/

" Add async to all functions with await
:g/await/,/^function/-1s/function/async function/

" Remove console.log statements
:g/console\.log/d

" Wrap in try-catch
:g/^async function/normal {O try {jo} catch(e) {}k
```

### Example 3: Documentation Generation

```vim
" Extract function signatures
:g/^function/t$ | s/function \(\w\+\).*/- \1()/

" Generate table of contents
:g/^#/t0 | s/#\+/-/g

" Create index from headings
:let n=1 | g/^##/s/^/\=n.'. '/ | let n+=1
```

## Interactive Global Commands

### 1. Confirmation Mode

```vim
" Confirm each deletion
:g/pattern/d_

" Interactive substitution on matching lines
:g/class/s/old/new/gc

" Review before executing
:g/pattern/p            " Review matches first
:g/pattern/d            " Then delete
```

### 2. Building Complex Globals

```vim
" Start simple, add complexity
:g/pattern/p            " Find matches
:g/pattern/-1,+1p       " Check context
:g/pattern/command      " Apply command

" Test on subset first
:1,10g/pattern/command  " Test on first 10 lines
:%g/pattern/command     " Apply to whole file
```

## Practice Exercises

### Exercise 1: Log File Processing

```vim
" Sample log:
2024-01-01 INFO: Application started
2024-01-01 ERROR: Database connection failed
2024-01-01 DEBUG: Variable x = 5
2024-01-01 WARNING: Memory usage high
2024-01-01 ERROR: Invalid user input

" Tasks:
" 1. Remove all DEBUG lines
" 2. Move ERROR lines to top
" 3. Add line numbers to remaining
" 4. Count each log level
```

### Exercise 2: Code Cleanup

```javascript
// Clean up this code:
function oldFunc() {
    console.log("debug");
    var x = 5;
    // TODO: refactor this
    var y = 10;
    console.log("test");
    return x + y;
}

var data = [];
// TODO: implement
function newFunc() {
    console.log("debug");
}
```

### Exercise 3: Data Transformation

```csv
// Transform this data:
name,age,city
john,30,NYC
jane,25,LA
bob,35,CHI

// Into:
Person: john (30) from NYC
Person: jane (25) from LA
Person: bob (35) from CHI
```

## Common Pitfalls & Solutions

### Pitfall 1: Command Affects Line Numbers
**Problem**: Deletions change line positions
**Solution**: Global marks lines first, then executes
```vim
" This works correctly:
:g/pattern/d      " All marked lines deleted

" Not this:
:1,10g/pattern/+1d  " Line numbers shift
```

### Pitfall 2: Escaping in Patterns
**Problem**: Special characters in patterns
**Solution**: Escape or use different delimiters
```vim
:g/\//d           " Delete lines with /
:g#/#d            " Alternative delimiter
```

### Pitfall 3: Multiple Commands
**Problem**: Can't chain some commands
**Solution**: Use execute or normal
```vim
:g/pattern/execute "normal dd" | execute "put"
:g/pattern/normal! {commands}
```

## Real-World Applications

### 1. Code Review
Extract all TODOs, FIXMEs, and review comments for processing.

### 2. Log Analysis
Filter, categorize, and analyze log files by patterns.

### 3. Batch Refactoring
Apply systematic changes across codebases.

### 4. Documentation
Generate indexes, tables of contents, and summaries.

## Practice Goals

### Beginner (20 mins)
- [ ] Use :g for basic deletion
- [ ] Master :v for inverse operations
- [ ] Apply different commands (d, p, m, t)
- [ ] Work with simple patterns

### Intermediate (30 mins)
- [ ] Combine global with substitution
- [ ] Use normal mode commands in global
- [ ] Apply range modifications
- [ ] Chain multiple operations

### Advanced (40 mins)
- [ ] Create complex workflows
- [ ] Use variables and expressions
- [ ] Build recursive operations
- [ ] Generate reports with global

## Quick Reference Card

```
BASIC SYNTAX
:g/pattern/command   Execute on matching lines
:v/pattern/command   Execute on NON-matching
:g!/pattern/command  Same as :v

COMMON COMMANDS
d  Delete
p  Print
m  Move
t  Copy (transfer)
s  Substitute
>  Indent
normal  Execute normal commands

RANGES
:%g/    Entire file
:10,20g Lines 10-20
:.,$g   Current to end
:'<,'>g Visual selection

ADVANCED
:g/p1/,/p2/command      Pattern ranges
:g/p/command1|command2  Multiple commands
:g/p/+1,+5command       Relative ranges

EXAMPLES
:g/^$/d              Delete blank lines
:v/pattern/d         Keep only pattern
:g/TODO/m$           Move TODOs to end
:g/^/normal I//      Comment all lines
```

## Connection to Other Lessons

**Previous**: Day 33's substitute command is often used within global operations.

**Next**: Day 35 will explore visual block editing, another way to apply operations to multiple locations.

**Related Concepts**:
- Pattern matching (Day 22) essential for global commands
- Ex commands knowledge enhances global usage
- Macros (Day 31) can be combined with global

## Summary

Global commands transform Vim into a sophisticated text processing tool, enabling pattern-based operations at scale. Master global to:
- Process files based on content patterns
- Reorganize code and data systematically
- Filter and transform text efficiently
- Automate complex multi-step operations

Remember: Global commands are about *selective execution*—applying operations precisely where patterns match, turning Vim into a programmable text processor.