# Day 26: Indent Operations - Structure Your Code Perfectly

## Learning Objectives

By the end of this lesson, you will:
- Master indent operators: >>, <<, =
- Use visual mode for block indenting
- Apply indents with motions and text objects
- Configure indent settings for different languages
- Auto-format code with indent operations

## Basic Indent Commands

### Single Line Indenting

```vim
>>  - Indent current line right
<<  - Indent current line left
==  - Auto-indent current line
```

#### Visual Example:
```python
# Before >>
def function():
pass  # Not indented

# After >>
def function():
    pass  # Indented

# After ==
def function():
    pass  # Auto-indented to correct level
```

### Count with Indent

```vim
3>>  - Indent 3 lines right
5<<  - Indent 5 lines left
4==  - Auto-indent 4 lines
```

## Indent with Motions

### Motion-Based Indenting

```vim
>}  - Indent to next paragraph
<}  - Unindent to next paragraph
>G  - Indent to end of file
<gg - Unindent to beginning
=G  - Auto-indent to end of file
```

#### Example:
```javascript
// Cursor on function line
function example() {
// >} indents entire function
const x = 1;
const y = 2;
return x + y;
}

// Result:
    function example() {
        const x = 1;
        const y = 2;
        return x + y;
    }
```

### Indent with Text Objects

```vim
>ip  - Indent inner paragraph
<ap  - Unindent around paragraph
>i{  - Indent inner braces
=i{  - Auto-indent inner braces
>at  - Indent around tag (HTML)
```

#### Example:
```python
def outer():
    def inner():
    # =i{ auto-indents everything in braces
    x = 1
    y = 2
    return x + y

# After =i{
def outer():
    def inner():
        x = 1
        y = 2
        return x + y
```

## Visual Mode Indenting

### Visual Selection Indent

```vim
V    - Visual line mode
j    - Select lines
>    - Indent selection
<    - Unindent selection
=    - Auto-indent selection
```

#### Repeating Visual Indents:
```python
# Select block with V
def function():
pass
pass
pass

# Press > to indent once
    def function():
    pass
    pass
    pass

# Press . to repeat (or > again)
        def function():
        pass
        pass
        pass
```

### Visual Block Indent

```vim
Ctrl-v  - Visual block mode
j       - Select lines
I       - Insert at beginning
(spaces) - Add spaces
<ESC>   - Apply
```

## Auto-Indenting

### The = Operator

```vim
==   - Auto-indent current line
=ap  - Auto-indent paragraph
gg=G - Auto-indent entire file
=i{  - Auto-indent block
=it  - Auto-indent HTML tag content
```

#### Common Patterns:
```javascript
// Messy code
function process(){
const data=getData();
if(data){
transform(data);
save(data);
}
return data;
}

// After gg=G (auto-indent entire file)
function process(){
    const data=getData();
    if(data){
        transform(data);
        save(data);
    }
    return data;
}
```

### Smart Indenting

```vim
:set smartindent   " Enable smart indenting
:set autoindent    " Copy indent from current line
:set cindent       " C-style indenting
```

## Indent Settings

### Configure Indent Width

```vim
:set shiftwidth=4   " Indent width (for >> and <<)
:set tabstop=4      " Tab display width
:set expandtab      " Use spaces instead of tabs
:set softtabstop=4  " Spaces per tab key press
```

### File-Type Specific Settings

```vim
" In .vimrc
autocmd FileType python setlocal shiftwidth=4 expandtab
autocmd FileType javascript setlocal shiftwidth=2 expandtab
autocmd FileType go setlocal shiftwidth=4 noexpandtab
```

### View Current Settings

```vim
:set shiftwidth?    " Show current indent width
:set expandtab?     " Check if using spaces
:set list           " Show tabs and spaces
:set listchars=tab:>-,space:· " Visualize whitespace
```

## Common Indent Patterns

### Pattern 1: Fix Pasted Code

```python
# Pasted code (wrong indent)
def function():
x = 1
    y = 2
        z = 3

# Fix with visual selection
# V3j (select all lines)
# = (auto-indent)

# Result:
def function():
    x = 1
    y = 2
    z = 3
```

### Pattern 2: Nested Structure Indent

```javascript
// Nested objects needing indent
const config = {
server: {
host: 'localhost',
port: 3000,
ssl: {
enabled: true,
cert: 'path/to/cert'
}
}
};

// Position cursor on first {
// =% to auto-indent to matching }

// Result:
const config = {
    server: {
        host: 'localhost',
        port: 3000,
        ssl: {
            enabled: true,
            cert: 'path/to/cert'
        }
    }
};
```

### Pattern 3: Conditional Block Indent

```ruby
# Unindented conditional
if condition
code_line_1
code_line_2
code_line_3
end

# >i{ or visual select and >
if condition
    code_line_1
    code_line_2
    code_line_3
end
```

## Advanced Indent Techniques

### Technique 1: Indent to Match

```vim
" Match indent of another line
" Copy indent from line above
0y$ " Yank indent spaces
j0P " Paste at beginning of next line
```

### Technique 2: Block Indent Preservation

```vim
" Preserve relative indents
:set paste    " Prevent auto-indent
p            " Paste
:set nopaste " Re-enable auto-indent
```

### Technique 3: Indent Guides

```vim
" Visual indent guides
:set list
:set listchars=tab:\│\ ,trail:·
:IndentLinesEnable  " With plugin
```

## Practical Workflows

### Workflow 1: Code Reformatting

```python
# Messy function from paste
def calculate(x,y,z):
result=x+y
if z>0:
result*=z
else:
result/=2
return result

# Steps:
# 1. gg=G to auto-indent
# 2. Add proper spacing manually
# Result:
def calculate(x, y, z):
    result = x + y
    if z > 0:
        result *= z
    else:
        result /= 2
    return result
```

### Workflow 2: HTML Structure

```html
<!-- Unformatted HTML -->
<div>
<header>
<h1>Title</h1>
<nav>
<ul>
<li>Item</li>
</ul>
</nav>
</header>
</div>

<!-- gg=G auto-formats -->
<div>
    <header>
        <h1>Title</h1>
        <nav>
            <ul>
                <li>Item</li>
            </ul>
        </nav>
    </header>
</div>
```

### Workflow 3: JSON Formatting

```javascript
// Compact JSON
{"name":"John","age":30,"address":{"street":"123 Main","city":"NYC"}}

// After formatting and =G
{
    "name": "John",
    "age": 30,
    "address": {
        "street": "123 Main",
        "city": "NYC"
    }
}
```

## Indent with Macros

### Recording Indent Operations

```vim
qa       " Start recording
>>       " Indent line
j        " Move down
q        " Stop recording
5@a      " Replay 5 times
```

### Complex Indent Patterns

```vim
" Indent every other line
qa       " Start recording
>>       " Indent current
j        " Skip one
j        " Move to next
q        " Stop
10@a     " Apply to 10 pairs
```

## Common Pitfalls

### Pitfall 1: Mixed Tabs/Spaces

```python
# Looks aligned but mixed tabs/spaces
def function():
····x = 1  # Spaces
	y = 2  # Tab

# Solution:
:retab  " Convert tabs to spaces
```

### Pitfall 2: Paste Mode

```vim
" Forgot paste mode, double-indented
:set paste
" Paste here
:set nopaste  " Don't forget to disable!
```

### Pitfall 3: Wrong Indent Settings

```vim
" Python with 2-space indent (wrong)
:set shiftwidth=2

" Fix:
:set shiftwidth=4
gg=G  " Re-indent entire file
```

## Practice Exercises

### Exercise 1: Basic Indenting

```python
# practice_basic.py
def function1():
pass
pass
pass

def function2():
pass
pass
pass

# Tasks:
# 1. Indent function1 body with >>
# 2. Select function2 body and indent with V>
# 3. Auto-indent entire file with gg=G
```

### Exercise 2: Fix Nested Code

```javascript
// practice_nested.js
function outer() {
function inner() {
if (true) {
console.log("deep");
if (nested) {
console.log("deeper");
}
}
}
}

// Tasks:
// 1. Use =i{ to fix each level
// 2. Or use gg=G for entire file
// 3. Verify 2-space indent
```

### Exercise 3: Visual Block Indent

```ruby
# practice_visual.rb
items = [
"item1",
"item2",
"item3"
]

# Tasks:
# 1. Visual block select strings
# 2. Indent all at once
# 3. Result should be:
# items = [
#     "item1",
#     "item2",
#     "item3"
# ]
```

### Exercise 4: Mixed Content

```html
<!-- practice_mixed.html -->
<body>
<div>
<script>
function test() {
const x = 1;
return x;
}
</script>
<style>
.class {
color: red;
margin: 0;
}
</style>
</div>
</body>

<!-- Tasks:
1. Auto-indent entire file
2. Fix JavaScript section
3. Fix CSS section
4. Ensure proper HTML nesting
-->
```

## Advanced Tips

### Tip 1: Indent Text Objects

```vim
>i}  " Indent inner paragraph
>a}  " Indent around paragraph
>2i{ " Indent 2 levels of braces
```

### Tip 2: Maintain Visual Selection

```vim
" After indenting in visual mode
gv   " Reselect last visual selection
>    " Indent again
```

### Tip 3: Smart Tab Key

```vim
" Make tab key smart (in .vimrc)
vnoremap <Tab> >gv
vnoremap <S-Tab> <gv
```

### Tip 4: Format Operators

```vim
gq   " Format text (wrap lines)
gqap " Format paragraph
gqG  " Format to end of file
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Indent 20 lines with >>
- [ ] Unindent with <<
- [ ] Auto-indent with ==
- [ ] Visual mode indent
- [ ] Configure shiftwidth

### Intermediate (10 minutes)
- [ ] Indent with motions (>}, >G)
- [ ] Use text objects (>ip, =i{)
- [ ] Fix pasted code indentation
- [ ] Auto-indent entire files
- [ ] Work with different indent widths

### Advanced (15 minutes)
- [ ] Complex nested structure formatting
- [ ] Mixed language files
- [ ] Create indent macros
- [ ] Master all indent operators
- [ ] Achieve 50 indent operations in 2 minutes

## Quick Reference Card

```
Command     | Description
------------|---------------------------
>>          | Indent line right
<<          | Indent line left
==          | Auto-indent line
3>>         | Indent 3 lines
>}          | Indent to next paragraph
<G          | Unindent to end of file
=G          | Auto-indent to end
>ip         | Indent inner paragraph
=i{         | Auto-indent inner braces
V>          | Visual indent
gv          | Reselect visual
:set sw=4   | Set indent width to 4
:set et     | Use spaces not tabs
:retab      | Fix tabs/spaces
gg=G        | Auto-indent entire file
```

## Links to Other Days

- **Day 25**: Visual Block → Block indenting
- **Day 10**: Visual Mode → Visual indent
- **Day 20**: Operators & Motions → Indent operators
- **Day 27**: Join & Format → Related formatting
- **Day 28**: Motion Review → Complete integration

## Conclusion

Indent operations are essential for maintaining clean, readable code. Whether you're fixing pasted code, restructuring functions, or enforcing coding standards, Vim's indent operators handle it all. Combined with motions and text objects, you can format any code structure precisely. Master these operations and your code will always be perfectly aligned.

Tomorrow, we'll explore join and format operations for text manipulation.