# Day 25: Visual Block Operations - Column Editing Mastery

## Learning Objectives

By the end of this lesson, you will:
- Enter and navigate visual block mode with Ctrl-v
- Select and edit columns of text
- Insert text on multiple lines simultaneously
- Append to multiple lines at once
- Master advanced block operations

## Understanding Visual Block Mode

### What is Visual Block Mode?

Visual Block mode lets you select and edit rectangular blocks of text, perfect for column-based operations.

```
Normal Visual:       Visual Block:
┌─────────────┐     ┌─────────────┐
│█████████████│     │   ███       │
│█████████████│     │   ███       │
│█████████████│     │   ███       │
└─────────────┘     └─────────────┘
Line selection      Column selection
```

### Entering Visual Block Mode

```vim
Ctrl-v  - Enter visual block mode
<ESC>   - Exit visual block mode
```

## Basic Block Selection

### Selection Movement

```vim
" In visual block mode:
h, l  - Extend selection left/right
j, k  - Extend selection up/down
w, b  - Extend by words
$     - Extend to end of all lines
0     - Extend to beginning of lines
```

#### Visual Example:
```python
# Start position (█ = cursor)
def func1():█
def func2():
def func3():

# Ctrl-v, then 2j
def func1():█
def func2():█
def func3():█

# Then 5l
def func1():██████
def func2():██████
def func3():██████
```

## Column Operations

### Delete Columns

```vim
Ctrl-v  - Enter block mode
(select) - Select column
d or x  - Delete selected block
```

#### Example:
```python
# Before (select 'def ' column)
def function1():
def function2():
def function3():

# After pressing d
function1():
function2():
function3():
```

### Change Columns

```vim
Ctrl-v  - Enter block mode
(select) - Select column
c       - Change selected block
```

#### Example:
```javascript
// Before (select 'var' column)
var name1 = "a";
var name2 = "b";
var name3 = "c";

// After c, type 'const'
const name1 = "a";
const name2 = "b";
const name3 = "c";
```

### Yank and Paste Columns

```vim
Ctrl-v  - Enter block mode
(select) - Select column
y       - Yank block
p       - Paste block after cursor
P       - Paste block before cursor
```

## Multi-Line Insert

### Insert at Beginning (I)

```vim
Ctrl-v   - Enter block mode
(select) - Select lines
I        - Insert at beginning
(text)   - Type text
<ESC>    - Apply to all lines
```

#### Example:
```python
# Select first column of all lines
item1
item2
item3

# Press I, type '- ', then ESC
- item1
- item2
- item3
```

### Append at End (A)

```vim
Ctrl-v   - Enter block mode
(select) - Select lines
$        - Extend to line ends (optional)
A        - Append after selection
(text)   - Type text
<ESC>    - Apply to all lines
```

#### Example:
```python
# Select lines
name1
name2
name3

# Press $A, type ' = None', then ESC
name1 = None
name2 = None
name3 = None
```

## Advanced Block Patterns

### Pattern 1: Add Prefix to Multiple Lines

```python
# Original
print("one")
print("two")
print("three")

# Ctrl-v, select first column, I, type '# '
# print("one")
# print("two")
# print("three")
```

### Pattern 2: Change Multiple Values

```javascript
// Original
const config = {
    host: "localhost",
    port: 8080,
    user: "admin",
    pass: "secret"
};

// Select all values after :
// Ctrl-v to select quote column
// Navigate to select all values
// c to change, type new values
```

### Pattern 3: Create Aligned Comments

```python
# Original
x = 1
long_variable = 2
y = 3

# Visual block select at end
# Press $A to append
# Type '  # comment'

x = 1              # comment
long_variable = 2  # comment
y = 3              # comment
```

## Column Alignment

### Align Equals Signs

```python
# Before
x = 1
long_name = 2
y = 3

# Process:
# 1. Visual block select space before =
# 2. Delete extra spaces
# 3. Visual block at = position
# 4. Insert appropriate spaces

# After
x         = 1
long_name = 2
y         = 3
```

### Align Comments

```javascript
// Before
let a = 1; // comment
let longVariable = 2; // another
let b = 3; // more

// Visual block to align comments
// Select and delete varying spaces
// Insert consistent spacing

// After
let a = 1;            // comment
let longVariable = 2; // another
let b = 3;            // more
```

## Practical Use Cases

### Use Case 1: CSV Manipulation

```csv
# Original CSV
John,Doe,30
Jane,Smith,25
Bob,Johnson,35

# Add quotes to names
# Ctrl-v select first column
# I" (insert quote at start)
# Ctrl-v select after first comma
# I" (insert quote)
# Repeat for other columns

"John","Doe","30"
"Jane","Smith","25"
"Bob","Johnson","35"
```

### Use Case 2: SQL Formatting

```sql
-- Original
SELECT id, name, email FROM users

-- Convert to multiline
-- Position after SELECT
-- Substitute commas with newlines
-- Use visual block to align

SELECT
    id,
    name,
    email
FROM users
```

### Use Case 3: Array/List Formatting

```javascript
// Original
const items = [item1, item2, item3, item4];

// Convert to multiline
// Visual block to add line breaks
// Visual block to add indentation

const items = [
    item1,
    item2,
    item3,
    item4
];
```

## Visual Block with Numbers

### Increment/Decrement

```vim
Ctrl-v   - Select column of numbers
g Ctrl-a - Increment sequence
g Ctrl-x - Decrement sequence
```

#### Example:
```python
# Original (select all 0s)
item_0 = 0
item_0 = 0
item_0 = 0

# After g Ctrl-a
item_0 = 0
item_0 = 1
item_0 = 2
```

## Complex Block Operations

### Replace in Block

```vim
Ctrl-v   - Select block
:        - Enter command mode
'<,'>s/old/new/g - Replace in block only
```

### Sort Block

```vim
Ctrl-v   - Select block
:        - Enter command mode
'<,'>sort - Sort selected lines
```

### Run Macro on Block

```vim
Ctrl-v   - Select block
:        - Enter command mode
'<,'>normal @q - Run macro q on each line
```

## Visual Block Tips and Tricks

### Tip 1: Ragged Right

```vim
" When lines have different lengths
" $ in visual block selects to end of each line
Ctrl-v
$  " Selects to different endpoints
A  " Append at each line's end
```

### Tip 2: Block to Other Modes

```vim
Ctrl-v  " Start in block mode
v       " Switch to character mode
V       " Switch to line mode
Ctrl-v  " Back to block mode
```

### Tip 3: Precise Selection

```vim
" Use marks for precise block selection
ma      " Mark top-left
(move)  " Move to bottom-right
Ctrl-v
`a      " Select exact block
```

### Tip 4: Virtual Edit

```vim
:set virtualedit=block  " Move beyond line ends
" Useful for creating aligned blocks
```

## Practice Exercises

### Exercise 1: Comment Management

```python
# practice_comments.py
print("line 1")
print("line 2")
print("line 3")
print("line 4")
print("line 5")

# Tasks:
# 1. Comment out all lines using visual block
# 2. Uncomment using visual block delete
# 3. Add inline comments to all lines
# 4. Align the inline comments
```

### Exercise 2: Variable Prefixing

```javascript
// practice_prefix.js
name = "John";
age = 30;
city = "NYC";
country = "USA";

// Tasks:
// 1. Add 'const ' to all lines
// 2. Add 'user.' prefix to all variables
// 3. Result: const user.name = "John";
```

### Exercise 3: Table Formatting

```
// practice_table.txt
Name|Age|City
John|30|NYC
Jane|25|LA
Bob|35|Chicago

// Tasks:
// 1. Replace | with spaces using visual block
// 2. Align columns properly
// 3. Add borders using visual block
```

### Exercise 4: Number Sequences

```python
# practice_numbers.py
test_1 = 1
test_1 = 1
test_1 = 1
test_1 = 1

# Tasks:
# 1. Fix test numbers (1,2,3,4) using g Ctrl-a
# 2. Fix values to match using visual block
# Result:
# test_1 = 1
# test_2 = 2
# test_3 = 3
# test_4 = 4
```

## Common Pitfalls

### Pitfall 1: Forgetting ESC

```vim
" After I or A in visual block
" Must press ESC to apply changes
Ctrl-v
I#
" Nothing happens until ESC
<ESC>  " Now changes apply
```

### Pitfall 2: Ragged Selections

```python
# Lines of different lengths
short
very_long_line
mid

# Ctrl-v$ behavior varies
# Use virtualedit=block for consistency
```

### Pitfall 3: Mode Confusion

```vim
v      " Character visual (not block)
V      " Line visual (not block)
Ctrl-v " Block visual (correct)
```

## Advanced Workflows

### Workflow 1: Convert to Markdown Table

```
# Data
John 30 Engineer
Jane 25 Designer
Bob 35 Manager

# Steps:
1. Ctrl-v select spaces
2. Replace with |
3. Add | at start/end with I and A
4. Add header separator

# Result:
| John | 30 | Engineer |
| Jane | 25 | Designer |
| Bob  | 35 | Manager  |
```

### Workflow 2: Multi-Cursor Simulation

```javascript
// Multiple edits
obj.method1();
obj.method2();
obj.method3();

// Ctrl-v select 'obj'
// c to change
// Type 'this'
// Result:
this.method1();
this.method2();
this.method3();
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Enter/exit visual block mode 10 times
- [ ] Select and delete columns
- [ ] Insert text on multiple lines with I
- [ ] Append text on multiple lines with A
- [ ] Yank and paste blocks

### Intermediate (10 minutes)
- [ ] Comment/uncomment code blocks
- [ ] Align text in columns
- [ ] Change multiple values simultaneously
- [ ] Use $ for ragged right selection
- [ ] Create number sequences

### Advanced (15 minutes)
- [ ] Complex table formatting
- [ ] Multi-cursor-like editing
- [ ] Combine with macros
- [ ] Use with substitute commands
- [ ] Master virtualedit mode

## Quick Reference Card

```
Command     | Description
------------|---------------------------
Ctrl-v      | Enter visual block mode
h,j,k,l     | Extend block selection
I           | Insert at block start
A           | Append at block end
c           | Change block
d           | Delete block
y           | Yank block
p           | Paste block after
P           | Paste block before
$           | Select to end of lines
0           | Select to start of lines
g Ctrl-a    | Increment numbers
g Ctrl-x    | Decrement numbers
r           | Replace block with character
```

## Links to Other Days

- **Day 10**: Visual Mode Basics → Foundation
- **Day 26**: Indent Operations → Block indenting
- **Day 27**: Join & Format → Formatting blocks
- **Day 17-19**: Text Objects → Combine with blocks
- **Day 28**: Motion Review → Integration

## Conclusion

Visual block mode is Vim's answer to multi-cursor editing. It provides powerful column operations that would be tedious with traditional editing. From commenting multiple lines to aligning code to creating tables, visual block mode handles repetitive edits with surgical precision. Master this mode and you'll handle any column-based editing task effortlessly.

Tomorrow, we'll explore indent operations for managing code structure and formatting.