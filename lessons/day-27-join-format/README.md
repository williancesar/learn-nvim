# Day 27: Join & Format - Text Manipulation and Formatting

## Learning Objectives

By the end of this lesson, you will:
- Master line joining with J and gJ
- Format text with gq operations
- Understand text width and wrapping
- Join and split lines efficiently
- Format code and documentation professionally

## Line Joining Operations

### Basic Join (J)

```vim
J  - Join current line with next line (with space)
3J - Join 3 lines together
```

#### Example:
```python
# Before J
first_line = "hello"
second_line = "world"

# After J (cursor on first_line)
first_line = "hello" second_line = "world"
```

### Join Without Space (gJ)

```vim
gJ  - Join lines without adding space
3gJ - Join 3 lines without spaces
```

#### Example:
```javascript
// Before gJ
"Hello "
"World"

// After gJ
"Hello ""World"

// Regular J would produce:
"Hello " "World"  // Note the extra space
```

## Visual Mode Joining

### Visual Line Join

```vim
V   - Visual line mode
j   - Select lines
J   - Join all selected lines
```

#### Example:
```python
# Select these lines with V
item1 = 1
item2 = 2
item3 = 3

# After J
item1 = 1 item2 = 2 item3 = 3
```

### Smart Joining

```python
# Original list
items = [
    "apple",
    "banana",
    "cherry"
]

# Visual select the items, press J
items = [ "apple", "banana", "cherry" ]
```

## Text Formatting with gq

### Format Operator

```vim
gq  - Format operator (requires motion)
gqq - Format current line
gqap - Format paragraph
gqG - Format to end of file
gq} - Format to next paragraph
```

### Text Width Setting

```vim
:set textwidth=80   " Set line width to 80
:set tw=80         " Short version
:set tw=0          " Disable text width
```

#### Formatting Example:
```markdown
<!-- Before formatting (one long line) -->
This is a very long line of text that goes on and on and definitely exceeds the reasonable width for comfortable reading and should be wrapped.

<!-- After gqap with tw=60 -->
This is a very long line of text that goes on and on and
definitely exceeds the reasonable width for comfortable
reading and should be wrapped.
```

## Format Patterns

### Pattern 1: Comment Formatting

```python
# This is a very long comment that extends way beyond the normal width and needs to be formatted properly for readability

# After gqq with tw=72
# This is a very long comment that extends way beyond the normal
# width and needs to be formatted properly for readability
```

### Pattern 2: Documentation Formatting

```javascript
/**
 * This function does something very important. It takes multiple parameters and processes them in a specific way that requires detailed explanation.
 */

// After gqip
/**
 * This function does something very important. It takes multiple
 * parameters and processes them in a specific way that requires
 * detailed explanation.
 */
```

### Pattern 3: List Formatting

```markdown
- First item that has a lot of text and goes on for quite a while
- Second item with similarly verbose content
- Third item

After gqap:
- First item that has a lot of text and goes on for quite a
  while
- Second item with similarly verbose content
- Third item
```

## Advanced Join Techniques

### Join with Substitution

```vim
" Join with custom separator
:s/\n/, /g  " Replace newlines with comma-space
```

#### Example:
```
apple
banana
cherry

" After :%s/\n/, /g
apple, banana, cherry
```

### Selective Joining

```vim
" Join only specific lines
:10,15j   " Join lines 10-15
:'a,'bj   " Join between marks
```

### Join with Formatting

```python
# Multiple short lines
x = 1
y = 2
z = 3

# Select with V, then J
x = 1 y = 2 z = 3

# Better: Join with semicolons
# Select, then :s/\n/; /
x = 1; y = 2; z = 3
```

## Split Operations (Opposite of Join)

### Manual Splitting

```vim
" Split at cursor
i<CR><ESC>  " Insert newline

" Split at pattern
:s/, /,\r/g  " Split after commas
```

#### Example:
```javascript
// Before
const items = "apple, banana, cherry";

// Position after = and use :s/, /,\r/g
const items = "apple,
banana,
cherry";
```

### Smart Splitting

```python
# Long function call
result = process(param1, param2, param3, param4)

# Split arguments (cursor inside parens)
# :s/, /,\r    /g
result = process(param1,
    param2,
    param3,
    param4)
```

## Code Formatting Workflows

### Workflow 1: Function Parameter Formatting

```javascript
// Single line function
function example(firstName, lastName, age, email, address) {}

// Split parameters
// Position cursor inside ()
// :s/, /,\r    /g

function example(firstName,
    lastName,
    age,
    email,
    address) {}
```

### Workflow 2: Array/Object Formatting

```javascript
// Compact array
const data = {name: "John", age: 30, city: "NYC"};

// Format to multiline
// Split at commas, add indentation
const data = {
    name: "John",
    age: 30,
    city: "NYC"
};
```

### Workflow 3: SQL Query Formatting

```sql
-- Single line query
SELECT id, name, email FROM users WHERE active = true ORDER BY created_at;

-- Format for readability
SELECT id, name, email
FROM users
WHERE active = true
ORDER BY created_at;
```

## Format Options

### Configure Format Options

```vim
:set formatoptions=tcq  " Common format options
" t - Auto-wrap text
" c - Auto-wrap comments
" q - Allow gq formatting
" r - Auto-insert comment leader
" o - Auto-insert comment leader with o/O
```

### Format Program

```vim
:set formatprg=fmt     " Use external formatter
:set fp=prettier       " Use prettier for formatting
```

## Practical Examples

### Example 1: Markdown List Joining

```markdown
# Shopping list (separate lines)
- Milk
- Bread
- Eggs

# Join into single line
# Visual select items, J
- Milk - Bread - Eggs

# Or join with commas
# :'<,'>s/\n- /, /g
- Milk, Bread, Eggs
```

### Example 2: Code Comment Reformatting

```python
# TODO: This is a really long TODO comment that describes what needs to be done in great detail and extends beyond reasonable line length

# After gqq with tw=72
# TODO: This is a really long TODO comment that describes what needs
# to be done in great detail and extends beyond reasonable line length
```

### Example 3: JSON Formatting

```javascript
// Minified JSON
{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}

// After formatting (manual or with tool)
{
  "users": [
    {
      "id": 1,
      "name": "John"
    },
    {
      "id": 2,
      "name": "Jane"
    }
  ]
}
```

## Join and Format Combinations

### Chain Operations

```vim
" Join then format
3J     " Join 3 lines
gqq    " Format result

" Format then join
gqap   " Format paragraph
vipJ   " Select and join
```

### Conditional Joining

```vim
" Join non-empty lines only
:g/^$/d    " Delete empty lines first
:%j        " Join all remaining
```

## Common Pitfalls

### Pitfall 1: Unwanted Spaces

```vim
" J adds spaces
line1
line2
" Result: line1 line2

" gJ doesn't add spaces
" Result: line1line2
```

### Pitfall 2: Comment Formatting

```python
# Comment line 1
# Comment line 2

# J might produce:
# Comment line 1 # Comment line 2

# Better: use gqap for comments
```

### Pitfall 3: Breaking Code

```javascript
// Don't join these:
const url = "https://"
    + "example.com"
    + "/api";

// J would break the string concatenation
```

## Practice Exercises

### Exercise 1: Basic Joining

```python
# practice_join.py
first = 1
second = 2
third = 3
fourth = 4

# Tasks:
# 1. Join first two lines with J
# 2. Join all four with V3j J
# 3. Try gJ for no spaces
# 4. Undo and try different combinations
```

### Exercise 2: Text Formatting

```markdown
# practice_format.md
This is a very long line of text that contains important information about the project and extends well beyond the comfortable reading width of most editors and screens.

## Tasks:
1. Set textwidth to 60
2. Format with gqap
3. Try different widths
4. Format lists and paragraphs
```

### Exercise 3: Code Reformatting

```javascript
// practice_reformat.js
function process(param1, param2, param3, param4, param5) { return param1 + param2 + param3 + param4 + param5; }

// Tasks:
// 1. Split parameters onto separate lines
// 2. Split function body
// 3. Format with proper indentation
// 4. Join back to test gJ vs J
```

### Exercise 4: Advanced Formatting

```sql
-- practice_sql.sql
SELECT u.id, u.name, u.email, p.title, p.content FROM users u JOIN posts p ON u.id = p.user_id WHERE u.active = true AND p.published = true ORDER BY p.created_at DESC;

-- Tasks:
-- 1. Format into readable multi-line query
-- 2. Use substitution to split at keywords
-- 3. Properly indent clauses
```

## Advanced Tips

### Tip 1: Join with Macro

```vim
" Record join pattern
qa      " Record to 'a'
J       " Join line
f,a     " Find comma, append space
q       " Stop recording
5@a     " Apply 5 times
```

### Tip 2: Format Selection

```vim
" Format only selection
vip     " Select paragraph
gq      " Format selection
```

### Tip 3: Preserve Indentation

```vim
" Join preserving indent
:set formatoptions+=2
gqap    " Format preserves indent
```

### Tip 4: Custom Join Function

```vim
" Join with custom separator
:vnoremap <leader>j :s/\n/ \| /g<CR>
" Joins with pipe separator
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Join 20 line pairs with J
- [ ] Try gJ for no-space joins
- [ ] Format paragraphs with gqap
- [ ] Set and use textwidth
- [ ] Join visual selections

### Intermediate (10 minutes)
- [ ] Format code comments
- [ ] Split and join arrays/lists
- [ ] Use format with text objects
- [ ] Configure formatoptions
- [ ] Master gq operations

### Advanced (15 minutes)
- [ ] Complex code reformatting
- [ ] Multi-line SQL/JSON formatting
- [ ] Create format macros
- [ ] Custom join operations
- [ ] Format entire files efficiently

## Quick Reference Card

```
Command     | Description
------------|---------------------------
J           | Join with next line (space)
gJ          | Join without space
3J          | Join 3 lines
V J         | Visual join
gq          | Format operator
gqq         | Format line
gqap        | Format paragraph
gqG         | Format to end
gq}         | Format to next paragraph
:set tw=80  | Set text width
:set fo=tcq | Set format options
:%j         | Join all lines
:10,20j     | Join lines 10-20
```

## Links to Other Days

- **Day 26**: Indent Operations → Related formatting
- **Day 19**: Advanced Text Objects → Format objects
- **Day 10**: Visual Mode → Visual joining
- **Day 20**: Operators → Format operator
- **Day 28**: Motion Review → Complete integration

## Conclusion

Join and format operations transform messy text into clean, readable content. Whether you're reformatting documentation, cleaning up code, or restructuring data, these operations handle it all. The ability to quickly join lines or reformat paragraphs to specific widths makes text manipulation effortless. Master these operations for professional text and code formatting.

Tomorrow, we'll review and combine all motion techniques in a comprehensive practice session.