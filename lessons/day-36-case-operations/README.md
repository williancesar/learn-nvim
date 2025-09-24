# Day 36: Case Operations - Text Transformation Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master the tilde (`~`) operator for case toggling
- Use `gu` and `gU` for lowercase and uppercase operations
- Understand `g~` for case toggling with motions
- Learn advanced case manipulation patterns
- Build efficient text transformation workflows

## Case Operation Architecture

### Mental Model: Case Transformers

Case operations are **text transformers** that modify character casing. Think of them as:
- **Toggle Switch**: `~` flips between cases
- **Force Operators**: `gu` forces lower, `gU` forces upper
- **Motion Aware**: Combine with any motion for targeted changes
- **Visual Compatible**: Work seamlessly with selections

```
┌─────────────────────────────────────────┐
│         CASE OPERATIONS MAP            │
├─────────────────────────────────────────┤
│  Single Character:                     │
│  ~      Toggle case of character       │
│                                         │
│  With Motion:                           │
│  gu{motion}  Lowercase                 │
│  gU{motion}  Uppercase                 │
│  g~{motion}  Toggle case               │
│                                         │
│  Line Operations:                       │
│  guu/gugu    Lowercase line            │
│  gUU/gUgU    Uppercase line            │
│  g~~/g~g~    Toggle line               │
│                                         │
│  Visual Mode:                           │
│  u      Lowercase selection            │
│  U      Uppercase selection            │
│  ~      Toggle selection               │
└─────────────────────────────────────────┘
```

## Core Case Operations

### 1. The Tilde (~) Operator

```vim
" Basic toggle
~           " Toggle case of character under cursor
5~          " Toggle next 5 characters
~$          " Toggle to end of line

" Visual mode
v5l~        " Select 5 chars and toggle
V~          " Toggle entire line
<C-v>5j~    " Toggle visual block

" Settings
:set tildeop " Make ~ work with motions (like g~)
```

### 2. Lowercase Operations (gu)

```vim
" With motions
guw         " Lowercase word
gu$         " Lowercase to end of line
gu}         " Lowercase paragraph
guG         " Lowercase to end of file

" Line operations
guu         " Lowercase entire line
3guu        " Lowercase 3 lines

" Text objects
guiw        " Lowercase inner word
guis        " Lowercase inner sentence
gui{        " Lowercase inside braces
guit        " Lowercase inside tags
```

### 3. Uppercase Operations (gU)

```vim
" With motions
gUw         " Uppercase word
gU$         " Uppercase to end of line
gU}         " Uppercase paragraph
gUG         " Uppercase to end of file

" Line operations
gUU         " Uppercase entire line
3gUU        " Uppercase 3 lines

" Text objects
gUiw        " Uppercase inner word
gUis        " Uppercase inner sentence
gUi{        " Uppercase inside braces
gUit        " Uppercase inside tags
```

### 4. Toggle Case Operations (g~)

```vim
" With motions
g~w         " Toggle word case
g~$         " Toggle to end of line
g~}         " Toggle paragraph

" Line operations
g~~         " Toggle entire line case
3g~~        " Toggle 3 lines

" Text objects
g~iw        " Toggle inner word
g~is        " Toggle inner sentence
```

## Advanced Case Patterns

### Pattern 1: Title Case Creation

```vim
" Convert to title case (capitalize first letter of each word)
" the quick brown fox

" Method 1: Visual selection
v$          " Select to end
:s/\<\w/\u&/g " Capitalize first letters

" Method 2: Using macros
qa          " Record macro
guw         " Lowercase word
~           " Toggle first char (capitalize)
w           " Next word
q           " End recording
10@a        " Apply to 10 words

" Result: The Quick Brown Fox
```

### Pattern 2: Case Conversion Workflows

```vim
" Convert camelCase to CONSTANT_CASE
" myVariableName -> MY_VARIABLE_NAME

" Step 1: Insert underscores before capitals
:s/\(\l\)\(\u\)/\1_\2/g
" Result: my_Variable_Name

" Step 2: Uppercase everything
gUU
" Result: MY_VARIABLE_NAME

" As a function:
function! ToConstantCase()
    s/\(\l\)\(\u\)/\1_\2/g
    normal! gUU
endfunction
```

### Pattern 3: Smart Capitalization

```vim
" Capitalize sentences properly
" this is a sentence. this is another. and one more.

" Method: Capitalize after periods
:s/\. \zs\w/\u&/g    " Capitalize after ". "
:s/^\w/\u&/          " Capitalize first letter

" For programming: Capitalize constants
:g/^const /normal! gU$
```

## Complex Case Workflows

### Workflow 1: Code Style Conversion

```vim
" Convert between naming conventions

" snake_case to camelCase
function! SnakeToCamel()
    s/_\(\w\)/\u\1/g    " Replace _x with X
    s/^\w/\l&/          " Lowercase first letter
endfunction

" camelCase to snake_case
function! CamelToSnake()
    s/\(\l\)\(\u\)/\1_\l\2/g  " Add _ before capitals
endfunction

" PascalCase to kebab-case
function! PascalToKebab()
    s/\(\l\)\(\u\)/\1-\l\2/g   " Add - before capitals
    s/^\u/\l&/                 " Lowercase first
endfunction
```

### Workflow 2: Documentation Formatting

```vim
" Format headers consistently

" UPPERCASE HEADERS to Title Case
:g/^[A-Z ]\+$/s/\<\w\+/\u\L&/g

" Capitalize markdown headers
:g/^#/normal! gU$      " All headers uppercase
:g/^##/normal! gu$     " Subheaders lowercase
:g/^###/s/\<\w/\u&/g   " Sub-subheaders title case
```

### Workflow 3: Data Normalization

```vim
" Normalize mixed case data
JOHN DOE
jane smith
Bob JONES

" Normalize to proper case:
:%s/^\w\+/\u\L&/      " Capitalize first name
:%s/ \w\+/ \u\L&/     " Capitalize last name

" Result:
John Doe
Jane Smith
Bob Jones
```

## Practical Applications

### Application 1: Variable Renaming

```vim
" Rename variables with case changes
let myVariable = 5;
let myVariable2 = 10;
console.log(myVariable);

" Convert to uppercase constant:
/myVariable
gUiw           " Uppercase the word
n              " Next occurrence
.              " Repeat
```

### Application 2: SQL Formatting

```vim
" Format SQL keywords
select * from users where age > 18

" Uppercase SQL keywords:
:s/\<select\|from\|where\>/\U&/g

" Result:
SELECT * FROM users WHERE age > 18

" Or use global for all SQL:
:g/\<select\>/normal! gUiw
```

### Application 3: Comment Formatting

```vim
" Standardize comment format
// this is a comment
// ANOTHER COMMENT
// YET another One

" Capitalize first word only:
:g/^\/\//normal! w~guw$

" Result:
// This is a comment
// Another comment
// Yet another one
```

## Case Operations with Visual Mode

### Visual Mode Shortcuts

```vim
" In visual mode:
u           " Lowercase selection
U           " Uppercase selection
~           " Toggle case

" Examples:
viw U       " Uppercase inner word
vip u       " Lowercase paragraph
V ~         " Toggle line case
<C-v>5j U   " Uppercase block
```

### Advanced Visual Patterns

```vim
" Selective case changes
" Select specific columns with visual block
<C-v>       " Start visual block
5j          " Down 5 lines
3l          " 3 chars wide
U           " Uppercase the block

" Pattern-based visual case
/pattern    " Find pattern
viw         " Select word
U           " Uppercase
n           " Next match
.           " Repeat (doesn't work, need macro)
```

## Integration with Other Features

### With Macros

```vim
" Record case operation macro
qa          " Start recording
/\<todo\>   " Find 'todo'
gUiw        " Uppercase it
n           " Next occurrence
q           " End recording
100@a       " Apply to 100 occurrences
```

### With Substitution

```vim
" Case in replacement
:%s/name/\U&/g         " Uppercase matches
:%s/\(.*\)/\L\1/       " Lowercase entire line
:%s/\<\w/\u&/g         " Capitalize words

" Conditional case
:%s/error/\Uerror\E:/g " Uppercase just 'error'
```

### With Global Commands

```vim
" Apply case operations globally
:g/^#/normal! gU$      " Uppercase headers
:g/TODO/normal! gUiw   " Uppercase TODO markers
:v/^[A-Z]/normal! ~    " Toggle non-capital lines
```

## Practice Exercises

### Exercise 1: Name Formatting

```vim
" Format these names properly:
john doe
JANE SMITH
bOb JoNEs
mary ann o'malley

" Target format:
John Doe
Jane Smith
Bob Jones
Mary Ann O'Malley
```

### Exercise 2: Code Convention

```javascript
// Convert to proper conventions:
const my_constant_value = 100;  // Should be UPPERCASE
let MyVariable = 5;              // Should be camelCase
function DO_SOMETHING() {}       // Should be camelCase
class myclass {}                 // Should be PascalCase
```

### Exercise 3: Header Hierarchy

```markdown
// Format headers by level:
introduction
GETTING STARTED
Basic Concepts
advanced topics
CONCLUSION

// Target:
INTRODUCTION          (h1 - all caps)
Getting Started       (h2 - title case)
Basic Concepts        (h3 - title case)
Advanced Topics       (h3 - title case)
CONCLUSION           (h1 - all caps)
```

## Common Pitfalls & Solutions

### Pitfall 1: Motion Confusion
**Problem**: `gu` vs `gU` confusion
**Solution**: Remember direction
```vim
gu = go under (lowercase)
gU = go Upper (uppercase)
g~ = go toggle
```

### Pitfall 2: Visual Mode Keys
**Problem**: `u` for undo vs lowercase
**Solution**: Context matters
```vim
" Normal mode:
u = undo

" Visual mode:
u = lowercase selection
```

### Pitfall 3: Partial Word Changes
**Problem**: Changing case mid-word
**Solution**: Use text objects
```vim
" Instead of: llgue (imprecise)
" Use: guiw (entire word)
```

## Practice Goals

### Beginner (15 mins)
- [ ] Master `~` for single character toggle
- [ ] Use `guw` and `gUw` for words
- [ ] Apply `guu` and `gUU` for lines
- [ ] Practice visual mode u/U/~

### Intermediate (25 mins)
- [ ] Combine case ops with text objects
- [ ] Create title case conversions
- [ ] Use case in substitutions
- [ ] Apply to visual blocks

### Advanced (35 mins)
- [ ] Build naming convention converters
- [ ] Create case-changing macros
- [ ] Implement smart capitalization
- [ ] Master mixed case workflows

## Quick Reference Card

```
CHARACTER OPERATIONS
~           Toggle single character
3~          Toggle 3 characters

MOTION OPERATIONS
gu{motion}  Lowercase motion
gU{motion}  Uppercase motion
g~{motion}  Toggle motion

LINE OPERATIONS
guu         Lowercase line
gUU         Uppercase line
g~~         Toggle line

TEXT OBJECTS
guiw        Lowercase inner word
gUaw        Uppercase around word
g~is        Toggle inner sentence

VISUAL MODE
u           Lowercase selection
U           Uppercase selection
~           Toggle selection

SUBSTITUTION
\u          Uppercase next char
\U..\E      Uppercase range
\l          Lowercase next char
\L..\E      Lowercase range
```

## Connection to Other Lessons

**Previous**: Day 35's visual block mode combines perfectly with case operations for column-wise changes.

**Next**: Day 37 will explore the black hole register, building on register knowledge for advanced operations.

**Related Concepts**:
- Visual mode (Day 10, 32) for selection-based case changes
- Substitution (Day 33) for pattern-based case operations
- Text objects (Day 17-19) for precise case targeting

## Summary

Case operations provide powerful text transformation capabilities that go beyond simple uppercase/lowercase. Master these operations to:
- Enforce coding conventions automatically
- Format text and documentation consistently
- Transform between naming conventions
- Process data with case-aware operations

Remember: Case operations are **composable**—they work with motions, text objects, and visual selections, making them a versatile tool in your text transformation toolkit.