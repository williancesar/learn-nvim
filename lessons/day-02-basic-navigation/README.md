# Day 02: Basic Navigation - The H, J, K, L Foundation

## Learning Objectives

By the end of this lesson, you will:
- Master the h, j, k, l movement keys
- Understand why these keys were chosen
- Build muscle memory for home-row navigation
- Learn count modifiers for faster movement
- Never need arrow keys again

## Why H, J, K, L?

### Historical Context
Bill Joy chose these keys in 1976 on the ADM-3A terminal where he created vi. The ADM-3A didn't have dedicated arrow keys - instead, it had arrows printed on h, j, k, l keys!

```
    ← h  j ↓  k ↑  l →

    The HOME ROW advantage:
    Your fingers rest here naturally!
```

### The Ergonomic Advantage

```
Traditional Arrow Keys:          Vim Navigation:
┌─────────────────┐              ┌─────────────────┐
│ Move hand away  │              │ Fingers stay on │
│ from home row   │              │ the home row    │
│                 │              │                 │
│   ┌───┐         │              │  h j k l        │
│   │ ↑ │         │              │  ← ↓ ↑ →        │
│ ┌─┼───┼─┐       │              │                 │
│ │ ← ↓ → │       │              │ Index on J      │
│ └───────┘       │              │ Natural reach   │
└─────────────────┘              └─────────────────┘
```

## Movement Basics

### The Four Directions

```
         k
         ↑
    h ← [ ] → l
         ↓
         j

Memory Tricks:
- j looks like a down arrow ↓
- k kicks up
- h is to the left (west)
- l is to the right (east)
```

### Single Character Movement
- **h** - Move left one character
- **j** - Move down one line
- **k** - Move up one line
- **l** - Move right one character

### Visual Guide
```
The quick brown fox jumps
    ↑   ↑   ↑   ↑   ↑
    l→  l→  l→  l→  l→

Multiple lines for vertical movement:
Line 1  ← cursor starts here
Line 2  ← j moves down
Line 3  ← j again
Line 2  ← k moves back up
```

## Count Modifiers - Your Speed Multiplier

### The Power of Numbers
In Normal mode, typing a number before a movement repeats it:

```
5j  = Move down 5 lines
10l = Move right 10 characters
3h  = Move left 3 characters
7k  = Move up 7 lines
```

### Visual Examples

```
Starting position (│ = cursor):
│The quick brown fox
 jumps over the lazy
 dog and runs away
 quickly into the
 forest

After 2j:
 The quick brown fox
 jumps over the lazy
│dog and runs away
 quickly into the

After 10l from start:
 The quick│brown fox
```

### Counting Strategy
1. **Small movements** (1-3): Press key multiple times
2. **Medium movements** (4-9): Use count modifier
3. **Large movements** (10+): Consider other navigation methods (we'll learn these later)

## Step-by-Step Exercises

### Exercise 1: Basic Movement Drills
Create a practice file with this content:
```
Start here
Move down to this line
Then to this one
Go back up
And down again
Final line
```

1. Start at "Start here"
2. Press **j** to move to "Move down to this line"
3. Press **j** again for "Then to this one"
4. Press **k** twice to return to "Move down to this line"
5. Press **5j** to jump to "Final line"

### Exercise 2: Horizontal Navigation
```
Navigate|through|these|words|using|h|and|l
```

1. Start at the beginning
2. Press **l** repeatedly to move right
3. Count characters: use **8l** to jump 8 characters
4. Press **h** to move back left
5. Try **15h** to jump back 15 characters

### Exercise 3: The Box Pattern
Practice this pattern to build muscle memory:
```
Start → 10l → 5j → 10h → 5k (makes a box!)

█──────────→
│          │
│          │
│          │
│          ↓
←──────────
```

### Exercise 4: Count Modifier Practice
```
Line 01: Practice counting
Line 02: Two down from start
Line 03: Three down
Line 04: Four down
Line 05: Five down
Line 06: Six down
Line 07: Seven down
Line 08: Eight down
Line 09: Nine down
Line 10: Ten lines total
```

Tasks:
1. From Line 01, type **9j** to reach Line 10
2. Type **5k** to go to Line 05
3. Type **2j** for Line 07
4. Type **6k** back to Line 01

### Exercise 5: The Alphabet Challenge
```
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789012345678901234567890
The quick brown fox jumps over the lazy dog
```

Navigate to specific characters:
1. Start at 'a', navigate to 'm' (count the moves!)
2. Jump to 'Q' in line 2
3. Find the '5' in line 3
4. Land on 'fox' in line 4

## Advanced Techniques

### Holding Keys vs. Counting
```
DON'T: jjjjjjjjjj (holding or repeatedly pressing)
DO:    10j        (count modifier)

WHY: Precision and speed!
```

### Diagonal Movement Patterns
Combine horizontal and vertical for diagonal moves:
```
5j3l  - Move down 5, right 3
2k7h  - Move up 2, left 7
```

### The "Speedrun" Pattern
Practice this sequence for muscle memory:
```
10l 5j 10h 5k  (box)
5l5j 5l5j      (staircase down-right)
5h5k 5h5k      (staircase up-left)
```

## Common Mistakes to Avoid

### Mistake 1: Using Arrow Keys
❌ **Wrong**: Reaching for arrow keys
✅ **Right**: Force yourself to use hjkl only

### Mistake 2: Holding Keys
❌ **Wrong**: Holding 'j' to scroll down
✅ **Right**: Use count modifiers like 20j

### Mistake 3: Moving in Insert Mode
❌ **Wrong**: Staying in Insert mode to navigate
✅ **Right**: ESC → Navigate → Enter Insert mode

### Mistake 4: Not Counting
❌ **Wrong**: jjjjjjj (7 presses)
✅ **Right**: 7j (2 keystrokes)

### Mistake 5: Wrong Finger Placement
❌ **Wrong**: Using random fingers for hjkl
✅ **Right**: Index on j, natural reach for others

## Real-World Applications

### Code Navigation Example
```python
def calculate_total(items):    # Start here
    total = 0                   # j to move down
    for item in items:          # j again
        if item.active:         # 8l to reach 'active'
            total += item.price # 2j to skip line
    return total                # k to go back up
```

### Configuration File Editing
```yaml
server:
  host: localhost  # 2l to reach 'l' in localhost
  port: 3000      # j to next line, 8l to '3000'
  debug: true     # j, then 9l to 'true'
```

### Markdown Document Navigation
```markdown
# Header 1        # Start
                 # j to skip blank
## Header 2      # 10l to end of line
                 # j to next
Paragraph text   # 5j to jump multiple lines
```

## Tips for VSCode Users

### Breaking VSCode Habits

| VSCode Habit | Vim Alternative |
|-------------|-----------------|
| Arrow keys | hjkl |
| Page Down | Ctrl-f (we'll learn later) |
| Mouse clicking | Count + hjkl |
| Ctrl+Arrow | Word motions (tomorrow!) |
| Smooth scrolling | Discrete jumps |

### Transitional Exercises
1. **Disable arrow keys** in your vimrc:
```vim
noremap <Up> <Nop>
noremap <Down> <Nop>
noremap <Left> <Nop>
noremap <Right> <Nop>
```

2. **Practice without looking** at the keyboard
3. **Use a timer**: Navigate for 5 minutes using only hjkl

## Practice Goals for Today

### Beginner (Complete all)
- [ ] Navigate 100 lines without arrow keys
- [ ] Use count modifiers 20 times
- [ ] Complete box pattern 10 times
- [ ] Navigate a code file using only hjkl

### Intermediate
- [ ] Navigate precisely to 10 random positions using counts
- [ ] Complete alphabet challenge in under 30 seconds
- [ ] Edit a configuration file without arrow keys

### Advanced
- [ ] Complete a coding session using only hjkl
- [ ] Navigate a 500+ line file efficiently
- [ ] Achieve 50+ WPM navigation speed

## Finger Position Guide

### Proper Hand Placement
```
Left Hand:          Right Hand:
 Q W E R T          Y U I O P
  A S D F     [home] J K L ;
   Z X C V          N M , .

              Index finger → J (down)
              Middle → K (up)
              Ring → L (right)
              Index reaches → H (left)
```

### Practice Drill
1. Place fingers on home row
2. Without looking, press: j j k k l l h h
3. Increase speed gradually
4. Add counts: 2j 2k 2l 2h

## Quick Reference

### Basic Movements
```
h - Left  (←)
j - Down  (↓)
k - Up    (↑)
l - Right (→)
```

### With Counts
```
[count]h - Move left [count] characters
[count]j - Move down [count] lines
[count]k - Move up [count] lines
[count]l - Move right [count] characters

Examples:
5j  - Down 5 lines
10l - Right 10 characters
3k  - Up 3 lines
7h  - Left 7 characters
```

### Navigation Patterns
```
Horizontal line:  20l (right), 20h (back)
Vertical line:    10j (down), 10k (up)
Box pattern:      10l 5j 10h 5k
Diagonal:         5j5l (down-right)
```

## Tomorrow's Preview

Now that you've mastered character-by-character movement, tomorrow we'll learn to jump by words with w, b, e, W, B, E. You'll move through text at 10x the speed!

## Summary

The hjkl keys are the foundation of Vim navigation. By keeping your hands on the home row, you maintain speed and efficiency. Combined with count modifiers, these four simple keys give you precise control over cursor movement. Practice until hjkl becomes second nature - your future Vim self will thank you!

**Remember**: Every Vim master started with hjkl. Master these four keys, and you've taken your first real step into the world of efficient text editing!