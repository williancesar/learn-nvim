# Day 17: Text Objects Introduction - Think in Chunks

## Learning Objectives

By the end of this lesson, you will:
- Understand the concept of text objects in Vim
- Master word objects: iw, aw, iW, aW
- Learn the difference between "inner" and "a" (around) objects
- Combine text objects with operators (d, c, y, v)
- Think in semantic chunks rather than positions

## Understanding Text Objects

### What Are Text Objects?

Text objects are semantic chunks of text that Vim understands. Unlike motions that move the cursor, text objects define regions of text to operate on.

```
Motion:     "Move cursor TO a location"
Text Object: "Select THIS chunk of text"

w  - Motion: move to next word
iw - Text object: inner word (word under cursor)
aw - Text object: a word (word + surrounding space)
```

### The Grammar of Text Objects

```
[operator][text object]

d    iw   = delete inner word
│    │
verb object

c    aw   = change a word
│    │
verb object
```

### Inner vs Around (i vs a)

```
Inner (i): The content itself
Around (a): The content plus delimiters/whitespace

Text:     "Hello world example"
           ──┬── ──┬── ───┬───
           word  space  word

iw on "world": [world]
aw on "world": [world ]  (includes trailing space)
```

## Word Text Objects

### iw - Inner Word

Selects the word under cursor, excluding surrounding whitespace.

```
Text:     function calculate_total(price, quantity)
Cursor:            ──────┼──────
Command:  diw
Result:   function _total(price, quantity)
          (deleted "calculate")
```

### aw - A Word

Selects the word under cursor, including one surrounding space.

```
Text:     function calculate_total(price, quantity)
Cursor:            ──────┼──────
Command:  daw
Result:   function total(price, quantity)
          (deleted "calculate " with space)
```

### iW - Inner WORD

Selects the WORD under cursor (non-whitespace characters).

```
Text:     user.email@domain.com sends data
Cursor:       ──────┼────────
Command:  diW
Result:   sends data
          (deleted entire "user.email@domain.com")
```

### aW - A WORD

Selects the WORD plus surrounding space.

```
Text:     user.email@domain.com sends data
Cursor:       ──────┼────────
Command:  daW
Result:   sends data
          (deleted "user.email@domain.com " with space)
```

## Visual Comparison

### Word vs WORD Objects

```
Text:     self.config_value = get-default-config();

word boundaries:  self . config _ value = get - default - config ( ) ;
WORD boundaries:  self.config_value = get-default-config();

On "config":
  iw selects: config
  iW selects: self.config_value

On "default":
  iw selects: default
  iW selects: get-default-config();
```

### Inner vs Around

```
Text:     The quick brown fox jumps
          ┌─┐ ┌───┐ ┌───┐ ┌─┐ ┌───┐
          │T│ │qui│ │bro│ │f│ │jum│
          │h│ │ck │ │wn │ │o│ │ps │
          │e│ └───┘ └───┘ │x│ └───┘
          └─┘ space space └─┘ space

On "quick":
  iw: [quick]           - just the word
  aw: [quick ]          - word + space after
  aw: [ quick]          - or space before if at end

On "fox":
  iw: [fox]             - just the word
  aw: [fox ]            - word + space after
```

## Combining with Operators

### Delete Operations

```vim
diw - Delete inner word
daw - Delete a word (with space)
diW - Delete inner WORD
daW - Delete a WORD (with space)
```

#### Examples:
```python
# Before: cursor on 'value'
result = calculate_value(data)

# After diw:
result = calculate_(data)

# After daw:
result = calculate(data)
```

### Change Operations

```vim
ciw - Change inner word
caw - Change a word
ciW - Change inner WORD
caW - Change a WORD
```

#### Examples:
```javascript
// Before: cursor on 'oldName'
const oldName = getValue();

// Type ciw then 'newName':
const newName = getValue();

// Type caw then 'userName ':
const userName = getValue();
```

### Yank Operations

```vim
yiw - Yank inner word
yaw - Yank a word
yiW - Yank inner WORD
yaW - Yank a WORD
```

### Visual Selection

```vim
viw - Visual select inner word
vaw - Visual select a word
viW - Visual select inner WORD
vaW - Visual select a WORD
```

## Advanced Word Object Patterns

### Pattern 1: Quick Variable Rename

```python
# Rename all instances of 'old_var'
# Cursor on 'old_var'

yiw         # Yank inner word
:%s/<C-r>"/new_var/g  # Paste and replace all
```

### Pattern 2: Function Parameter Edit

```javascript
function process(oldParam, otherParam) {
    // Cursor on 'oldParam'
    // Type: ciwparamName<ESC>
}
// Result:
function process(paramName, otherParam) {
```

### Pattern 3: Clean Word Replacement

```ruby
# Remove and replace with proper spacing
text = "word1    word2    word3"
       #      ^ cursor here
       # daw removes excessive spaces too

# After daw:
text = "word1 word3"
```

## Common Code Patterns

### Variable and Function Names

```python
# Snake case
user_name_field = "value"  # iw on 'name': selects 'name'
                           # iW on 'name': selects 'user_name_field'

# Camel case
userNameField = "value"    # iw on 'Name': selects 'Name'
                           # iW on 'Name': selects 'userNameField'

# Kebab case
user-name-field = "value"  # iw on 'name': selects 'name'
                           # iW on 'name': selects 'user-name-field'
```

### Method Chaining

```javascript
result = object
  .method1()     // diW removes entire '.method1()'
  .method2()     // ciw on 'method2' changes just the name
  .method3();    // daw removes '.method3()' and cleans up
```

### Configuration Objects

```javascript
const config = {
  apiUrl: "https://api.example.com",  // ciW changes entire URL
  timeout: 5000,                       // ciw changes just number
  retryCount: 3                        // daw removes with comma
};
```

## Practical Workflows

### Workflow 1: Refactoring Variable Names

```python
# Original code
def calculate_total_price(item_price, item_quantity):
    total_price = item_price * item_quantity
    return total_price

# Task: Change 'item_' prefix to 'product_'
# Steps:
# 1. Cursor on 'item_price'
# 2. ciWproduct_price<ESC>
# 3. n (next occurrence)
# 4. . (repeat change)
# 5. n.n. (continue for all)
```

### Workflow 2: Clean Up Spacing

```vim
Text:     word1    word2     word3
Strategy: Position on extra spaces, use daw

Result:   word1 word2 word3
```

### Workflow 3: Quick Documentation Edit

```javascript
// TODO: fix the calculation algorithm issue
//       ^ cursor on 'calculation'
// ciw → "validation" → changes just that word

// TODO: fix the validation algorithm issue
```

## Text Objects in Different Contexts

### In Comments

```python
# This is a comment with words
#          ^ cursor here
# diw removes 'comment'
# daw removes 'comment ' with space

"""
Multi-line docstring with many words
                          ^ cursor
diw removes 'many'
daW removes 'many words' if cursor on 'many'
"""
```

### In Strings

```javascript
const message = "Hello world example";
//                     ^ cursor
// ciw inside string changes 'world'
// Result: "Hello universe example"

const url = "https://example.com/path";
//                    ^ cursor
// ciW changes 'example.com/path'
```

### In Markup/Config

```html
<div class="container responsive centered">
<!--        ^ cursor on 'responsive'
     daw removes 'responsive ' leaving proper spacing -->
<div class="container centered">

data-attribute="value1 value2 value3"
<!--                   ^ cursor
     ciw changes just 'value2' -->
```

## Practice Exercises

### Exercise 1: Word vs WORD

```javascript
// practice_words.js
const user_email@domain = "test@example.com";
const price-in-dollars = 99.99;
const fileName.extension = "data.json";

// Tasks:
// 1. Use iw vs iW on different parts
// 2. Delete parts using diw vs diW
// 3. Change using ciw vs ciW
// Note the differences!
```

### Exercise 2: Inner vs Around

```python
# practice_spacing.py
result = calculate  (  value1  ,  value2  )

# Fix spacing using aw vs iw:
# 1. Delete extra spaces with daw
# 2. Change with proper spacing using caw
# Goal: result = calculate(value1, value2)
```

### Exercise 3: Rapid Refactoring

```ruby
# practice_refactor.rb
def process_user_data(user_name, user_email, user_age)
  validate_user_name(user_name)
  validate_user_email(user_email)
  validate_user_age(user_age)

  save_user_name(user_name)
  save_user_email(user_email)
  save_user_age(user_age)
end

# Task: Change all 'user_' to 'person_'
# Use: ciW on each occurrence
# Or: yiw, :%s pattern
```

## Common Pitfalls

### Pitfall 1: Word Boundaries in Code

```python
# Unexpected word boundaries
self.method_name()  # 'method' and 'name' are separate words
                   # Use iW for the whole identifier

# Solution: Know when to use w vs W
```

### Pitfall 2: Edge Cases with Spaces

```vim
"word1 word2"  # At end of line
      ^ cursor on word2

daw might not work as expected at line end
Use diw then x for the space
```

### Pitfall 3: Special Characters

```javascript
// Special chars break words
email@domain.com  // Three words: email, domain, com
price=$99.99     // Multiple words

// Use iW/aW for these cases
```

## Real-World Applications

### 1. Variable Renaming
- Position cursor on variable
- `yiw` to copy name
- `:%s/\<<C-r>"\>/newName/g` to replace all

### 2. Code Cleanup
- Remove extra spaces: position on spaces, `daw`
- Clean parameters: `caw` to replace with proper spacing
- Delete arguments: `daw` to remove cleanly

### 3. Quick Editing
- Change configuration values: `ciW` on URLs or paths
- Update constants: `ciw` on the value
- Modify identifiers: `ciw` for partial, `ciW` for complete

### 4. Refactoring
- Extract variable: `yiw` the expression
- Rename method: `ciw` just the name part
- Update imports: `ciW` for full module path

## Advanced Tips

### Tip 1: Repeating with Dot

```vim
ciw<new_text><ESC>  " Change first occurrence
n                   " Next occurrence
.                   " Repeat change
n.n.                " Continue pattern
```

### Tip 2: Visual Mode Power

```vim
viw   " Select word
U     " Make uppercase
viwu  " Select and lowercase
vaW~  " Select WORD and toggle case
```

### Tip 3: Counting Objects

```vim
d2aw  " Delete 2 words (current and next)
c3iw  " Change 3 words starting from cursor
```

### Tip 4: Text Object Aliases

```vim
" These are equivalent
dw   " Delete to next word (motion)
daw  " Delete a word (text object)

" But these are different
de   " Delete to end of word (motion)
diw  " Delete inner word (text object)
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Delete 10 words using diw
- [ ] Change 10 words using ciw
- [ ] Use aw vs iw and note differences
- [ ] Practice with iW on compound identifiers
- [ ] Achieve 20 text object operations

### Intermediate (10 minutes)
- [ ] Refactor variable names using ciW
- [ ] Clean up spacing with daw
- [ ] Use text objects in visual mode
- [ ] Combine with dot repetition
- [ ] Master inner vs around selection

### Advanced (15 minutes)
- [ ] Use text objects exclusively (no motions) for 5 minutes
- [ ] Refactor entire functions with text objects
- [ ] Develop muscle memory for iw/aw/iW/aW
- [ ] Combine with search and replace
- [ ] Create complex editing patterns

## Quick Reference Card

```
Object | Description              | Example
-------|-------------------------|------------------
iw     | Inner word              | [word]
aw     | A word (with space)     | [word ]
iW     | Inner WORD              | [compound-word]
aW     | A WORD (with space)     | [compound-word ]
diw    | Delete inner word       | Delete word only
daw    | Delete a word           | Delete with space
ciw    | Change inner word       | Replace word
caw    | Change a word           | Replace with space
yiw    | Yank inner word         | Copy word
viw    | Visual select word      | Highlight word
```

## Links to Other Days

- **Day 3**: Word Motion → Foundation for word objects
- **Day 18**: Quote & Bracket Objects → More text objects
- **Day 19**: Advanced Text Objects → Sentences, paragraphs
- **Day 20**: Combining Operators → Text objects + operators
- **Day 28**: Motion Review → Text objects in practice

## Conclusion

Text objects fundamentally change how you edit text. Instead of thinking "move cursor here, then delete to there," you think "delete this word" or "change this identifier." This semantic approach is faster, more precise, and less error-prone. The word objects (iw, aw, iW, aW) are your foundation - master these and you'll edit code at the speed of thought.

Tomorrow, we'll expand your text object vocabulary with quote and bracket objects, essential for working with strings and code blocks.