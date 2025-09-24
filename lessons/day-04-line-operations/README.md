# Day 04: Line Operations - Master Line-Level Navigation

## Learning Objectives

By the end of this lesson, you will:
- Navigate instantly to any line in your file
- Master beginning and end of line movements
- Understand the subtle differences between 0, ^, and g_
- Jump to specific line numbers efficiently
- Combine line operations with other motions

## The Line Navigation Toolkit

### Overview of Line Motions

```
Line operations in Vim:
┌─────────────────────────────────────────┐
│  gg = First line of file                │
│   G = Last line of file                 │
│  :n = Go to line n                      │
│  0  = Start of line (column 0)          │
│  ^  = First non-blank character         │
│  $  = End of line                       │
│  g_ = Last non-blank character          │
└─────────────────────────────────────────┘
```

## Within-Line Navigation

### The Four Line Positions

```
Current line anatomy:
    │   def calculate_total(items):    │
    ↑   ↑                         ↑    ↑
    0   ^                         g_   $

0  = Absolute beginning (column 0)
^  = First non-blank character
$  = Absolute end (includes whitespace)
g_ = Last non-blank character
```

### Visual Comparison

```
Line with indentation and trailing spaces:
"····def process():····"
 ↑   ↑            ↑    ↑
 0   ^            g_   $

0  lands here: │····def process():····
^  lands here: ····│def process():····
g_ lands here: ····def process()│:····
$  lands here: ····def process():····│
```

### When to Use Each

```
Use 0 when:
- You need column 0 specifically
- Removing all indentation
- Selecting entire line including indents

Use ^ when:
- Starting to edit code (most common)
- Skipping indentation
- Beginning normal editing

Use $ when:
- Appending at true line end
- Including trailing whitespace
- Visual line selections

Use g_ when:
- Avoiding trailing whitespace
- Copying without extra spaces
- Clean selections
```

## File-Level Navigation

### Top and Bottom

```
gg - Go to first line of file
G  - Go to last line of file

Visual representation of a file:
┌─ Line 1 ──── gg lands here ─┐
│  Line 2                     │
│  Line 3                     │
│  ...                        │
│  Line 998                   │
│  Line 999                   │
└─ Line 1000 ── G lands here ─┘
```

### Line Number Navigation

```
Three ways to jump to specific lines:

1. [n]G     - Go to line n
   50G      - Jump to line 50
   1G       - Same as gg

2. [n]gg    - Go to line n
   50gg     - Jump to line 50
   gg       - Without number, goes to first line

3. :[n]     - Command mode navigation
   :50      - Jump to line 50
   :$       - Jump to last line
   :1       - Jump to first line
```

### Percentage Navigation

```
50% through file = 50%
25% through file = 25%

In a 1000-line file:
gg  = Line 1    (0%)
25% = Line 250  (25%)
50% = Line 500  (50%)
75% = Line 750  (75%)
G   = Line 1000 (100%)
```

## Practical Examples

### Code File Navigation

```python
# Line 1    ← gg lands here
import os
import sys

class DataProcessor:          # Line 5
    def __init__(self):       # Line 6
        self.data = []         # Line 7

    def process(self):         # Line 9
        # Processing logic     # Line 10
        pass                   # Line 11

# More code...                # Line 13

if __name__ == "__main__":    # Line 50
    main()                     # Line 51   ← G lands here

Navigation examples:
- gg    → Jump to imports
- 6G    → Jump to __init__
- 50G   → Jump to main section
- G     → Jump to end
```

### Editing Patterns

```python
····def calculate(x, y):········
    ↑   ↑              ↑       ↑
    0   ^              g_      $

Common patterns:
- ^   → Start editing the function name
- $   → Add parameters at end
- 0   → Remove all indentation
- g_  → Copy without trailing spaces
```

## Step-by-Step Exercises

### Exercise 1: Line Position Practice
Create a file with indented code:
```python
    def example():
        return True
            # Comment with indent

    class Test:
        pass
```

For each line:
1. Press **0** - notice column 0
2. Press **^** - notice first non-blank
3. Press **$** - notice absolute end
4. Press **g_** - notice last non-blank

### Exercise 2: File Navigation Jumps
Create a 50-line file (or use existing code):

1. Start anywhere, press **gg** (go to line 1)
2. Press **G** (go to last line)
3. Press **25G** (go to line 25)
4. Press **10gg** (go to line 10)
5. Type **:35** and Enter (go to line 35)
6. Press **gg** then **15j** (alternative to 16G)

### Exercise 3: Beginning/End Combinations
```
Practice these combinations:

Starting from middle of any line:
1. 0w  - Beginning of line, then first word
2. ^w  - First non-blank, then next word
3. $b  - End of line, then back one word
4. g_h - Last non-blank, then one char left

Rapid line clearing:
1. 0   - Start of line
2. d$  - Delete to end (we'll learn 'd' later)
3. ^   - First character position
```

### Exercise 4: Precise Line Jumping
```python
# Line 1: Import section
import os
import sys
from pathlib import Path

# Line 6: Configuration
DEBUG = True
VERSION = "1.0.0"

# Line 10: Main class
class Application:
    def __init__(self):
        self.initialized = False

    def run(self):
        print("Running...")

# Line 18: Entry point
if __name__ == "__main__":
    app = Application()
    app.run()
```

Tasks:
1. Jump to configuration (line 6)
2. Jump to main class (line 10)
3. Jump to entry point (line 18)
4. Return to imports (gg)

### Exercise 5: The Line Dance
Perform this sequence smoothly:
```
gg → G → 50% → gg → 10G → $ → ^ → 0 → g_ → G
```
Time yourself - aim for under 10 seconds!

## Advanced Techniques

### Combining with Visual Mode

```
V   - Visual line mode
ggVG - Select entire file
0v$ - Select entire line including whitespace
^vg_ - Select line content without spaces

Examples:
V5j  - Select 6 lines down
ggVG - Select all
```

### Line Operations with Counts

```
5gg  - Go to line 5
5G   - Also go to line 5
5j   - Down 5 lines (relative)
5k   - Up 5 lines (relative)

Difference:
10G  - Goes to absolute line 10
10j  - Goes down 10 lines from current position
```

### Efficient Patterns

```python
# Common navigation patterns:

# Jump to function definition:
/def<Enter> → ^ → w

# Jump to class:
?class<Enter> → ^

# Edit end of multiple lines:
$ → j → $ → j → $  (inefficient)
$ → j. → j.        (using repeat, we'll learn later)
```

## Common Mistakes to Avoid

### Mistake 1: Confusing 0 and ^
❌ **Wrong**: Using 0 when you want first character
✅ **Right**: Use ^ for first non-blank character

### Mistake 2: Using $ for Clean Selections
❌ **Wrong**: v$ when line has trailing spaces
✅ **Right**: vg_ for clean selection

### Mistake 3: Counting Lines Manually
❌ **Wrong**: jjjjjjjjjj (10 times)
✅ **Right**: 10j or 10G for absolute

### Mistake 4: Forgetting gg vs G
❌ **Wrong**: 1G when gg is faster
✅ **Right**: gg for first line, G for last

### Mistake 5: Not Using Line Numbers
❌ **Wrong**: Scrolling to find a line
✅ **Right**: :set number, then 123G

## Real-World Applications

### Debugging Stack Traces
```
Error at line 45: undefined variable
Error at line 102: type mismatch
Error at line 78: null reference

Quick jumps:
45G  → Check first error
102G → Check second error
78G  → Check third error
```

### Code Review Navigation
```python
# Review comments reference line numbers:
# "Line 23: Consider using list comprehension"
# "Line 45: This could be async"
# "Line 67: Add error handling"

23G  → Jump to first comment
45G  → Jump to second comment
67G  → Jump to third comment
```

### Log File Analysis
```
[ERROR] Line 1234: Connection timeout
[WARN]  Line 2456: High memory usage
[ERROR] Line 3478: Database locked

Navigation:
:1234 → First error
:2456 → Warning
:3478 → Second error
G     → Check latest entries
gg    → Check from beginning
```

## Tips for VSCode Users

### VSCode Equivalents

| VSCode Shortcut | Vim Equivalent |
|----------------|----------------|
| Ctrl+G | :n or nG |
| Ctrl+Home | gg |
| Ctrl+End | G |
| Home | 0 or ^ |
| End | $ |
| Ctrl+L (go to line) | :n |

### Transitioning Tips

1. **Enable line numbers**: `:set number` or `:set relativenumber`
2. **Use command mode**: `:` for precise jumps
3. **Think in lines**: Not pages or screens
4. **Combine motions**: 10G instead of scrolling

## Practice Goals for Today

### Beginner (Complete all)
- [ ] Navigate to 20 specific line numbers
- [ ] Use each motion (0,^,$,g_,gg,G) 10 times
- [ ] Jump between first and last line 10 times
- [ ] Practice line positions on 10 different lines

### Intermediate
- [ ] Navigate 200-line file without scrolling
- [ ] Jump to error lines from stack trace
- [ ] Use line operations in visual mode
- [ ] Combine line ops with word motions

### Advanced
- [ ] Review code using only line jumps
- [ ] Debug using stack trace line numbers
- [ ] Navigate 1000+ line file efficiently
- [ ] Master all four line positions instinctively

## Quick Reference

### Line Position Commands
```
Within line:
0  - Start of line (column 0)
^  - First non-blank character
$  - End of line
g_ - Last non-blank character

File navigation:
gg - First line of file
G  - Last line of file
nG - Go to line n
ngg - Go to line n
:n - Command mode go to line n
```

### Common Patterns
```
ggVG   - Select entire file
^v$    - Select line content
0v$    - Select entire line
^vg_   - Select without trailing spaces
50G    - Jump to line 50
:100   - Jump to line 100
gg=G   - Re-indent entire file (bonus!)
```

### Quick Jumps
```
File sections:
gg  - Top (imports, headers)
50% - Middle (main logic)
G   - Bottom (main, exports)

Line sections:
^  - Code start (skip indent)
$  - Line end (add semicolon)
0  - Absolute start (fix indent)
```

## Tomorrow's Preview

You can now navigate to any position in your file instantly. Tomorrow, we'll learn the various ways to enter Insert mode (i, a, I, A, o, O) to start making changes at these positions!

## Summary

Line operations give you instant access to any location in your file. Whether jumping to specific line numbers with G, or navigating within lines with 0,^,$,g_, you now have the tools for precise, efficient navigation. Combined with the hjkl and word motions you've already learned, you can reach any character in your file in just a few keystrokes.

**Remember**: gg for top, G for bottom, ^ for code start, $ for line end. Master these and you'll never scroll through a file again!