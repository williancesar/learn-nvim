# Day 20: Combining Operators & Motions - The Power of Vim Grammar

## Learning Objectives

By the end of this lesson, you will:
- Master the operator-motion grammar of Vim
- Combine any operator with any motion/text object
- Understand the power of composability
- Create complex edits with simple commands
- Develop an intuitive feel for Vim's language

## The Vim Grammar System

### The Formula

```
[count][operator][count][motion/text-object]

Examples:
d2w   = delete 2 words
3dw   = delete word, 3 times
2d3w  = delete 3 words, 2 times = 6 words total
```

### Core Operators

```
d - Delete
c - Change (delete and enter insert mode)
y - Yank (copy)
v - Visual select
< - Indent left
> - Indent right
= - Auto-indent
g~ - Toggle case
gu - Lowercase
gU - Uppercase
```

### Motion/Object Categories

```
Character: h, l, f, t, F, T
Word:      w, b, e, W, B, E
Line:      0, ^, $, g_, gg, G
Paragraph: {, }
Screen:    H, M, L
Search:    /, ?, n, N, *, #
Objects:   iw, aw, i(, a", it, ip, etc.
```

## Operator-Motion Combinations

### Delete Combinations

```vim
" Character level
dx    - Delete character (same as x)
d3l   - Delete 3 characters right
dfa   - Delete to and including 'a'
dt)   - Delete until ')'

" Word level
dw    - Delete to next word
d3w   - Delete 3 words
dW    - Delete to next WORD
de    - Delete to end of word
db    - Delete back one word

" Line level
d$    - Delete to end of line
d0    - Delete to beginning of line
d^    - Delete to first non-blank
dd    - Delete entire line
3dd   - Delete 3 lines

" Paragraph/block level
d}    - Delete to next paragraph
d{    - Delete to previous paragraph
dG    - Delete to end of file
dgg   - Delete to beginning of file

" Text objects
diw   - Delete inner word
da"   - Delete around quotes
di{   - Delete inner braces
dip   - Delete inner paragraph
dat   - Delete around tag
```

### Change Combinations

```vim
" Quick replacements
cw    - Change word
c$    - Change to end of line
cc    - Change entire line
c3w   - Change 3 words
ciw   - Change inner word
ci"   - Change inner quotes
cit   - Change inner tag
cip   - Change inner paragraph

" Advanced changes
cf)   - Change to and including ')'
ct,   - Change until comma
c/pattern - Change until pattern
c}    - Change to next paragraph
```

### Yank Combinations

```vim
" Copying text
yw    - Yank word
y$    - Yank to end of line
yy    - Yank entire line
y3j   - Yank current + 3 lines down
yiw   - Yank inner word
yi{   - Yank inner braces
yip   - Yank inner paragraph
yG    - Yank to end of file
```

### Visual Combinations

```vim
" Visual selections
vw    - Visual select word forward
v3w   - Visual select 3 words
v$    - Visual select to end of line
viw   - Visual select inner word
vi"   - Visual select inner quotes
vip   - Visual select inner paragraph
vit   - Visual select inner tag
v}    - Visual select to next paragraph
```

## Advanced Operator Combinations

### Case Operations

```vim
" Toggle case
g~w   - Toggle case of word
g~$   - Toggle case to end of line
g~iw  - Toggle case of inner word
g~ap  - Toggle case of paragraph

" Uppercase
gUw   - Uppercase word
gU$   - Uppercase to end of line
gUiw  - Uppercase inner word
gUit  - Uppercase inner tag

" Lowercase
guw   - Lowercase word
gu$   - Lowercase to end of line
guiw  - Lowercase inner word
gui"  - Lowercase inner quotes
```

### Indent Operations

```vim
" Indent right
>}    - Indent to next paragraph
>G    - Indent to end of file
>ip   - Indent inner paragraph
>at   - Indent around tag
3>>   - Indent 3 lines

" Indent left
<}    - Unindent to next paragraph
<G    - Unindent to end of file
<ip   - Unindent inner paragraph
3<<   - Unindent 3 lines

" Auto-indent
=}    - Auto-indent to next paragraph
=G    - Auto-indent to end of file
=ip   - Auto-indent inner paragraph
==    - Auto-indent current line
```

## Complex Combination Patterns

### Pattern 1: Refactoring Function Arguments

```javascript
// Original
function process(oldName, oldAge, oldAddress) {
    // cursor on 'old' in oldName
}

// Command sequence:
// diwuser<ESC>w.w.
// Result:
function process(userName, userAge, userAddress) {
```

### Pattern 2: Extract and Replace

```python
# Original
result = calculate_complex_operation(x * 2 + y * 3)
#                                    ^ cursor here

# Commands:
# vi(y        - Yank inner parentheses
# Ovalue = <ESC>p  - Create variable above
# j0f(ci(value<ESC> - Replace with variable

# Result:
value = x * 2 + y * 3
result = calculate_complex_operation(value)
```

### Pattern 3: Restructure Conditionals

```ruby
# Original
if condition1 && condition2 && condition3
  # code
end

# Commands on first line:
# f&dt&   - Delete first condition
# f&dt&   - Delete second condition
# Result:
if condition3
  # code
end
```

### Pattern 4: Clean Function Calls

```javascript
// Original
obj.method1(  ).method2(  arg  ).method3( a, b, c  );
//          ^ cursor

// Commands:
// di(       - Clean first params
// f.l di(   - Clean second params
// f.l di(   - Fix third params

// Result:
obj.method1().method2(arg).method3(a, b, c);
```

## Real-World Workflows

### Workflow 1: Variable Extraction

```python
# Extract repeated expression
def calculate():
    result1 = data['user']['profile']['name']
    result2 = data['user']['profile']['age']
    result3 = data['user']['profile']['email']

# Position on first data['user']['profile']
# yi]f]yi]f]yi]
# Oprofile = data['user']['profile']<ESC>
# j0ct]profile['name']<ESC>
# j0ct]profile['age']<ESC>
# j0ct]profile['email']<ESC>

# Result:
def calculate():
    profile = data['user']['profile']
    result1 = profile['name']
    result2 = profile['age']
    result3 = profile['email']
```

### Workflow 2: Code Cleanup

```javascript
// Messy code
function process(   x,y,   z   ){
const result=x+y*z;
    return result;
}

// Commands:
// f(di(x, y, z<ESC>    - Fix parameters
// j0f=i <ESC>f+i <ESC>a <ESC>f*i <ESC>a <ESC>  - Fix spacing
// j==                  - Fix indentation

// Clean result:
function process(x, y, z){
  const result = x + y * z;
  return result;
}
```

### Workflow 3: Comment Management

```java
// TODO: implement this feature
// NOTE: consider performance
// FIXME: handle edge cases
public void method() {
    // implementation
}

// Delete all comment lines:
// :g/^\/\//d
// Or individually:
// dd (on each line)
// Or as paragraph:
// dip (if grouped)
```

## Powerful Combination Examples

### Example 1: Smart Deletion

```vim
" Delete everything inside various containers
di"   - Delete string content
di(   - Delete function arguments
di{   - Delete block content
dit   - Delete HTML tag content
dip   - Delete paragraph
diw   - Delete word

" Delete including containers
da"   - Delete entire string
da(   - Delete including parentheses
da{   - Delete including braces
dat   - Delete entire HTML tag
dap   - Delete paragraph with spacing
```

### Example 2: Precise Changes

```vim
" Change specific parts
ci"new text   - Replace string content
ci(a, b       - Replace function params
ci{           - Replace block content
cit           - Replace tag content
ciw           - Replace word

" Change with motion
ctnew         - Change until 'n', type 'ew'
cf)done       - Change to ')', type 'done'
c$text        - Change to line end
c3wwords      - Change 3 words
```

### Example 3: Selective Yanking

```vim
" Copy specific structures
yi{   - Copy block content
yi"   - Copy string content
yip   - Copy paragraph
y2}   - Copy 2 paragraphs forward

" Copy with precision
yt,   - Copy until comma
y$    - Copy to line end
y^    - Copy from start to cursor
```

## Motion Operator Matrix

### Common Combinations Reference

```
     | d (delete) | c (change) | y (yank) | v (visual)
-----|-----------|-----------|----------|------------
w    | dw        | cw        | yw       | vw
iw   | diw       | ciw       | yiw      | viw
i"   | di"       | ci"       | yi"      | vi"
i(   | di(       | ci(       | yi(      | vi(
i{   | di{       | ci{       | yi{      | vi{
ip   | dip       | cip       | yip      | vip
it   | dit       | cit       | yit      | vit
$    | d$        | c$        | y$       | v$
G    | dG        | cG        | yG       | vG
}    | d}        | c}        | y}       | v}
```

## Practice Exercises

### Exercise 1: Operator Combinations

```python
# practice_combinations.py
def messy_function(  x,y,z  ):
    RESULT = X + Y + Z  # wrong case
    Return RESULT  # wrong case

# Fix using combinations:
# 1. ci( to fix parameters
# 2. guj to lowercase line
# 3. gu$ to fix Return
# Target:
def messy_function(x, y, z):
    result = x + y + z
    return result
```

### Exercise 2: Complex Refactoring

```javascript
// practice_refactor.js
const obj = {
    firstName: "John",
    lastName: "Doe",
    emailAddress: "john@example.com",
    phoneNumber: "123-456-7890"
};

// Tasks:
// 1. Change all keys from camelCase to snake_case
// 2. Use ciw on each key
// 3. Extract values to variables
// 4. Use yi" and O to create variables
```

### Exercise 3: Text Manipulation

```html
<!-- practice_html.html -->
<div class="OLD-CLASS-NAME">
    <p>OLD TEXT CONTENT HERE</p>
    <span>more OLD content</span>
</div>

<!-- Tasks:
1. ci" to change class name
2. cit to change paragraph content
3. guit to lowercase span content
4. Use combinations to modernize
-->
```

### Exercise 4: Code Organization

```ruby
# practice_organize.rb
def unorganized; x=1; y=2; z=x+y; return z; end

# Expand to proper format using:
# f;s<CR> to split statements
# == to fix indentation
# O/o to add blank lines
# Result should be properly formatted
```

## Common Pitfalls

### Pitfall 1: Order Matters

```vim
" Wrong order
w3d   " This doesn't work

" Correct order
3dw   " Delete 3 words
d3w   " Also deletes 3 words
```

### Pitfall 2: Double Operators

```vim
" These are special cases
dd    " Delete line (not 'd' motion)
cc    " Change line
yy    " Yank line
>>    " Indent line
```

### Pitfall 3: Motion vs Text Object

```vim
" Different results
dw    " Delete TO next word (leaves cursor word)
diw   " Delete word under cursor

" Visual difference
Text: "one two three"
      ^cursor
dw  result: "two three"
diw result: " two three"
```

## Advanced Techniques

### Technique 1: Operator-Pending Mode

```vim
" Custom motions in operator-pending
d/pattern<CR>   - Delete to pattern
c?pattern<CR>   - Change back to pattern
y/pattern<CR>   - Yank to pattern
```

### Technique 2: Visual Mode Operators

```vim
" Select then operate
viw U    - Select word, uppercase
vi{ >    - Select block, indent
vip =    - Select paragraph, auto-indent
```

### Technique 3: Repeat Power

```vim
" Repeatable operations
ciw<text><ESC>   - Change word
.                - Repeat on next word
n.               - Find next, repeat
```

### Technique 4: Count Multiplication

```vim
2d3w    - Delete 3 words, twice (6 words)
3c2w    - Change 2 words, 3 times
2y4j    - Yank 4 lines, twice (8 lines)
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Use 10 different operator-motion combinations
- [ ] Delete text using 5 different motions
- [ ] Change text using 5 different text objects
- [ ] Practice d, c, y with w, $, and iw
- [ ] Achieve 30 operations in 2 minutes

### Intermediate (10 minutes)
- [ ] Refactor a function using only combinations
- [ ] Use count with operators (3dw, 2c$)
- [ ] Combine operators with f/t motions
- [ ] Master inner vs around objects
- [ ] Chain operations efficiently

### Advanced (15 minutes)
- [ ] Complete complex refactoring without mouse
- [ ] Use all operators (d,c,y,>,<,=,g~,gu,gU)
- [ ] Combine with search motions
- [ ] Create repeatable patterns with .
- [ ] Achieve 100+ operations in 5 minutes

## Quick Reference Card

```
Formula: [count][operator][count][motion]

Operators:        Common Motions:
d - delete        w - word
c - change        $ - end of line
y - yank          } - paragraph
v - visual        G - end of file
> - indent        i( - inner parens
< - unindent      a" - around quotes
= - auto-indent   it - inner tag
g~ - toggle case  ip - inner paragraph
gu - lowercase
gU - uppercase

Power Combinations:
ciw - change word        di{ - delete block
yi" - yank string       dap - delete paragraph
vi( - select params     c$ - change to end
>G - indent to end      gUiw - uppercase word
```

## Links to Other Days

- **Day 5**: Basic Editing → Operator foundations
- **Day 17-19**: Text Objects → Objects for combinations
- **Day 21**: Jump History → Navigate after operations
- **Day 26**: Indent Operations → Indent operators
- **Day 28**: Motion Review → All combinations together

## Conclusion

The operator-motion grammar is Vim's superpower. By combining a small set of operators with motions and text objects, you create hundreds of precise editing commands. This composability means you don't memorize commands - you speak Vim's language. Master this grammar and you'll edit with the precision of a surgeon and the speed of thought.

Tomorrow, we'll explore jump history navigation, learning how to move through your editing trail efficiently.