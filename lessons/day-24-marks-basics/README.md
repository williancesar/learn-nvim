# Day 24: Marks Basics - Bookmarks for Instant Navigation

## Learning Objectives

By the end of this lesson, you will:
- Set and navigate to marks with m[a-z] and `[a-z]
- Understand the difference between ` and ' for mark navigation
- Use uppercase marks for global (cross-file) navigation
- Master special automatic marks
- Combine marks with other operations for powerful workflows

## Understanding Marks

### What Are Marks?

Marks are bookmarks that save positions in your files. Think of them as named locations you can instantly jump back to.

```
Set mark 'a' at line 10, column 5
Navigate anywhere in file
Jump back to exact position with `a
```

### Mark Types

```
a-z  - Local marks (within file)
A-Z  - Global marks (across files)
0-9  - Automatically set by Vim
Special marks - Set automatically by Vim
```

## Setting Marks

### Basic Mark Setting

```vim
ma  - Set mark 'a' at current position
mb  - Set mark 'b' at current position
mz  - Set mark 'z' at current position
```

#### Visual Example:
```python
def function_one():     # ma - Set mark 'a' here
    setup()
    process()

def function_two():     # mb - Set mark 'b' here
    validate()
    transform()

def function_three():   # mc - Set mark 'c' here
    cleanup()
    return result
```

### Mark Naming Strategy

```vim
" Common conventions
ma - Start of section/function
mb - Important position
mc - Current work position
mm - Temporary quick mark
mz - End position
```

## Navigating to Marks

### Exact Position vs Line

```vim
`a  - Jump to exact position of mark 'a' (column and line)
'a  - Jump to beginning of line containing mark 'a'
```

#### Visual Difference:
```python
def process():
    data = get_data()  # Mark 'a' set at 'd' in data
           ^
           mark position

`a  - Jumps here (exact position)
'a  - Jumps to beginning of line
```

### Navigation Commands

```vim
`a  - Jump to mark 'a' exact position
'a  - Jump to mark 'a' line start
``  - Jump to position before last jump
''  - Jump to line before last jump
`.  - Jump to position of last change
'.  - Jump to line of last change
```

## Local Marks (a-z)

### File-Specific Marks

Local marks are specific to each file and are lost when Vim exits (unless using sessions).

```python
# file1.py
def start():    # ma - Mark 'a' in this file
    pass

# file2.py
def begin():    # ma - Different mark 'a' in this file
    pass

# Each file has its own set of a-z marks
```

### Common Local Mark Patterns

```vim
" Working positions
mm  - Mark current work position
'm  - Return to work

" Section navigation
ma  - Mark section A
mb  - Mark section B
mc  - Mark section C

" Before/after operations
mz  - Mark position before risky operation
'z  - Return if something goes wrong
```

## Global Marks (A-Z)

### Cross-File Marks

Global marks work across files and sessions (if saved).

```vim
mA  - Set global mark 'A'
`A  - Jump to mark 'A' (may open different file)
'A  - Jump to line of mark 'A'
```

#### Example Workflow:
```python
# main.py
def main():     # mM - Set global mark 'M' for Main
    config()

# config.py
def config():   # mC - Set global mark 'C' for Config
    load()

# utils.py
def utils():    # mU - Set global mark 'U' for Utils
    helper()

# From anywhere:
# `M - Jump to main.py at main()
# `C - Jump to config.py at config()
# `U - Jump to utils.py at utils()
```

## Special Marks

### Automatic Marks

Vim automatically sets these marks:

```vim
`[  - Start of last changed/yanked text
`]  - End of last changed/yanked text
`<  - Start of last visual selection
`>  - End of last visual selection
`^  - Position of last insert
`.  - Position of last change
``  - Position before last jump
`"  - Position when last exiting file
`0  - Position in last edited file
```

### Using Automatic Marks

```python
# After yanking these lines:
def yanked_function():  # `[ points here
    line1()
    line2()
    line3()             # `] points here

# After visual selection:
start_selection  # `< points here
middle_line
end_selection    # `> points here

# After change:
changed_text     # `. points to last change
```

## Viewing and Managing Marks

### Show All Marks

```vim
:marks      - Display all marks
:marks aB   - Display marks a and B
:delmarks a - Delete mark a
:delmarks!  - Delete all marks in current buffer
:delmarks a-z - Delete marks a through z
```

#### Marks Display:
```
mark line  col file/text
 '    24    0 def current_function():
 a    10    5 def marked_function():
 b    35   12     return result
 A    50    0 ~/project/main.py
 .    75    8     last_change = True
 [    60    0 start_of_yank
 ]    65    0 end_of_yank
```

## Mark-Based Operations

### Delete to Mark

```vim
d`a  - Delete from cursor to mark 'a' (exact)
d'a  - Delete from cursor to mark 'a' line
```

#### Example:
```python
# Current position
current_line = 1  # Line 50

# ... other code ...

marked_line = 100  # Line 75 - mark 'a' here

# d'a deletes lines 50-75
```

### Yank to Mark

```vim
y`a  - Yank from cursor to mark 'a'
y'a  - Yank from cursor line to mark 'a' line
```

### Visual Selection to Mark

```vim
v`a  - Visual select to mark 'a' exact
V'a  - Visual line select to mark 'a' line
```

## Advanced Mark Patterns

### Pattern 1: Before/After Comparison

```javascript
// Original code
function original() {  // mz - Mark before changes
    oldImplementation();
}

// Make changes
function modified() {
    newImplementation();
}

// Check original: `z
// Return to modified: ``
```

### Pattern 2: Multi-Point Editing

```python
def section_1():  # ma
    # edit here

def section_2():  # mb
    # edit here

def section_3():  # mc
    # edit here

# Jump between sections: `a `b `c
# Make consistent changes at each mark
```

### Pattern 3: Reference and Implementation

```vim
" Mark important reference points
" Interface definition - mI
" Implementation - mM
" Tests - mT
" Documentation - mD

" Quick jumps:
`I  " Check interface
`M  " Check implementation
`T  " Run tests
`D  " Update docs
```

## Practical Workflows

### Workflow 1: Debugging Navigation

```python
def problematic_function():  # mP - Problem location
    step1()
    error_here()  # mE - Error position
    step3()

def error_here():  # Jump to definition
    # Debug this
    pass  # mD - Debug point

# Navigation during debugging:
# `P - Return to problem
# `E - Check error call
# `D - Current debug position
```

### Workflow 2: Refactoring with Marks

```javascript
// Mark all functions needing refactoring
function oldFunc1() {}  // m1
function keepFunc() {}
function oldFunc2() {}  // m2
function oldFunc3() {}  // m3

// Navigate and refactor:
// `1 - Refactor first
// `2 - Refactor second
// `3 - Refactor third
```

### Workflow 3: Documentation Updates

```markdown
# README.md

## Installation  <!-- mI -->
Old installation steps

## Configuration  <!-- mC -->
Old configuration

## Usage  <!-- mU -->
Old usage examples

<!-- Update each section:
`I - Update installation
`C - Update configuration
`U - Update usage
-->
```

## Mark Best Practices

### Practice 1: Consistent Naming

```vim
" Develop personal conventions
ma - API/Start
mb - Business logic
mc - Configuration
md - Database/Data
me - Error handling
mf - Functions
mm - My current position (temporary)
mt - Tests
mu - Utils
```

### Practice 2: Global Mark Strategy

```vim
" Project-wide marks
mH - Home/Main file
mT - Test file
mC - Configuration
mD - Documentation
mS - Script/Build file
```

### Practice 3: Mark Before Jump

```vim
" Before searching or jumping far
mm       " Mark current position
/pattern " Search for something
'm       " Return to marked position
```

## Common Pitfalls

### Pitfall 1: Overwriting Marks

```vim
" Marks are silently overwritten
ma  " Set mark 'a' at line 10
" Later...
ma  " Overwrites - line 10 mark lost
```

### Pitfall 2: Case Sensitivity

```vim
ma  " Local mark (current file)
mA  " Global mark (across files)
" These are different marks!
```

### Pitfall 3: Lost After Exit

```vim
" Local marks lost when exiting Vim
" Solution: Use sessions or global marks
:mksession  " Save session with marks
```

## Practice Exercises

### Exercise 1: Basic Mark Navigation

```python
# practice_marks.py
def function_a():  # Set mark 'a' here
    pass

def function_b():  # Set mark 'b' here
    pass

def function_c():  # Set mark 'c' here
    pass

def function_d():  # Set mark 'd' here
    pass

# Tasks:
# 1. Set marks at each function
# 2. Jump to end of file
# 3. Navigate back using `a `b `c `d
# 4. Try 'a 'b 'c 'd for line jumps
# 5. Use :marks to view all
```

### Exercise 2: Mark Operations

```javascript
// practice_operations.js
function start() {  // Mark 's' here
    // 20 lines of code
}

function middle() {  // Mark 'm' here
    // 20 lines of code
}

function end() {  // Mark 'e' here
    // 20 lines of code
}

// Tasks:
// 1. Set marks at each function
// 2. From start, delete to middle with d'm
// 3. Undo, then yank to end with y'e
// 4. Visual select between marks
```

### Exercise 3: Global Marks

```vim
" Create 3 files
" file1.txt - Set mark 'A' at line 10
" file2.txt - Set mark 'B' at line 20
" file3.txt - Set mark 'C' at line 30

" Tasks:
" 1. Set global marks in each file
" 2. From any file, jump with `A `B `C
" 3. Marks should open different files
" 4. Use :marks to see global marks
```

## Advanced Tips

### Tip 1: Mark Validation

```vim
" Check if mark exists before jumping
:marks a  " Check if mark 'a' exists
`a        " Then jump to it
```

### Tip 2: Quick Mark Delete

```vim
:delm a   " Short for :delmarks a
:delm a-d " Delete range
:delm!    " Delete all
```

### Tip 3: Mark with Operations

```vim
" Mark and operate in one flow
ma3dd'a   " Mark, delete 3 lines, return to mark
mayy'ap   " Mark, yank line, return, paste
```

### Tip 4: Visual Mode Marks

```vim
" Reselect last visual selection
gv        " Reselect
" Or use marks
`<v`>     " Select from start to end mark
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Set 5 different marks
- [ ] Navigate with `a and 'a
- [ ] Use automatic marks (`. and ``)
- [ ] View marks with :marks
- [ ] Delete marks with :delmarks

### Intermediate (10 minutes)
- [ ] Use global marks across files
- [ ] Combine marks with operations (d`a, y'a)
- [ ] Master automatic marks
- [ ] Develop personal mark conventions
- [ ] Use marks in visual selection

### Advanced (15 minutes)
- [ ] Complex refactoring with marks
- [ ] Multi-file navigation workflow
- [ ] Mark-based macros
- [ ] Session management with marks
- [ ] Achieve 30 mark operations in 2 minutes

## Quick Reference Card

```
Command     | Description
------------|---------------------------
ma          | Set mark 'a' at cursor
`a          | Jump to mark 'a' (exact position)
'a          | Jump to mark 'a' (line start)
mA          | Set global mark 'A'
`A          | Jump to global mark 'A'
:marks      | Show all marks
:delmarks a | Delete mark 'a'
``          | Previous cursor position
`.          | Last change position
`[          | Start of last change/yank
`]          | End of last change/yank
`<          | Start of last visual selection
`>          | End of last visual selection
d`a         | Delete to mark 'a'
y'a         | Yank to mark 'a' line
v`a         | Visual select to mark 'a'
```

## Links to Other Days

- **Day 21**: Jump History → Works with marks
- **Day 22**: Search → Mark before searching
- **Day 23**: Line Jumps → Alternative navigation
- **Day 25**: Visual Block → Mark corners
- **Day 28**: Motion Review → Marks in workflows

## Conclusion

Marks are your personal navigation system in Vim. They let you bookmark important locations and jump between them instantly. Whether you're debugging, refactoring, or just navigating a large codebase, marks eliminate the need to remember line numbers or search repeatedly. Combined with operations, they enable powerful editing patterns. Master marks and you'll never lose your place again.

Tomorrow, we'll explore visual block mode for powerful column editing.