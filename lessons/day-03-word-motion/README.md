# Day 03: Word Motion - Navigate at Word Speed

## Learning Objectives

By the end of this lesson, you will:
- Master word-based navigation with w, b, e
- Understand the difference between word and WORD (w vs W)
- Navigate code and text 10x faster than with hjkl
- Combine word motions with counts for precision jumps
- Handle special characters and code symbols efficiently

## Understanding "Words" in Vim

### Two Types of Words

Vim distinguishes between "word" and "WORD":

```
word (lowercase): Separated by non-alphanumeric characters
WORD (uppercase): Separated by whitespace only

Example text: "self.config_value = get-default-config();"

words: self . config _ value = get - default - config ( ) ;
WORDS: self.config_value = get-default-config();
```

### Visual Breakdown

```
Text:     The quick-brown fox_jumps $over the-lazy dog

words:    The│quick│-│brown│fox│_│jumps│$│over│the│-│lazy│dog
          └─┘ └───┘ │ └───┘ └─┘ │ └───┘ │ └──┘ └─┘ │ └──┘ └─┘
               word  │  word      │  word  │ word     │ word
                    not         not      not        not

WORDS:    The│quick-brown│fox_jumps│$over│the-lazy│dog
          └─┘ └────────┘ └───────┘ └───┘ └──────┘ └─┘
          WORD   WORD      WORD     WORD   WORD   WORD
```

## Core Word Motions

### Forward Motions

```
w - Forward to beginning of next word
W - Forward to beginning of next WORD
e - Forward to end of current/next word
E - Forward to end of current/next WORD

Visual representation:
"The quick brown fox"
 ↑   ↑     ↑     ↑    w movements
 ↑         ↑          W movements
   ↑    ↑     ↑    ↑  e movements
         ↑         ↑  E movements
```

### Backward Motion

```
b - Backward to beginning of previous word
B - Backward to beginning of previous WORD

Visual representation:
"The quick brown fox"
 ↑   ↑     ↑     ↑    b movements (going ←)
 ↑         ↑          B movements (going ←)
```

### Motion Diagrams

```
Forward word motions:
           w →    w →    w →
        The quick brown fox
           └e→    └e→   └e→

Backward word motions:
         ← b    ← b    ← b
        The quick brown fox
```

## Detailed Motion Behavior

### W (Beginning of Next Word)

```
Starting position: │ = cursor

│The quick brown fox
 ↓ (press w)
 The │quick brown fox
      ↓ (press w)
 The quick │brown fox
            ↓ (press w)
 The quick brown │fox
```

### E (End of Word)

```
│The quick brown fox
 ↓ (press e)
 Th│e quick brown fox
    ↓ (press e)
 The quic│k brown fox
          ↓ (press e)
 The quick brow│n fox
```

### B (Beginning of Previous Word)

```
 The quick brown fo│x
                  ↓ (press b)
 The quick brown │fox
                ↓ (press b)
 The quick │brown fox
          ↓ (press b)
 The │quick brown fox
```

## Code Navigation Examples

### JavaScript/TypeScript
```javascript
const userData = await fetchUser(userId);
↑     ↑        ↑ ↑     ↑         ↑      ↑  w positions
↑              ↑       ↑                   W positions

// With special characters:
object.method().property['key'] = value;
↑      ↑      ↑ ↑        ↑ ↑    ↑ ↑      w positions
↑              ↑                ↑         W positions
```

### Python
```python
def calculate_total(items: List[str]) -> float:
↑   ↑               ↑      ↑    ↑     ↑  ↑      w positions
↑                   ↑            ↑     ↑         W positions

self.config['debug_mode'] = True
↑    ↑      ↑ ↑           ↑ ↑     w positions
↑           ↑             ↑       W positions
```

### CSS
```css
.container-fluid:hover::after {
↑ ↑              ↑      ↑      ↑  w positions
↑                ↑             ↑  W positions

  margin-top: 2.5rem !important;
  ↑      ↑    ↑   ↑   ↑          w positions
  ↑           ↑       ↑          W positions
```

## Count Modifiers with Words

### Powerful Combinations

```
3w  - Forward 3 words
5b  - Back 5 words
2e  - Forward to end of 2nd word
4W  - Forward 4 WORDS

Example progression:
│The quick brown fox jumps over
 ↓ (3w)
 The quick brown │fox jumps over
                 ↓ (2e)
 The quick brown fox jump│s over
```

### Strategic Counting

```
Text: function processUserData(userData, options = {}) {

From start:
- 2W  → Jump to (userData,
- 4w  → Jump to processUserData
- 7w  → Jump to options
- 3e  → Jump to end of processUserData
```

## Step-by-Step Exercises

### Exercise 1: Basic Word Navigation
```
The quick brown fox jumps over the lazy dog
```

Starting from the beginning:
1. Press **w** five times (notice each jump)
2. Press **3b** to go back 3 words
3. Press **e** to go to end of current word
4. Press **2w** to skip forward 2 words
5. Press **$** (end of line), then **b** repeatedly to go backward

### Exercise 2: Code Navigation Practice
```python
def process_data(raw_data, config=None):
    if config is None:
        config = get_default_config()
    return transform(raw_data, config)
```

Tasks:
1. Navigate to `config=None` using word motions
2. Jump to `get_default_config` in one motion
3. Move from `transform` back to `process_data`
4. Count the difference between w and W movements

### Exercise 3: Special Characters Challenge
```
user@example.com:8080/api/v1/users?id=123&name=john
```

Navigate:
1. From start to `example` (count the w presses)
2. From `example` to `8080` using W
3. From `8080` to `users` using w
4. From `users` to `john` using combinations

### Exercise 4: Mixed Content
```
The URL https://github.com/user/repo-name points to the-best project!
```

1. Navigate each word with lowercase w
2. Repeat with uppercase W
3. Notice the difference in jumps
4. Use e and E to reach word endings

### Exercise 5: Speed Building
Create a file with this content and navigate it in under 30 seconds:
```
Start here and navigate through each word quickly and efficiently.
Use the word motions to jump between different positions.
Try using count modifiers like 3w or 5b for bigger jumps.
Master these motions and your speed will increase dramatically!
```

Goal: Touch every word using only w, b, e motions.

## Advanced Techniques

### Combining Motions

```
Popular combinations:
- 2w3l  : Forward 2 words, then 3 chars right
- eb    : End of word, then back one word
- 3e2b  : Forward 3 word-ends, back 2 words

Example flow:
│The quick brown fox
 2w → The quick │brown fox
 e  → The quick brow│n fox
 b  → The quick │brown fox
```

### Efficient Code Editing Patterns

```python
# Common pattern: Navigate to function arguments
def function(arg1, arg2, arg3):
    ↑ start   ↑ W   ↑ w   ↑ w

# Navigate object properties
object.property.method().value
↑      ↑ 2w    ↑ 2w   ↑ 2w
```

### The Power of WORD vs word

Use WORD (W, B, E) for:
- Skipping through code blocks
- Moving across URLs/paths
- Jumping over hyphenated-words

Use word (w, b, e) for:
- Precise code navigation
- Editing within compound words
- Navigating special characters

## Common Mistakes to Avoid

### Mistake 1: Always Using Lowercase
❌ **Wrong**: Using only w/b/e in code with symbols
✅ **Right**: Mix W/B/E for faster navigation

### Mistake 2: Not Using Counts
❌ **Wrong**: w w w w w (5 presses)
✅ **Right**: 5w (2 keystrokes)

### Mistake 3: Overshooting with WORD
❌ **Wrong**: Using W when you need precision
✅ **Right**: Use w for precise, W for speed

### Mistake 4: Forgetting 'e' Motion
❌ **Wrong**: Using w then backing up with h
✅ **Right**: Use e to land at word endings

### Mistake 5: Wrong Motion for the Task
❌ **Wrong**: Using b to go forward (then correcting)
✅ **Right**: Know your directions: w/e = forward, b = back

## Real-World Applications

### Refactoring Variable Names
```javascript
// Change all instances of 'userId' to 'userID'
const userId = getUserId(userId);
      ↑ w to reach
           ↑ 2w to reach
                        ↑ 4w from start
```

### Navigating Import Statements
```python
from package.submodule.component import ClassName, function_name
↑    ↑       ↑         ↑         ↑      ↑          ↑
W    W       2w        2w        W      W          w
```

### Editing Configuration Files
```yaml
database:
  host: localhost
  port: 5432
  name: my_database

# Use W to jump between values
# Use w for precise edits within values
```

## Tips for VSCode Users

### Equivalent VSCode Operations

| VSCode Operation | Vim Word Motion |
|-----------------|-----------------|
| Ctrl+Right | w or W |
| Ctrl+Left | b or B |
| Double-click word | w to start, e to end |
| Ctrl+D (select word) | viw (we'll learn this) |
| Alt+Right | W (WORD) |

### Breaking VSCode Habits
1. **Stop using Ctrl+arrows** - Use w/b instead
2. **Don't hold keys** - Use counts (3w not www)
3. **Think in words** not characters
4. **Use both word and WORD** appropriately

## Practice Goals for Today

### Beginner (Complete all)
- [ ] Navigate a 100-line file using only word motions
- [ ] Use each motion (w,b,e,W,B,E) 20 times
- [ ] Complete word navigation without hjkl for 10 minutes
- [ ] Navigate 10 different code files

### Intermediate
- [ ] Navigate to any word in 3 motions or less
- [ ] Use count modifiers (3w, 5b) naturally
- [ ] Edit a function using only word motions
- [ ] Achieve 30 WPM navigation speed

### Advanced
- [ ] Complete coding task using word motions exclusively
- [ ] Navigate 500-line file efficiently
- [ ] Refactor variable names using word motions
- [ ] Mix word/WORD motions fluidly

## Quick Reference

### Basic Word Motions
```
Forward:
w - beginning of next word
W - beginning of next WORD
e - end of current/next word
E - end of current/next WORD

Backward:
b - beginning of previous word
B - beginning of previous WORD

With counts:
3w - forward 3 words
5b - back 5 words
2e - end of 2nd word
```

### word vs WORD Comparison
```
Text: self.config['key'] = value

word stops:  self . config [ ' key ' ] = value
WORD stops:  self.config['key'] = value
```

### Common Patterns
```
Jump to function args:    f(w
Jump to next statement:   W
Jump to end of variable:  e
Back to start of line:    0w (or just 0)
Skip URL:                 W (treats as one WORD)
```

## Tomorrow's Preview

You've learned to navigate by characters (hjkl) and words (w,b,e). Tomorrow, we'll master line operations with 0, $, ^, g_, gg, and G. You'll be able to jump anywhere in your file instantly!

## Summary

Word motions are your speed multipliers in Vim. The distinction between word and WORD gives you both precision and speed. Master these six keys (w,b,e,W,B,E) and you'll navigate text and code 10x faster than traditional methods.

**Remember**: Use lowercase (w,b,e) for precision, uppercase (W,B,E) for speed, and always consider count modifiers for efficiency!