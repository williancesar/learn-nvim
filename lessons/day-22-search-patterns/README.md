# Day 22: Search Patterns - Find Anything, Anywhere

## Learning Objectives

By the end of this lesson, you will:
- Master forward (/) and backward (?) search
- Navigate search results with n and N
- Use * and # for word-under-cursor search
- Understand search patterns and regular expressions basics
- Configure search behavior for optimal workflow

## Basic Search Commands

### Forward Search (/)

```vim
/pattern<CR>  - Search forward for pattern
/pattern      - While typing, shows incremental search
/<CR>         - Repeat last search forward
```

#### Example:
```python
# Cursor at line 1
def process_data():     # Line 1
    data = load()       # Line 2
    process(data)       # Line 3 ← /process finds this first
    return data         # Line 4

def process_config():   # Line 6 ← next match
    pass
```

### Backward Search (?)

```vim
?pattern<CR>  - Search backward for pattern
?pattern      - While typing, shows matches above
?<CR>         - Repeat last search backward
```

#### Example:
```javascript
function validateUser() {}   // Line 1
function processUser() {}    // Line 2
function createUser() {}     // Line 3 ← cursor here

// ?User<CR> finds Line 2 first
// ?User<CR> again finds Line 1
```

## Navigating Search Results

### n and N - Next/Previous Match

```vim
n  - Next match in search direction
N  - Previous match (opposite direction)

After /pattern:
  n moves forward
  N moves backward

After ?pattern:
  n moves backward (search direction)
  N moves forward (opposite)
```

#### Visual Flow:
```
/pattern →
  Match1 → Match2 → Match3 → Match4
    ↓ n     ↓ n     ↓ n     ↓ n
    ↑ N     ↑ N     ↑ N     ↑ N

?pattern ←
  Match4 ← Match3 ← Match2 ← Match1
    ↓ n     ↓ n     ↓ n     ↓ n
    ↑ N     ↑ N     ↑ N     ↑ N
```

## Word Search with * and #

### * - Search Forward for Word Under Cursor

```vim
*  - Search forward for whole word under cursor
g* - Search forward for word under cursor (partial matches)
```

#### Example:
```python
count = 0          # Cursor on 'count'
counter = 0        # * won't match this (whole word)
recount = 0        # * won't match this
count_total = 0    # * won't match this
final_count = 0    # * won't match this
count = 10         # * matches this!

# g* would match all lines containing 'count'
```

### # - Search Backward for Word Under Cursor

```vim
#  - Search backward for whole word under cursor
g# - Search backward for word under cursor (partial matches)
```

## Search Patterns and Magic

### Very Magic Mode (\v)

```vim
/\vpattern  - Very magic: most characters are special

# Without \v (requires many backslashes)
/\(group\)\+\d\{3,5\}

# With \v (cleaner)
/\v(group)+\d{3,5}
```

### Common Pattern Elements

```vim
.     - Any character
*     - 0 or more of previous
\+    - 1 or more of previous
\?    - 0 or 1 of previous
^     - Start of line
$     - End of line
\<    - Word boundary start
\>    - Word boundary end
[abc] - Character class
\d    - Digit
\w    - Word character
\s    - Whitespace
```

### Pattern Examples

```vim
/^def           - Lines starting with 'def'
/;$             - Lines ending with semicolon
/\<word\>       - Exact word 'word'
/\d\{3\}        - Exactly 3 digits
/[a-z]\+        - One or more lowercase letters
/\v(foo|bar)    - Match 'foo' or 'bar'
/error\c        - Case insensitive 'error'
```

## Case Sensitivity

### Search Modifiers

```vim
/pattern\c   - Case insensitive search
/pattern\C   - Case sensitive search
/\cpattern   - Also case insensitive
/\Cpattern   - Also case sensitive
```

### Settings

```vim
:set ignorecase   - Ignore case in search
:set smartcase    - Smart case (lowercase = insensitive)
:set noignorecase - Case sensitive always
```

#### Smart Case Behavior:
```
With smartcase + ignorecase:
/hello  - Matches: hello, Hello, HELLO
/Hello  - Matches: Hello only
/HELLO  - Matches: HELLO only
```

## Search Highlighting

### Highlight Control

```vim
:set hlsearch    - Highlight all matches
:set nohlsearch  - Don't highlight matches
:nohl            - Clear current highlighting
:nohlsearch      - Same, clear highlighting
```

### Incremental Search

```vim
:set incsearch   - Show matches while typing
:set noincsearch - Don't show until Enter
```

## Advanced Search Techniques

### Search and Replace Preview

```vim
/pattern        - Find pattern
cgn            - Change next match
.              - Repeat change on next match
.              - Continue repeating
```

#### Example:
```javascript
// Change all 'var' to 'const'
var x = 1;
var y = 2;
var z = 3;

// /var<CR>
// cgn const<ESC>
// . . (repeat for each)
```

### Search Within Visual Selection

```vim
v   - Visual mode
/\%V pattern  - Search only in visual selection
```

### Search History

```vim
/   - Enter search mode
↑   - Previous search
↓   - Next search
q/  - Open search history window
```

## Common Search Patterns

### Code-Specific Patterns

```vim
# Python functions
/^def \w\+

# JavaScript functions
/function \w\+(

# Variable assignments
/\w\+ =

# Comments
/\/\/ .\+      # Single line
/\/\*.\{-}\*\/ # Multi-line

# TODO comments
/TODO\|FIXME\|NOTE\|XXX

# Import statements
/^import
/^from .* import
```

### String and Quote Patterns

```vim
# Strings in quotes
/"[^"]*"       # Double quoted
/'[^']*'/      # Single quoted
/`[^`]*`/      # Backticks

# Empty strings
/""/
/''/

# URLs
/https\?:\/\/[^ ]\+
```

### Number Patterns

```vim
/\d\+          # Any number
/\<\d\{3}\>    # Exactly 3 digits
/\d\+\.\d\+    # Decimal numbers
/0x[0-9a-fA-F]\+ # Hexadecimal
```

## Search-Based Operations

### Delete Until Pattern

```vim
d/pattern<CR>  - Delete from cursor to pattern
c/pattern<CR>  - Change from cursor to pattern
y/pattern<CR>  - Yank from cursor to pattern
```

#### Example:
```python
# Cursor at 'data'
data = process(input, output, configuration)
#              ^ d/output deletes to here
```

### Visual Select to Pattern

```vim
v/pattern<CR>  - Visual select to pattern
V/pattern<CR>  - Line select to pattern
```

## Practical Workflows

### Workflow 1: Refactoring Variable Names

```python
# Rename 'old_name' to 'new_name'
old_name = 1
use(old_name)
process(old_name)

# Method 1: Using * and cgn
# * on 'old_name'
# cgn new_name<ESC>
# . . (repeat)

# Method 2: Search and replace
# :%s/\<old_name\>/new_name/g
```

### Workflow 2: Finding All TODOs

```javascript
// TODO: Implement feature A
function featureA() {}

// FIXME: Handle edge case
function buggyFunction() {}

// NOTE: Performance issue here
function slowFunction() {}

// Search: /TODO\|FIXME\|NOTE
// n to cycle through all
```

### Workflow 3: Navigating Errors

```
Error at line 45: undefined variable
Error at line 102: syntax error
Warning at line 78: unused import

// /Error\|Warning
// n to jump between issues
// Ctrl-o to return
```

## Search Tips and Tricks

### Tip 1: Search Register

```vim
/pattern<CR>   " Search for pattern
Ctrl-r /      " Insert last search pattern
:%s/<C-r>//replacement/g  " Replace last search
```

### Tip 2: Word Boundaries

```vim
/word          " Matches: word, words, sword
/\<word\>      " Matches: word only
/\<word        " Matches: word, words
/word\>        " Matches: word, sword
```

### Tip 3: Lazy Matching

```vim
/.*            " Greedy: matches everything
/.\{-}         " Lazy: matches minimum
/".*"          " Greedy: wrong for multiple quotes
/".\{-}"       " Lazy: correct for quotes
```

### Tip 4: Search Offset

```vim
/pattern/2     " Land 2 lines after match
/pattern/-1    " Land 1 line before match
/pattern/e     " Land at end of match
/pattern/b     " Land at beginning of match
```

## Practice Exercises

### Exercise 1: Basic Search Navigation

```python
# practice_search.py
def validate_email(email):
    if "@" not in email:
        return False
    if email.count("@") != 1:
        return False
    if not email.endswith(".com"):
        return False
    return True

# Tasks:
# 1. Search for 'email' with /email
# 2. Navigate with n and N
# 3. Use * on 'False' to find all
# 4. Search for 'return' with ?return from bottom
```

### Exercise 2: Pattern Matching

```javascript
// practice_patterns.js
var oldVar1 = 100;
var oldVar2 = 200;
const newConst = 300;
let newLet = 400;

function oldFunction() {}
const newFunction = () => {};

// TODO: Update this
// FIXME: Bug here
// NOTE: Performance issue

// Tasks:
// 1. Find all 'var' with /^var
// 2. Find all functions with /function\|=>/
// 3. Find all comments with /\/\//
// 4. Find all TODOs with /TODO\|FIXME\|NOTE/
```

### Exercise 3: Advanced Search

```html
<!-- practice_advanced.html -->
<div id="container-1" class="main-container">
  <p>Paragraph with some text</p>
  <p>Another paragraph here</p>
</div>

<div id="container-2" class="sub-container">
  <span>Span element</span>
  <span>Another span</span>
</div>

<!-- Tasks:
1. Find all IDs with /id="[^"]*"
2. Find all classes with /class="[^"]*"
3. Find opening divs with /<div
4. Find closing tags with /<\/
-->
```

## Common Pitfalls

### Pitfall 1: Regex Special Characters

```vim
" Need to escape special chars
/.      " Wrong: matches any character
/\.     " Right: matches literal dot

/(test) " Wrong: creates group
/\(test\) " Right: literal parentheses
```

### Pitfall 2: Case Sensitivity Confusion

```vim
" With ignorecase + smartcase
/hello  " Finds: hello, Hello, HELLO
/Hello  " Finds: Hello only

" Force case
/hello\c " Always case insensitive
/hello\C " Always case sensitive
```

### Pitfall 3: Greedy vs Lazy

```python
text = "first quote" and "second quote"

# /".∗" matches entire line (greedy)
# /".\{-}" matches each quote separately (lazy)
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Search 20 different patterns
- [ ] Navigate with n/N efficiently
- [ ] Use * and # for word search
- [ ] Clear highlighting with :nohl
- [ ] Practice / and ? directions

### Intermediate (10 minutes)
- [ ] Use regex patterns in search
- [ ] Search with case modifiers
- [ ] Delete/change to pattern
- [ ] Search within visual selection
- [ ] Use search history effectively

### Advanced (15 minutes)
- [ ] Complex regex patterns
- [ ] Search and operate workflows
- [ ] Combine search with macros
- [ ] Use search offsets
- [ ] Master lazy vs greedy matching

## Quick Reference Card

```
Command     | Description
------------|---------------------------
/pattern    | Search forward
?pattern    | Search backward
n           | Next match
N           | Previous match
*           | Search word under cursor forward
#           | Search word under cursor backward
g*          | Partial word search forward
g#          | Partial word search backward
:nohl       | Clear search highlighting
q/          | Search history

Patterns:
\<  \>      | Word boundaries
^   $       | Line start/end
.           | Any character
*           | 0 or more
\+          | 1 or more
\?          | 0 or 1
\d          | Digit
\w          | Word character
\s          | Whitespace
[abc]       | Character class
\c          | Case insensitive
\C          | Case sensitive
```

## Links to Other Days

- **Day 9**: Character Search → f/t for line search
- **Day 21**: Jump History → Searches create jumps
- **Day 23**: Line Jumps → Direct navigation
- **Day 24**: Marks → Combine with search
- **Day 28**: Motion Review → Search in workflows

## Conclusion

Search is one of Vim's most powerful navigation tools. Unlike scrolling through files, you jump directly to what you're looking for. With patterns and regular expressions, you can find complex code structures instantly. Combined with operations like delete and change, search becomes a powerful editing tool. Master search patterns and you'll navigate code at the speed of thought.

Tomorrow, we'll explore line jumps and precise navigation techniques.