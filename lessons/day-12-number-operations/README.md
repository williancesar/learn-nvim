# Day 12: Number Operations - Increment, Decrement, and Count Magic

## Learning Objectives

By the end of this lesson, you will:
- Master number increment/decrement with `Ctrl-a` and `Ctrl-x`
- Understand and apply counts to motions for multiplied effects
- Combine counts with operators for powerful edits
- Use number operations in visual block mode
- Build efficiency through numeric patterns

## Theory & Concepts

### Two Types of Numbers in Vim

```
1. Count Prefixes: Multiply commands
   3w  = move 3 words forward
   5dd = delete 5 lines
   2} = move 2 paragraphs down

2. Number Operations: Modify numeric values
   Ctrl-a = increment number
   Ctrl-x = decrement number
   10Ctrl-a = add 10 to number
```

### The Count-Motion-Operator Trinity

```
Pattern: [count][operator][count][motion]

Examples:
  2d3w = Delete 3 words, twice (deletes 6 words)
  3y2j = Yank 2 lines down, 3 times (yanks current + 2 below)
  5c2w = Change 2 words, 5 times (changes 10 words)
```

### Number Recognition Patterns

Vim recognizes various number formats:

```
Decimal:     123, -456, 0
Hexadecimal: 0x1F, 0X2A, 0xff
Octal:       0755, 0644
Binary:      0b1010, 0B1111
```

## Key Commands Reference

### Number Operations
| Command | Action | Example |
|---------|--------|---------|
| `Ctrl-a` | Increment number | 5 → 6 |
| `Ctrl-x` | Decrement number | 5 → 4 |
| `5Ctrl-a` | Add 5 to number | 10 → 15 |
| `3Ctrl-x` | Subtract 3 from number | 10 → 7 |
| `gCtrl-a` | Increment in visual block (sequential) | Creates sequence |
| `gCtrl-x` | Decrement in visual block (sequential) | Creates sequence |

### Count with Motions
| Pattern | Effect | Example Result |
|---------|--------|----------------|
| `3w` | Move 3 words forward | Cursor jumps 3 words |
| `5j` | Move 5 lines down | Cursor down 5 lines |
| `2f,` | Find 2nd comma forward | Skips first comma |
| `4}` | Move 4 paragraphs down | Jump 4 paragraphs |
| `10l` | Move 10 characters right | Precise positioning |

### Count with Operators
| Pattern | Effect | Use Case |
|---------|--------|----------|
| `3dd` | Delete 3 lines | Clear multiple lines |
| `2dw` | Delete 2 words | Remove phrase |
| `5yy` | Yank 5 lines | Copy block |
| `3cw` | Change 3 words | Replace phrase |
| `4>>` | Indent 4 lines right | Format code block |
| `2gUw` | Uppercase 2 words | Format constants |

### Advanced Count Patterns
| Pattern | Effect | Breakdown |
|---------|--------|-----------|
| `d2f,` | Delete to 2nd comma | Delete till second occurrence |
| `3d2w` | Delete 2 words, 3 times | Total: 6 words deleted |
| `2y3j` | Yank 3 lines down, twice | Complex but legal |
| `5~` | Toggle case of 5 chars | Quick case changes |

## Step-by-Step Exercises

### Exercise 1: Basic Number Increment/Decrement
```
Starting text:
Version: 1.0.0
Count: 42
Index: 99
Port: 8080
Timeout: 30

Tasks:
1. Increment version to 1.0.1 (cursor on last 0, Ctrl-a)
2. Increase count by 5 (cursor on 42, 5Ctrl-a)
3. Decrease index by 10 (cursor on 99, 10Ctrl-x)
4. Change port to 8081 (cursor on 8080, Ctrl-a)
5. Double timeout to 60 (cursor on 30, 30Ctrl-a)
```

### Exercise 2: Count with Navigation
```
Starting text:
one two three four five six seven eight nine ten
alpha beta gamma delta epsilon zeta eta theta iota

Tasks:
1. From start, use 5w to reach "six"
2. Use 3b to go back to "three"
3. Use 2j0 to go to start of line 3
4. Use 8l to position at specific column
5. Use 2f<space> to find second space
```

### Exercise 3: Count with Operations
```
Starting text:
Line 1
Line 2
Line 3
Line 4
Line 5
Line 6

Tasks:
1. Delete lines 1-3 with 3dd
2. Yank remaining 3 lines with 3yy
3. Change 2 lines with 2cc
4. Indent 4 lines with 4>>
5. Join 3 lines with 3J
```

### Exercise 4: Sequential Numbers with Visual Block
```
Starting text:
item_1
item_1
item_1
item_1
item_1

Tasks:
1. Select "1" in all lines with Ctrl-v
2. Press gCtrl-a to create sequence

Result:
item_1
item_2
item_3
item_4
item_5
```

### Exercise 5: Complex Number Patterns
```
Starting text:
const DELAY_1 = 100;
const DELAY_1 = 100;
const DELAY_1 = 100;
const DELAY_1 = 100;

Tasks:
1. Fix numbering: Ctrl-v select "1", gCtrl-a
2. Increment all delays by 50:
   - Ctrl-v select "100" column
   - 50Ctrl-a

Result:
const DELAY_1 = 150;
const DELAY_2 = 150;
const DELAY_3 = 150;
const DELAY_4 = 150;
```

### Exercise 6: Working with Different Number Formats
```
Starting text:
decimal: 255
hex: 0xFF
octal: 0377
binary: 0b11111111
negative: -42

Tasks:
1. Increment each number with Ctrl-a
2. Observe format preservation
3. Add 10 to decimal (10Ctrl-a)
4. Subtract 5 from negative (5Ctrl-x)
5. Increment hex by 16 (16Ctrl-a on 0xFF)
```

### Exercise 7: Practical Counting Applications
```
Starting CSS:
.item { margin: 5px; }
.item { margin: 5px; }
.item { margin: 5px; }
.item { margin: 5px; }

Tasks:
1. Increment margins progressively:
   - Select "5" with Ctrl-v
   - Use gCtrl-a to create 5,6,7,8
2. Or make them all 10px:
   - Select "5" with Ctrl-v
   - Use 5Ctrl-a
```

## Common Mistakes to Avoid

### 1. Cursor Positioning for Numbers
- Ctrl-a/x works from cursor position forward
- Place cursor ON or BEFORE the number
- Won't work if cursor is after the number

### 2. Confusing Count Meanings
- `3dw` = delete word 3 times
- `d3w` = delete next 3 words
- Order matters significantly

### 3. Format Confusion
- Leading 0 makes it octal (077 = 63 decimal)
- Be careful with number formats
- Use :set nrformats-=octal to disable octal

### 4. Visual Block Increment
- `Ctrl-a` in visual block: same increment
- `gCtrl-a` in visual block: sequential increment
- Remember the 'g' for sequences

### 5. Negative Number Gotchas
- Ctrl-a on -1 gives 0 (increments)
- Ctrl-x on -1 gives -2 (decrements)
- Works as expected with signed integers

## Real-World Applications

### Array Index Generation
```javascript
// Generate array indices
arr[0] = value;
arr[0] = value;  // Select 0's with Ctrl-v, gCtrl-a
arr[0] = value;
// Becomes arr[0], arr[1], arr[2]
```

### CSS Value Adjustments
```css
.container {
    padding: 10px;  /* 5Ctrl-a for 15px */
    margin: 20px;   /* 10Ctrl-x for 10px */
    width: 100%;    /* Already perfect */
}
```

### Port Configuration
```yaml
services:
  - port: 3000  # Ctrl-a for next available
  - port: 3000  # Select all with Ctrl-v, gCtrl-a
  - port: 3000  # Creates 3000, 3001, 3002
```

### Version Bumping
```json
{
  "version": "2.3.14",  // Ctrl-a on 14 for patch
  "major": 2,           // Ctrl-a for major bump
  "minor": 3,           // Ctrl-a for minor bump
  "patch": 14           // Ctrl-a for patch bump
}
```

### Test Data Generation
```python
test_cases = [
    {"id": 1, "value": 100},  # Select ids with Ctrl-v
    {"id": 1, "value": 100},  # gCtrl-a for sequence
    {"id": 1, "value": 100},  # Select values with Ctrl-v
    {"id": 1, "value": 100},  # 10Ctrl-a to increment all
]
```

## Practice Goals

### Beginner (10 mins)
- [ ] Increment/decrement 20 numbers
- [ ] Use count with motion 15 times
- [ ] Delete multiple lines with count
- [ ] Complete Exercises 1-3

### Intermediate (15 mins)
- [ ] Create 5 number sequences with gCtrl-a
- [ ] Combine counts with different operators
- [ ] Work with hex and octal numbers
- [ ] Complete Exercises 1-5 fluently

### Advanced (20 mins)
- [ ] Generate complex number patterns
- [ ] Refactor code using count operations
- [ ] Master visual block increments
- [ ] Complete all exercises in 10 minutes

## Quick Reference Card

```
NUMBER OPERATIONS
┌─────────────────────────────┐
│ Ctrl-a   - Increment number │
│ Ctrl-x   - Decrement number │
│ 5Ctrl-a  - Add 5           │
│ 3Ctrl-x  - Subtract 3      │
│ gCtrl-a  - Sequential (visual)│
└─────────────────────────────┘

COUNT WITH MOTIONS
┌─────────────────────────────┐
│ 3w   - Forward 3 words      │
│ 5j   - Down 5 lines         │
│ 2}   - 2 paragraphs down    │
│ 4f,  - To 4th comma         │
│ 10l  - Right 10 chars       │
└─────────────────────────────┘

COUNT WITH OPERATORS
┌─────────────────────────────┐
│ 3dd  - Delete 3 lines       │
│ 2dw  - Delete 2 words       │
│ 5yy  - Yank 5 lines         │
│ 4>>  - Indent 4 lines       │
│ 3cw  - Change 3 words       │
└─────────────────────────────┘

NUMBER FORMATS
┌─────────────────────────────┐
│ 123     - Decimal           │
│ 0xFF    - Hexadecimal       │
│ 0755    - Octal             │
│ 0b1010  - Binary            │
│ -42     - Negative          │
└─────────────────────────────┘
```

## Tips for Mastery

1. **Think in Multiples**: Before moving/deleting, ask "how many?"
2. **Visual Block for Columns**: Perfect for parallel number edits
3. **Combine Operations**: `3d2w` is legal and powerful
4. **Format Awareness**: Know your number formats to avoid surprises
5. **Sequence Generation**: `gCtrl-a` is magic for test data
6. **Relative Counts**: Often easier than absolute positioning

## Connection to Previous Lessons

- **Day 01-02**: Counts enhance basic movements (3h, 5l)
- **Day 03-04**: Counts with words/paragraphs (3w, 2})
- **Day 08**: Undo counts (3u undoes 3 operations)
- **Day 09**: Count with find (3f, finds 3rd occurrence)
- **Day 10**: Visual block + numbers for column edits
- **Day 11**: Counts with change (3cw changes 3 words)

## Preview of Next Lesson

Tomorrow (Day 13), we'll explore file operations - the essential `:w`, `:q`, `:wq`, and `:e` commands for managing files, plus advanced file navigation techniques.

---

*Remember: Numbers are everywhere in code. Master these operations and you'll handle version numbers, array indices, port configs, and test data with mechanical precision.*