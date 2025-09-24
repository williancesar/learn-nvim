# Day 23: Line Jumps - Precise Navigation by Line Number

## Learning Objectives

By the end of this lesson, you will:
- Master absolute line jumps with :[number] and [number]G
- Use relative line numbers for efficient jumping
- Navigate with % for percentage-based movement
- Master bracket matching with %
- Combine line jumps with other operations

## Absolute Line Navigation

### Go to Line Commands

```vim
:50<CR>  - Jump to line 50 (command mode)
50G      - Jump to line 50 (normal mode)
50gg     - Also jump to line 50
gg       - Jump to first line
G        - Jump to last line
```

#### Visual Comparison:
```
File with 100 lines:
┌─────────────┐
│ Line 1      │ ← gg or 1G
│ Line 2      │
│ ...         │
│ Line 50     │ ← 50G or :50
│ ...         │
│ Line 75     │ ← 75G or :75
│ ...         │
│ Line 100    │ ← G or 100G
└─────────────┘
```

### Command Line Method

```vim
:50      - Go to line 50
:$       - Go to last line
:1       - Go to first line
:.       - Current line (rarely needed)
:+5      - 5 lines down from current
:-3      - 3 lines up from current
```

## Relative Line Numbers

### Enabling Relative Numbers

```vim
:set relativenumber  " Show relative line numbers
:set number         " Show absolute line numbers
:set number relativenumber  " Hybrid: current absolute, others relative
```

#### Display Example:
```
Relative Numbers:      Hybrid Mode:
  3 def function1():    47 def function1():
  2 def function2():    48 def function2():
  1 def function3():    49 def function3():
  0 def current():  →   50 def current():  ← Current line
  1 def function5():    51 def function5():
  2 def function6():    52 def function6():
  3 def function7():    53 def function7():
```

### Relative Jumps

```vim
5j   - Jump 5 lines down
5k   - Jump 5 lines up
10+ - 10 lines down (alternative)
10- - 10 lines up (alternative)
```

#### With Relative Numbers:
```python
  3  def process():      # See "3" in gutter
  2      validate()
  1      transform()
  0      return data  ← Current line
  1
  2  def validate():     # Type "2j" to jump here
  3      check_data()
```

## Percentage Navigation

### File Percentage Jumps

```vim
50%  - Jump to 50% (middle) of file
25%  - Jump to 25% of file
75%  - Jump to 75% of file
100% - Jump to end (same as G)
```

#### Visual Representation:
```
1000-line file:
┌─────────────┐
│ Line 1      │ ← 0% (gg)
│ ...         │
│ Line 250    │ ← 25%
│ ...         │
│ Line 500    │ ← 50%
│ ...         │
│ Line 750    │ ← 75%
│ ...         │
│ Line 1000   │ ← 100% (G)
└─────────────┘
```

## Bracket Matching with %

### The % Motion

```vim
%  - Jump to matching bracket/delimiter
```

#### Supported Pairs:
```
() - Parentheses
[] - Square brackets
{} - Curly braces
<> - Angle brackets (in some contexts)
/* */ - Comments (with matchit plugin)
#ifdef #endif - Preprocessor (with matchit)
```

### Bracket Matching Examples

```javascript
// Cursor on opening bracket
function example(param1, param2) {
//              ^ cursor here
//              % jumps to matching )

    if (condition) {
//     ^ cursor here
//     % jumps to matching )
//  or ^ cursor here
//     % jumps to matching }

        array[index]
//           ^ cursor here
//           % jumps to matching ]
    }
}
```

### Complex Nesting

```python
# Nested structures
data = {
    "user": {           # Cursor on this {
        "profile": {    # % skips inner brackets
            "name": "John"
        }               # And jumps here }
    }
}

# Works with any nesting depth
result = function(arg1, (arg2 + arg3), arg4)
#                ^ cursor
#                % jumps to matching )
```

## Line Operations with Jumps

### Delete to Line

```vim
d50G  - Delete from current line to line 50
d10j  - Delete next 10 lines
d5k   - Delete previous 5 lines
dG    - Delete to end of file
dgg   - Delete to beginning of file
```

#### Example:
```python
# Line 10: cursor here
def current():
    pass

# Lines to delete
def delete1():
    pass

def delete2():
    pass

# Line 20: keep this
def keep():
    pass

# d20G deletes lines 10-19
```

### Yank to Line

```vim
y50G  - Yank from current to line 50
y10j  - Yank next 10 lines
yG    - Yank to end of file
```

### Visual Selection to Line

```vim
V50G  - Visual line select to line 50
v50G  - Visual select to line 50
V%    - Visual line select to matching bracket
```

## Advanced Line Jump Patterns

### Pattern 1: Code Block Operations

```javascript
function longFunction() {  // Line 100
    // 50 lines of code

    if (condition) {       // Line 120
        // code
    }                      // Line 125

    // more code
}                          // Line 150

// At line 100, use V150G to select entire function
// At line 120, use % to jump to line 125
```

### Pattern 2: Quick Section Navigation

```python
# File with clear sections

# === IMPORTS === (Line 1)
import os
import sys

# === CONFIGURATION === (Line 20)
CONFIG = {}
SETTINGS = {}

# === FUNCTIONS === (Line 50)
def process():
    pass

# === MAIN === (Line 100)
if __name__ == "__main__":
    main()

# Jump directly: 20G for config, 50G for functions
```

### Pattern 3: Error Line Navigation

```
// Error console output:
Error at line 45: undefined variable
Error at line 102: syntax error
Error at line 234: type mismatch

// In editor:
:45   // Jump to first error
:102  // Jump to second error
:234  // Jump to third error
```

## Combining with Marks

### Mark and Jump Pattern

```vim
ma     - Mark current position
50G    - Jump to line 50
'a     - Return to mark
```

### Automatic Line Marks

```vim
''     - Previous cursor line
'.     - Last change line
'^     - Last insert line
```

## Line Range Operations

### Command Mode Ranges

```vim
:10,20d   - Delete lines 10-20
:10,20y   - Yank lines 10-20
:10,20m30 - Move lines 10-20 after line 30
:10,20co30 - Copy lines 10-20 after line 30
:10,20>   - Indent lines 10-20
```

### Visual Mode Ranges

```vim
V        - Start visual line mode
10j      - Select 10 lines down
:        - Enter command mode (range auto-filled)
'<,'>s/old/new/g  - Replace in selection
```

## Practical Workflows

### Workflow 1: Function Extraction

```python
# Large function needing refactoring
def large_function():  # Line 50
    # Part 1: Setup (lines 51-60)
    setup_code()
    more_setup()

    # Part 2: Processing (lines 61-80)
    process_data()
    transform()

    # Part 3: Cleanup (lines 81-90)
    cleanup()
    return result

# Extract Part 2:
# :61,80d  - Delete lines
# Create new function
# p        - Paste extracted code
```

### Workflow 2: Code Review Navigation

```javascript
// Review comments reference line numbers
// "Issue at line 145"
// "See also line 200"
// "Compare with line 45"

// Quick navigation:
:145  // Check issue
:200  // See reference
:45   // Compare
''    // Return to previous
```

### Workflow 3: Test Navigation

```ruby
# Test file with many test cases
describe "Feature" do
  it "test 1" do  # Line 10
  end

  it "test 2" do  # Line 20
  end

  it "test 3" do  # Line 30
  end

  it "failing test" do  # Line 89
  end
end

# Jump directly to failing test: 89G
# Jump between tests: 10G, 20G, 30G
```

## Line Jump Tips

### Tip 1: Show Line Numbers

```vim
:set number          " Absolute line numbers
:set relativenumber  " Relative line numbers
:set nonumber        " Hide line numbers

" Toggle function (add to vimrc)
nnoremap <leader>n :set relativenumber!<CR>
```

### Tip 2: Line Info Commands

```vim
Ctrl-g    " Show current line info
g Ctrl-g  " Show detailed position info
:=        " Show total lines
```

### Tip 3: Jump with Operations

```vim
50Gdd     " Go to line 50 and delete it
25Gyy     " Go to line 25 and yank it
100Gcc    " Go to line 100 and change it
```

### Tip 4: Quick Calculations

```vim
:.+10     " 10 lines after current
:$-5      " 5 lines before end
:%        " All lines (for commands)
```

## Practice Exercises

### Exercise 1: Basic Line Navigation

```python
# practice_lines.py (100 lines)
# Line numbers shown for reference

1   def function_1():
2       pass
...
25  def function_25():
26      pass
...
50  def function_50():
51      pass
...
75  def function_75():
76      pass
...
100 def function_100():

# Tasks:
# 1. Jump to line 50 with :50
# 2. Jump to line 75 with 75G
# 3. Jump to 25% with 25%
# 4. Return to top with gg
# 5. Jump to bottom with G
```

### Exercise 2: Bracket Matching

```javascript
// practice_brackets.js
function complex() {
    if (condition1) {
        while (true) {
            array[index] = {
                key: "value",
                nested: {
                    deep: [1, 2, 3]
                }
            };
        }
    }
}

// Tasks:
// 1. Position on each { and use % to find match
// 2. Position on [ and use % to jump
// 3. Use v% to select bracket contents
// 4. Use d% to delete to matching bracket
```

### Exercise 3: Range Operations

```ruby
# practice_ranges.rb
# 50 lines of code

def method_1  # Line 10
  # code
end

def method_2  # Line 20
  # code
end

def method_3  # Line 30
  # code
end

def method_4  # Line 40
  # code
end

# Tasks:
# 1. Delete lines 20-30 with :20,30d
# 2. Copy lines 10-15 after 40 with :10,15co40
# 3. Move lines 35-40 to top with :35,40m0
# 4. Indent lines 10-20 with :10,20>
```

## Common Pitfalls

### Pitfall 1: Off-by-One Errors

```vim
" Inclusive vs exclusive
:10,20d  " Deletes lines 10 through 20 (inclusive)
V10j     " Selects 11 lines (current + 10 more)
```

### Pitfall 2: Relative Number Confusion

```vim
" With relative numbers showing '5'
5j   " Moves 5 lines down
5G   " Goes to absolute line 5 (not relative)
```

### Pitfall 3: % Behavior

```vim
" % finds different matches based on cursor position
(text)   " On ( jumps to )
(text)   " On ) jumps to (
(text)   " On 't' does nothing
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Jump to 10 specific line numbers
- [ ] Use gg and G effectively
- [ ] Navigate with percentage jumps
- [ ] Use % for bracket matching
- [ ] Practice :line navigation

### Intermediate (10 minutes)
- [ ] Use relative line numbers
- [ ] Combine jumps with operations
- [ ] Master range commands
- [ ] Navigate complex nested code
- [ ] Use line jumps in debugging

### Advanced (15 minutes)
- [ ] Efficient code refactoring with ranges
- [ ] Complex bracket navigation
- [ ] Create line-based workflows
- [ ] Master all jump variations
- [ ] Achieve 50+ line jumps in 2 minutes

## Quick Reference Card

```
Command     | Description
------------|---------------------------
50G         | Go to line 50
:50         | Go to line 50 (command)
gg          | Go to first line
G           | Go to last line
50%         | Go to 50% of file
%           | Jump to matching bracket
:10,20      | Lines 10-20 range
:+5         | 5 lines down
:-3         | 3 lines up
:.          | Current line
:$          | Last line
Ctrl-g      | Show line info
5j          | 5 lines down (relative)
5k          | 5 lines up (relative)
```

## Links to Other Days

- **Day 16**: Screen Navigation → Viewport movement
- **Day 21**: Jump History → Line jumps create history
- **Day 22**: Search Patterns → Alternative navigation
- **Day 24**: Marks → Bookmark specific lines
- **Day 28**: Motion Review → Integration

## Conclusion

Line jumps provide surgical precision in navigation. Whether you're jumping to error lines, navigating large files by percentage, or matching brackets in complex code, these commands get you there instantly. Combined with relative line numbers, you have both absolute and relative navigation at your fingertips. This precision is essential for debugging, code review, and working with compiler errors.

Tomorrow, we'll explore marks - Vim's bookmarking system for instant navigation to saved positions.