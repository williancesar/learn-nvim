# Day 32: Advanced Visual Operations - Selection Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master `gv` to reselect last visual selection
- Understand `o` and `O` for pivoting selection endpoints
- Learn advanced visual mode workflows and techniques
- Build complex selection patterns for efficient editing
- Combine visual operations with other Vim features

## Visual Mode Architecture

### Mental Model: Selection as an Object

Visual mode creates a **text object** that can be manipulated. Think of selections as:
- **Anchored**: One end fixed, one end moving
- **Reversible**: Can swap which end is active
- **Persistent**: Can be recalled and reused
- **Transformable**: Can be extended, contracted, or modified

```
┌─────────────────────────────────────────┐
│        VISUAL MODE OPERATIONS           │
├─────────────────────────────────────────┤
│  Selection State                        │
│  ┌─────────────────────────────┐       │
│  │  Start ────────────> End    │       │
│  │    ↑                   ↑    │       │
│  │  Anchor              Cursor │       │
│  └─────────────────────────────┘       │
│                                         │
│  Key Operations:                        │
│  • o  - Switch cursor to other end     │
│  • O  - Switch corner (block mode)     │
│  • gv - Restore last selection         │
│  • 1v - Force charwise from visual     │
│  • 1V - Force linewise from visual     │
└─────────────────────────────────────────┘
```

## Core Advanced Operations

### 1. The `gv` Command - Selection Memory

```vim
" gv: Reselect last visual selection
" This is incredibly powerful for iterative operations

" Example workflow:
viw         " Select word
~           " Toggle case
gv          " Reselect same word
u           " Convert to lowercase
gv          " Reselect again
U           " Convert to uppercase
```

**Practical Uses:**
```vim
" Apply multiple operations to same selection
vip         " Select paragraph
:s/old/new/g " Replace in selection
gv          " Reselect paragraph
>           " Indent
gv          " Reselect
gU          " Make uppercase
```

### 2. The `o` Command - Pivot Selection

```vim
" o: Switch which end of selection is active
" Cursor jumps to other end, anchor switches

" Visual demonstration:
" Text: |The quick brown fox|
v           " Start visual at T
5w          " Selection: [The quick brown fox]
o           " Cursor jumps to T
2w          " Selection: [brown fox]
```

**Advanced Selection Adjustment:**
```vim
" Precise selection boundaries
v/pattern<CR>   " Select to pattern
o               " Jump to start
w               " Adjust start position
o               " Jump back to end
h               " Adjust end position
```

### 3. The `O` Command - Block Mode Corner Switch

```vim
" O: In visual block mode, switch corner
" <C-v>: Start visual block
" O: Move to opposite corner

" Selecting a rectangle:
<C-v>       " Start visual block
5j10l       " Create 5x10 block
O           " Switch to opposite corner
2j3l        " Adjust from that corner
```

### 4. Visual Mode Persistence Patterns

```vim
" Pattern 1: Incremental selection expansion
vaw         " Select a word
gv          " Reselect
aw          " Extend by another word
gv          " Reselect
as          " Extend to include sentence

" Pattern 2: Selection recovery after operation
vip         " Select paragraph
y           " Yank (loses selection)
gv          " Restore selection
p           " Replace with yanked text
```

## Advanced Visual Workflows

### Workflow 1: Precision Selection Building

```vim
" Build complex selections incrementally
function complexFunction() {
    let result = calculate();
    if (result > 0) {
        return processPositive(result);
    } else {
        return processNegative(result);
    }
}

" Select function body without braces:
/{<CR>      " Find opening brace
vi{         " Select inside braces
o           " Jump to start
j           " Move down one line
o           " Jump to end
k           " Move up one line
" Now have just the code, not braces
```

### Workflow 2: Multi-Pass Transformations

```vim
" Transform data with multiple passes
" Original:
user_name: john_doe
user_email: john@example.com
user_age: 30

" Pass 1: Select and change structure
/user_<CR>
<C-v>       " Start block select
2j          " Down 2 lines
e           " To end of user_
c           " Change
person.<Esc>

" Pass 2: Use gv for capitalization
gv          " Reselect last change
$           " Extend to line end
gU          " Uppercase
```

### Workflow 3: Visual Mode with Macros

```vim
" Combine visual selection with macro recording
qa          " Start recording
gv          " Reselect last visual
:s/\<\(\w\)/\u\1/g<CR> " Capitalize words
gv          " Reselect
>           " Indent
q           " Stop recording

" Now @a will repeat on any selection:
vip         " Select paragraph
@a          " Apply transformation
```

## Advanced Selection Techniques

### 1. Visual Mode Switching

```vim
" Convert between visual modes while maintaining selection
v           " Start character-wise
iw          " Select word
<C-v>       " Convert to block (maintains boundaries)
V           " Convert to line-wise

" Force specific mode from operator pending:
d<C-v>      " Force blockwise delete
y<C-v>      " Force blockwise yank
```

### 2. Selection with Counts

```vim
" Extend selections with counts
v3w         " Select 3 words
V5j         " Select 5 lines
<C-v>10l5j  " Select 10x5 block

" Reselect with modification:
gv          " Reselect
3j          " Extend 3 lines down
gv          " Reselect original
3k          " Contract 3 lines up
```

### 3. Visual Mode with Text Objects

```vim
" Combining visual with text objects
vit         " Select inside tags
o           " Switch ends
at          " Extend to include tags
gv          " Reselect
it          " Back to inside only

" Nested selections:
vi{         " Inside braces
o           " To start
i{          " Inside next level
```

## Complex Operations

### Operation 1: Columnar Editing

```vim
" Align assignments in code:
let shortVar = 1;
let veryLongVariableName = 2;
let med = 3;

" Process:
/=<CR>      " Find first =
<C-v>       " Start block
2j          " Select column down
I <Esc>     " Insert space before
gv          " Reselect
r=          " Ensure all are =
gv          " Reselect
I <Esc>     " Add more spacing
```

### Operation 2: Selection Arithmetic

```vim
" Increment numbers in selection:
" 1, 1, 1, 1, 1

V           " Select line
:s/\d\+/\=submatch(0)+1/g<CR>
" Result: 2, 2, 2, 2, 2

gv          " Reselect
:s/\d\+/\=line('.')/g<CR>
" Numbers become line numbers
```

### Operation 3: Template Expansion

```vim
" Expand template with visual mode:
" TODO: implement

vit         " Select TODO text
c           " Change
function process(data) {<CR>
    return data.map(transform);<CR>
}<Esc>
gv          " Could reselect to verify replacement
```

## Practice Exercises

### Exercise 1: Selection Gymnastics

```vim
" Practice selection pivoting:
The quick brown fox jumps over the lazy dog.

" Tasks:
" 1. Select "quick brown fox"
" 2. Use 'o' to expand to include "The"
" 3. Use 'o' again to contract to just "brown fox"
" 4. Use 'gv' to restore original selection
```

### Exercise 2: Block Mode Mastery

```vim
" Column operations:
name:    John
age:     30
city:    NYC
country: USA

" Tasks:
" 1. Select all values (John, 30, NYC, USA) with block mode
" 2. Use 'O' to adjust selection
" 3. Transform all values
```

### Exercise 3: Multi-Pass Processing

```vim
" Transform data structure:
{name: "john", age: 30}
{name: "jane", age: 25}
{name: "bob", age: 35}

" Tasks:
" 1. Select all names with block mode
" 2. Uppercase them
" 3. Use gv to reselect and quote them
" 4. Select ages and increment by 1
```

## Common Pitfalls & Solutions

### Pitfall 1: Lost Selection After Operation
**Problem**: Selection disappears after yank/delete
**Solution**: Use `gv` to restore
```vim
vip         " Select paragraph
y           " Yank (loses selection)
gv          " Restore for next operation
```

### Pitfall 2: Wrong Selection Endpoint
**Problem**: Extended selection too far
**Solution**: Use `o` to switch and adjust
```vim
v/end<CR>   " Selected too much
o           " Switch to start
w           " Adjust start position
```

### Pitfall 3: Block Mode Confusion
**Problem**: Can't adjust block properly
**Solution**: Understand `O` for corner switching
```vim
<C-v>5j10l  " Initial block
O           " Switch corner
2j3l        " Adjust from opposite corner
```

## Real-World Applications

### 1. Code Formatting
Use visual block mode to align comments, variables, or imports.

### 2. Data Processing
Select and transform CSV columns or log file fields.

### 3. Refactoring
Select method signatures across multiple lines for consistent changes.

### 4. Documentation
Select and format lists, tables, or code blocks uniformly.

## Practice Goals

### Beginner (15 mins)
- [ ] Master `gv` for reselection
- [ ] Practice `o` for endpoint switching
- [ ] Use visual mode with text objects
- [ ] Combine visual with simple operations

### Intermediate (25 mins)
- [ ] Master block mode with `O`
- [ ] Build complex selections incrementally
- [ ] Create multi-pass transformations
- [ ] Use visual mode in macros

### Advanced (35 mins)
- [ ] Implement columnar editing workflows
- [ ] Create visual mode functions
- [ ] Master selection arithmetic
- [ ] Build custom visual operators

## Quick Reference Card

```
RESELECTION
gv          Reselect last visual selection
1v          Reselect as charwise
1V          Reselect as linewise
1<C-v>      Reselect as blockwise

SELECTION PIVOTING
o           Go to other end of selection
O           Go to other corner (block mode)

SELECTION ADJUSTMENT
v           Start/toggle charwise
V           Toggle linewise
<C-v>       Toggle blockwise
<Esc>       Exit visual mode

VISUAL WITH OPERATIONS
>           Indent selection
<           Unindent selection
~           Toggle case
u           Lowercase
U           Uppercase
J           Join lines
=           Auto-indent

VISUAL MODE COMMANDS
:'<,'>      Command on selection
gv          After command to reselect
```

## Connection to Other Lessons

**Previous**: Day 31's macros can be powerfully combined with visual selections for automation.

**Next**: Day 33 will explore search and replace, which often uses visual mode for scoped operations.

**Related Concepts**:
- Visual mode basics (Day 10)
- Text objects (Day 17-19) for selection targets
- Registers (Day 29) for storing selections

## Summary

Advanced visual operations transform selections from simple highlighting into a powerful editing paradigm. Master these techniques to:
- Build precise selections incrementally
- Recover and reuse previous selections
- Navigate and adjust selection boundaries dynamically
- Combine visual mode with other Vim features for complex workflows

Remember: Visual mode is not just about seeing your selection—it's about treating selections as persistent, manipulatable objects that enhance your editing efficiency.