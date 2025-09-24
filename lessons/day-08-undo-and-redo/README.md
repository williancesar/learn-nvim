# Day 08: Undo & Redo - Master Time Travel in Vim

## Learning Objectives

By the end of this lesson, you will:
- Master the undo/redo system with `u` and `Ctrl-r`
- Understand and leverage the `.` (dot) repeat command
- Navigate the undo tree effectively
- Combine undo/redo with other operations for efficient editing
- Build muscle memory for rapid error correction

## Theory & Concepts

### The Undo/Redo System

Vim's undo system is more powerful than traditional editors - it maintains a complete history tree of your changes.

```
Initial State: "Hello World"
     |
     v
Change 1: "Hello Vim"  <-- u undoes to here
     |
     v
Change 2: "Hello Neovim"  <-- Current state
```

### The Power of Repeat (.)

The `.` command repeats your last change operation, making repetitive edits incredibly efficient.

```
Operation Flow:
1. Make a change (ciw, dd, x, etc.)
2. Move to next location
3. Press . to repeat
4. Continue as needed
```

## Key Commands Reference

### Undo Operations
| Command | Action | Memory Aid |
|---------|--------|------------|
| `u` | Undo last change | **u**ndo |
| `U` | Undo all changes on current line | **U**ndo line |
| `Ctrl-r` | Redo (undo the undo) | **r**edo |

### Repeat Command
| Command | Action | Memory Aid |
|---------|--------|------------|
| `.` | Repeat last change | Period = "do it again" |

### Advanced Undo
| Command | Action | Memory Aid |
|---------|--------|------------|
| `:undo {n}` | Go to change number n | Time travel to specific point |
| `:earlier {n}` | Go back n changes | Earlier in time |
| `:later {n}` | Go forward n changes | Later in time |
| `:earlier {n}s` | Go back n seconds | Time-based undo |
| `g-` | Go to older change | Previous branch |
| `g+` | Go to newer change | Next branch |

## Step-by-Step Exercises

### Exercise 1: Basic Undo/Redo Flow
```
Starting text:
The quick brown fox jumps over the lazy dog.

Tasks:
1. Delete "quick" with daw (cursor on word)
2. Press u to undo
3. Press Ctrl-r to redo
4. Delete "brown" with daw
5. Delete "fox" with daw
6. Press u twice to restore both words
7. Press Ctrl-r to redo one deletion
```

### Exercise 2: The Dot Command Magic
```
Starting text:
var oldName = "value1";
var oldName = "value2";
var oldName = "value3";
var oldName = "value4";

Tasks:
1. Position cursor on first "oldName"
2. Type ciw and change to "newName"
3. Press n to find next "oldName"
4. Press . to repeat the change
5. Continue with n and . for all occurrences
```

### Exercise 3: Complex Undo Scenarios
```
Starting text:
function calculate() {
    let x = 10;
    let y = 20;
    return x + y;
}

Tasks:
1. Change x to 100 (ci0100<Esc>)
2. Change y to 200 (ci0200<Esc>)
3. Delete the return line (dd)
4. Press u three times (observe each undo)
5. Press Ctrl-r twice (redo two changes)
6. Press U on the return line
```

### Exercise 4: Dot Command with Movements
```
Starting text:
item_1, item_2, item_3, item_4, item_5

Tasks:
1. Position on "item_1"
2. Type ciw"item_1"<Esc> (add quotes)
3. Press f, to find next comma
4. Press w to move to next item
5. Press . to add quotes
6. Repeat steps 3-5 for all items
```

### Exercise 5: Advanced Undo Tree
```
Starting text:
Original text here

Tasks:
1. Make change A: "First change"
2. Make change B: "Second change"
3. Press u twice to return to original
4. Make change C: "Alternative change"
5. Use g- and g+ to navigate branches
6. Use :earlier 10s to go back 10 seconds
7. Use :later 5s to go forward 5 seconds
```

## Common Mistakes to Avoid

### 1. Confusing u and U
- `u` - Undoes last change (most common)
- `U` - Undoes all changes on current line (rarely needed)

### 2. Over-relying on Undo
- Don't use undo/redo for navigation
- Plan your edits to minimize undo usage

### 3. Not Understanding What Constitutes a Change
- Insert mode entry to exit = one change
- Each command mode operation = one change
- Understanding this helps predict undo behavior

### 4. Forgetting About the Dot Command
- Many repetitive tasks become trivial with `.`
- Always think: "Can I use . for this?"

### 5. Not Using Count with Undo
- `3u` undoes last 3 changes
- More efficient than pressing u three times

## Real-World Applications

### Refactoring Variable Names
```javascript
// Original
let userName = getUserName();
let userAge = getUserAge();
let userEmail = getUserEmail();

// Use ciw to change first "user" to "customer"
// Then use n and . to change the rest
```

### Fixing Repeated Typos
```python
# Typo: "recieve" instead of "receive"
def recieve_data():
    data = recieve_from_socket()
    return process_recieved_data(data)

# Fix first with ciw, then n and . for others
```

### Experimenting with Code
```rust
// Try different implementations
impl Calculator {
    fn add(&self, a: i32, b: i32) -> i32 {
        // Try approach 1
        a + b
        // Undo and try approach 2
        // self.internal_add(a, b)
    }
}
```

## Practice Goals

### Beginner (10 mins)
- [ ] Perform 20 undo operations smoothly
- [ ] Perform 20 redo operations smoothly
- [ ] Use the dot command 15 times
- [ ] Complete Exercise 1 without mistakes

### Intermediate (15 mins)
- [ ] Chain 5+ operations with dot command
- [ ] Navigate undo tree with g-/g+
- [ ] Use count with undo (3u, 5u)
- [ ] Complete Exercises 1-3 fluently

### Advanced (20 mins)
- [ ] Use time-based undo (:earlier/:later)
- [ ] Master undo tree branching scenarios
- [ ] Combine dot with macros (Day 15 preview)
- [ ] Complete all exercises under 10 minutes

## Quick Reference Card

```
UNDO/REDO ESSENTIALS
┌─────────────────────────────┐
│ u      - Undo last change  │
│ Ctrl-r - Redo              │
│ .      - Repeat last change│
│ 3u     - Undo 3 changes    │
└─────────────────────────────┘

ADVANCED UNDO
┌─────────────────────────────┐
│ :earlier 5  - 5 changes back│
│ :later 5    - 5 changes fwd │
│ :earlier 30s - 30 secs back │
│ g-          - Older branch  │
│ g+          - Newer branch  │
└─────────────────────────────┘

DOT COMMAND WORKFLOW
┌─────────────────────────────┐
│ 1. Make change (ciw, dd, etc)│
│ 2. Move to target (/, n, })  │
│ 3. Press . to repeat         │
│ 4. Repeat steps 2-3          │
└─────────────────────────────┘
```

## Tips for Mastery

1. **Think Before You Undo**: Understanding what you're undoing prevents confusion
2. **Use Dot for Patterns**: Any repetitive edit pattern is a dot candidate
3. **Combine with Search**: `/pattern` + `n` + `.` is incredibly powerful
4. **Practice Undo Limits**: Know how far back your undo history goes
5. **Mental Model**: Think of undo as time travel, not just "oops" fixing

## Connection to Previous Lessons

- **Day 01-02**: Basic movements to position for edits
- **Day 03-04**: Words/paragraphs as targets for changes
- **Day 05**: Search (`/`) to find locations for dot repeat
- **Day 06**: Horizontal movement for precise positioning
- **Day 07**: Marks to return after experimental changes

## Preview of Next Lesson

Tomorrow (Day 09), we'll explore character search with `f`, `F`, `t`, `T` - powerful single-line navigation that combines perfectly with the dot command for surgical text editing.

---

*Remember: Undo is not just for mistakes - it's a powerful tool for experimentation and exploration. Master it to edit fearlessly!*