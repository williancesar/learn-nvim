# Day 11: Change Operations - Delete and Insert in One Motion

## Learning Objectives

By the end of this lesson, you will:
- Master the change operator `c` with motions
- Use line-wise changes with `cc` and `C`
- Apply substitute commands `s` and `S` efficiently
- Understand when to use change vs delete+insert
- Combine change operations with counts and text objects

## Theory & Concepts

### The Change Philosophy

Change operations combine deletion and insert mode in a single command, eliminating the two-step delete-then-insert pattern.

```
Traditional approach:  dw → i → type new text → Esc
Change approach:      cw → type new text → Esc

Saves: 1 keystroke + mental context switch
```

### Change Command Family Tree

```
Change Operations
├── c{motion} - Change with motion
│   ├── cw - Change word
│   ├── c$ - Change to end of line (C)
│   └── ci{ - Change inside braces
├── cc - Change entire line
├── C - Change from cursor to end of line
├── s - Substitute character(s)
└── S - Substitute entire line
```

### Mental Model: Replace Mode

Think of change operations as "smart replace" - they delete exactly what you specify and position you perfectly for the replacement text.

```
Before: const oldVariable = getValue();
        cursor on 'o' in oldVariable

Operation: ciw (change inner word)
Result: const | = getValue();  (cursor in insert mode)
Type: newVariable
Final: const newVariable = getValue();
```

## Key Commands Reference

### Core Change Commands
| Command | Action | Equivalent |
|---------|--------|------------|
| `c{motion}` | Change text covered by motion | `d{motion}i` |
| `cc` | Change entire current line | `ddO` or `S` |
| `C` | Change from cursor to end of line | `c$` or `D` then `a` |
| `s` | Substitute character under cursor | `xi` |
| `S` | Substitute entire line | `cc` |

### Common Change Patterns
| Pattern | Effect | Use Case |
|---------|--------|----------|
| `cw` | Change word from cursor | Fixing typos |
| `ciw` | Change entire word | Replace word completely |
| `ci"` | Change inside quotes | Update string values |
| `ci(` | Change inside parentheses | Modify function arguments |
| `ci{` | Change inside braces | Replace block contents |
| `ct,` | Change till comma | Modify parameter |
| `cf)` | Change to closing paren | Replace rest of arguments |
| `c2w` | Change next 2 words | Multi-word replacement |
| `c0` | Change to beginning of line | Replace line start |

### Substitute Commands
| Command | Action | Best For |
|---------|--------|----------|
| `s` | Substitute 1 character | Quick single-char fixes |
| `3s` | Substitute 3 characters | Multi-char replacement |
| `S` | Substitute line | Rewrite entire line |
| `5S` | Substitute 5 lines | Multi-line rewrite |

## Step-by-Step Exercises

### Exercise 1: Basic Change Operations
```
Starting text:
The wrong word is here in this sentence.

Tasks:
1. Navigate to "wrong"
2. Press cw and type "correct"
3. Navigate to "here"
4. Press ciw and type "present"
5. Position at start of "sentence"
6. Press c$ and type "paragraph."
7. Press u repeatedly to see each change
```

### Exercise 2: Line-wise Changes
```
Starting text:
Line 1: Keep this line
Line 2: Replace this entire line
Line 3: And this one too
Line 4: Keep this line

Tasks:
1. Navigate to Line 2
2. Press cc and type "Line 2: New content here"
3. Navigate to Line 3
4. Press S and type "Line 3: Also new"
5. On any line, press C to change from cursor to end
6. Try 2cc to change 2 lines at once
```

### Exercise 3: Substitute Commands
```
Starting text:
Fix x single character.
Replace xxx multiple characters.
Rewrite this entire line completely.

Tasks:
1. Navigate to 'x' in first line
2. Press s and type 'a'
3. Navigate to "xxx" in second line
4. Press 3s and type "the"
5. Navigate to third line
6. Press S and type "This line is brand new."
```

### Exercise 4: Change with Text Objects
```
Starting text:
function oldName(param1, param2) {
    return "old value";
}

Tasks:
1. Navigate to "oldName"
2. Press ciw and type "newName"
3. Navigate inside parentheses
4. Press ci( and type "newParam1, newParam2"
5. Navigate to quoted string
6. Press ci" and type "new value"
7. Navigate inside function body
8. Press ci{ and type new function body
```

### Exercise 5: Practical Refactoring
```
Starting text:
const userAge = 25;
const userName = "Alice";
const userEmail = "alice@example.com";
const userPhone = "555-1234";

Tasks:
1. Change all "user" prefixes to "customer":
   - Position on first "user"
   - Press ciw and type "customerAge"
   - Press j0 to go to next line start
   - Press cw and type "customer"
   - Continue pattern (or use . repeat after first change)
```

### Exercise 6: Advanced Change Patterns
```
Starting text:
<div class="old-class" id="old-id">
    <span>Old content here</span>
    <p>Another old paragraph</p>
</div>

Tasks:
1. Navigate to "old-class"
2. Press ci" and type "new-class"
3. Use f" to find next quoted value
4. Press ci" and type "new-id"
5. Navigate to "Old content"
6. Press cit (change inner tag) and type "New content"
7. Navigate to paragraph text
8. Press C and type "Updated paragraph</p>"
```

## Common Mistakes to Avoid

### 1. Using Delete Then Insert
- Don't: `dw` then `i`
- Do: `cw` (single operation)
- Change commands are designed for this

### 2. Confusing c and s
- `c` requires a motion: `cw`, `c$`, `ci(`
- `s` works on characters under cursor
- Use `s` for quick character fixes

### 3. Forgetting About C
- `C` changes to end of line
- More intuitive than `c$`
- Parallel to `D` for delete

### 4. Not Using Text Objects
- `cw` changes from cursor position
- `ciw` changes entire word
- Text objects are more precise

### 5. Overusing Visual Mode
- Don't: `viwc`
- Do: `ciw`
- Direct change is usually faster

## Real-World Applications

### Renaming Variables
```javascript
// Change variable names throughout
let oldName = getValue();
processData(oldName);
return oldName * 2;
// Use ciw on each occurrence
```

### Updating Configuration
```json
{
    "host": "old.server.com",
    "port": 8080,
    "timeout": 30
}
// Use ci" for strings, cw for numbers
```

### Refactoring Function Signatures
```python
def old_function(param1, param2, param3):
    # Use ci( to replace all parameters at once
    pass

# Becomes:
def old_function(new_param1, new_param2):
    pass
```

### HTML/JSX Attribute Updates
```jsx
<Component oldProp="value" anotherProp={oldVar} />
// Use cw for prop names, ci" for string values, ci{ for JS expressions
```

### SQL Query Modifications
```sql
SELECT old_column FROM old_table WHERE old_condition = 'value';
-- Use cw to change identifiers, ci' for string values
```

## Practice Goals

### Beginner (10 mins)
- [ ] Perform 20 cw operations
- [ ] Use cc and C 10 times each
- [ ] Execute 15 substitute operations with s
- [ ] Complete Exercises 1-3

### Intermediate (15 mins)
- [ ] Use ci with 5 different text objects
- [ ] Chain changes with . repeat 10 times
- [ ] Combine counts with change (3cw, 2cc)
- [ ] Complete Exercises 1-5 smoothly

### Advanced (20 mins)
- [ ] Refactor a function using only change commands
- [ ] Update 20 variable names efficiently
- [ ] Complete all exercises in 8 minutes
- [ ] Use change operations exclusively (no delete+insert)

## Quick Reference Card

```
CHANGE OPERATORS
┌─────────────────────────────┐
│ c{motion} - Change motion   │
│ cc        - Change line     │
│ C         - Change to EOL   │
│ s         - Substitute char │
│ S         - Substitute line │
└─────────────────────────────┘

COMMON CHANGE PATTERNS
┌─────────────────────────────┐
│ cw  - Change word forward   │
│ ciw - Change entire word    │
│ ci" - Change inside quotes  │
│ ci( - Change inside parens  │
│ ci{ - Change inside braces  │
│ ct, - Change till comma     │
│ cf) - Change to close paren │
│ c$  - Change to end (or C)  │
│ c0  - Change to beginning   │
└─────────────────────────────┘

SUBSTITUTE SHORTCUTS
┌─────────────────────────────┐
│ s   = xi  (delete char + insert)│
│ S   = cc  (change line)     │
│ C   = c$  (change to end)   │
│ 3s  = 3xi (replace 3 chars) │
└─────────────────────────────┘

CHANGE VS DELETE
┌─────────────────────────────┐
│ Delete (d): Remove text     │
│ Change (c): Replace text    │
│ Rule: Use c when you'll     │
│       immediately type new  │
│       text in same spot     │
└─────────────────────────────┘
```

## Tips for Mastery

1. **Think "Replace" not "Delete-Insert"**: Change is a single mental operation
2. **Use Text Objects**: `ciw` is almost always better than `cw`
3. **C for Line Endings**: When editing line ends, `C` is your friend
4. **S for Line Rewrites**: Faster than `cc` mentally
5. **Combine with Repeat**: Make first change, then `.` for similar changes
6. **Count for Efficiency**: `3cw` to change three words at once

## Connection to Previous Lessons

- **Day 03-04**: Word motions (w, b, e) combine with c
- **Day 05**: Search to position, then change
- **Day 08**: Change operations work perfectly with `.` repeat
- **Day 09**: `cf{char}` and `ct{char}` for precise changes
- **Day 10**: Visual mode to preview what `c` will affect

## Preview of Next Lesson

Tomorrow (Day 12), we'll explore number operations with `Ctrl-a` and `Ctrl-x`, plus how to combine counts with motions for powerful multiplied actions.

---

*Remember: Change operations are about efficiency. Every time you delete something to immediately type something new, you should be using change instead.*