# Day 16: Screen Navigation - Master Your Viewport

## Learning Objectives

By the end of this lesson, you will:
- Navigate using screen-relative positions with H, M, L
- Control scrolling precisely with Ctrl-d, Ctrl-u, Ctrl-f, Ctrl-b
- Maintain cursor position while scrolling with zz, zt, zb
- Combine screen navigation with other motions for efficiency
- Understand viewport management for long files

## Understanding the Viewport

### Screen Anatomy

```
┌──────────────────────────────────┐
│ Line 42: function process() {    │ ← H (High/Top)
│ Line 43:   const data = [];      │
│ Line 44:   for (let i = 0; i <   │
│ Line 45:     data.push(i * 2);   │
│ Line 46:   }                     │
│ Line 47:   return data;          │ ← M (Middle)
│ Line 48: }                       │
│ Line 49:                         │
│ Line 50: function validate() {   │
│ Line 51:   if (!data) {          │
│ Line 52:     return false;       │ ← L (Low/Bottom)
└──────────────────────────────────┘
  Your viewport (visible area)

File continues above and below...
```

### Viewport vs File

```
Complete File:          Your Screen:
Line 1    ┐            ┌─────────┐
Line 2    │            │ Line 42 │ ← Currently
Line 3    │            │ Line 43 │   visible
...       │            │ ...     │   portion
Line 42   ├──────────→ │ Line 52 │
Line 43   │            └─────────┘
...       │
Line 100  ┘
```

## Screen Position Motions

### H, M, L - Screen Relative Jumps

```
H - Move to High (top) of screen
M - Move to Middle of screen
L - Move to Low (bottom) of screen
```

#### Visual Example:
```
┌──────────────────────────┐
│ def function_one():      │ ← H moves here
│   implementation = 1     │ ← 2H moves here
│   return implementation  │ ← 3H moves here
│                         │
│ def function_two():      │
│   result = process()     │ ← M moves here
│   return result * 2      │
│                         │
│ def function_three():    │ ← 3L moves here
│   data = fetch()        │ ← 2L moves here
│   return validate(data)  │ ← L moves here
└──────────────────────────┘
```

### Count Modifiers

```vim
5H - Move to line 5 from top of screen
3L - Move to line 3 from bottom of screen
```

## Scrolling Commands

### Half-Page Scrolling

```
Ctrl-d - Down half page (Down)
Ctrl-u - Up half page (Up)
```

#### Scrolling Visualization:
```
Before Ctrl-d:          After Ctrl-d:
┌─────────────┐        ┌─────────────┐
│ Line 10     │        │ Line 20     │ ← Was middle
│ Line 11     │        │ Line 21     │
│ Line 12     │        │ Line 22     │
│ Line 13     │        │ Line 23     │
│ Line 14     │   →    │ Line 24     │
│ Line 15     │        │ Line 25     │
│ Line 16     │        │ Line 26     │
│ Line 17     │        │ Line 27     │
│ Line 18     │        │ Line 28     │
│ Line 19     │        │ Line 29     │
│ Line 20     │ ←Mid   │ Line 30     │ ← New middle
└─────────────┘        └─────────────┘
```

### Full-Page Scrolling

```
Ctrl-f - Forward full page (Page down)
Ctrl-b - Backward full page (Page up)
```

#### Page Movement:
```
Page 1 (Lines 1-30)    Page 2 (Lines 31-60)
┌─────────────┐        ┌─────────────┐
│ Lines 1-30  │  Ctrl-f│ Lines 31-60 │
│             │   →    │             │
│             │   ←    │             │
│             │ Ctrl-b │             │
└─────────────┘        └─────────────┘
```

### Smooth Scrolling

```
Ctrl-e - Scroll down one line (expose one more line)
Ctrl-y - Scroll up one line (yank screen up)
```

## Centering and Positioning

### Cursor Line Positioning

```
zz - Center current line in window
zt - Put current line at top
zb - Put current line at bottom
```

#### Positioning Example:
```
Before zz:              After zz:
┌─────────────┐        ┌─────────────┐
│ Line 1      │        │ Line 18     │
│ Line 2      │        │ Line 19     │
│ Line 3      │        │ Line 20     │
│ Line 4      │        │ Line 21     │
│ Line 5      │   →    │ Line 22     │
│ ...         │        │ Line 23 ←   │ Cursor line
│ Line 23 ←   │ Cursor │ Line 24     │ centered
│ Line 24     │        │ Line 25     │
│ Line 25     │        │ Line 26     │
└─────────────┘        └─────────────┘
```

### Advanced Positioning

```vim
z<CR>  - Put current line at top and move to first non-blank
z.     - Center current line and move to first non-blank
z-     - Put current line at bottom and move to first non-blank
```

## Combined Navigation Patterns

### Pattern 1: Jump and Center

```vim
/search<CR>zz  - Search and center result
50Gzz          - Go to line 50 and center
}zz            - Next paragraph and center
]]zz           - Next section and center
```

### Pattern 2: Screen Hopping

```vim
L              - Jump to bottom of screen
Ctrl-f         - Scroll forward one page
H              - Jump to top of new screen
```

### Pattern 3: Contextual Reading

```vim
zt             - Current line to top (read below)
zb             - Current line to bottom (read above)
zz             - Center for context on both sides
```

## Practical Code Navigation

### Function Review Pattern

```python
# Large file navigation strategy

def important_function():     # Found with /important
    setup()                   # zt - put at top to see full function
    process()
    cleanup()
    return result

# ... many lines ...

def helper_function():        # Jump here with }
    validate()               # zz - center to see context
    transform()

def another_function():      # L - jump to bottom visible
    initialize()            # Ctrl-f - next screen
    execute()
```

### Code Reading Flow

```javascript
// Reading long function
function complexAlgorithm() {
    // Part 1: Setup        ← zt here to read downward
    const config = {};
    const data = [];

    // Part 2: Processing   ← zz here for context
    for (let i = 0; i < 1000; i++) {
        // ... 50 lines of code ...
    }

    // Part 3: Cleanup      ← zb here to see what came before
    cleanup(data);
    return results;
}
```

### Debugging Navigation

```java
// Stack trace navigation
public void problematicMethod() {
    try {
        operation1();      // Error here - use zz to center
        operation2();
        operation3();
    } catch (Exception e) {
        logger.error(e);   // Jump with / then zz
    }
}

// Navigate related methods
private void operation1() {   // Ctrl-d to scroll down
    // implementation
}

private void operation2() {   // M to jump to middle
    // implementation
}
```

## Visual Mode with Screen Navigation

### Visual Selection Patterns

```vim
vL  - Visual select from cursor to bottom of screen
vH  - Visual select from cursor to top of screen
VH  - Line select to top of screen
VL  - Line select to bottom of screen
```

#### Example:
```python
# Select visible function
def visible_function():    ← Cursor here, press VL
    line1()                │
    line2()                │ All selected
    line3()                │
    line4()                ↓
    return result         ← L position
```

### Scrolling in Visual Mode

```vim
v           - Enter visual mode
Ctrl-d      - Scroll down while selecting
Ctrl-u      - Scroll up while selecting
```

## Common Patterns and Workflows

### Workflow 1: Code Review

```vim
1. Open file: vim large_file.py
2. gg        - Go to top
3. Ctrl-d    - Scroll down half page
4. M         - Jump to middle for focus
5. zz        - Center interesting code
6. Ctrl-d    - Continue reviewing
7. H         - Check top of screen
8. L         - Check bottom
9. Ctrl-f    - Next page
```

### Workflow 2: Refactoring

```vim
1. /function_to_refactor<CR>  - Find function
2. zz                         - Center it
3. V                          - Start line selection
4. }                          - Select to paragraph end
5. d                          - Delete
6. /new_location<CR>          - Find insertion point
7. zt                         - Put at top
8. p                          - Paste below
```

### Workflow 3: Debugging

```vim
1. /error<CR>     - Find error message
2. zz             - Center for context
3. Ctrl-u         - Scroll up to see cause
4. mm             - Mark position
5. H              - Jump to top of screen
6. /related<CR>   - Find related code
7. `m             - Return to mark
```

## Practice Exercises

### Exercise 1: Screen Navigation Basics

```python
# practice_screen.py - 100 lines
# Goals:
# 1. Navigate using only H, M, L
# 2. Never use j, k for this exercise

def function_01(): pass
def function_02(): pass
def function_03(): pass
# ... functions 04-97 ...
def function_98(): pass
def function_99(): pass
def function_100(): pass

# Tasks:
# - Jump to middle function (M)
# - Jump to top visible (H)
# - Jump to bottom visible (L)
# - Use 5H to jump to 5th line from top
# - Use 3L to jump to 3rd line from bottom
```

### Exercise 2: Scrolling Control

```javascript
// practice_scroll.js - 200 lines
// Navigate without losing context

function section1() {
    // 20 lines of code
}

function section2() {
    // 20 lines of code
}

// ... more sections ...

// Tasks:
// 1. Start at top (gg)
// 2. Ctrl-d to scroll through file
// 3. Find section10 using screen navigation
// 4. Center it with zz
// 5. Review with Ctrl-e/Ctrl-y fine scrolling
```

### Exercise 3: Combined Techniques

```ruby
# practice_combined.rb
# Mix all screen navigation techniques

class LargeClass
  def initialize
    # setup code
  end

  def process_data
    # 50 lines of processing
  end

  def validate_results
    # 30 lines of validation
  end

  # ... many more methods ...
end

# Goals:
# 1. Navigate to process_data and use zt
# 2. Read through using Ctrl-d
# 3. Jump to validate_results with /
# 4. Center with zz
# 5. Select entire visible screen with VHL
```

## Common Pitfalls

### Pitfall 1: Forgetting Current Position

```vim
" Problem: Losing place after scrolling
Ctrl-f  " Scrolled but lost context

" Solution: Mark before scrolling
ma      " Mark current position
Ctrl-f  " Scroll
`a      " Return to mark
```

### Pitfall 2: Inefficient Reading

```vim
" Inefficient: Multiple small scrolls
Ctrl-e
Ctrl-e
Ctrl-e
Ctrl-e

" Better: Single larger scroll
Ctrl-d  " Half page at once
```

### Pitfall 3: Not Using Screen Positions

```vim
" Inefficient: Counting lines
15j  " Count 15 lines down

" Better: Use screen position
L    " Jump to bottom of screen
5L   " Or 5 lines from bottom
```

## Real-World Applications

### 1. Log File Analysis
- `G` to end of log file
- `Ctrl-b` to page backward through events
- `zz` to center interesting entries
- `H` and `L` to quickly scan visible entries

### 2. Code Documentation
- Navigate long README files with `Ctrl-d/Ctrl-u`
- Center important sections with `zz`
- Use `H` and `L` to jump between sections

### 3. Large Configuration Files
- Use `Ctrl-f/Ctrl-b` for page-by-page review
- `zt` to put section headers at top
- `M` to focus on middle configurations

### 4. Code Comparison
- Split windows and use `Ctrl-d` to sync scrolling
- `zz` to align compared sections
- `H` and `L` to check boundaries

## Advanced Tips

### Tip 1: Custom Scroll Settings

```vim
" In .vimrc - Set scroll amount
set scroll=10  " Ctrl-d/Ctrl-u scroll 10 lines
set scrolloff=5  " Keep 5 lines visible above/below cursor
```

### Tip 2: Screen Percentage Jumps

```vim
50%  " Jump to 50% of file (middle)
25%  " Jump to 25% of file
75%  " Jump to 75% of file
```

### Tip 3: Smooth Scrolling Chain

```vim
zt]czz  " Put current at top, next diff, center
HVL     " Select entire visible screen
```

### Tip 4: Window Management

```vim
Ctrl-w =  " Equalize window sizes
zH        " Scroll window left
zL        " Scroll window right
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Navigate file using only H, M, L (no hjkl)
- [ ] Scroll through 100 lines with Ctrl-d/Ctrl-u
- [ ] Center 5 different lines with zz
- [ ] Use zt and zb effectively
- [ ] Achieve 20 screen jumps in 1 minute

### Intermediate (10 minutes)
- [ ] Combine H/M/L with visual selection
- [ ] Use count modifiers (5H, 3L)
- [ ] Master Ctrl-f/Ctrl-b for paging
- [ ] Navigate 500+ line file efficiently
- [ ] Use z commands for code reading

### Advanced (15 minutes)
- [ ] Navigate without hjkl for entire session
- [ ] Develop personal scrolling workflow
- [ ] Combine screen nav with search
- [ ] Master viewport management
- [ ] Use screen navigation in macros

## Quick Reference Card

```
Motion    | Description
----------|---------------------------
H         | High (top) of screen
M         | Middle of screen
L         | Low (bottom) of screen
5H        | 5 lines from top
3L        | 3 lines from bottom
Ctrl-d    | Down half page
Ctrl-u    | Up half page
Ctrl-f    | Forward full page
Ctrl-b    | Backward full page
Ctrl-e    | Scroll down one line
Ctrl-y    | Scroll up one line
zz        | Center current line
zt        | Current line to top
zb        | Current line to bottom
z<CR>     | Line to top, cursor to start
z.        | Center line, cursor to start
z-        | Line to bottom, cursor to start
```

## Links to Other Days

- **Day 15**: Paragraph Motion → Combine with screen jumps
- **Day 17**: Text Objects → Select visible with HL
- **Day 22**: Search Patterns → Search and center
- **Day 24**: Marks → Mark before scrolling
- **Day 28**: Motion Review → Screen nav in workflows

## Conclusion

Screen navigation transforms how you read and navigate code. Instead of repeatedly pressing j and k, you jump directly to screen positions and scroll in meaningful chunks. Combined with centering commands, you maintain perfect context while moving through large files. These motions are essential for code review, debugging, and any task involving large files.

Tomorrow, we'll dive into text objects - one of Vim's most powerful features for precise text manipulation.