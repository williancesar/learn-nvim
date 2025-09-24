# Day 19: Advanced Text Objects - Sentences, Paragraphs, and Tags

## Learning Objectives

By the end of this lesson, you will:
- Master sentence text objects: is, as
- Master paragraph text objects: ip, ap
- Master tag text objects: it, at (for HTML/XML)
- Understand how Vim defines sentences and paragraphs
- Apply advanced text objects to real-world editing scenarios

## Understanding Sentences in Vim

### What is a Sentence?

Vim defines a sentence as text ending with `.`, `!`, or `?` followed by:
- End of line
- Space(s) or tab(s)
- Closing bracket `)`, `]`, `"`, `'`

```
This is sentence one. This is sentence two! Is this sentence three?
├──────────────────┘ ├───────────────────┘ ├────────────────────┘
     Sentence 1           Sentence 2              Sentence 3
```

### Sentence Text Objects

```
is - Inner sentence (sentence without trailing space)
as - A sentence (sentence with trailing space/punctuation)
```

#### Visual Representation:
```
Text: First sentence. Second sentence! Third sentence?
      ├────────────┘│ ├─────────────┘│ ├────────────┘
      └─────────────┴─┘              │
           as (with space)           │
      └─────────────┘                │
           is (without space)        │
```

## Sentence Objects in Action

### Inner Sentence (is)

```markdown
# Example text
This is the first sentence. This is the second sentence! And the third?
                            ^ cursor here

# dis - Delete inner sentence
This is the first sentence. And the third?

# cis - Change inner sentence
This is the first sentence. New content here. And the third?
```

### Around Sentence (as)

```python
# Documentation example
"""
This explains the function. It takes parameters. Returns result.
                            ^ cursor here

das - Deletes "It takes parameters. " including space
Result: This explains the function. Returns result.
"""
```

## Working with Code Comments

### Single-Line Comments

```javascript
// This is a comment sentence. Another sentence here! And one more?
//                             ^ cursor

// dis - Deletes "Another sentence here"
// das - Deletes "Another sentence here! " with space
```

### Multi-Line Comments

```java
/**
 * This method processes data. It validates input first.
 * Then transforms the data. Finally returns the result.
 */

// Position on "It validates"
// dis - Deletes just that sentence
// das - Deletes with trailing space
```

## Understanding Paragraphs in Vim

### What is a Paragraph?

A paragraph is a block of text separated by:
- Blank lines (lines containing only whitespace)
- Paragraph macros (nroff macros like .IP, .LP)

```
First paragraph with
multiple lines of text.
                        ← blank line (paragraph boundary)
Second paragraph also
with multiple lines.
```

### Paragraph Text Objects

```
ip - Inner paragraph (content only, no blank lines)
ap - A paragraph (content plus one blank line)
```

#### Visual Representation:
```
────────────────── (blank line above)
│
│  Paragraph text      ← ip starts here
│  continues here
│  and ends here       ← ip ends here
│
────────────────── (blank line below)
   └────────────────────┘
   ap includes blank line
```

## Paragraph Objects in Action

### Inner Paragraph (ip)

```python
def function_one():
    """
    This is a docstring paragraph
    with multiple lines
    of documentation.
    """
    pass


def function_two():
    # cursor anywhere in docstring
    # dip - Deletes just the docstring content
    pass
```

### Around Paragraph (ap)

```javascript
// First paragraph of comments
// explaining the code below
// with multiple lines.

function process() {
    // implementation
}

// cursor in first paragraph
// dap - Deletes paragraph AND blank line
```

## Tag Text Objects (HTML/XML)

### Understanding Tag Objects

```
it - Inner tag (content between tags)
at - A tag (including opening and closing tags)
```

#### Visual Structure:
```html
<div class="container">
  <p>Content here</p>
</div>

For the <p> tag:
it = "Content here"
at = "<p>Content here</p>"

For the <div> tag:
it = entire content including <p> tags
at = entire <div> including tags
```

### Tag Objects in Action

```html
<!-- Original HTML -->
<section>
  <h1>Title Text</h1>
  <p>Paragraph content here.</p>
</section>

<!-- With cursor on "Title Text" -->
<!-- dit - Deletes "Title Text" -->
<section>
  <h1></h1>
  <p>Paragraph content here.</p>
</section>

<!-- dat - Deletes entire <h1> tag -->
<section>
  <p>Paragraph content here.</p>
</section>
```

### Nested Tag Handling

```html
<div class="outer">
  <div class="inner">
    <span>Nested content</span>
  </div>
</div>

<!-- Cursor on "Nested content" -->
<!-- dit - Deletes just "Nested content" -->
<!-- d2it - Deletes <span> and content -->
<!-- d3it - Deletes inner div content -->
<!-- dat - Deletes <span> tag completely -->
```

## Advanced Patterns and Combinations

### Pattern 1: Documentation Editing

```python
def complex_function(param1, param2):
    """
    This function does X. It processes param1 first.
    Then it handles param2. Finally combines results.

    Args:
        param1: Description here
        param2: Another description

    Returns:
        Combined result
    """
    # cip on first paragraph - Replace description
    # dap on Args section - Remove entirely
```

### Pattern 2: Comment Block Manipulation

```javascript
/*
 * This is a comment block. It explains the code.
 * Has multiple sentences. Each on different lines.
 *
 * Second paragraph here. With more explanation.
 */

// vip - Select first paragraph
// dap - Delete second paragraph with spacing
// cis - Change individual sentences
```

### Pattern 3: HTML/JSX Refactoring

```jsx
<Card className="user-card">
  <CardHeader>
    <Title>User Profile</Title>
  </CardHeader>
  <CardBody>
    <Text>User information here</Text>
  </CardBody>
</Card>

// Position on "User Profile"
// cit - Change just the title text
// dat - Delete entire Title component
// d2at - Delete CardHeader and contents
```

## Mixed Object Navigation

### Combining Different Objects

```html
<article>
  <p>First paragraph. Has multiple sentences. Each one important.</p>

  <p>Second paragraph. Also has sentences! With different punctuation?</p>

  <blockquote>
    "A quoted paragraph. With its own sentences."
  </blockquote>
</article>

<!-- Cursor in first <p> -->
<!-- dis - Delete one sentence -->
<!-- dip - Delete paragraph content -->
<!-- dit - Delete tag content -->
<!-- dat - Delete entire tag -->
```

## Practical Use Cases

### Use Case 1: README Editing

```markdown
# Project Title

This project does X. It's built with Y. Uses Z framework.

## Installation

First install dependencies. Then run setup. Finally start server.

## Usage

Import the module. Call the function. Process results.

# Navigation:
# dip - Delete paragraph
# cis - Change sentence
# vap - Select entire section
```

### Use Case 2: Code Documentation

```javascript
/**
 * Processes user data. Validates all fields first.
 * Transforms data to required format. Stores in database.
 * Sends confirmation email. Returns success status.
 *
 * @param {Object} userData - The user data to process
 * @param {Object} options - Processing options
 * @returns {Boolean} Success status
 */
function processUser(userData, options) {
    // dis on any sentence to delete it
    // cip to rewrite main description
    // dap to remove @param section
}
```

### Use Case 3: Test Descriptions

```python
class TestFeature(unittest.TestCase):
    def test_basic_functionality(self):
        """
        Test basic operations. Should handle normal input.
        Edge cases are tested separately. Performance is key.
        """
        # cis - Modify individual test requirements
        # dip - Clear entire description

    def test_edge_cases(self):
        """
        Tests boundary conditions. Handles null values.
        Manages empty strings. Processes large inputs.
        """
        # vis - Select and modify sentences
```

## Common Pitfalls

### Pitfall 1: Sentence Detection

```
# Problematic: Abbreviations
Dr. Smith arrived. Mr. Jones followed.
# Vim might treat "Dr." as sentence end

# URLs and decimals
Visit example.com. Price is $99.99.
# Period in URL/decimal can confuse

# Solution: Adjust 'isk' setting or use different objects
```

### Pitfall 2: Paragraph Boundaries

```python
# Looks like separate paragraphs but isn't
def function():
    line1
    line2  # No blank line between
    line3

# Proper paragraph separation
def function():
    line1

    line2  # Now separate paragraphs

    line3
```

### Pitfall 3: Nested Tags

```html
<!-- Unexpected behavior with malformed HTML -->
<div>
  <p>Unclosed paragraph
  <p>Another paragraph</p>
</div>

<!-- dit/dat might not work as expected -->
<!-- Ensure proper HTML structure -->
```

### Pitfall 4: Mixed Content

```jsx
<div>
  Some text
  <span>inline element</span>
  more text
</div>

// dit selects ALL content including <span>
// Not just the text nodes
```

## Advanced Techniques

### Technique 1: Sentence Reordering

```vim
" Swap sentences
dis       " Delete inner sentence
)         " Move to next sentence
P         " Paste before
```

### Technique 2: Paragraph Movement

```vim
dap       " Cut entire paragraph
{         " Jump to previous paragraph
p         " Paste after
```

### Technique 3: Tag Content Extraction

```vim
" Extract tag content to variable
yit       " Yank inner tag
O         " Open line above
const content = "<C-r>0";<ESC>
```

### Technique 4: Bulk Documentation Updates

```vim
" Change all paragraph first sentences
/^[A-Z]<CR>    " Find paragraph starts
cis            " Change sentence
<new text><ESC>
n.n.           " Repeat for others
```

## Practice Exercises

### Exercise 1: Sentence Manipulation

```markdown
# practice_sentences.md

This is sentence one. This is sentence two! Is this sentence three?
Another paragraph here. With more sentences. And questions too?

Tasks:
1. Delete every second sentence using dis
2. Change questions to statements with cis
3. Reorder sentences using dis and p
4. Join sentences by removing periods
```

### Exercise 2: Paragraph Operations

```python
# practice_paragraphs.py

"""
First documentation paragraph
with multiple lines
explaining the purpose.

Second paragraph with details
about implementation
and usage examples.

Third paragraph containing
warnings and notes
for developers.
"""

# Tasks:
# 1. Delete middle paragraph with dap
# 2. Swap first and last paragraphs
# 3. Merge two paragraphs into one
# 4. Split paragraphs into sentences
```

### Exercise 3: HTML/XML Editing

```html
<!-- practice_tags.html -->
<body>
  <header>
    <h1>Main Title</h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>Section Title</h2>
      <p>First paragraph of content.</p>
      <p>Second paragraph here.</p>
    </section>
  </main>
</body>

<!-- Tasks:
1. Change all h1/h2 content with cit
2. Delete nav links with dit
3. Remove entire sections with dat
4. Extract paragraph text with yit
-->
```

### Exercise 4: Mixed Objects

```javascript
// practice_mixed.js

/**
 * Main function description. Does primary work.
 * Has multiple responsibilities. Needs refactoring.
 *
 * Implementation notes. Uses algorithm X.
 * Performance is O(n). Memory usage is minimal.
 */
function complexFunction() {
    // First comment block. Explains setup.
    // Multiple sentences here. Important notes.

    const config = {
        option1: "value1",
        option2: "value2"
    };

    // Second comment block. Describes process.
    // More sentences. Additional details.

    return process(config);
}

// Tasks:
// 1. Modify individual sentences in comments
// 2. Delete entire comment paragraphs
// 3. Change config object with di{
// 4. Rewrite function documentation
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Delete 10 sentences using dis
- [ ] Change 5 sentences with cis
- [ ] Delete 5 paragraphs with dip
- [ ] Modify 5 HTML tag contents with cit
- [ ] Visual select paragraphs with vip

### Intermediate (10 minutes)
- [ ] Handle multi-sentence paragraphs
- [ ] Work with nested HTML tags
- [ ] Combine sentence and paragraph objects
- [ ] Use as and ap for spacing control
- [ ] Navigate documentation efficiently

### Advanced (15 minutes)
- [ ] Refactor entire documentation blocks
- [ ] Manipulate complex HTML structures
- [ ] Chain multiple text object operations
- [ ] Create macros with text objects
- [ ] Handle edge cases (abbreviations, etc.)

## Quick Reference Card

```
Object | Description              | Example Use
-------|-------------------------|------------------
is     | Inner sentence          | dis - delete sentence
as     | A sentence (+ space)    | cas - change sentence
ip     | Inner paragraph         | yip - yank paragraph
ap     | A paragraph (+ blank)   | dap - delete with space
it     | Inner tag               | cit - change tag content
at     | A tag (with tags)       | dat - delete entire tag
2is    | Two sentences           | d2is - delete 2 sentences
3ip    | Three paragraphs        | y3ip - yank 3 paragraphs
```

## Tips for Mastery

### Tip 1: Know Your Content Type

```vim
" For prose/documentation
is, as  " Sentence-level editing
ip, ap  " Paragraph restructuring

" For code
i{, a{  " Code blocks
i", a"  " Strings

" For markup
it, at  " HTML/XML tags
```

### Tip 2: Combine with Other Motions

```vim
}dip    " Next paragraph, delete it
{cis    " Previous paragraph, change sentence
]]dit   " Next section, delete tag content
```

### Tip 3: Visual Mode Power

```vim
vis     " Visual select sentence
vip     " Visual select paragraph
vit     " Visual select tag content
V2ap    " Line-select 2 paragraphs
```

### Tip 4: Text Object Repetition

```vim
.       " Repeat last text object operation
cis<text><ESC>
n.      " Find next, repeat change
```

## Links to Other Days

- **Day 15**: Paragraph Motion → Movement vs objects
- **Day 17**: Text Objects Intro → Foundation concepts
- **Day 18**: Quote & Bracket Objects → Other object types
- **Day 20**: Combining Operators → Advanced combinations
- **Day 28**: Motion Review → Complete integration

## Conclusion

Advanced text objects complete your semantic editing toolkit. Sentences and paragraphs let you manipulate documentation and comments naturally. Tag objects are invaluable for HTML/XML work. These objects think the way you think about text structure, making complex edits simple and intuitive.

Tomorrow, we'll combine all operators and motions, showing how these pieces work together to create powerful editing commands.