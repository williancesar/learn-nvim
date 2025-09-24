# Day 35: Multiple Cursors Concepts - Visual Block Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master visual block mode as Vim's "multiple cursors" solution
- Learn advanced column editing techniques
- Understand how to simulate multi-cursor workflows
- Build efficient patterns for parallel text editing
- Combine visual blocks with other Vim features for powerful workflows

## Visual Block as Multiple Cursors

### Mental Model: Parallel Editing

Visual block mode provides **parallel editing** capabilities—Vim's answer to multiple cursors. Think of it as:
- **Column Selection**: Select rectangular regions
- **Parallel Insert**: Type once, appear in multiple places
- **Synchronized Change**: Modify multiple lines identically
- **Structured Editing**: Work with aligned text efficiently

```
┌──────────────────────────────────────────┐
│    VISUAL BLOCK = MULTIPLE CURSORS      │
├──────────────────────────────────────────┤
│  Traditional Multiple Cursors:           │
│  │ cursor1                               │
│  │ cursor2                               │
│  │ cursor3                               │
│                                          │
│  Vim Visual Block:                       │
│  ┌─────────┐ ← Selected block           │
│  │ text1   │                            │
│  │ text2   │ I/A inserts at all        │
│  │ text3   │ c/C changes all           │
│  └─────────┘ d deletes all             │
│                                          │
│  Result: Same power, different approach  │
└──────────────────────────────────────────┘
```

## Core Visual Block Operations

### 1. Creating Visual Blocks

```vim
" Enter visual block mode
<C-v>       " Start visual block
<C-v>$      " Select to end of lines (ragged)
<C-v>10l    " Select 10 characters wide
<C-v>5j10l  " Select 5x10 block

" Selection modifiers
gv          " Reselect last block
o           " Jump to opposite corner
O           " Jump to other corner
```

### 2. Parallel Insertion

```vim
" Insert at beginning of block
<C-v>       " Select column
3j          " Extend down
I           " Insert at beginning
text<Esc>   " Type and escape
" 'text' appears on all lines

" Append at end of block
<C-v>3j$    " Select to line ends
A           " Append after block
text<Esc>   " Appears at all line ends
```

### 3. Parallel Changes

```vim
" Change entire block
<C-v>3j5l   " Select block
c           " Change block
new<Esc>    " Replace with 'new'

" Replace characters
<C-v>3j5l   " Select block
r-          " Replace all with '-'

" Delete and shift
<C-v>3j5l   " Select block
d           " Delete block
```

## Advanced Multi-Cursor Patterns

### Pattern 1: Adding Prefixes/Suffixes

```vim
" Before:
item1
item2
item3

" Add bullets:
<C-v>       " Start block
2j          " Select down
I- <Esc>    " Insert "- " at beginning

" Result:
- item1
- item2
- item3

" Add quotes:
<C-v>2j     " Select first column
I"<Esc>     " Insert opening quote
gv$         " Reselect to end
A"<Esc>     " Append closing quote
```

### Pattern 2: Column Alignment

```vim
" Before:
name = "John"
age = 30
city = "NYC"

" Align equals signs:
<C-v>       " Start at first =
2j          " Select column down
d           " Delete
20|         " Go to column 20
P           " Paste

" Result:
name          = "John"
age           = 30
city          = "NYC"
```

### Pattern 3: Incremental Numbers

```vim
" Generate numbered list:
<C-v>       " Select column
4j          " Down 4 lines
I0. <Esc>   " Insert "0. "

" Now increment:
gv          " Reselect
g<C-a>      " Increment sequentially

" Result:
1. item
2. item
3. item
4. item
5. item
```

## Simulating Multiple Cursor Workflows

### Workflow 1: Multiple Word Selection

```vim
" Task: Change all occurrences of specific word
" Multiple cursor approach: Select each occurrence
" Vim approach:

" Method 1: Visual block for aligned words
/word<CR>   " Find first
<C-v>       " Start block
n           " Include next match
n           " And next
cNewWord<Esc>

" Method 2: Using substitution
:%s/\<word\>/NewWord/g

" Method 3: Using dot repeat
/word<CR>   " Find first
ciwNewWord<Esc>  " Change word
n.          " Next and repeat
n.          " Continue...
```

### Workflow 2: Multi-Line Editing

```vim
" Task: Edit multiple similar lines simultaneously

function one() {
    return 1;
}
function two() {
    return 2;
}
function three() {
    return 3;
}

" Convert to arrow functions:
/function<CR>    " Find first function
<C-v>            " Visual block
2j               " Select down to cover all
^                " To line start
c                " Change
const <Esc>      " Replace with const
/()<CR>          " Find parentheses
<C-v>2j          " Select column
A => {<Esc>      " Append arrow
/}<CR>           " Find closing brace
<C-v>2j          " Select
r;               " Replace with semicolon
```

### Workflow 3: Data Table Editing

```vim
" Edit CSV/table columns:
John,Doe,30,Engineer
Jane,Smith,25,Designer
Bob,Johnson,35,Manager

" Add quotes to second column:
f,              " Find first comma
l               " Move right
<C-v>           " Start block
2j              " Select column
t,              " To before next comma
I"<Esc>         " Insert quote
gv              " Reselect
$               " To end (different lengths)
h               " Back one
a"<Esc>         " Insert closing quote
```

## Complex Visual Block Techniques

### 1. Variable Width Blocks

```vim
" Handling different line lengths
<C-v>       " Start block
3j          " Move down
$           " To end of lines (ragged right)
A;<Esc>     " Append to all line ends

" Select specific width
<C-v>       " Start block
3j          " Move down
10|         " To column 10 exactly
```

### 2. Block Operations with Macros

```vim
" Record macro for complex block operation
qa          " Start recording
<C-v>       " Visual block
5j          " Select lines
I// <Esc>   " Comment out
j0          " Next line start
q           " End recording

" Apply to multiple blocks
@a          " Run on next block
10@@        " Repeat 10 times
```

### 3. Block Transformations

```vim
" Transform block content
<C-v>3j10l  " Select block
U           " Uppercase
" or
~           " Toggle case
" or
gu          " Lowercase

" With substitution
<C-v>3j10l  " Select block
:s/\%V\w/\u&/g  " Capitalize within selection
```

### 4. Advanced Block Patterns

```vim
" Create patterns with blocks
" Draw a box:
<C-v>20l10j " Select area
r#          " Fill with #
gv          " Reselect
:s/\%V./# /g " Make hollow

" Create diagonal:
<C-v>       " Start block
5j5l        " Select square
:s/\%V\(\d\+\)/\=line('.')-line("'<")+1/g
```

## Practical Applications

### Application 1: Code Commenting

```vim
" Comment multiple lines
<C-v>       " Visual block at line start
5j          " Select lines
I// <Esc>   " Add comment

" Toggle comments
<C-v>5j     " Select comment markers
2l          " Width of //
d           " Remove

" Block comments
<C-v>5j     " Select lines
I/* <Esc>   " Start comment
gv$         " Reselect to end
A */<Esc>   " End comment
```

### Application 2: Data Formatting

```vim
" Format JSON keys
{
name: "John",
age: 30,
city: "NYC"
}

" Add quotes to keys:
<C-v>       " At first key
2j          " Select keys
I"<Esc>     " Quote start
gvf:        " Reselect to colon
h           " Back one
a"<Esc>     " Quote end
```

### Application 3: Log Processing

```vim
" Extract timestamp column
2024-01-01 10:30:45 INFO Message1
2024-01-01 10:31:12 WARN Message2
2024-01-01 10:31:45 ERROR Message3

" Select time column:
10|         " Go to column 10
<C-v>       " Start block
2j8l        " Select time portion
y           " Yank
:vnew<CR>   " New vertical split
p           " Paste times only
```

## Practice Exercises

### Exercise 1: Parallel Editing

```vim
" Transform variable declarations:
var item1
var item2
var item3
var item4

" Tasks:
" 1. Change all 'var' to 'const'
" 2. Add ' = null;' to all lines
" 3. Indent all lines by 4 spaces
```

### Exercise 2: Table Creation

```vim
" Create markdown table from data:
Name Age City
John 30 NYC
Jane 25 LA
Bob 35 Chicago

" Expected:
| Name | Age | City    |
|------|-----|---------|
| John | 30  | NYC     |
| Jane | 25  | LA      |
| Bob  | 35  | Chicago |
```

### Exercise 3: Multi-Column Operations

```vim
" Process multi-column data:
001:John:Engineer:45000
002:Jane:Designer:50000
003:Bob:Manager:65000

" Tasks:
" 1. Add 'ID-' prefix to first column
" 2. Uppercase job titles
" 3. Add '$' to salaries
```

## Common Pitfalls & Solutions

### Pitfall 1: Ragged Line Endings
**Problem**: Lines have different lengths
**Solution**: Use `$` for ragged selection
```vim
<C-v>3j$    " Selects to end of each line
A;<Esc>     " Appends to each line end
```

### Pitfall 2: Insert vs Append Confusion
**Problem**: `I` and `A` behavior in block mode
**Solution**: Remember positioning
```vim
I   " Insert at left edge of block
A   " Append at right edge of block
```

### Pitfall 3: Block Operation Limits
**Problem**: Some operations don't work in block mode
**Solution**: Use `:` commands with `\%V`
```vim
:'<,'>s/\%V pattern/replacement/g
" \%V limits to visual selection
```

## Practice Goals

### Beginner (15 mins)
- [ ] Master `<C-v>` block creation
- [ ] Use `I` and `A` for parallel insert
- [ ] Apply `c` for block change
- [ ] Practice with `r` for character replacement

### Intermediate (25 mins)
- [ ] Work with ragged selections using `$`
- [ ] Combine with `gv` for reselection
- [ ] Use block mode with numbers
- [ ] Create aligned columns

### Advanced (35 mins)
- [ ] Implement multi-column workflows
- [ ] Combine blocks with macros
- [ ] Master `\%V` in substitutions
- [ ] Build complex parallel edits

## Quick Reference Card

```
VISUAL BLOCK MODE
<C-v>       Enter visual block
gv          Reselect last block
o/O         Switch corners

BLOCK OPERATIONS
I           Insert at block start
A           Append at block end
c/C         Change block
d/D         Delete block
r           Replace with character
~           Toggle case
U/u         Upper/lowercase

BLOCK SELECTION
$           To end of lines (ragged)
10|         To column 10
5j10l       5 lines down, 10 chars right

SPECIAL OPERATIONS
g<C-a>      Sequential increment
:s/\%V//    Substitute in block only

TYPICAL WORKFLOWS
<C-v>jjI    Insert at line starts
<C-v>jj$A   Append at line ends
<C-v>jjc    Change column
```

## Connection to Other Lessons

**Previous**: Day 34's global commands offer another approach to multi-line operations.

**Next**: Day 36 will explore case operations that work well with visual blocks.

**Related Concepts**:
- Visual mode basics (Day 10)
- Advanced visual operations (Day 32)
- Macros (Day 31) for automating block operations

## Summary

Visual block mode is Vim's powerful answer to multiple cursors, providing parallel editing capabilities through columnar selection. Master visual blocks to:
- Edit multiple lines simultaneously
- Align and format code efficiently
- Process columnar data
- Create structured text patterns

Remember: While other editors add multiple cursors as a feature, Vim's visual block mode has provided this functionality for decades, with deeper integration into Vim's command language. Think in columns and rectangles to unlock parallel editing power.