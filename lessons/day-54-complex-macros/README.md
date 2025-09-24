# Day 54: Recording Complex Macros - Multi-Step Automation Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master complex, multi-step macro recording techniques
- Build conditional and recursive macros
- Create macros that work across files and buffers
- Debug and optimize macro performance
- Combine macros with registers, marks, and commands
- Build a library of reusable macro patterns

## Advanced Macro Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   COMPLEX MACRO SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 MACRO COMPONENTS                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  1. Setup Phase                                       │  │
│  │     └─ Position cursor, set marks, clear registers   │  │
│  │                                                       │  │
│  │  2. Search/Navigation Phase                           │  │
│  │     └─ Find target, position for operation           │  │
│  │                                                       │  │
│  │  3. Operation Phase                                   │  │
│  │     └─ Perform edits, transformations                 │  │
│  │                                                       │  │
│  │  4. State Management                                  │  │
│  │     └─ Save data to registers, update marks          │  │
│  │                                                       │  │
│  │  5. Iteration/Recursion                              │  │
│  │     └─ Position for next run, call self              │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 MACRO REGISTERS                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  q → Main macro                                      │  │
│  │  w → Helper macro (called by q)                      │  │
│  │  e → Error handler                                   │  │
│  │  r → Recursive component                             │  │
│  │  a-z → Data storage during execution                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Complex Macro Patterns

### 1. Multi-Phase Macros

```vim
" Pattern: Setup → Search → Operation → Cleanup

" Example: Convert functions to arrow functions
qa                   " Start recording to register a
^                    " Go to line start
/function<CR>        " Find next function
dw                   " Delete 'function'
f(                   " Find opening paren
i const<Esc>         " Insert const
F                    " Back to start of name
yiw                  " Yank function name
f)                   " To closing paren
a => <Esc>           " Add arrow
n                    " Next function (position for repeat)
q                    " Stop recording

" Run: 100@a         " Transform 100 functions
```

### 2. Conditional Macros

```vim
" Pattern: Check condition → Branch execution

" Example: Add semicolons only where missing
qa                   " Start recording
$                    " End of line
:if getline('.')[col('.')-1] != ';'<CR>
a;<Esc>              " Add semicolon
:endif<CR>
j                    " Next line
q                    " Stop recording

" More complex: Different actions based on content
qb
:let line = getline('.')<CR>
:if line =~ 'function'<CR>
Iexport <Esc>
:elseif line =~ 'class'<CR>
Iexport default <Esc>
:endif<CR>
j
q
```

### 3. Recursive Macros

```vim
" Pattern: Perform operation → Call self

" Example: Number all list items
:let i = 1
qq                   " Start recording to q
I<C-r>=i<CR>. <Esc> " Insert number
:let i += 1<CR>      " Increment counter
j                    " Next line
@q                   " Call itself (recursive)
q                    " Stop recording

" Clear and run
:let i = 1
@q                   " Numbers all lines until error

" Safe recursion with search
qr
/pattern<CR>         " Search for pattern
:if @/ != ''<CR>     " If found
cwreplacement<Esc>   " Make change
@r                   " Recurse
:endif<CR>
q
```

### 4. Cross-Buffer Macros

```vim
" Pattern: Collect → Switch buffer → Apply

" Example: Copy method names to documentation
qa
/function \w\+(<CR>  " Find function
"Ayiw                " Append name to register a
:bnext<CR>           " Next buffer
Go<C-r>a<Esc>        " Paste at end
:bprev<CR>           " Back to original
n                    " Next function
q

" Run across project
:bufdo normal @a
```

### 5. Data Processing Macros

```vim
" Pattern: Extract → Transform → Store

" Example: Convert CSV to JSON
qt                   " Transform line macro
I"<Esc>              " Quote start
f,                   " To comma
r"i": "<Esc>         " Replace with ": "
f,                   " Next comma
r"i", "<Esc>         " Replace with ", "
$a"<Esc>             " Quote end
q

qj                   " JSON wrapper macro
ggO{<Esc>            " Add opening brace
G$a}<Esc>            " Add closing brace
gg                   " Back to top
:g/^[^{}]/normal @t<CR>  " Transform all data lines
q
```

## Advanced Macro Techniques

### 1. Macro Composition

```vim
" Build complex macros from simple ones

" Component 1: Find and mark
qf
/TODO<CR>
mm                   " Mark position
q

" Component 2: Extract TODO
qe
'm                   " Go to mark
yy                   " Yank line
:e todos.txt<CR>     " Open TODO file
Gp                   " Paste at end
:b#<CR>              " Back to original
q

" Composite macro
qc
@f                   " Find and mark
@e                   " Extract
n                    " Next TODO
@c                   " Recurse
q
```

### 2. State Management in Macros

```vim
" Using registers as variables

" Counter macro
:let @c = 0          " Initialize counter
qa
:let @c = @c + 1<CR> " Increment
I<C-r>c. <Esc>       " Insert count
j
q

" Stack operations
qp                   " Push to stack
"Ayy                 " Append to register A
dd                   " Delete line
q

qo                   " Pop from stack
:put a<CR>           " Put from register a
:let @a = @a[:-2]<CR> " Remove last line
q
```

### 3. Error Handling

```vim
" Graceful failure patterns

" Safe search macro
qs
:try<CR>
/\v<error><CR>       " Search might fail
daw                  " Delete word
:catch<CR>
:echo 'Pattern not found'<CR>
:endtry<CR>
q

" Bounded recursion
:let @n = 100        " Max iterations
qb
:if @n > 0<CR>
:let @n = @n - 1<CR>
" ... operations ...
@b                   " Recurse
:endif<CR>
q
```

### 4. Interactive Macros

```vim
" Get user input during execution

qi
:let choice = confirm('Process this line?', "&Yes\n&No\n&All")<CR>
:if choice == 1<CR>
" Process single line
dd
:elseif choice == 3<CR>
" Process all
dG
:endif<CR>
q

" Parameter-driven macros
:let @p = input('Enter prefix: ')
qx
I<C-r>p<Esc>         " Insert prefix
j
q
```

## Practical Macro Workflows

### 1. Refactoring Workflow

```vim
" Convert class methods to arrow functions
qa
/^\s*\<\w\+\s*(<CR>        " Find method
^dw                        " Delete indentation
iconst <Esc>               " Add const
f(i = <Esc>                " Convert to arrow
f{i => <Esc>               " Arrow function
j
@a                         " Recursive
q

" Extract interface from class
qe
/class \w\+<CR>            " Find class
yiw                        " Copy name
Ointerface I<C-r>"<Esc>    " Create interface
/{<CR>%                    " Go to class end
o}<Esc>                    " Close interface
q
```

### 2. Documentation Generation

```vim
" Generate JSDoc from function signature
qd
/function \w\+(<CR>        " Find function
O/**<Esc>                  " Start JSDoc
o * <Esc>                  " Description line
:let params = matchstr(getline(line('.')+2), '(\zs.*\ze)')
:for param in split(params, ',')
o * @param {type} <C-r>=trim(param)<CR>
:endfor
o * @returns {type}<Esc>
o */<Esc>
j
q

" Generate README sections
qr
gg                         " Top of file
o## Table of Contents<Esc>
o<Esc>
:g/^##\s/t$                " Copy all headers
:$<CR>
:'[,']s/## /- [/g
:'[,']s/$/](#)/g
q
```

### 3. Data Transformation

```vim
" CSV to SQL INSERT statements
qs
I INSERT INTO table VALUES (<Esc>
$a);<Esc>
:s/,/', '/g<CR>
I'<Esc>$i'<Esc>
j
q

" JSON formatting
qj
:%s/,/,\r/g<CR>            " Newline after commas
:%s/{/{\r/g<CR>            " Newline after braces
:%s/}/\r}/g<CR>            " Newline before braces
gg=G                       " Indent everything
q

" Log parsing
ql
/ERROR<CR>                 " Find error
V/^\d\d\d\d-<CR>          " Select until next timestamp
"ay                        " Yank to register a
:e errors.log<CR>          " Open error file
"ap                        " Paste
:b#<CR>                    " Back
n                          " Next error
@l                         " Recurse
q
```

### 4. Testing Workflow

```vim
" Generate test cases from functions
qt
/function \(\w\+\)(<CR>    " Find function
yiw                        " Copy name
:e test.js<CR>            " Open test file
Odescribe('<C-r>"', () => {<Esc>
o  it('should work', () => {<Esc>
o    expect(<C-r>"()).toBe();<Esc>
o  });<Esc>
o});<Esc>
:b#<CR>                    " Back
n                          " Next function
q

" Add console.log debugging
qc
/\<\(let\|const\|var\) \(\w\+\)<CR>
yiw                        " Copy variable name
oconsole.log('<C-r>":', <C-r>");<Esc>
n
@c
q
```

## Macro Optimization

### 1. Performance Tips

```vim
" Avoid expensive operations in loops
" Bad:
qa :w<CR> j q              " Saves every line

" Good:
qa j q                     " Just navigate
:wa                        " Save once after

" Use native commands when possible
" Bad:
qa dd j q                  " Delete lines one by one

" Good:
:g/pattern/d               " Delete all at once

" Minimize mode switches
" Bad:
qa i text <Esc> j i more <Esc> q

" Good:
qa i text^Mmore<Esc> j q   " Single insert
```

### 2. Debugging Macros

```vim
" Step-by-step execution
:set lazyredraw!          " Toggle to see each step
:redraw!                  " Force redraw during macro

" Inspect macro content
:registers a              " View macro in register a
:let @a = substitute(@a, '\^M', '\n', 'g')  " Make readable

" Test on single line first
qa " macro content" q
@a                        " Test once
u                         " Undo
@a                        " Refine and test

" Add debug output
qa
:echom 'Processing line ' . line('.')
" ... macro operations ...
q
```

### 3. Macro Libraries

```vim
" Save useful macros
:let @f = 'macro for formatting'
:let @r = 'macro for refactoring'
:let @t = 'macro for testing'

" Store in vimrc
let @f = 'saved formatting macro'

" Load from file
:source ~/macros/refactoring.vim

" Create macro menu
:menu Macros.Format @f
:menu Macros.Refactor @r
:menu Macros.Test @t
```

## Common Pitfalls and Solutions

### 1. Macro Breaks on Edge Cases
**Problem**: Macro fails on unexpected input
```vim
" Solution: Add error handling
qa
:try | /pattern | catch | j | endtry
" operations
q
```

### 2. Infinite Recursion
**Problem**: Recursive macro never stops
```vim
" Solution: Add termination condition
:let @c = 100     " Counter
qa
:if @c > 0 | let @c -= 1 | ... | @a | endif
q
```

### 3. Register Pollution
**Problem**: Macros overwrite important registers
```vim
" Solution: Use specific registers
qz                " Use z for temporary
"_dd              " Delete to black hole
"ayy              " Explicit register use
q
```

### 4. Lost Macro State
**Problem**: Macro state lost between runs
```vim
" Solution: Persist in variables
:let g:macro_state = {}
qa
:let g:macro_state.count = get(g:macro_state, 'count', 0) + 1
q
```

## Integration with Previous Lessons

### With Search (Day 53)
```vim
" Complex search in macros
qa
/\v<(class|function)><CR>
Iexport <Esc>
n
@a
q
```

### With Buffers (Day 52)
```vim
" Cross-buffer macro
qa
"ayy              " Yank line
:bnext<CR>        " Next buffer
"ap               " Paste
:bprev<CR>        " Back
j
q
```

### With Marks (Day 49)
```vim
" Mark-based navigation
qa
mm                " Mark start
/pattern<CR>      " Find target
d'm               " Delete to mark
q
```

### With Registers (Day 29)
```vim
" Register accumulation
qa
"Ayy              " Append to register
j
@a
q
```

## Quick Reference Card

```
Macro Recording
═══════════════
q{reg}          Start recording
q               Stop recording
@{reg}          Play macro
@@              Repeat last macro
{count}@{reg}   Play count times

Advanced Patterns
═════════════════
@:              Repeat last command
"ap             Paste macro content
:let @a='...'   Set macro directly
:reg a          View macro

Recursive Macros
════════════════
qa ... @a q     Self-calling macro
:let @n=100     Set counter
@n              Execute n times

Macro Editing
═════════════
"ap             Paste to edit
"ayy            Yank back to register
:let @a=@a.'j'  Append to macro

Common Patterns
═══════════════
qa j q          Simple iteration
qa /pat<CR> q   Search-based
qa ... n q      Process and next
qa ... @a q     Recursive

Debugging
═════════
:reg {reg}      Inspect macro
:set lazyredraw Toggle animation
:messages       View echoed output
```

## Practice Goals

### Beginner (15 minutes)
- [ ] Create multi-step refactoring macros
- [ ] Use registers within macros
- [ ] Build search-based macros
- [ ] Debug macro execution

### Intermediate (25 minutes)
- [ ] Create recursive macros safely
- [ ] Build cross-buffer workflows
- [ ] Use conditional logic in macros
- [ ] Compose macros from components

### Advanced (35 minutes)
- [ ] Build state-managing macros
- [ ] Create interactive macros
- [ ] Optimize macro performance
- [ ] Build macro libraries

## Mastery Checklist

- [ ] Design complex macros before recording
- [ ] Use recursive patterns safely
- [ ] Manage macro state with registers
- [ ] Debug and optimize macro execution
- [ ] Build reusable macro components
- [ ] Handle errors gracefully in macros
- [ ] Create project-specific macro libraries
- [ ] Never repeat complex operations manually

Remember: Complex macros are programs within Vim. They can handle sophisticated workflows, make decisions, and process data. Master them, and you'll automate tasks that would take hours manually!