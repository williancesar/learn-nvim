# Day 09: Character Search - Precision Line Navigation

## Learning Objectives

By the end of this lesson, you will:
- Master forward and backward character search with `f` and `F`
- Use "till" motions `t` and `T` for precise positioning
- Chain searches efficiently with `;` and `,`
- Combine character search with operators for powerful edits
- Develop muscle memory for instant in-line navigation

## Theory & Concepts

### The Character Search System

Character search provides surgical precision within a line, complementing the broader `/` search from Day 05.

```
Line Navigation Hierarchy:
├── Global: / and ? (entire file)
├── Line: f, F, t, T (current line)
└── Repeat: ; and , (continue search)
```

### Mental Model: The Sniper vs The Scout

```
f/F = The Sniper (lands ON target)
     "Jump to that parenthesis"

t/T = The Scout (stops BEFORE target)
     "Go up to but not including that comma"
```

### Search Direction Flow

```
Current line: const example = (arg1, arg2, arg3) => result;
              ^cursor here

f( → moves TO (         : const example = (
t( → moves BEFORE (     : const example =(
F; → moves back TO ;    : const example = (arg1, arg2, arg3) => result;
T; → moves BEFORE ;     : const example = (arg1, arg2, arg3) => result ;
```

## Key Commands Reference

### Primary Character Search
| Command | Action | Memory Aid |
|---------|--------|------------|
| `f{char}` | Find forward TO character | **f**ind forward |
| `F{char}` | Find backward TO character | **F**ind backward (capital = reverse) |
| `t{char}` | Till forward (before char) | **t**ill (stop before) |
| `T{char}` | Till backward (before char) | **T**ill backward |

### Search Repetition
| Command | Action | Memory Aid |
|---------|--------|------------|
| `;` | Repeat last f/F/t/T forward | Semicolon continues |
| `,` | Repeat last f/F/t/T backward | Comma reverses |

### Common Combinations
| Pattern | Usage | Example |
|---------|-------|---------|
| `df{char}` | Delete from cursor to char (inclusive) | `df)` deletes to ) |
| `dt{char}` | Delete from cursor till char (exclusive) | `dt)` deletes up to ) |
| `cf{char}` | Change from cursor to char | `cf,` change to comma |
| `ct{char}` | Change from cursor till char | `ct]` change till bracket |
| `vf{char}` | Visual select to char | `vf}` select to brace |
| `yf{char}` | Yank to char | `yf"` copy to quote |

## Step-by-Step Exercises

### Exercise 1: Basic Character Finding
```
Starting text:
The quick brown fox jumps over the lazy dog.

Tasks:
1. Start at beginning of line
2. Press fx to jump to 'x' in "fox"
3. Press fo to jump to 'o' in "over"
4. Press Fq to jump back to 'q' in "quick"
5. Press ; to find next 'q' (none, stays put)
6. Press fo then ; twice (finds all 'o's forward)
```

### Exercise 2: Till Motion Precision
```
Starting text:
function calculate(param1, param2, param3) {

Tasks:
1. Start at 'f' in "function"
2. Press t( to move before opening paren
3. Press f, to jump to first comma
4. Press t, to move before next comma
5. Press T( to move back after opening paren
6. Press dt) to delete all parameters
```

### Exercise 3: Programming Delimiters
```
Starting text:
const data = {name: "Alice", age: 30, city: "NYC"};

Tasks:
1. Position at start of line
2. Use f{ to find opening brace
3. Use t} to position before closing brace
4. Use F: to find last colon backwards
5. Use f" then ; repeatedly to find all quotes
6. Use ci" after f" to change string contents
```

### Exercise 4: Complex Edits with Character Search
```
Starting text:
array[0] = getValue(); array[1] = getValue(); array[2] = getValue();

Tasks:
1. Start at beginning
2. Use f[ to find first bracket
3. Use ci] to change index to 'i'
4. Use f; to find semicolon
5. Use f[ to find next bracket
6. Use . to repeat change (from Day 08)
7. Continue pattern for all indices
```

### Exercise 5: Method Chaining Navigation
```
Starting text:
result.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b);

Tasks:
1. Use f. to navigate between method calls
2. Use t. to position before dots
3. Use T. to jump back after previous dot
4. Use f> then ; to find all arrows
5. Use ct) to change method arguments
```

### Exercise 6: CSV/List Manipulation
```
Starting text:
Apple, Banana, Cherry, Date, Elderberry, Fig, Grape

Tasks:
1. Use f, to jump between items
2. Use dt, to delete item (preserves comma)
3. Use df, to delete item with comma
4. Use ct, to change item
5. Chain with ; for rapid navigation
```

## Common Mistakes to Avoid

### 1. Confusing f/t Inclusivity
- `f` includes the character (ON target)
- `t` excludes the character (BEFORE target)
- Remember: `df)` deletes the ), `dt)` doesn't

### 2. Forgetting About Semicolon/Comma
- `;` continues search in same direction
- `,` reverses search direction
- Don't repeatedly type `fx` when `;` will do

### 3. Using f/F When / is Better
- `f` is for current line only
- Use `/` for multi-line searches
- Don't chain multiple `j` + `f` when `/` is cleaner

### 4. Not Combining with Operators
- `f` alone just moves cursor
- `df`, `cf`, `yf`, `vf` perform operations
- Always think: "What do I want to DO when I get there?"

### 5. Case Sensitivity Confusion
- `fx` finds lowercase 'x' only
- `fX` finds uppercase 'X' only
- Character search is always case-sensitive

## Real-World Applications

### HTML/JSX Attribute Editing
```html
<button class="btn-primary" onclick="handleClick()" disabled>
<!-- Use f" to jump between attributes -->
<!-- Use ci" to change attribute values -->
```

### Function Parameter Navigation
```python
def process_data(input_file, output_file, verbose=True, retry=3):
    # Use f, and t, to navigate parameters
    # Use ct, or ct) to change parameter values
```

### URL Manipulation
```javascript
const url = "https://api.example.com/v1/users/123/profile";
// Use f/ to navigate path segments
// Use dt/ to delete segments
// Use ct/ to change segments
```

### Configuration Files
```yaml
database:
  host: localhost
  port: 5432
  user: admin
  # Use f: to find key-value separators
  # Use f<space> then cE to change values
```

## Practice Goals

### Beginner (10 mins)
- [ ] Find 30 characters with f/F
- [ ] Use t/T motions 20 times
- [ ] Chain 10 searches with ;
- [ ] Complete Exercises 1-2 smoothly

### Intermediate (15 mins)
- [ ] Combine f/t with d/c/y operations 20 times
- [ ] Use , to reverse search 10 times
- [ ] Navigate complex code structures
- [ ] Complete Exercises 1-4 without hesitation

### Advanced (20 mins)
- [ ] Edit 10 lines using only f/F/t/T navigation
- [ ] Chain 5+ operations with ; continuation
- [ ] Refactor code using character search
- [ ] Complete all exercises in under 8 minutes

## Quick Reference Card

```
CHARACTER SEARCH
┌─────────────────────────────┐
│ f{c} - Find char forward    │
│ F{c} - Find char backward   │
│ t{c} - Till char forward    │
│ T{c} - Till char backward   │
│ ;    - Repeat search        │
│ ,    - Reverse repeat       │
└─────────────────────────────┘

COMMON PATTERNS
┌─────────────────────────────┐
│ df) - Delete to )           │
│ dt) - Delete till )         │
│ cf" - Change to "           │
│ ct, - Change till ,         │
│ vf} - Select to }           │
│ yf; - Yank to ;             │
└─────────────────────────────┘

SEARCH LOGIC
┌─────────────────────────────┐
│ f = ON target (inclusive)   │
│ t = BEFORE target (exclusive)│
│ Capital = Backward direction│
│ ; = Continue same direction │
│ , = Reverse direction       │
└─────────────────────────────┘
```

## Tips for Mastery

1. **Think in Landmarks**: Punctuation marks are navigation waypoints
2. **Prefer t for Edits**: `ct` and `dt` often give cleaner results
3. **Use f for Movement**: When just navigating, `f` is more intuitive
4. **Chain with Semicolon**: Don't repeat `f{char}`, use `;` instead
5. **Combine with Counts**: `2f,` finds the second comma
6. **Visual Feedback**: Use `vf` to see what will be affected before `df`

## Connection to Previous Lessons

- **Day 01-02**: Foundation movements that f/F/t/T enhance
- **Day 05**: Global search `/` vs line search `f`
- **Day 06**: `0` and `$` for line boundaries, `f/t` for precision
- **Day 08**: Combine `.` repeat with `f` navigation patterns

## Preview of Next Lesson

Tomorrow (Day 10), we'll explore Visual Mode - Vim's powerful selection system with `v`, `V`, and `Ctrl-v`, enabling you to see and manipulate exactly what you want to change.

---

*Remember: Character search is your precision tool. While `/` is your telescope for finding content across files, `f` is your magnifying glass for surgical edits within lines.*