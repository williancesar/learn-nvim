# Day 28: Motion Combinations Review - Mastery Through Integration

## Learning Objectives

By the end of this lesson, you will:
- Combine all motion techniques learned in Weeks 3-4
- Create complex editing workflows using multiple motions
- Develop muscle memory for advanced combinations
- Build personal motion patterns for common tasks
- Achieve true Vim fluency

## Motion Categories Review

### Week 3: Motion Mastery
- **Day 15**: Paragraph Motion - {, }
- **Day 16**: Screen Navigation - H, M, L, Ctrl-d/u
- **Day 17**: Text Objects Intro - iw, aw, iW, aW
- **Day 18**: Quote & Bracket Objects - i", i(, i{
- **Day 19**: Advanced Text Objects - is, ip, it
- **Day 20**: Operators & Motions - Combinations
- **Day 21**: Jump History - Ctrl-o, Ctrl-i

### Week 4: Advanced Navigation
- **Day 22**: Search Patterns - /, ?, *, #, n, N
- **Day 23**: Line Jumps - :50, 50G, %
- **Day 24**: Marks - ma, `a, 'a
- **Day 25**: Visual Block - Ctrl-v operations
- **Day 26**: Indent - >>, <<, =
- **Day 27**: Join & Format - J, gJ, gq

## Complete Motion Hierarchy

### Level 1: Character Precision
```vim
h, l      - Left/right character
f, t, F, T - Find/till character
; ,       - Repeat character search
x, X      - Delete character
r         - Replace character
```

### Level 2: Word Movement
```vim
w, b, e   - Word motion
W, B, E   - WORD motion
iw, aw    - Word objects
iW, aW    - WORD objects
ciw       - Change word
```

### Level 3: Line Navigation
```vim
0, ^, $   - Line positions
I, A      - Insert at start/end
f, t      - Find in line
50G, :50  - Jump to line
dd, yy    - Line operations
```

### Level 4: Block Movement
```vim
{, }      - Paragraph motion
(, )      - Sentence motion
[[, ]]    - Section motion
ip, ap    - Paragraph objects
is, as    - Sentence objects
```

### Level 5: Screen Control
```vim
H, M, L   - Screen positions
Ctrl-d/u  - Half-page scroll
Ctrl-f/b  - Full-page scroll
zz, zt, zb - Center/top/bottom
Ctrl-e/y  - Line scroll
```

### Level 6: Search & Jump
```vim
/, ?      - Search forward/back
*, #      - Word search
n, N      - Next/previous match
Ctrl-o/i  - Jump history
ma, `a    - Marks
```

### Level 7: Advanced Objects
```vim
i", a"    - Quote objects
i(, a(    - Parentheses objects
i{, a{    - Brace objects
it, at    - Tag objects
i<, a<    - Angle objects
```

## Power Combinations

### Combination 1: Refactor Function

```python
# Original function
def old_function_name(param1, param2):
    result = param1 + param2
    return result

# Motion sequence:
# * on function name - Search all occurrences
# cgn new_function_name - Change first
# . . . - Repeat for all
# ci( - Change parameters
# =i{ - Auto-indent body
```

### Combination 2: Extract Variable

```javascript
// Complex expression inline
const result = data.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b);

// Motion sequence:
// f. to first method
// vt; to select expression
// d to cut
// O to open line above
// const filtered = <ESC>p
// Repeat for other parts
```

### Combination 3: Clean Up Imports

```python
from module import function1, function2, function3, function4, function5

# Motion sequence:
# f, to first comma
# v$ to select all
# :s/, /,\r    /g - Split to lines
# vi{ if in brackets
# = to auto-indent
```

## Complex Workflow Examples

### Workflow 1: Complete Function Refactor

```javascript
// Starting point
function processData(input) {
    var result = input * 2;
    var doubled = result;
    console.log(doubled);
    return doubled;
}

// Goal: Modern syntax, better names
// Steps:
1. /function<CR> - Find function
2. ciw const - Change to arrow function
3. f( a => - Add arrow syntax
4. /var<CR> - Find var
5. cgn const - Change and repeat with .
6. * on 'doubled' - Find all instances
7. cgn output - Rename variable
8. . to repeat
9. gg=G - Format entire file

// Result:
const processData = (input) => {
    const result = input * 2;
    const output = result;
    console.log(output);
    return output;
}
```

### Workflow 2: Data Structure Transformation

```python
# List to dictionary
data = [
    "apple",
    "banana",
    "cherry"
]

# Steps:
1. ci[ - Clear array content
2. Type: Enter dict items
3. Use Ctrl-v for column edit
4. Add keys and values

# Result:
data = {
    "fruit1": "apple",
    "fruit2": "banana",
    "fruit3": "cherry"
}
```

### Workflow 3: Multi-File Navigation

```vim
" Working across multiple files

" main.py
mM  " Mark Main file

" utils.py
mU  " Mark Utils file

" tests.py
mT  " Mark Tests file

" Quick navigation:
`M  " Jump to main
/function_name  " Find function
gd  " Go to definition
Ctrl-o  " Back to search
`T  " Jump to tests
/test_function  " Find test
`U  " Check utils
```

## Speed Drills

### Drill 1: Text Object Marathon

```python
# Change every string, number, and parameter

config = {
    "host": "localhost",
    "port": 8080,
    "timeout": 30,
    "retry": true
}

# Time yourself:
# ci" for each string (4 times)
# ciw for each number (2 times)
# ci{ for entire content (1 time)
# Target: < 15 seconds
```

### Drill 2: Navigation Sprint

```javascript
// Navigate to specific positions quickly

function level1() {          // 1. Start here
    function level2() {      // 2. Jump here with }
        function level3() {  // 3. Jump here with }
            return 42;       // 4. Jump here with /42
        }
    }
}

// Reverse path:
// Ctrl-o back through jumps
// Target: Full cycle < 5 seconds
```

### Drill 3: Precision Editing

```python
# Fix all issues without arrow keys

DEF BADFUNCTION( X,Y,Z ):  # Issues: caps, spacing
  RESULT=X+Y+Z             # Issues: caps, spacing, indent
  RETURN RESULT            # Issues: caps

# Commands only:
# gu$ - lowercase line
# == - fix indent
# f( r<space> - fix spacing
# Continue...
# Target: < 20 seconds
```

## Advanced Combination Patterns

### Pattern 1: Search-Mark-Execute

```vim
/pattern    " Search for pattern
mm         " Mark position
n          " Next occurrence
cwNEW<ESC> " Change word
n          " Next
.          " Repeat change
'm         " Return to mark
```

### Pattern 2: Visual-Object-Operator

```vim
vip        " Visual inner paragraph
>          " Indent
gv         " Reselect
=          " Auto-format
gv         " Reselect
J          " Join lines
```

### Pattern 3: Jump-Operate-Return

```vim
ma         " Mark current
50G        " Jump to line 50
d}         " Delete paragraph
'a         " Return to mark
p          " Paste deleted text
```

## Motion Cheat Sheets

### By Frequency of Use

```
Most Used (Master First):
w, b, e    - Word movement
/, ?       - Search
ciw, diw   - Word objects
dd, yy, p  - Line operations
Ctrl-o/i   - Jump history

Frequently Used:
{, }       - Paragraphs
f, t       - Line search
ci", ci(   - Quote/bracket objects
>>, <<     - Indent
*, #       - Word search

Occasionally Used:
H, M, L    - Screen positions
ma, `a     - Marks
gq         - Format
Ctrl-v     - Visual block
%          - Match bracket
```

### By Task Type

```
Refactoring:
ciw        - Change identifier
*          - Find all occurrences
cgn        - Change next match
.          - Repeat change

Navigation:
/pattern   - Search
Ctrl-o/i   - Jump history
ma, `a     - Bookmarks
50G        - Line jump

Formatting:
==         - Auto-indent line
gg=G       - Format file
>>, <<     - Manual indent
gqap       - Format paragraph
J          - Join lines

Selection:
viw        - Select word
vi"        - Select string
vip        - Select paragraph
Ctrl-v     - Column select
```

## Personal Motion Cookbook

### Create Your Own Patterns

```vim
" Quick comment
I// <ESC>  " Comment line

" Quick uncomment
^xx        " Remove comment

" Duplicate line
yyp        " Copy and paste

" Swap lines
ddp        " Delete and paste below

" Clear line content
0D         " Delete from start

" Quick save and continue
:w<CR>     " Save without leaving
```

## Practice Challenges

### Challenge 1: No Arrow Keys

Complete an entire coding session without arrow keys:
- Use hjkl for basic movement
- Use word motions for speed
- Use search for long jumps
- Track how often you reach for arrows

### Challenge 2: Minimal Keystrokes

Edit a file with minimum keystrokes:
- Count every keystroke
- Find shorter alternatives
- Use repetition (.)
- Optimize motion chains

### Challenge 3: Speed Run

Common tasks with time limits:
- Rename all variables: < 30 seconds
- Reformat entire file: < 45 seconds
- Extract 3 functions: < 2 minutes
- Navigate 10 positions: < 20 seconds

## Integration Exercises

### Exercise 1: Full Refactor

```python
# practice_refactor.py
class OldClassName:
    def old_method_1(self, param1, param2):
        result = param1 + param2
        return result

    def old_method_2(self, x, y):
        output = x * y
        return output

# Tasks:
# 1. Rename class (use * and cgn)
# 2. Rename all methods (use ciw)
# 3. Update parameters (use ci()
# 4. Format with gg=G
# Time limit: 2 minutes
```

### Exercise 2: Data Transformation

```javascript
// practice_transform.js
const data = ["item1", "item2", "item3", "item4", "item5"];

// Transform to:
const data = {
    item1: { id: 1, value: "item1" },
    item2: { id: 2, value: "item2" },
    item3: { id: 3, value: "item3" },
    item4: { id: 4, value: "item4" },
    item5: { id: 5, value: "item5" }
};

// Use visual block, macros, and text objects
// Time limit: 3 minutes
```

### Exercise 3: Navigation Marathon

```vim
" Create 5 files with marks
" Set global marks A-E
" Create a path visiting all marks
" Add searches between marks
" Complete circuit 5 times
" Time limit: 5 minutes
```

## Mastery Checklist

### Motion Mastery
- [ ] Navigate entire file without hjkl
- [ ] Use text objects exclusively for 10 minutes
- [ ] Complete edits using only search
- [ ] Work with marks for 30 minutes
- [ ] Format code without manual spacing

### Speed Goals
- [ ] 100+ operations in 5 minutes
- [ ] Navigate 50 positions in 2 minutes
- [ ] Refactor function in 30 seconds
- [ ] Format file in 15 seconds
- [ ] Complete edit without thinking

### Advanced Goals
- [ ] Develop 10 personal patterns
- [ ] Chain 5+ operations smoothly
- [ ] Use all Week 3-4 motions daily
- [ ] Achieve "flow state" editing
- [ ] Teach someone else these motions

## Quick Reference: All Motions

```
Week 3 Motions:
{ }         - Paragraphs
H M L       - Screen positions
Ctrl-d/u    - Half-page scroll
iw aw       - Word objects
i" a"       - Quote objects
i( a(       - Parentheses
is as       - Sentences
ip ap       - Paragraphs
it at       - Tags
Ctrl-o/i    - Jump history

Week 4 Motions:
/ ? n N     - Search
* #         - Word search
50G :50     - Line jumps
%           - Match/percentage
ma `a 'a    - Marks
Ctrl-v      - Visual block
>> << =     - Indent
J gJ        - Join
gq          - Format
```

## Final Tips

### Tip 1: Think in Objects, Not Positions
Don't think "delete 5 characters," think "delete word"

### Tip 2: Compose, Don't Memorize
Combine simple pieces into complex operations

### Tip 3: Practice Deliberately
Focus on weak areas, not comfortable patterns

### Tip 4: Minimize Movement
The best motion is often no motion (use text objects)

### Tip 5: Build Muscle Memory
Repeat patterns until they're automatic

## Conclusion

You've completed 4 weeks of intensive Vim motion training. You now have a complete toolkit for navigating and editing at the speed of thought. The key to mastery isn't memorizing every command—it's understanding how they combine. With these motions, you can express any editing intention directly, without translation through mouse movements or arrow keys.

Remember: Vim is a language. You've learned the grammar. Now speak fluently.

## Next Steps

- **Week 5+**: Macros and Registers
- **Week 6+**: Plugins and Customization
- **Week 7+**: Advanced Patterns
- **Week 8+**: Language-Specific Workflows

Keep practicing. Keep improving. Welcome to the world of efficient text editing.