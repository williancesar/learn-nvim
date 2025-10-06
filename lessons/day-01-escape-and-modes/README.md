# Day 01: Escape & Modes - The Foundation of Vim

## Learning Objectives

By the end of this lesson, you will:
- Understand Vim's modal editing philosophy
- Master switching between Normal, Insert, and Visual modes
- Build muscle memory for the ESC key
- Learn why modal editing makes you faster
- Understand when to use each mode effectively

## Why Modal Editing?

Imagine if your keyboard could transform based on what you're doing. That's modal editing! Instead of holding modifier keys (Ctrl, Alt, Cmd) for commands, Vim gives your entire keyboard different superpowers in different modes.

### The Three Core Modes

```
┌──────────────────────────────────────────────┐
│                  NORMAL MODE                 │
│         (Command Center - Default)           │
│     Navigate, Delete, Copy, Paste, etc.      │
└─────────────┬───────────────┬────────────────┘
              │               │
         ESC ←│→ i,a,o       ←│→ v,V,Ctrl-v
              │               │
┌─────────────▼─────────┐ ┌───▼───────────────┐
│     INSERT MODE       │ │   VISUAL MODE     │
│   (Writing Text)      │ │ (Selecting Text)  │
│  Type like normal     │ │ Highlight regions │
└───────────────────────┘ └───────────────────┘
```

## 1. Normal Mode - Your Home Base

Normal mode is where you'll spend most of your time. It's not for typing text, but for navigating and manipulating text that already exists.

### Key Concept
**Normal mode is the default.** Unlike other editors where you're always in "insert" mode, Vim assumes you spend more time reading and editing than typing new text.

### Entering Normal Mode
- **ESC** - The universal "return to Normal" key
- **Ctrl-[** - Alternative to ESC (easier to reach!)
- **Ctrl-c** - Another alternative (with slight differences)

### Visual Indicator
Look at your cursor:
- **Block cursor (█)** = Normal mode
- **Thin line cursor (|)** = Insert mode
- **Highlighted text** = Visual mode

## 2. Insert Mode - Writing Text

Insert mode is where Vim becomes a "normal" text editor. You type, and characters appear.

### Entering Insert Mode from Normal Mode

```
    Before cursor          After cursor
         ↓                      ↓
    [i] insert            [a] append

    The |cat sat     →    The c|at sat

    [I] Insert at         [A] Append at
    line beginning        line end

    |    The cat sat  →  The cat sat    |

    [o] open line         [O] Open line
    below                 above

    The cat sat          |
    |                    The cat sat
```

### Practice Combinations
- **i** - Insert before cursor
- **a** - Append after cursor
- **I** - Insert at beginning of line (first non-blank character)
- **A** - Append at end of line
- **o** - Open new line below and enter insert mode
- **O** - Open new line above and enter insert mode

## 3. Visual Mode - Selecting Text

Visual mode lets you select text visually before operating on it. Think of it as click-and-drag with keyboard precision.

### Types of Visual Mode

```
v   - Character-wise visual mode
      Select individual characters

      The [q]uick brown fox
           ↑ start here
      The [quick bro]wn fox
           ↑-------↑ selected

V   - Line-wise visual mode
      Select entire lines

      Line 1
    → [Line 2] ←
      Line 3

Ctrl-v - Block visual mode
         Select rectangular blocks

         The |cat| sat
         The |dog| ran
         The |fox| hid
```

### Entering Visual Mode
- **v** - Character-wise selection
- **V** - Line-wise selection
- **Ctrl-v** - Block selection (column mode)

### Exiting Visual Mode
- **ESC** or **Ctrl-[** - Return to Normal mode
- **o** - Move cursor to other end of selection

## Step-by-Step Exercises

### Exercise 1: Mode Switching Basics
1. Open Neovim: `nvim practice.txt`
2. You start in Normal mode (block cursor)
3. Press **i** to enter Insert mode (cursor becomes thin line)
4. Type: "Hello, Vim!"
5. Press **ESC** to return to Normal mode
6. Press **a** to append after cursor
7. Type: " Welcome."
8. Press **ESC** again

### Exercise 2: Different Insert Positions
Starting with this text in Normal mode:
```
The quick brown fox
```

1. Place cursor on 'q' in "quick"
2. Press **i** and type "very " - Result: "The very quick brown fox"
3. Press **ESC**
4. Press **A** and type " jumps" - Result: "The very quick brown fox jumps"
5. Press **ESC**
6. Press **I** and type "Look! " - Result: "Look! The very quick brown fox jumps"

### Exercise 3: New Line Operations
1. Start with cursor anywhere on a line
2. Press **o** - Opens line below, enters Insert mode
3. Type a new sentence
4. Press **ESC**
5. Press **O** - Opens line above
6. Type another sentence
7. Press **ESC**

### Exercise 4: Visual Selection Practice
1. In Normal mode, place cursor at the beginning of a word
2. Press **v** to enter Visual mode
3. Press **l** repeatedly to extend selection character by character
4. Press **ESC** to cancel selection
5. Try again with **V** for line selection
6. Use **j** and **k** to extend line selection

### Exercise 5: The ESC Reflex
**Goal**: Build muscle memory for ESC

1. Enter Insert mode (**i**)
2. Type a single word
3. Immediately press **ESC**
4. Repeat 20 times with different entry methods (i, a, o, O, I, A)

**Pro tip**: Remap Caps Lock to ESC at the OS level for easier reach!

## Common Mistakes to Avoid

### Mistake 1: Staying in Insert Mode
❌ **Wrong**: Entering Insert mode and using arrow keys to navigate
✅ **Right**: ESC to Normal mode → Navigate → Enter Insert mode only to type

### Mistake 2: Forgetting Which Mode You're In
❌ **Wrong**: Typing commands in Insert mode (they appear as text!)
✅ **Right**: Always check your cursor shape and status line

### Mistake 3: Using Mouse in Terminal Vim
❌ **Wrong**: Reaching for the mouse to select text
✅ **Right**: Use Visual mode for precise keyboard selection

### Mistake 4: Overusing Visual Mode
❌ **Wrong**: Entering Visual mode for single-character operations
✅ **Right**: Use Normal mode operators (we'll learn these later)

## Real-World Applications

### Scenario 1: Editing Configuration Files
```yaml
# In Normal mode, quickly jump to values and change them
server:
  host: localhost  # A to append ":8080"
  port: 3000      # I to insert "# " to comment
```

### Scenario 2: Code Refactoring
```python
def calculate(x, y):  # A to add "-> float:"
    return x + y      # o to add new line below
```

### Scenario 3: Writing Documentation
```markdown
# Header  # A to append text
          # o to start new paragraph
          # O to add line above header
```

## Tips for VSCode Users

If you're coming from VSCode, here's a mental model shift:

| VSCode Habit | Vim Alternative |
|-------------|-----------------|
| Always in "typing mode" | Default to Normal mode |
| Ctrl+A to select all | ggVG in Normal mode |
| Click to position cursor | Navigate in Normal mode |
| Ctrl+C/V for copy/paste | Visual mode + y/p |
| Hold Shift to select | Enter Visual mode |

### Transitional Tips
1. **Start slow**: Use Insert mode more initially, gradually increase Normal mode usage
2. **Disable arrow keys**: Force yourself to use hjkl (tomorrow's lesson!)
3. **Use `:help mode` in Vim**: Built-in documentation is excellent
4. **Practice mode indicators**: Always know which mode you're in

## Practice Goals for Today

### Beginner (Complete all)
- [ ] Switch between modes 50 times without looking at keyboard
- [ ] Use all 6 insert mode entry methods (i, a, I, A, o, O)
- [ ] Complete a 5-minute session without using arrow keys
- [ ] Select 10 different text blocks using Visual mode

### Intermediate
- [ ] Write a complete paragraph using proper mode switching
- [ ] Edit existing text using only keyboard navigation
- [ ] Use Ctrl-[ instead of ESC for one hour

### Advanced
- [ ] Complete daily coding tasks using only Vim modes
- [ ] Use block visual mode to edit multiple lines simultaneously
- [ ] Chain mode switches smoothly (Normal → Visual → Normal → Insert)

## Quick Reference

### Mode Switching Cheat Sheet
```
Normal → Insert:
  i - insert before cursor
  a - append after cursor
  I - insert at line start
  A - append at line end
  o - open line below
  O - open line above

Normal → Visual:
  v - character selection
  V - line selection
  Ctrl-v - block selection

Any → Normal:
  ESC - universal escape
  Ctrl-[ - alternative escape
  Ctrl-c - force normal mode

Visual → Normal:
  ESC - cancel selection
  Any operation - executes and returns
```

### Mode Indicators
- **Normal**: Block cursor, status shows nothing or "NORMAL"
- **Insert**: Thin cursor, status shows "-- INSERT --"
- **Visual**: Highlighted text, status shows "-- VISUAL --"
- **Visual Line**: Highlighted lines, status shows "-- VISUAL LINE --"
- **Visual Block**: Highlighted block, status shows "-- VISUAL BLOCK --"

## Tomorrow's Preview

Now that you understand modes, tomorrow we'll explore navigation in Normal mode using h, j, k, l. You'll learn why these keys were chosen and how to fly through your text without ever leaving the home row!

## Summary

Modal editing is Vim's superpower. By separating "writing" from "editing", Vim gives you an entire keyboard of commands without modifier keys. Master the ESC key, understand when to use each mode, and you're on your way to editing at the speed of thought.

**Remember**: If you're unsure which mode you're in, just hit ESC. Normal mode is home!
