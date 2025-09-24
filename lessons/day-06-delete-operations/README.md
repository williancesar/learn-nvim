# Day 06: Delete Operations - Surgical Text Removal

## Learning Objectives

By the end of this lesson, you will:
- Master single character deletion with x and X
- Understand the delete operator 'd' and its motions
- Efficiently delete lines, words, and blocks of text
- Learn the relationship between delete and cut
- Combine deletions with counts and motions

## The Delete Command Family

### Overview

```
Delete Operations in Vim:
┌────────────────────────────────────────┐
│  x  - Delete character under cursor    │
│  X  - Delete character before cursor   │
│  d  - Delete operator (needs motion)   │
│  dd - Delete entire line               │
│  D  - Delete from cursor to line end   │
└────────────────────────────────────────┘

Important: In Vim, "delete" = "cut"
Deleted text goes to register (clipboard)!
```

## Single Character Deletion

### x - Delete Under Cursor

```
Before:  The qu│ick brown fox
Action:  x
After:   The qu│ck brown fox

Multiple deletes:
Before:  The qu│ick brown fox
Action:  3x
After:   The qu│k brown fox
```

### X - Delete Before Cursor (Backspace)

```
Before:  The quic│k brown fox
Action:  X
After:   The qui│k brown fox

Multiple deletes:
Before:  The quic│k brown fox
Action:  3X
After:   The q│k brown fox
```

### Visual Comparison

```
        X ← │ → x
        ↑   ↑   ↑
    Deletes Delete Delete
    before  cursor after

Text:   a b c │ d e f
x →     a b c │ e f    (d deleted)
X →     a b │ d e f    (c deleted)
```

## The Delete Operator: d

### Understanding d + Motion

The 'd' operator deletes text defined by the following motion:

```
d + motion = delete that motion covers

Examples:
dw  - Delete word
d$  - Delete to end of line
d0  - Delete to beginning of line
dG  - Delete to end of file
dgg - Delete to beginning of file
```

### Common Delete Combinations

```
Word Deletions:
dw  - Delete to beginning of next word
dW  - Delete to beginning of next WORD
de  - Delete to end of word
dE  - Delete to end of WORD
db  - Delete to beginning of previous word
dB  - Delete to beginning of previous WORD

Line Position Deletions:
d$  - Delete to end of line (same as D)
d0  - Delete to beginning of line
d^  - Delete to first non-blank character
dg_ - Delete to last non-blank character
```

### Visual Examples

```
Text:    The quick│ brown fox jumps

dw  →    The quick│brown fox jumps  (space deleted too)
de  →    The quick│ brown fox jumps (precision delete)
d$  →    The quick│                 (rest of line)
d0  →    │ brown fox jumps          (to line start)
d3w →    The quick│jumps            (3 words forward)
```

## Line Deletion Commands

### dd - Delete Entire Line

```
Before:  Line 1
         │Line 2 to delete
         Line 3

Action:  dd

After:   Line 1
         │Line 3
```

### D - Delete to End of Line

```
Before:  The quick│ brown fox
Action:  D
After:   The quick│

Equivalent to: d$
```

### Multiple Line Deletion

```
3dd - Delete 3 lines (current and 2 below)

Before:  Line 1
         │Line 2  ← cursor here
         Line 3
         Line 4
         Line 5

After:   Line 1
         │Line 5
```

## Advanced Delete Patterns

### Delete Inside/Around

Preview of text objects (future lesson):
```
diw - Delete inner word (word only)
daw - Delete a word (word + spaces)
di" - Delete inside quotes
da" - Delete around quotes (including quotes)
di( - Delete inside parentheses
da( - Delete around parentheses

Example:
Text:    function("hello│ world")
di"  →   function("│")
da"  →   function(│)
```

### Delete with Search

```
d/pattern - Delete until pattern

Example:
Text:    The quick brown│ fox jumps over
d/fox →  The quick brown│fox jumps over
         (deletes up to but not including "fox")
```

### Delete with Counts

```
Count + Delete:
2x   - Delete 2 characters forward
5X   - Delete 5 characters backward
3dw  - Delete 3 words
2dd  - Delete 2 lines
d2w  - Delete 2 words (alternative syntax)
```

## The Delete Register

### Understanding Cut vs Delete

```
In Vim, "delete" is actually "cut":

1. Delete text with d, x, or X
2. Text goes to unnamed register
3. Can paste with p or P

Example workflow:
dd  - Cut current line
j   - Move down
p   - Paste the cut line below
```

### The Black Hole Register

```
True deletion (no copy):
"_d  - Delete without saving to register

Examples:
"_dd - Really delete line
"_x  - Really delete character
"_dw - Really delete word
```

## Step-by-Step Exercises

### Exercise 1: Character Deletion Practice
```
Start:   The| quuuick browwwn foxx
Target:  The quick brown fox

Steps:
1. Position on first 'u': press 2x
2. Position on first 'w': press 2x
3. Position on last 'x': press x
```

### Exercise 2: Word Deletion Drills
```python
def calculate_total_amount_with_tax(price, tax_rate):
    return price * tax_rate

# Task: Simplify function name to 'calculate'
# Position cursor on _total, press d/_
# Result: def calculate(price, tax_rate):
```

### Exercise 3: Line Operations
```
Line 1: Keep this
Line 2: Delete this
Line 3: Delete this
Line 4: Delete this
Line 5: Keep this

Position on Line 2, press 3dd
Result: Line 1 and Line 5 remain
```

### Exercise 4: Mixed Deletions
Starting text:
```javascript
function processData(data) {
    // Old comment to remove
    const result = data.filter().map().reduce();
    console.log('Debug:', result);
    return result;
}
```

Tasks:
1. Delete the comment line (position on it, `dd`)
2. Delete 'Debug:' (position on D, `de` or `dw`)
3. Delete `.reduce()` (position on ., `d3e`)

### Exercise 5: Rapid Cleanup
Clean this code using only delete operations:
```python
def func(xxxparam1, yyyaram2):
    """Docstring"""
    # TODO: Remove this comment
    value = calculaaate(param1) + param2
    print("Debug value:", value)
    return value
```

Target:
```python
def func(param1, param2):
    """Docstring"""
    value = calculate(param1) + param2
    return value
```

## Common Mistakes to Avoid

### Mistake 1: Using Insert Mode Backspace
❌ **Wrong**: Enter insert mode, hold backspace
✅ **Right**: Use X or x in normal mode

### Mistake 2: Not Using Counts
❌ **Wrong**: xxxxxx (6 presses)
✅ **Right**: 6x (2 keystrokes)

### Mistake 3: Imprecise Word Deletion
❌ **Wrong**: dw when you need precision
✅ **Right**: de to delete exactly to word end

### Mistake 4: Forgetting D
❌ **Wrong**: d$ every time
✅ **Right**: D is faster for line-end deletion

### Mistake 5: Not Understanding Delete = Cut
❌ **Wrong**: Delete then retype same text elsewhere
✅ **Right**: Delete (dd) then paste (p) to move text

## Real-World Applications

### Removing Debug Code
```javascript
function calculate() {
    console.log('Starting calculation');  // dd to remove
    const result = compute();
    console.log('Result:', result);       // dd to remove
    return result;
}
```

### Cleaning Up Imports
```python
import os
import sys          # dd if unused
import json
import requests     # dd if unused
from typing import List
```

### Refactoring Variable Names
```javascript
const userDataFromDatabase = fetch();  // Position on DataFromDatabase, dw
const user = fetch();                   // Result
```

### Removing Function Parameters
```typescript
function process(data: string, unused: number, flag: boolean) {
    // Position on ", unused: number", press d/,
    // Result: process(data: string, flag: boolean)
}
```

## Tips for VSCode Users

### Comparison with VSCode

| VSCode Action | Vim Delete | Advantage |
|--------------|------------|-----------|
| Backspace (repeat) | X or x | No repetition needed |
| Ctrl+Backspace | db | More precise |
| Ctrl+Shift+K | dd | Faster |
| Select + Delete | d + motion | No selection needed |
| Ctrl+X | dd | Same concept |

### Breaking VSCode Habits

1. **Stop using Backspace in insert mode**: Use X in normal mode
2. **Stop selecting to delete**: Use d + motion
3. **Think in text objects**: Words, lines, blocks
4. **Use counts**: 3dd instead of delete, delete, delete

## Advanced Techniques

### Delete and Replace Pattern
```
Common pattern: Delete and immediately type replacement
cw  - Change word (delete word + enter insert)
cc  - Change line (delete line + enter insert)
C   - Change to end of line

This combines delete + insert (tomorrow's lesson!)
```

### Delete with Visual Mode
```
Enter visual mode, select, then d:
v3wd  - Visual select 3 words, delete
V3jd  - Visual line select 4 lines, delete
```

### Delete Surroundings
```
Advanced (plugin) but common:
ds"  - Delete surrounding quotes
ds(  - Delete surrounding parentheses
dst  - Delete surrounding tags
```

## Practice Goals for Today

### Beginner (Complete all)
- [ ] Delete 50 characters with x
- [ ] Delete 20 words with dw
- [ ] Delete 10 lines with dd
- [ ] Use D to delete line endings 10 times
- [ ] Practice delete + paste workflow

### Intermediate
- [ ] Clean up a code file using only delete operations
- [ ] Use count modifiers with all delete commands
- [ ] Delete with precision (de vs dw)
- [ ] Complete exercises in under 5 minutes

### Advanced
- [ ] Refactor code using delete operations
- [ ] Use delete + register operations
- [ ] Combine delete with other operators
- [ ] Master d + any motion combination

## Quick Reference

### Character Deletion
```
x  - Delete character under cursor
X  - Delete character before cursor
3x - Delete 3 characters forward
5X - Delete 5 characters backward
```

### Delete with Motions
```
dw  - Delete word
de  - Delete to end of word
db  - Delete back word
d$  - Delete to line end
d0  - Delete to line start
dgg - Delete to file start
dG  - Delete to file end
```

### Line Deletion
```
dd  - Delete entire line
D   - Delete to end of line (same as d$)
3dd - Delete 3 lines
```

### Common Patterns
```
Clean word:     dw or de
Clean line:     dd
Clean to end:   D
Clean function: dap (delete a paragraph)
Move line:      dd then p
```

## Tomorrow's Preview

You've learned to delete text surgically. Tomorrow, we'll complete the trio with copy (yank) and paste operations. Combined with delete, you'll be able to restructure text like a pro!

## Summary

Delete operations in Vim are powerful and precise. Remember that delete is actually "cut" - deleted text can be pasted elsewhere. The combination of x/X for characters, d+motion for precise deletion, and dd/D for lines gives you complete control over text removal.

**Remember**: Think before you delete. Use counts for efficiency. And always remember - deleted text isn't gone, it's in your register waiting to be pasted!