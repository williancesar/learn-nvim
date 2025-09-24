# Day 10: Visual Mode Basics - See What You're Changing

## Learning Objectives

By the end of this lesson, you will:
- Master character-wise visual mode with `v`
- Control line-wise visual mode with `V`
- Utilize block visual mode with `Ctrl-v` for column editing
- Combine visual modes with operators and motions
- Build confidence in selecting exactly what you need

## Theory & Concepts

### The Three Visual Modes

Visual mode provides visual feedback before applying operations, making Vim more intuitive for complex selections.

```
Visual Mode Hierarchy:
├── v     : Character-wise (precise selection)
├── V     : Line-wise (full line selection)
└── Ctrl-v: Block-wise (rectangular selection)
```

### Mental Model: Highlight Then Act

```
Traditional Vim:  Command → Motion → Result
                  d2w     → (delete 2 words)

Visual Mode:      Select → See → Command → Result
                  v2w    → [highlighted] → d → (deleted)
```

### Visual Mode State Machine

```
Normal Mode
    |
    v (character-wise)
    V (line-wise)
    Ctrl-v (block-wise)
    |
Visual Mode (selection active)
    |
    - Expand with motions (w, }, f, etc.)
    - Contract with motions
    - Switch modes (v→V→Ctrl-v)
    |
Operation (d, y, c, etc.) or Esc
    |
Normal Mode
```

## Key Commands Reference

### Entering Visual Modes
| Command | Mode | Selection Type |
|---------|------|----------------|
| `v` | Character-wise | Individual characters |
| `V` | Line-wise | Entire lines |
| `Ctrl-v` | Block-wise | Rectangular blocks |
| `gv` | Reselect | Last visual selection |

### Visual Mode Operations
| Command | Action | Works In |
|---------|--------|----------|
| `d` or `x` | Delete selection | All modes |
| `c` | Change selection | All modes |
| `y` | Yank (copy) selection | All modes |
| `~` | Toggle case | All modes |
| `>` | Indent right | All modes |
| `<` | Indent left | All modes |
| `=` | Auto-indent | All modes |
| `gU` | Uppercase | All modes |
| `gu` | Lowercase | All modes |

### Visual Mode Navigation
| Command | Action | Effect |
|---------|--------|--------|
| `o` | Switch cursor to other end | Adjust selection from other side |
| `O` | Switch corner (block mode) | Change active corner |
| `aw` | Select a word | Include surrounding space |
| `iw` | Select inner word | Word only, no space |
| `ab` or `a(` | Select a block with () | Include parentheses |
| `ib` or `i(` | Select inner block | Exclude parentheses |
| `a"` | Select quoted string | Include quotes |
| `i"` | Select inner quoted | Exclude quotes |

### Special Block Mode Commands
| Command | Action | Usage |
|---------|--------|-------|
| `I` | Insert at start of each line | Add prefix to multiple lines |
| `A` | Append at end of each line | Add suffix to multiple lines |
| `c` | Change block | Replace rectangular area |
| `r` | Replace all with character | Fill block with single char |

## Step-by-Step Exercises

### Exercise 1: Character-wise Visual Mode (v)
```
Starting text:
The quick brown fox jumps over the lazy dog.

Tasks:
1. Position cursor on "quick"
2. Press v to enter visual mode
3. Press 2w to select "quick brown"
4. Press d to delete selection
5. Press u to undo
6. Try v3w to select "quick brown fox"
7. Press y to yank, move elsewhere, press p to paste
```

### Exercise 2: Line-wise Visual Mode (V)
```
Starting text:
Line 1: First line
Line 2: Second line
Line 3: Third line
Line 4: Fourth line
Line 5: Fifth line

Tasks:
1. Position on Line 2
2. Press V to select entire line
3. Press 2j to extend selection to Line 4
4. Press d to delete three lines
5. Press u to undo
6. Press V3j to select 4 lines at once
7. Press > to indent selected lines
```

### Exercise 3: Block Visual Mode (Ctrl-v)
```
Starting text:
item_1: value_1
item_2: value_2
item_3: value_3
item_4: value_4

Tasks:
1. Position cursor on 'i' of first "item"
2. Press Ctrl-v to enter block mode
3. Press 3j to extend down 4 lines
4. Press 5l to extend right to cover "item_"
5. Press c to change, type "product_"
6. Press Esc to apply to all lines
```

### Exercise 4: Adding Prefixes with Block Mode
```
Starting text:
apple
banana
cherry
date

Tasks:
1. Position at start of "apple"
2. Press Ctrl-v
3. Press 3j to select down all 4 lines
4. Press I to insert at beginning
5. Type "- " (dash space)
6. Press Esc to apply to all lines

Result:
- apple
- banana
- cherry
- date
```

### Exercise 5: Visual Mode with Text Objects
```
Starting text:
function example(arg1, arg2, arg3) {
    return arg1 + arg2 + arg3;
}

Tasks:
1. Position inside parentheses
2. Press vi( to select inner parentheses content
3. Press Esc, then va( to include parentheses
4. Position on "arg1"
5. Press viw to select just the word
6. Position inside the function body
7. Press vi{ to select function content
8. Press va{ to include the braces
```

### Exercise 6: Complex Visual Selections
```
Starting text:
const config = {
    host: "localhost",
    port: 8080,
    secure: true,
    timeout: 5000
};

Tasks:
1. Select just values: position on "localhost", v$
2. Select key-value pair: position on "host", V
3. Select all values column: Ctrl-v on "l" of localhost, 3j, $
4. Change all values to null: after selection, cnull<Esc>
5. Select entire object: va{
6. Reselect last: gv
```

## Common Mistakes to Avoid

### 1. Forgetting to Exit Visual Mode
- Visual mode persists until you act or press Esc
- Don't leave visual mode active unintentionally
- Press Esc to return to normal mode

### 2. Confusing v and V
- `v` = character precision
- `V` = always full lines
- Choose based on what you need to select

### 3. Not Using Text Objects
- `viw`, `vi"`, `vi{` are powerful and precise
- More accurate than manual selection with hjkl
- Learn these for faster selection

### 4. Block Mode Direction Confusion
- Ctrl-v creates rectangular selection
- Motion keys extend the rectangle
- `$` in block mode means "to end of each line"

### 5. Forgetting About gv
- `gv` reselects your last visual selection
- Useful for applying multiple operations
- Great for iterative refinement

## Real-World Applications

### Commenting Multiple Lines
```python
# Select lines with V or Ctrl-v
def process():
    step_one()
    step_two()
    step_three()
# Ctrl-v, select column 0, I#<Space><Esc>
```

### Aligning Code
```javascript
// Select with Ctrl-v for column editing
const short     = 1;
const medium    = 100;
const very_long = 10000;
```

### Extracting Methods
```java
// Use V to select lines for extraction
public void original() {
    // setup code

    // Lines to extract - select with V
    processData();
    validateResults();
    saveToDatabase();

    // cleanup code
}
```

### Changing Variable Prefixes
```c
// Use Ctrl-v to change prefixes
int m_count = 0;
int m_total = 0;
int m_average = 0;
// Ctrl-v select "m_", c, type "g_"
```

## Practice Goals

### Beginner (10 mins)
- [ ] Enter each visual mode 10 times
- [ ] Select and delete 10 text segments
- [ ] Select and yank 10 text segments
- [ ] Complete Exercises 1-2

### Intermediate (15 mins)
- [ ] Use block mode for 5 multi-line edits
- [ ] Apply 10 text object selections (viw, vi", etc.)
- [ ] Use gv to reselect 5 times
- [ ] Complete Exercises 1-4 fluently

### Advanced (20 mins)
- [ ] Perform 10 column alignments with Ctrl-v
- [ ] Chain visual operations with dot repeat
- [ ] Refactor code using visual block mode
- [ ] Complete all exercises in under 10 minutes

## Quick Reference Card

```
ENTERING VISUAL MODE
┌─────────────────────────────┐
│ v      - Character-wise     │
│ V      - Line-wise          │
│ Ctrl-v - Block-wise         │
│ gv     - Reselect last      │
└─────────────────────────────┘

VISUAL MODE OPERATIONS
┌─────────────────────────────┐
│ d/x - Delete selection      │
│ c   - Change selection      │
│ y   - Yank selection        │
│ >   - Indent right          │
│ <   - Indent left           │
│ ~   - Toggle case           │
│ gU  - Uppercase             │
│ gu  - Lowercase             │
└─────────────────────────────┘

TEXT OBJECTS IN VISUAL
┌─────────────────────────────┐
│ viw - Select inner word     │
│ vaw - Select a word         │
│ vi" - Select inner quotes   │
│ vi{ - Select inner braces   │
│ vi( - Select inner parens   │
│ vit - Select inner tags     │
└─────────────────────────────┘

BLOCK MODE SPECIAL
┌─────────────────────────────┐
│ I - Insert at line start    │
│ A - Append at line end      │
│ c - Change block            │
│ r - Replace with char       │
│ o - Switch selection end    │
│ O - Switch block corner     │
└─────────────────────────────┘
```

## Tips for Mastery

1. **Start with V for Lines**: When you know you want full lines, V is faster
2. **Use Text Objects**: `vi{` is better than manually selecting braces
3. **Block Mode for Columns**: Perfect for adding prefixes, suffixes, or aligning
4. **Visual Then Operate**: See selection before applying operation
5. **Combine with Search**: `/pattern` then `vn` to select to next match
6. **Practice Mode Switching**: `v` → `V` → `Ctrl-v` switches between modes

## Connection to Previous Lessons

- **Day 01-02**: Use hjkl to extend visual selections
- **Day 03-04**: Combine w/b/e with visual mode
- **Day 05**: Search then visual select with `v//e`
- **Day 08**: Visual mode + `.` repeat for patterns
- **Day 09**: `vf{char}` for precise visual selection

## Preview of Next Lesson

Tomorrow (Day 11), we'll explore change operations (`c`, `cc`, `C`, `s`, `S`) - powerful commands that delete and immediately enter insert mode, streamlining your text modifications.

---

*Remember: Visual mode is training wheels you'll eventually outgrow for many operations, but it remains invaluable for complex selections and when you need to see exactly what you're about to change.*