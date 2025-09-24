# Day 21: Jump History - Navigate Your Editing Trail

## Learning Objectives

By the end of this lesson, you will:
- Master jump list navigation with Ctrl-o and Ctrl-i
- Understand what creates jump points
- Navigate efficiently through your editing history
- Combine jumps with marks for powerful navigation
- Use the change list for precise edit tracking

## Understanding the Jump List

### What is a Jump?

A jump is any motion that moves the cursor "far" - typically more than a few lines. Vim records these jumps in a list, allowing you to retrace your navigation path.

```
File: mycode.py
Line 10 ──jump──> Line 50 ──jump──> Line 5 ──jump──> Line 75
         └──────────── Jump List Trail ────────────┘
           Ctrl-o ← ← ← Navigate Back
           Ctrl-i → → → Navigate Forward
```

### Jump List Visualization

```
Jump List (newest first):
  4  75  current position
  3  5   previous jump
  2  50  earlier jump
  1  10  oldest jump

Ctrl-o moves UP the list (backward in time)
Ctrl-i moves DOWN the list (forward in time)
```

## Core Jump Navigation

### Ctrl-o - Jump Back (Out)

```vim
Ctrl-o  - Go to previous position in jump list
3Ctrl-o - Go back 3 jumps
```

#### Example Flow:
```python
# You were at line 10
def function_one():  # Line 10
    pass

# Jumped to line 50 (using 50G or /search)
def function_two():  # Line 50
    pass

# Jumped to line 25
def function_three(): # Line 25
    pass

# Press Ctrl-o → back to line 50
# Press Ctrl-o → back to line 10
```

### Ctrl-i - Jump Forward (In)

```vim
Ctrl-i  - Go to next position in jump list
3Ctrl-i - Go forward 3 jumps
```

#### Example Flow:
```javascript
// After using Ctrl-o to go back
// Use Ctrl-i to retrace forward

// Position 1: Line 5
function start() {}

// Position 2: Line 40 (after jumping here)
function middle() {}

// Position 3: Line 80 (current)
function end() {}

// Ctrl-o → Line 40
// Ctrl-o → Line 5
// Ctrl-i → Line 40 (forward again)
// Ctrl-i → Line 80 (back to recent)
```

## What Creates Jump Points?

### Motions That Create Jumps

```vim
" Large line movements
G       - Go to last line
gg      - Go to first line
50G     - Go to line 50
50%     - Go to 50% of file

" Searches
/pattern - Search forward
?pattern - Search backward
n       - Next search result
N       - Previous search result
*       - Search word under cursor
#       - Search word backward

" Paragraph/section movements
{       - Previous paragraph
}       - Next paragraph
[[      - Previous section
]]      - Next section

" Marks
'm      - Jump to mark m
`m      - Jump to exact mark position

" Other jumps
Ctrl-]  - Jump to tag
%       - Jump to matching bracket
(       - Previous sentence
)       - Next sentence
```

### Motions That DON'T Create Jumps

```vim
" Small movements (no jump points)
h, j, k, l     - Character/line movement
w, b, e        - Word movement
0, ^, $        - Line navigation
fx, tx         - Character search on line
H, M, L        - Screen relative (usually)
Ctrl-d, Ctrl-u - Scrolling (usually)
```

## Jump List in Practice

### Code Navigation Pattern

```python
# Typical debugging session
def main():           # 1. Start here
    data = load()
    process(data)     # 2. Jump to definition with gd
    save(data)

def process(data):    # 3. Now here
    validate(data)    # 4. Jump to validate with gd
    transform(data)

def validate(data):   # 5. Now here
    if not data:
        raise Error

# Navigation:
# Ctrl-o → back to process()
# Ctrl-o → back to main()
# Ctrl-i → forward to process()
```

### Search and Return Pattern

```javascript
// Working on a function
function currentWork() {
    // Need to check something
    const value = helper();  // Line 20
}

// Search for helper definition
// /function helper<CR>

function helper() {          // Line 150
    return computeValue();
}

// After checking, Ctrl-o returns to line 20
```

### Multi-File Jumps

```vim
" Jump list works across files
file1.py:10  → file2.py:50  → file3.py:25  → file1.py:75

" Ctrl-o navigates back through all files
" Ctrl-i navigates forward through all files
```

## The Change List

### Understanding Change List

The change list tracks positions where you made changes (inserts, deletes, etc.)

```vim
g;  - Go to previous change position
g,  - Go to next change position
```

### Change List Example

```python
# Made changes at these lines:
def function():      # Line 5: Added function
    x = 1           # Line 6: Added variable
    y = 2           # Line 7: Added variable

    return x + y    # Line 9: Added return

# Line 20: Made another change
result = function()

# Current position: Line 20
# g; → Jump to line 9 (previous change)
# g; → Jump to line 7
# g; → Jump to line 6
# g, → Jump to line 7 (forward in changes)
```

## Viewing Jump and Change Lists

### Show Jump List

```vim
:jumps   " Display jump list

 jump line  col file/text
   3    50    0 def function_two():
   2    25   10 def function_three():
   1    10    5 def function_one():
>  0    75    0 current_position
   1   100    0 future_jump_if_any
```

### Show Change List

```vim
:changes  " Display change list

change line  col text
    3     5    0 def function():
    2     6    4     x = 1
    1     7    4     y = 2
>   0     9    4     return x + y
```

## Combining with Marks

### Mark and Jump Pattern

```vim
" Mark important positions
ma      - Mark position 'a'
mb      - Mark position 'b'

" Jump around for edits
/pattern
50G
100G

" Return using marks or jump list
'a      - Return to mark a
Ctrl-o  - Or use jump history
```

### Automatic Marks

```vim
''  - Previous jump position (before last jump)
'.  - Position of last change
'^  - Position of last insert
'[  - Start of last change or yank
']  - End of last change or yank
'<  - Start of last visual selection
'>  - End of last visual selection
```

## Advanced Jump Patterns

### Pattern 1: Definition Diving

```python
# Following function calls deeply
main()
  → process()      # gd to definition
    → validate()   # gd to definition
      → check()    # gd to definition

# Ctrl-o repeatedly to climb back up
```

### Pattern 2: Reference Checking

```javascript
// Check all usages of a variable
const config = {};     // Definition

useConfig(config);     // Usage 1 - found with n
process(config);       // Usage 2 - found with n
validate(config);      // Usage 3 - found with n

// Ctrl-o to return to definition
// Or '' to return to start of search
```

### Pattern 3: Comparison Navigation

```vim
" Comparing two sections
:50   " Jump to line 50
:100  " Jump to line 100
Ctrl-o " Back to 50
Ctrl-i " Forward to 100
" Quick comparison without marks
```

## Practical Workflows

### Workflow 1: Bug Investigation

```python
# 1. Error at line 150
def problematic_function():  # Line 150
    result = calculate()     # Error here

# 2. Jump to calculate() definition
def calculate():             # Line 30
    value = get_value()

# 3. Jump to get_value()
def get_value():            # Line 10
    return None  # Found bug!

# 4. Navigate back
# Ctrl-o → Line 30
# Ctrl-o → Line 150
```

### Workflow 2: Refactoring Trail

```javascript
// Refactoring multiple related functions

function oldImplementation() {  // Start here
    // Change this
}

// Search for related functions
// /relatedFunction<CR>

function relatedFunction() {    // Jump here
    // Update this too
}

// Search for another
// /anotherRelated<CR>

function anotherRelated() {     // Jump here
    // Update this
}

// Ctrl-o, Ctrl-o to review changes
```

### Workflow 3: Documentation Review

```markdown
# Jump between sections for review

## Introduction        // Line 1

## Installation       // Line 50 - Jump here with /Installation

## Configuration      // Line 100 - Jump here with /Configuration

## Usage             // Line 200 - Jump here with /Usage

// Use Ctrl-o to review in reverse
// Use Ctrl-i to continue forward
```

## Common Pitfalls

### Pitfall 1: Lost in Jumps

```vim
" Too many jumps, lost position
" Solution: Use marks before long jump sequences
mm      " Mark current position
" ... many jumps ...
'm      " Return to mark
```

### Pitfall 2: Overwritten Jump List

```vim
" Jump list has a limit (usually 100 entries)
" Older jumps are removed
" Solution: Use marks for important positions
```

### Pitfall 3: Confused with Change List

```vim
" Jump list (Ctrl-o/Ctrl-i): Navigation positions
" Change list (g;/g,): Edit positions
" Different lists, different purposes
```

## Practice Exercises

### Exercise 1: Jump List Navigation

```python
# practice_jumps.py - 200 lines
def function_1(): pass  # Line 10
def function_2(): pass  # Line 50
def function_3(): pass  # Line 100
def function_4(): pass  # Line 150
def function_5(): pass  # Line 200

# Tasks:
# 1. Jump to each function using /{name}
# 2. Use Ctrl-o to go back to function_1
# 3. Use Ctrl-i to go forward to function_5
# 4. Try :jumps to see your trail
```

### Exercise 2: Search and Return

```javascript
// practice_search.js
const API_KEY = "secret";

function fetchData() {
    // Uses API_KEY
    return fetch(url, {key: API_KEY});
}

function processData() {
    // Uses API_KEY
    validate(API_KEY);
}

function saveData() {
    // Uses API_KEY
    store(API_KEY, data);
}

// Tasks:
// 1. Search for API_KEY with /API_KEY
// 2. Jump through all occurrences with n
// 3. Use Ctrl-o to return to start
// 4. Use g; to visit your changes
```

### Exercise 3: Multi-File Navigation

```vim
" Create 3 files and practice jumping

" file1.txt - Edit line 10
" file2.txt - Edit line 20
" file3.txt - Edit line 30

" Tasks:
" 1. Open file1.txt, jump to line 10
" 2. :e file2.txt, jump to line 20
" 3. :e file3.txt, jump to line 30
" 4. Use Ctrl-o to navigate back through files
" 5. Use Ctrl-i to navigate forward
```

## Advanced Tips

### Tip 1: Jump List Management

```vim
" Clear jump list for current window
:clearjumps

" Set jump manually before big movement
:normal! m'
/search_pattern
```

### Tip 2: Combine with Tags

```vim
Ctrl-]   " Jump to tag (adds to jump list)
Ctrl-o   " Return from tag
Ctrl-t   " Alternative: pop tag stack
```

### Tip 3: Window-Local Jump Lists

```vim
" Each window has its own jump list
:split   " New window, new jump list
Ctrl-w w " Switch windows
" Different jump histories
```

### Tip 4: Jump List in Macros

```vim
" Record macro with jumps
qa
/pattern<CR>
cwNEW<ESC>
Ctrl-o
q

" Macro includes navigation
@a
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Navigate with Ctrl-o and Ctrl-i 20 times
- [ ] Use :jumps to view jump list
- [ ] Create 10 jumps with search
- [ ] Return to start with Ctrl-o
- [ ] Practice g; and g, for changes

### Intermediate (10 minutes)
- [ ] Navigate 100+ line file with jumps
- [ ] Combine jumps with marks
- [ ] Use jump navigation in debugging
- [ ] Master '' for quick returns
- [ ] Navigate multi-file projects

### Advanced (15 minutes)
- [ ] Use jumps in complex refactoring
- [ ] Manage multiple jump trails
- [ ] Combine with tags and includes
- [ ] Create jump-based workflows
- [ ] Master change list navigation

## Quick Reference Card

```
Command     | Description
------------|---------------------------
Ctrl-o      | Jump back (older position)
Ctrl-i      | Jump forward (newer position)
:jumps      | Show jump list
g;          | Previous change position
g,          | Next change position
:changes    | Show change list
''          | Previous jump position
'.          | Last change position
'^          | Last insert position
'[          | Start of last change
']          | End of last change

Creating Jumps:
gg, G       | File start/end
/pattern    | Search
n, N        | Search next/prev
{, }        | Paragraph jump
%, [{, ]}   | Bracket matching
'm          | Jump to mark
```

## Links to Other Days

- **Day 22**: Search Patterns → Creates jump points
- **Day 24**: Marks → Work with jump list
- **Day 15**: Paragraph Motion → Creates jumps
- **Day 16**: Screen Navigation → Some create jumps
- **Day 28**: Motion Review → Integrated navigation

## Conclusion

Jump history transforms Vim from a text editor into a navigation system. Instead of losing your place when investigating code or searching for references, you have a complete trail to follow backward and forward. Combined with marks and the change list, you have multiple ways to navigate your editing session. This is essential for debugging, refactoring, and understanding large codebases.

Next week (Days 22-28), we'll explore advanced navigation techniques, starting with search patterns tomorrow.