# Day 07: Copy & Paste - The Yank and Put System

## Learning Objectives

By the end of this lesson, you will:
- Master yanking (copying) with the y operator
- Understand put (paste) operations with p and P
- Learn about Vim's register system
- Combine yank, delete, and put for text manipulation
- Develop efficient copy-paste workflows

## Understanding Vim's Terminology

### Yank = Copy, Put = Paste

```
Traditional:          Vim:
Copy     →           Yank (y)
Cut      →           Delete (d)
Paste    →           Put (p/P)

Why "yank"? Historical Unix terminology
Why "put"? You're "putting" text at location
```

### The Register Concept

```
The Unnamed Register (" "):
┌────────────────────────────────────┐
│  All yanks/deletes go here by      │
│  default (like a clipboard)        │
│                                    │
│  yy  → copies line to ""           │
│  dd  → cuts line to ""             │
│  p   → puts from ""                │
└────────────────────────────────────┘
```

## The Yank Operator: y

### Basic Yank Operations

```
y + motion = yank text covered by motion

Common yanks:
yy  - Yank entire line
yw  - Yank word
ye  - Yank to end of word
y$  - Yank to end of line
y0  - Yank to beginning of line
ygg - Yank to beginning of file
yG  - Yank to end of file
```

### Visual Yank Examples

```
Text:    The quick│ brown fox jumps

yw  →    Yanks " brown" (to register)
ye  →    Yanks "ick" (to register)
y$  →    Yanks " brown fox jumps"
yy  →    Yanks entire line
2yy →    Yanks 2 lines
```

### Yank Entire Line: yy

```
Before:  Line 1
         │Line 2 (to copy)
         Line 3

Action:  yy (yanks Line 2)
Buffer:  "Line 2 (to copy)\n"

Note: Line is still there (unlike dd)
```

## Put Operations: p and P

### p - Put After

```
After cursor (characters) or below (lines):

Character-wise:
Text:    The qui│ck fox
Buffer:  "brown "
Action:  p
Result:  The quick│brown  fox

Line-wise:
Text:    Line 1│
         Line 2
Buffer:  "Inserted line\n"
Action:  p
Result:  Line 1
         Inserted line│
         Line 2
```

### P - Put Before

```
Before cursor (characters) or above (lines):

Character-wise:
Text:    The qui│ck fox
Buffer:  "brown "
Action:  P
Result:  The qui│brown ck fox

Line-wise:
Text:    Line 1│
         Line 2
Buffer:  "Inserted line\n"
Action:  P
Result:  Inserted line│
         Line 1
         Line 2
```

### Character vs Line-wise Behavior

```
Important distinction:

If yanked with line operation (yy, dd):
  p = paste below current line
  P = paste above current line

If yanked with character operation (yw, d$):
  p = paste after cursor
  P = paste before cursor
```

## Complete Workflow Examples

### Example 1: Duplicate a Line

```
Original:
    const config = loadConfig();│

Actions:
1. yy   - Yank current line
2. p    - Put below

Result:
    const config = loadConfig();
    const config = loadConfig();│
```

### Example 2: Move a Line

```
Original:
    Line 1│
    Line 2
    Line 3

Actions:
1. dd   - Delete (cut) Line 1
2. j    - Move to Line 2 (now first)
3. p    - Put after current line

Result:
    Line 2
    Line 3
    Line 1│
```

### Example 3: Copy Word to Multiple Places

```
Original:
    The │quick brown fox
    The lazy dog
    The sleeping cat

Actions:
1. yw   - Yank "quick "
2. j0   - Next line, beginning
3. p    - Put after "The "
4. j0   - Next line, beginning
5. p    - Put after "The "

Result:
    The quick brown fox
    The quick lazy dog
    The quick sleeping cat
```

## Advanced Yank Patterns

### Yank with Counts

```
3yy - Yank 3 lines
y3w - Yank 3 words
y2j - Yank current line and 2 below
5yl - Yank 5 characters to the right

Example:
│Line 1
Line 2    3yy yanks all three
Line 3
```

### Yank Text Objects

```
yiw - Yank inner word
yaw - Yank a word (with spaces)
yi" - Yank inside quotes
ya" - Yank around quotes
yi( - Yank inside parentheses
ya( - Yank around parentheses
yip - Yank inner paragraph
yap - Yank around paragraph

Example:
Text:    function("hello│ world")
yi"  →   Yanks "hello world"
ya"  →   Yanks "hello world" (with quotes)
```

### Visual Mode Yanking

```
Enter visual mode, select, then y:

v3wy  - Visual select 3 words, yank
V3jy  - Visual line select 4 lines, yank
Ctrl-v + select + y - Block yank

Example:
v   - Enter visual mode
3w  - Select 3 words
y   - Yank selection
```

## The Register System

### Named Registers

```
Store in specific registers:
"ayy - Yank line to register a
"byw - Yank word to register b
"ap  - Put from register a
"bp  - Put from register b

Append to registers:
"Ayy - Append line to register a
"Ayw - Append word to register a
```

### Special Registers

```
""  - Unnamed register (default)
"0  - Yank register (last yank)
"1-"9 - Delete registers (history)
"+  - System clipboard
"*  - Selection clipboard
".  - Last inserted text
"%  - Current filename
":  - Last command
```

### System Clipboard Integration

```
Copy to system clipboard:
"+yy - Yank line to system clipboard
"+yw - Yank word to system clipboard

Paste from system clipboard:
"+p  - Put from system clipboard

Select all and copy to clipboard:
ggVG"+y
```

## Step-by-Step Exercises

### Exercise 1: Basic Copy-Paste
```python
def original():
    return "value"

# Task: Duplicate the function
# 1. Position on 'def' line
# 2. V to select line mode
# 3. j to include all 2 lines
# 4. y to yank
# 5. G to go to end
# 6. p to paste

# Result: Two copies of the function
```

### Exercise 2: Rearrange Lines
```
Start:
1. Third line
2. First line
3. Second line

Goal:
1. First line
2. Second line
3. Third line

Steps:
1. On line "First line": dd
2. On line "Third line": P
3. On line "Second line": dd
4. On line "Third line": p
```

### Exercise 3: Word Distribution
```javascript
// Start:
const DEFAULT = getDefault();
const value1 = calculate();
const value2 = process();
const value3 = transform();

// Task: Replace all 'value' with 'DEFAULT'
// 1. Position on DEFAULT
// 2. yiw (yank inner word)
// 3. /value<Enter> (search for value)
// 4. viwp (select word, paste)
// 5. n. (next occurrence, repeat)
// 6. n. (repeat for all)
```

### Exercise 4: Function Parameter Copy
```python
def source(param1, param2, param3):
    pass

def target():
    pass

# Task: Copy parameters to target
# 1. Position inside source parentheses
# 2. yi( - yank inside parentheses
# 3. Navigate to target()
# 4. Position between parentheses
# 5. p - paste parameters
```

### Exercise 5: Build a List
Create this list using yank and put:
```python
items = [
    "item",
    "item",
    "item",
    "item",
    "item"
]
```

Starting with just:
```python
items = [
    "item",
]
```

Solution:
1. On "item" line: yy
2. p four times: pppp

## Common Patterns

### The Duplicate Pattern
```
yy p   - Duplicate current line below
yy P   - Duplicate current line above
yaw p  - Duplicate current word after
3yy p  - Duplicate 3 lines below
```

### The Move Pattern
```
dd p   - Move current line down
dd P   - Move current line up
dw wP  - Move word forward
v3j d p - Move visual selection
```

### The Replace Pattern
```
yiw    - Yank word
viw p  - Select word and replace with yanked
"0p    - Paste last yank (not delete)
```

### The Distribute Pattern
```
yy     - Yank line
3j p   - Go down 3, paste
5j p   - Go down 5, paste
```

## Common Mistakes to Avoid

### Mistake 1: Confusing p and P
❌ **Wrong**: Using p when you want line above
✅ **Right**: P for above, p for below/after

### Mistake 2: Forgetting Delete = Cut
❌ **Wrong**: yy, dd, then trying to paste yanked
✅ **Right**: Use "0p to paste last yank, not delete

### Mistake 3: Not Using Visual Mode
❌ **Wrong**: Counting characters for precise yank
✅ **Right**: Visual select then yank

### Mistake 4: Overwriting Register
❌ **Wrong**: Yank, delete something, lose yank
✅ **Right**: Use named registers "ayy, "ap

### Mistake 5: Character vs Line Mode Confusion
❌ **Wrong**: yw then p expecting new line
✅ **Right**: yy for line-wise, yw for character-wise

## Real-World Applications

### Duplicating Code Blocks
```javascript
// Original component
const Header = () => {
    return <div>Header</div>;
};

// Duplicate for Footer
// Position on const, V}, y, G, p
const Footer = () => {
    return <div>Footer</div>;
};
```

### Moving Functions
```python
# Cut function and move elsewhere
def misplaced_function():    # Start here
    """This is in wrong spot"""
    return True

# 1. V]] to select function
# 2. d to cut
# 3. Navigate to correct location
# 4. P to paste above
```

### Extracting to Variables
```javascript
// Complex inline expression
const result = data.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b);

// Extract parts:
// 1. Yank: yi( on filter condition
// 2. Create: const isPositive = yanked
// 3. Yank: yi( on map function
// 4. Create: const doubled = yanked
```

## Tips for VSCode Users

### Comparison

| VSCode Action | Vim Equivalent | Note |
|--------------|----------------|------|
| Ctrl+C | yy or Y | Yank line |
| Ctrl+X | dd | Cut line |
| Ctrl+V | p or P | Put text |
| Ctrl+D | yiw | Yank word |
| Alt+Shift+Down | yyp | Duplicate line |

### Building New Habits

1. **Stop using mouse selection**: Use visual mode + y
2. **Use registers**: Don't lose important yanks
3. **Think line-wise vs character-wise**: Different paste behavior
4. **Combine with motions**: y3w is powerful

## Advanced Techniques

### Register Inspection
```
:reg     - Show all registers
:reg a   - Show register a
"ap      - Paste from register a
```

### Macro Recording Preview
```
qa       - Record macro to register a
yy p     - Your actions
q        - Stop recording
@a       - Play macro
```

### Exchange Pattern
```
Two items to swap:
1. Delete first item (dd or diw)
2. Move to second item
3. Visual select second
4. Paste (p) - items swap!
```

## Practice Goals for Today

### Beginner (Complete all)
- [ ] Yank and put 20 lines
- [ ] Copy 10 words to different locations
- [ ] Use both p and P correctly
- [ ] Duplicate 5 functions or blocks
- [ ] Move 5 lines using delete and put

### Intermediate
- [ ] Use named registers (a-z)
- [ ] Copy to system clipboard
- [ ] Yank with visual mode
- [ ] Complete rearranging exercises
- [ ] Use yank with counts efficiently

### Advanced
- [ ] Master register system
- [ ] Combine yank/delete/put fluidly
- [ ] Use "0 register for repeated pastes
- [ ] Complete complex refactoring with yank/put
- [ ] Achieve muscle memory for all operations

## Quick Reference

### Yank Commands
```
yy  - Yank line
Y   - Yank line (same as yy)
yw  - Yank word
y$  - Yank to end of line
y0  - Yank to beginning
yiw - Yank inner word
yi( - Yank inside parentheses
3yy - Yank 3 lines
```

### Put Commands
```
p  - Put after cursor/below line
P  - Put before cursor/above line
3p - Put 3 times
```

### Register Operations
```
"ayy  - Yank to register a
"ap   - Put from register a
"+y   - Yank to clipboard
"+p   - Put from clipboard
"0p   - Put last yank (not delete)
```

### Common Workflows
```
Duplicate line:    yy p
Move line down:    dd p
Move line up:      dd k P
Copy to multiple:  yy 3j p 5j p
Swap two items:    dd vjj p
```

## Week 1 Summary

Congratulations! You've completed the first week of Vim fundamentals:

1. **Modes**: Normal, Insert, Visual
2. **Navigation**: hjkl basic movement
3. **Words**: w, b, e motion
4. **Lines**: 0, $, ^, gg, G operations
5. **Insertion**: i, a, I, A, o, O
6. **Deletion**: x, X, d, dd, D
7. **Copy/Paste**: y, yy, p, P

You now have all the basic tools to edit text efficiently in Vim!

## Next Week Preview

Week 2 will build on these fundamentals:
- Change and replace operations
- Search and navigation
- Visual mode mastery
- Text objects
- Undo/redo
- Marks and jumps

## Summary

The yank and put system completes your basic Vim toolkit. Combined with delete operations, you can now restructure any text efficiently. Remember that Vim's registers give you multiple clipboards, and the distinction between line-wise and character-wise operations affects how paste works.

**Remember**: Yank to copy, put to paste. Delete is cut. The unnamed register holds your latest operation, but named registers give you power. Master these, and text manipulation becomes effortless!