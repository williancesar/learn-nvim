# Day 18: Quote & Bracket Objects - Master String and Block Manipulation

## Learning Objectives

By the end of this lesson, you will:
- Master quote text objects: i", a", i', a'
- Master bracket/parenthesis objects: i(, a(, i), a)
- Work with all bracket types: [], {}, <>, ()
- Handle nested structures efficiently
- Combine quote/bracket objects with operators

## Understanding Quote Objects

### Quote Text Objects Overview

```
i" - Inner double quotes (content only)
a" - Around double quotes (including quotes)
i' - Inner single quotes (content only)
a' - Around single quotes (including quotes)
i` - Inner backticks (content only)
a` - Around backticks (including quotes)
```

### Visual Representation

```
Text:     message = "Hello, World!"
                    ┌────────────┐
                    │Hello, World│  i" (inner quotes)
                    └────────────┘
                   ┌──────────────┐
                   │"Hello, World"│  a" (around quotes)
                   └──────────────┘
```

## Quote Objects in Action

### Double Quotes (i" and a")

```python
# Original text
message = "This is a string"
#          ^ cursor anywhere inside

# di" - Delete inner quotes
message = ""

# da" - Delete around quotes
message =

# ci" - Change inner quotes
message = "New content"  # After typing new text

# ca" - Change around quotes
message = 'New content'  # Can change quote type too
```

### Single Quotes (i' and a')

```javascript
const char = 'a';
//            ^ cursor inside

// di' - Delete inner single quotes
const char = '';

// ca' - Change around quotes to double
const char = "a";  // After ca" then "a"
```

### Backticks (i` and a`)

```javascript
const template = `Hello ${name}!`;
//                ^ cursor anywhere inside

// ci` - Change inner backticks
const template = `Goodbye ${name}!`;

// da` - Delete around backticks
const template = ;
```

## Bracket and Parenthesis Objects

### Parenthesis Objects: ( and )

```
i( or i) - Inner parentheses (content only)
a( or a) - Around parentheses (including parens)
```

#### Examples:
```javascript
// Original
calculate(10 * 20 + 30);
//        ^ cursor inside

// di( or di) - Delete inner parentheses
calculate();

// da( or da) - Delete around parentheses
calculate;

// ci( - Change inner parentheses
calculate(newValue);
```

### Square Bracket Objects: [ and ]

```
i[ or i] - Inner square brackets
a[ or a] - Around square brackets
```

#### Examples:
```python
# Original
array[index + 1]
#     ^ cursor inside

# di[ - Delete inner brackets
array[]

# ca[ - Change around brackets (to function call)
array(index + 1)  # After ca[(
```

### Curly Brace Objects: { and }

```
i{ or i} - Inner curly braces
a{ or a} - Around curly braces
```

#### Examples:
```javascript
// Original
const obj = {
  name: "Alice",
  age: 30
};

// With cursor inside braces
// di{ - Delete inner braces
const obj = {};

// da{ - Delete around braces
const obj = ;
```

### Angle Bracket Objects: < and >

```
i< or i> - Inner angle brackets
a< or a> - Around angle brackets
```

#### Examples:
```cpp
// Original
vector<int> numbers;
//     ^ cursor inside

// ci< - Change inner angle brackets
vector<double> numbers;

// da< - Delete around angle brackets
vector numbers;
```

## Alternative Bracket Notations

### Block Objects (Vim's Alternative Names)

```
ib - Inner block (same as i()
ab - Around block (same as a()
iB - Inner Block (same as i{)
aB - Around Block (same as a{)
```

#### Examples:
```javascript
// These are equivalent
di( = dib  // Delete inner parentheses
da{ = daB  // Delete around curly braces

function test(param1, param2) {
  // dib on params removes: param1, param2
  // daB on body removes entire { } block
}
```

## Nested Structures

### Working with Nested Brackets

```javascript
// Nested structure
const data = {
  user: {
    details: {
      name: "John",
      email: "john@example.com"
    }
  }
};

// Cursor on "John"
// di" - Deletes just "John"
// di{ - Deletes name: "John", email: "john@example.com"
// d2i{ - Deletes the details object content
// d3i{ - Deletes the entire user object content
```

### Nested Parentheses

```python
result = calculate(multiply(add(5, 3), 2))
#                            ^ cursor on 5

# di) - Deletes: 5, 3
# d2i) - Deletes: add(5, 3), 2
# d3i) - Deletes: multiply(add(5, 3), 2)
```

### Mixed Nesting

```javascript
const config = {
  api: {
    endpoints: [
      "https://api1.com",
      "https://api2.com"
    ],
    timeout: 5000
  }
};

// Cursor on "api1"
// di" - Just the URL content
// di] - Both URLs
// di{ - The endpoints array and timeout
```

## Common Patterns and Workflows

### Pattern 1: String Manipulation

```python
# Change string content
message = "old text"
#          ^ ci"
# Type: new text
message = "new text"

# Change string type
value = "double quoted"
#        ^ ca"'
value = 'double quoted'
```

### Pattern 2: Function Parameter Editing

```javascript
function process(oldParam1, oldParam2, oldParam3) {
  // Position anywhere inside parens
  // ci( - Clear all parameters
  // Type new ones
}

// Result:
function process(newParam1, newParam2) {
```

### Pattern 3: Object/Dictionary Editing

```python
config = {
    "host": "localhost",
    "port": 8080,
    "ssl": False
}

# Position inside braces
# ci{ - Replace entire config
# Or use di{ then add new content
```

### Pattern 4: Array/List Operations

```javascript
const items = [
  "item1",
  "item2",
  "item3"
];

// Position inside brackets
// di[ - Clear array
// ci[ - Replace array contents
// va[ - Visual select entire array
```

## Advanced Techniques

### Technique 1: Quick String Replacement

```vim
" Position cursor anywhere in string
ci"<C-r>0<ESC>  " Replace with yanked text
```

### Technique 2: Extract to Variable

```javascript
// Before: cursor in string
console.log("This is a long message that should be extracted");

// yi" - Yank inner quotes
// O - Open line above
// const msg = "<C-r>0";<ESC>
// j - Down
// ci"msg<ESC>

// After:
const msg = "This is a long message that should be extracted";
console.log(msg);
```

### Technique 3: Wrap/Unwrap

```python
# Unwrap function call
result = function(argument)
#                 ^ da(

# Result:
result = argument

# Wrap with function
value = data
#       ^ viwc
# Type: process(data)
```

### Technique 4: Clean Nested Structures

```javascript
// Messy nested structure
obj = {a: {b: {c: {d: "value"}}}}

// Position on "value"
// d4a{ - Delete 4 levels of nesting

// Result:
obj =
```

## Visual Mode with Quote/Bracket Objects

### Visual Selection

```vim
vi" - Visual select inner quotes
va" - Visual select around quotes
vi( - Visual select inner parentheses
va{ - Visual select around braces
```

### Visual Operations

```python
# Select and transform
text = "lowercase text"
#       ^ vi"U (select and uppercase)
text = "LOWERCASE TEXT"

# Select and yank
array = [1, 2, 3, 4, 5]
#        ^ vi[y (select and yank contents)
```

## Practice Exercises

### Exercise 1: String Operations

```javascript
// practice_strings.js
const msg1 = "Change this text";
const msg2 = 'Single quoted text';
const msg3 = `Template ${literal}`;
const msg4 = "Text with \"escaped\" quotes";

// Tasks:
// 1. Change each string's content with ci"
// 2. Convert single to double quotes with ca'
// 3. Delete template literal with da`
// 4. Handle escaped quotes properly
```

### Exercise 2: Function Refactoring

```python
# practice_functions.py
def process(param1, param2, param3):
    return calculate(
        multiply(param1, 2),
        add(param2, param3),
        divide(100, param1)
    )

# Tasks:
# 1. Change function parameters with ci(
# 2. Delete nested function calls with di)
# 3. Reorder parameters using da( and p
```

### Exercise 3: Data Structure Manipulation

```javascript
// practice_structures.js
const config = {
  database: {
    host: "localhost",
    port: 5432,
    credentials: {
      user: "admin",
      pass: "secret"
    }
  },
  cache: {
    redis: {
      url: "redis://localhost:6379"
    }
  }
};

// Tasks:
// 1. Change database host with ci"
// 2. Delete credentials object with da{
// 3. Replace entire cache config with ci{
// 4. Extract URLs to variables
```

### Exercise 4: Array Operations

```ruby
# practice_arrays.rb
numbers = [1, 2, 3, 4, 5]
matrix = [[1, 2], [3, 4], [5, 6]]
mixed = ["text", 123, true, nil, {key: "value"}]

# Tasks:
# 1. Clear arrays with di[
# 2. Change nested arrays with ci[
# 3. Visual select array contents with vi[
# 4. Delete specific elements
```

## Common Pitfalls

### Pitfall 1: Unmatched Quotes

```python
# Problematic
text = "unclosed string
# di" won't work properly

# Also problematic
text = "string with \" escaped quote"
# Behavior varies with escapes
```

### Pitfall 2: Wrong Bracket Type

```vim
" Using wrong bracket object
{content}  " Using di( won't work
(content)  " Using di{ won't work

" Remember the mappings:
" () = i( i) ib
" {} = i{ i} iB
" [] = i[ i]
```

### Pitfall 3: Cursor Position Matters

```javascript
// Cursor must be inside the brackets/quotes
function(param)  // Cursor outside won't work
//      ^ di( works here
// ^ di( doesn't work here
```

### Pitfall 4: Nested Same-Type Brackets

```python
list = [1, [2, 3], 4]
#          ^ cursor here
# di] might not select what you expect
# It selects the innermost [2, 3]
```

## Real-World Applications

### 1. API Response Handling
```javascript
// Change API endpoints
fetch("https://old-api.com/data")
// ci" → type new URL

// Modify request config
fetch(url, {method: "GET", headers: {}})
// ci{ to replace entire config
```

### 2. Configuration Updates
```yaml
# Change config values
database: "production"  # ci" for value
port: 8080             # ciw for number
ssl: true              # ciw for boolean
```

### 3. Test Data Modification
```python
test_cases = [
    ("input1", "expected1"),
    ("input2", "expected2"),
]
# ci( to change test case
# di[ to clear all test cases
```

### 4. HTML/JSX Attribute Editing
```jsx
<Component prop="value" data={variable} />
// ci" for string attributes
// ci{ for JS expressions
```

## Advanced Tips

### Tip 1: Count with Text Objects

```vim
d2i(  " Delete 2 levels of nested parens
c3i{  " Change 3 levels of nested braces
```

### Tip 2: Text Objects in Macros

```vim
qa         " Start macro
f"ci"new   " Find quote, change inner
<ESC>q     " End macro
@a         " Run on next string
```

### Tip 3: Combine with Surround Plugin

```vim
" With vim-surround plugin
cs"'   " Change surrounding " to '
ds"    " Delete surrounding "
ys$"   " Surround to end of line with "
```

### Tip 4: Jump to Matching Bracket

```vim
%     " Jump to matching bracket
di%   " Delete to matching bracket
v%    " Visual select to matching bracket
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Change 10 string contents with ci"
- [ ] Delete 10 function parameters with di(
- [ ] Clear 5 arrays with di[
- [ ] Change 5 object contents with ci{
- [ ] Practice with both inner and around

### Intermediate (10 minutes)
- [ ] Handle nested structures (2-3 levels)
- [ ] Convert between quote types
- [ ] Refactor function calls efficiently
- [ ] Use visual mode with text objects
- [ ] Mix different bracket types

### Advanced (15 minutes)
- [ ] Navigate complex JSON/config files
- [ ] Refactor deeply nested code
- [ ] Use counts with text objects
- [ ] Create macros using text objects
- [ ] Handle escaped quotes properly

## Quick Reference Card

```
Object | Description                | Example
-------|---------------------------|------------------
i"     | Inner double quotes       | "content"
a"     | Around double quotes      | with "quotes"
i'     | Inner single quotes       | 'content'
a'     | Around single quotes      | with 'quotes'
i`     | Inner backticks          | `content`
a`     | Around backticks         | with `ticks`
i(,i)  | Inner parentheses        | (content)
a(,a)  | Around parentheses       | with (parens)
i[,i]  | Inner square brackets    | [content]
a[,a]  | Around square brackets   | with [brackets]
i{,i}  | Inner curly braces       | {content}
a{,a}  | Around curly braces      | with {braces}
i<,i>  | Inner angle brackets     | <content>
a<,a>  | Around angle brackets    | with <angles>
ib     | Inner block (same as i() | (content)
ab     | Around block (same as a()| with (parens)
iB     | Inner Block (same as i{) | {content}
aB     | Around Block (same as a{)| with {braces}
```

## Links to Other Days

- **Day 17**: Text Objects Intro → Foundation concepts
- **Day 19**: Advanced Text Objects → Tags, sentences, paragraphs
- **Day 20**: Combining Operators → Using with d, c, y
- **Day 25**: Visual Block → Column operations with brackets
- **Day 28**: Motion Review → All text objects together

## Conclusion

Quote and bracket text objects are essential for programming. They let you manipulate strings, function parameters, arrays, and code blocks with surgical precision. The inner/around distinction gives you fine control over what to include. Master these objects and you'll handle any code structure effortlessly.

Tomorrow, we'll explore advanced text objects including sentences, paragraphs, and tags - taking your text manipulation skills to the next level.