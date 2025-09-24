# Day 15: Paragraph Motion - Navigate at Block Speed

## Learning Objectives

By the end of this lesson, you will:
- Master paragraph navigation with { and } motions
- Understand how Vim defines paragraphs and blank lines
- Navigate code blocks and documentation efficiently
- Combine paragraph motions with operators for bulk editing
- Handle different paragraph styles in code and prose

## Understanding Paragraphs in Vim

### What is a Paragraph?

In Vim, a paragraph is defined as:
- A block of text separated by blank lines
- In code: logical blocks separated by empty lines
- In prose: traditional paragraphs with blank line separation

```
First paragraph of text
continues on this line
and ends here.
                        ← blank line (paragraph boundary)
Second paragraph starts
and contains multiple
lines of content.
                        ← blank line (paragraph boundary)
Third paragraph.
```

### Visual Representation

```
┌─────────────────────┐
│ function setup() {  │ ← Start of paragraph
│   const config = {  │
│     name: 'app',    │
│     version: '1.0'  │
│   };                │
│   return config;    │
│ }                   │ ← End of paragraph
│                     │ ← Blank line (boundary)
│ function process() {│ ← Start of next paragraph
│   // Processing     │
│   doWork();         │
│ }                   │
└─────────────────────┘
```

## Core Paragraph Motions

### Primary Motions

```
{ - Jump to previous paragraph boundary (backward)
} - Jump to next paragraph boundary (forward)
```

### Motion Behavior

```
Text Layout:           Cursor Positions After Motion:

1  function one() {    { → moves here (if starting below)
2    return 1;
3  }
4                      { or } lands here (blank line)
5  function two() {    } → moves here (if starting above)
6    return 2;
7  }
8                      { or } lands here (blank line)
9  function three() {  } → moves here (if starting above)
10   return 3;
11 }
```

## Paragraph Motion Patterns

### Code Navigation

```javascript
// Starting position: anywhere in processData function
│
▼
function processData(items) {
  const results = [];
  items.forEach(item => {
    results.push(transform(item));
  });
  return results;
}
                              ← } moves here
function validateData(data) { ← } moves here again
  if (!data) return false;
  return data.length > 0;
}
                              ← } moves here
class DataHandler {           ← } moves here
  constructor() {
    this.data = [];
  }
}
```

### Documentation Navigation

```markdown
# Section One         ← { stops here from below

Introduction paragraph
with multiple lines
of content.
                     ← { or } stops here
## Subsection        ← } stops here from above

Details about the
subsection with
extended content.
                     ← { or } stops here
Another paragraph
continues here.
```

## Combining with Operators

### Delete Operations

```vim
d{ - Delete from cursor to previous paragraph
d} - Delete from cursor to next paragraph
```

#### Example:
```python
# Before (cursor on 'return total')
def calculate():
    total = 0
    for i in range(10):
        total += i
    return total     ← cursor here

def validate():
    pass

# After pressing d{
def validate():
    pass

# Deleted everything from cursor back to blank line
```

### Change Operations

```vim
c{ - Change from cursor to previous paragraph
c} - Change from cursor to next paragraph
```

### Yank Operations

```vim
y{ - Yank from cursor to previous paragraph
y} - Yank from cursor to next paragraph
```

## Advanced Paragraph Techniques

### Visual Mode with Paragraphs

```vim
v} - Visual select to next paragraph
v{ - Visual select to previous paragraph
V} - Visual line select paragraphs
```

#### Visual Selection Example:
```ruby
# Press V} from 'def process'
def process        ← cursor starts here
  @items.each do |item|  ─┐
    puts item             │ All selected
  end                     │ with V}
end                      ─┘
                         ← selection ends here
def validate
  # validation
end
```

### Counting Paragraphs

```vim
3} - Jump forward 3 paragraphs
2{ - Jump backward 2 paragraphs
d2} - Delete next 2 paragraphs
```

### Paragraph Text Object

```vim
ip - Inner paragraph (paragraph without surrounding blank lines)
ap - A paragraph (paragraph including surrounding blank lines)
```

#### Text Object Example:
```
Before blank line    ← ap includes this blank line
│
This is a paragraph  ← ip starts here
with multiple lines
of text content.     ← ip ends here
│
After blank line     ← ap includes this blank line
```

## Common Code Patterns

### Function Navigation

```javascript
// Pattern: Jump between function definitions

function first() {    // Press } to jump to next function
  // code
}
                     // Blank line is paragraph boundary
function second() {   // Press } to arrive here
  // code
}
                     // Another boundary
function third() {    // Press 2} from first() to arrive here
  // code
}
```

### Class Method Navigation

```python
class DataProcessor:

    def __init__(self):      # Paragraph 1
        self.data = []
        self.processed = False

    def load_data(self):     # Paragraph 2 - Press } to get here
        with open('data.txt') as f:
            self.data = f.readlines()

    def process(self):       # Paragraph 3 - Press } again
        for item in self.data:
            self.transform(item)

    def save(self):          # Paragraph 4
        with open('output.txt', 'w') as f:
            f.writelines(self.data)
```

### Comment Block Navigation

```java
/**
 * First documentation block
 * with multiple lines
 */              // } stops here

public void methodOne() {
    // implementation
}

/**
 * Second documentation block
 * with details
 */              // } stops here

public void methodTwo() {
    // implementation
}
```

## Practice Exercises

### Exercise 1: Basic Navigation
```python
# practice_paragraphs.py
# Start at line 1, navigate using only { and }

def authenticate():
    username = input()
    password = getpass()
    return validate(username, password)

def authorize():
    token = generate_token()
    set_permissions(token)
    return token

def audit_log():
    timestamp = datetime.now()
    write_log(timestamp)

# Navigation goals:
# 1. Jump from authenticate to authorize (one })
# 2. Jump from audit_log to authenticate (two {)
# 3. Jump from authorize to audit_log (one })
```

### Exercise 2: Bulk Operations
```javascript
// Delete entire functions using paragraph motions

function oldFeature() {
    console.log("Deprecated");
    return null;
}

function currentFeature() {
    const result = process();
    return enhance(result);
}

function newFeature() {
    return optimize();
}

// Tasks:
// 1. Delete oldFeature() with d}
// 2. Delete currentFeature() with d{ and d}
// 3. Yank newFeature() with y{ or y}
```

### Exercise 3: Refactoring with Paragraphs
```ruby
# Refactor by moving paragraphs

def process_order
  validate_items
  calculate_total
end

def validate_items
  @items.each { |i| check(i) }
end

def calculate_total
  @items.sum(&:price)
end

# Tasks:
# 1. Move calculate_total above validate_items
# 2. Use paragraph motions to select and move
# 3. Maintain proper spacing
```

## Common Pitfalls

### Pitfall 1: Inconsistent Blank Lines
```python
# Problematic: No blank lines between functions
def one():
    pass
def two():    # { and } won't work as expected
    pass
def three():
    pass

# Better: Consistent separation
def one():
    pass

def two():    # Now { and } work properly
    pass

def three():
    pass
```

### Pitfall 2: Whitespace in "Blank" Lines
```javascript
// Looks blank but has spaces
function one() {
}
    // ← This line has spaces, not truly blank
function two() {
}

// Solution: Clean blank lines (no whitespace)
function one() {
}

function two() {
}
```

### Pitfall 3: Comment Lines Breaking Paragraphs
```java
public void methodOne() {
    // code
}
// Comment here breaks paragraph flow
public void methodTwo() {
    // code
}

// Better: Group comments with code
public void methodOne() {
    // code
}

// Comment for methodTwo
public void methodTwo() {
    // code
}
```

## Real-World Applications

### 1. Code Review Navigation
Jump between functions/methods when reviewing code:
- `}` to next method
- `{` to previous method
- `d}` to remove entire deprecated functions

### 2. Documentation Editing
Navigate and edit markdown/text documents:
- Jump between sections with `{` and `}`
- `cip` to rewrite entire paragraph
- `dap` to delete paragraph with spacing

### 3. Refactoring Code Structure
Move and reorganize code blocks:
- `dap` to cut entire function
- Navigate with `{` or `}`
- `p` to paste in new location

### 4. Log File Analysis
Navigate through log entries separated by blank lines:
- `}` to next log entry
- `{` to previous entry
- `y}` to copy entire error block

## Advanced Tips

### Tip 1: Paragraph Motion in Visual Mode
```vim
V}  - Select entire paragraph(s) in line mode
v}  - Select to next paragraph in character mode
v{  - Select to previous paragraph
```

### Tip 2: Combining with Search
```vim
/pattern<CR>}  - Search then jump to next paragraph
}n             - Jump paragraph then repeat search
```

### Tip 3: Paragraph Objects vs Motions
```vim
dip - Delete inner paragraph (content only)
d}  - Delete TO next paragraph (directional)
dap - Delete a paragraph (with blank lines)
```

### Tip 4: Quick Function Hopping
```vim
}{  - Jump to start of next paragraph
{}  - Jump to end of previous paragraph
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Navigate a 50-line file using only { and }
- [ ] Jump between 5 functions without using other motions
- [ ] Delete 3 paragraphs using d}
- [ ] Achieve 10 paragraph jumps in 30 seconds

### Intermediate (10 minutes)
- [ ] Combine paragraph motions with visual mode
- [ ] Use count prefixes (3}, 2{) accurately
- [ ] Refactor code by moving paragraphs
- [ ] Navigate mixed code/documentation files
- [ ] Use ip and ap text objects effectively

### Advanced (15 minutes)
- [ ] Navigate 500+ line file with only paragraph motions
- [ ] Perform complex refactoring with paragraph operations
- [ ] Chain paragraph motions with other operations
- [ ] Use paragraphs for quick code review
- [ ] Master paragraph navigation in different file types

## Quick Reference Card

```
Motion      | Description
------------|---------------------------
{           | Previous paragraph
}           | Next paragraph
2{          | Back 2 paragraphs
3}          | Forward 3 paragraphs
d}          | Delete to next paragraph
d{          | Delete to previous paragraph
y}          | Yank to next paragraph
c{          | Change to previous paragraph
v}          | Visual select to next
V{          | Visual line to previous
ip          | Inner paragraph object
ap          | A paragraph object
dip         | Delete inner paragraph
cap         | Change a paragraph
yap         | Yank a paragraph
```

## Links to Other Days

- **Day 14**: Week Review → Foundation for advanced motions
- **Day 16**: Screen Navigation → Combine with paragraph jumps
- **Day 17**: Text Objects → Paragraph objects (ip, ap)
- **Day 20**: Combining Operators → Paragraph + operators
- **Day 28**: Motion Review → Paragraph patterns in practice

## Conclusion

Paragraph motions transform how you navigate code and text. Instead of scrolling or using repeated line movements, you jump instantly between logical blocks. This is especially powerful in well-formatted code where functions and classes are separated by blank lines. Master these motions to navigate files at the speed of thought, making code review, refactoring, and editing significantly faster.

Tomorrow, we'll explore screen-relative navigation with H, M, L and scrolling commands, giving you another dimension of movement control.