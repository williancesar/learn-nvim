# Day 31: Macro Recording - Automation Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master recording and executing macros with `q` and `@`
- Understand macros as recorded keystrokes in registers
- Learn to edit and debug macros effectively
- Build recursive and nested macro patterns
- Create reusable automation workflows for complex tasks

## Understanding Macros

### Mental Model: Recorded Automation

Macros are **recorded sequences of keystrokes** stored in registers. Think of them as:
- **Recording**: Capturing your exact keyboard actions
- **Playback**: Replaying those actions exactly
- **Automation**: Turning repetitive tasks into single commands

```
┌────────────────────────────────────────────┐
│              MACRO WORKFLOW                │
├────────────────────────────────────────────┤
│   1. RECORD                                │
│   qa         Start recording into 'a'      │
│   [actions]  Your keystrokes               │
│   q          Stop recording                │
│                                             │
│   2. EXECUTE                               │
│   @a         Run macro from register 'a'   │
│   @@         Repeat last macro             │
│   5@a        Run macro 5 times             │
│                                             │
│   3. EDIT (Advanced)                       │
│   "ap        Paste macro to edit           │
│   [edit]     Modify the commands           │
│   "ayy       Yank back to register         │
└────────────────────────────────────────────┘
```

## Core Macro Operations

### 1. Recording Basics

```vim
q{register}  " Start recording into register
q            " Stop recording
@{register}  " Execute macro from register
@@           " Repeat last executed macro
```

**Example: Simple Transformation**
```vim
" Task: Add semicolon to end of lines
qa          " Start recording in register a
A;<Esc>     " Append semicolon and escape
j           " Move to next line
q           " Stop recording
@a          " Execute on next line
5@@         " Execute 5 more times
```

### 2. The Macro Lifecycle

```vim
" Step 1: Plan your actions
" - What needs to change?
" - What pattern to follow?
" - Where to position cursor after?

" Step 2: Record cleanly
qa          " Start recording
0           " Ensure consistent starting position
[actions]   " Your transformation
j           " Position for next iteration
q           " Stop

" Step 3: Test once
@a          " Verify it works

" Step 4: Apply broadly
10@a        " Run 10 times
:%norm @a   " Run on all lines
```

### 3. Viewing and Editing Macros

```vim
" View macro contents
:reg a      " Show register a content
:put a      " Paste macro content to buffer

" Edit a macro
"ap         " Paste macro as text
[edit]      " Modify the sequence
"ayy        " Yank back to register
```

## Practical Macro Patterns

### Pattern 1: Data Transformation

```vim
" Before:
John,Doe,30
Jane,Smith,25
Bob,Johnson,35

" Goal: Transform to JSON objects
" Record macro:
qa
0                      " Start of line
i{"firstName":"<Esc>   " Insert JSON start
f,                     " Find comma
r"                     " Replace with quote
a,"lastName":"<Esc>   " Add lastName field
f,                     " Find next comma
r"                     " Replace with quote
a,"age":<Esc>         " Add age field
A}<Esc>               " Close object
j                      " Next line
q

" Execute:
@a          " Transform second line
@@          " Transform third line
```

### Pattern 2: Code Generation

```vim
" Generate getters/setters from field list:
" private String name;
" private int age;

" Macro for getter:
qa
yiw                    " Yank field name
oopublic get<Esc>      " Start getter
~hea() {<Esc>          " Capitalize, add parentheses
oreturn this.<Esc>
pa;<Esc>               " Paste field name
o}<Esc>                " Close method
j                      " Next field
q
```

### Pattern 3: Incremental Changes

```vim
" Number items incrementally:
" item
" item
" item

" Macro with counter:
:let i = 1
qa
I<C-r>=i<CR>. <Esc>
:let i += 1<CR>
j
q

" Result:
" 1. item
" 2. item
" 3. item
```

## Advanced Macro Techniques

### 1. Recursive Macros

```vim
" Clear register first
qaq         " Clear register a

" Record recursive macro
qa
[action]    " Your transformation
@a          " Call itself (will fail first time)
q

" Execute (will run until error)
@a
```

**Example: Process until pattern not found**
```vim
" Remove all trailing spaces
qaq                " Clear register a
qa                 " Start recording
/\s\+$<CR>         " Search trailing spaces
d$                 " Delete to end of line
@a                 " Recursive call
q                  " End recording
@a                 " Run until no more matches
```

### 2. Nested Macros

```vim
" Macro a: Core transformation
qa
[transformation]
q

" Macro b: Wrapper with setup
qb
:set nohlsearch<CR>
@a                  " Call macro a
:set hlsearch<CR>
q

" Execute wrapper
@b
```

### 3. Macro Best Practices

```vim
" 1. Start with consistent position
qa
0           " Always start at beginning
[actions]
q

" 2. Make macros position-independent
qa
f{          " Find character (not 5l)
/pattern    " Search (not 10j)
q

" 3. Handle edge cases
qa
/pattern\<CR>  " Search might fail
:noh<CR>       " Clear highlighting
[action]
q
```

## Complex Workflows

### Workflow 1: Refactoring Variable Names

```vim
" Change all camelCase to snake_case in specific contexts
qa
/\<\w\+[A-Z]\w*\><CR>          " Find camelCase
yiw                             " Yank word
:let @b = substitute(@", '\(\u\)', '_\l\1', 'g')<CR>
ciw<C-r>b<Esc>                  " Replace with snake_case
n                               " Next match
q

" Run until done
@a
100@@       " Or repeat many times
```

### Workflow 2: HTML to Markdown Conversion

```vim
" Convert <h2>Title</h2> to ## Title
qa
/<h2><CR>        " Find h2 tag
dt>              " Delete until >
i## <Esc>        " Insert markdown header
/<\/h2><CR>      " Find closing tag
d$               " Delete to end
q

" Apply to entire file
gg               " Go to start
@a               " Run macro
999@@            " Repeat many times
```

### Workflow 3: Test Case Generation

```vim
" Generate test cases from function names
" function calculateTotal()
" function validateInput()

qa
/^function \(\w\+\)(<CR>
yiw                         " Yank function name
Gotest('<C-r>0', () => {<Esc>
o  // Test for <C-r>0<Esc>
o});<Esc>
''                          " Jump back
n                           " Next function
q

" Generate all tests
@a
@@
```

## Debugging Macros

### Common Issues and Solutions

```vim
" Issue 1: Macro stops unexpectedly
" Solution: Check for search failures
qa
/pattern/e<CR>    " Add 'e' flag for error suppression
[action]
q

" Issue 2: Cursor position drift
" Solution: Use absolute positioning
qa
0                 " Start of line
[action]
j0                " Next line, start position
q

" Issue 3: Macro too fast to see
" Solution: Add delay or step through
:set lazyredraw   " Speed up
@a
:set nolazyredraw " Normal speed
```

### Macro Debugging Techniques

```vim
" 1. View macro contents
:put a            " See what's recorded
:reg a            " Quick view

" 2. Step through manually
"ap               " Paste macro
[Execute each command manually]

" 3. Add debugging markers
qa
:echom "Step 1"<CR>
[action]
:echom "Step 2"<CR>
[action]
q
```

## Practice Exercises

### Exercise 1: Basic Automation

```vim
" Task: Add line numbers to a list
apple
banana
cherry
date

" Expected result:
1. apple
2. banana
3. cherry
4. date

" Challenge: Create a macro that:
" - Adds incrementing numbers
" - Formats consistently
" - Handles any number of items
```

### Exercise 2: Code Refactoring

```vim
" Task: Convert old-style functions to arrow functions
function getName() {
    return this.name;
}

function getAge() {
    return this.age;
}

" Expected:
const getName = () => this.name;
const getAge = () => this.age;
```

### Exercise 3: Data Processing

```vim
" Task: Convert CSV to SQL inserts
John,Doe,30,Engineer
Jane,Smith,25,Designer
Bob,Johnson,35,Manager

" Expected:
INSERT INTO users (first_name, last_name, age, role) VALUES ('John', 'Doe', 30, 'Engineer');
INSERT INTO users (first_name, last_name, age, role) VALUES ('Jane', 'Smith', 25, 'Designer');
INSERT INTO users (first_name, last_name, age, role) VALUES ('Bob', 'Johnson', 35, 'Manager');
```

## Real-World Applications

### 1. Code Migration
Automate syntax changes when upgrading frameworks or languages.

### 2. Data Cleaning
Process logs, CSV files, or JSON data with consistent transformations.

### 3. Documentation Generation
Create documentation from code comments or function signatures.

### 4. Testing Scaffolding
Generate test cases from implementation code automatically.

## Practice Goals

### Beginner (15 mins)
- [ ] Record 5 different simple macros
- [ ] Use @@ to repeat macros
- [ ] Apply macro with count (10@a)
- [ ] View macro contents with :reg

### Intermediate (25 mins)
- [ ] Create multi-line transformation macro
- [ ] Edit a macro after recording
- [ ] Use macros with search patterns
- [ ] Build macro for code generation

### Advanced (35 mins)
- [ ] Implement recursive macro
- [ ] Create nested macro workflow
- [ ] Debug complex macro issues
- [ ] Build macro library for common tasks

## Quick Reference Card

```
RECORDING
qa          Start recording in register 'a'
q           Stop recording
qA          Append to register 'a'

EXECUTION
@a          Execute macro in register 'a'
@@          Repeat last macro
5@a         Execute macro 5 times
:5,10norm @a Execute on lines 5-10
:%norm @a   Execute on all lines

EDITING
:reg a      View macro content
"ap         Paste macro as text
"ayy        Yank line back to register

SPECIAL TECHNIQUES
qaq         Clear register 'a'
@:          Repeat last Ex command
:put a      Put macro on new line
let @a='...' Set macro directly
```

## Connection to Other Lessons

**Previous**: Day 30's special registers knowledge is crucial since macros are stored in registers.

**Next**: Day 32 will cover advanced visual operations that can be combined with macros for powerful workflows.

**Related Concepts**:
- Registers (Day 29-30) for macro storage
- Dot command (Day 41) for simpler repetitions
- Search patterns (Day 22) for macro navigation

## Summary

Macros transform Vim into a programmable editor where any sequence of actions becomes reusable automation. Master macros to:
- Eliminate repetitive editing tasks
- Process large amounts of data consistently
- Create custom text transformations
- Build your own editing commands

Remember: If you do something twice, record it. If you do it three times, perfect the macro. Macros are not just about saving time—they're about consistency and accuracy at scale.