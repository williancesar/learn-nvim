# Day 33: Search & Replace - Substitution Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master the `:substitute` command and all its flags
- Understand pattern matching and capture groups
- Learn advanced replacement techniques with expressions
- Build complex multi-file substitution workflows
- Use visual mode and ranges for targeted replacements

## The Substitute Command Architecture

### Mental Model: Pattern Transformation Engine

The substitute command is Vim's **pattern transformation engine**. Think of it as:
- **Pattern Matcher**: Finds text using regular expressions
- **Transformer**: Replaces with literal text or expressions
- **Scope Controller**: Works on lines, ranges, or entire files
- **Flag Processor**: Modifies behavior with options

```
┌──────────────────────────────────────────────┐
│           SUBSTITUTE ANATOMY                 │
├──────────────────────────────────────────────┤
│  :[range]s/pattern/replacement/[flags]       │
│     ↑        ↑         ↑          ↑         │
│   Where   What to   What to    How to      │
│           find      put there   do it       │
│                                              │
│  Examples:                                   │
│  :s/old/new/       Current line, first      │
│  :s/old/new/g      Current line, all        │
│  :%s/old/new/g     Entire file, all         │
│  :5,10s/old/new/g  Lines 5-10, all         │
│  :'<,'>s/old/new/g Visual selection, all    │
└──────────────────────────────────────────────┘
```

## Core Substitute Patterns

### 1. Basic Substitution

```vim
" Syntax: :[range]s/pattern/replacement/[flags]

" Single replacement on current line
:s/foo/bar/

" All occurrences on current line
:s/foo/bar/g

" Entire file
:%s/foo/bar/g

" With confirmation
:%s/foo/bar/gc

" Case insensitive
:%s/foo/bar/gi

" Count occurrences without replacing
:%s/pattern//gn
```

### 2. Ranges and Scopes

```vim
" Line ranges
:5,10s/old/new/g       " Lines 5 to 10
:.,$s/old/new/g        " Current line to end
:.,+5s/old/new/g       " Current line plus next 5
:-3,.s/old/new/g       " 3 lines up to current

" Mark-based ranges
:'a,'bs/old/new/g      " From mark a to mark b

" Pattern-based ranges
:/start/,/end/s/old/new/g   " Between patterns

" Visual mode (automatic range)
" Select text with V or v, then:
:s/old/new/g          " Operates on selection
```

### 3. Pattern Matching Power

```vim
" Basic patterns
:%s/\<word\>/new/g     " Whole words only
:%s/^old/new/g         " Beginning of line
:%s/old$/new/g         " End of line
:%s/\s\+$//g          " Remove trailing spaces

" Character classes
:%s/[0-9]/X/g         " Replace digits with X
:%s/[A-Z]/\l&/g       " Lowercase capitals
:%s/[aeiou]//g        " Remove vowels

" Quantifiers
:%s/a\+/X/g           " One or more 'a's
:%s/a\{2,4}/X/g       " 2 to 4 'a's
:%s/.*old.*/new/g     " Lines containing 'old'
```

### 4. Capture Groups and Backreferences

```vim
" Capture with \(\) and reference with \1, \2, etc.

" Swap two words
:%s/\(\w\+\) \(\w\+\)/\2 \1/g

" Wrap in quotes
:%s/\(\w\+\)/"\1"/g

" Extract and reformat
:%s/name=\(.*\) age=\(.*\)/\1 is \2 years old/g

" Complex transformation
:%s/function \(\w\+\)(\(.*\))/const \1 = (\2) =>/g
```

## Advanced Substitution Techniques

### 1. Replacement Expressions

```vim
" Use \= for Vimscript expressions in replacement

" Increment all numbers
:%s/\d\+/\=submatch(0)+1/g

" Convert to uppercase
:%s/\w\+/\=toupper(submatch(0))/g

" Line numbers
:%s/^/\=line('.') . '. '/

" Conditional replacement
:%s/\d\+/\=submatch(0) > 5 ? 'HIGH' : 'LOW'/g

" Using register contents
:%s/old/\=@a/g         " Replace with register a
```

### 2. Special Replacement Sequences

```vim
" Special sequences in replacement:
& or \0     " The whole match
\1 to \9    " Captured groups
\u          " Uppercase next character
\U          " Uppercase until \E
\l          " Lowercase next character
\L          " Lowercase until \E
\e or \E    " End case modification
~           " Previous substitute string

" Examples:
:%s/\<\w/\u&/g        " Capitalize first letter
:%s/\<\w\+\>/\U&/g    " Uppercase words
:%s/CONST_\(.*\)/\L\1/g  " Remove PREFIX and lowercase
```

### 3. Multi-line Patterns

```vim
" Use \_. to match any character including newline
:%s/start\_.*end/replacement/g

" Remove multi-line comments
:%s/\/\*\_.\{-}\*\///g

" Join lines matching pattern
:%s/\n\s*{/ {/g       " Join opening braces to previous line
```

### 4. Substitution Flags

```vim
g  " Global - all occurrences in line
c  " Confirm each substitution
n  " Count matches without replacing
i  " Case insensitive
I  " Case sensitive (override 'ignorecase')
e  " No error if pattern not found
&  " Reuse flags from previous substitute

" Flag combinations:
:%s/old/new/gci       " Global, confirm, case insensitive
:%s/old/new/gn        " Count occurrences
:%s//new/g            " Reuse last search pattern
```

## Practical Workflows

### Workflow 1: Refactoring Variable Names

```vim
" Change camelCase to snake_case
:%s/\(\l\)\(\u\)/\1_\l\2/g

" Add prefix to all variables
:%s/\<\(var\|let\|const\) \(\w\+\)/\1 prefix_\2/g

" Rename specific variable (whole word)
:%s/\<oldName\>/newName/g
```

### Workflow 2: Code Style Transformation

```vim
" Convert functions to arrow functions
:%s/function \(\w\+\)(\(.*\))/const \1 = (\2) =>/g

" Add semicolons to line ends (if missing)
:%s/\([^;]\)$/\1;/

" Convert single to double quotes
:%s/'/"/g

" But preserve escaped quotes:
:%s/\([^\\]\)'/\1"/g
```

### Workflow 3: Data Cleaning

```vim
" Remove extra spaces
:%s/\s\+/ /g          " Multiple spaces to single
:%s/\s\+$//g          " Trailing spaces
:%s/^\s\+//g          " Leading spaces

" Format phone numbers
:%s/\(\d\{3}\)\(\d\{3}\)\(\d\{4}\)/(\1) \2-\3/g

" Clean CSV data
:%s/,\s*/,/g          " Remove spaces after commas
:%s/\s*,/,/g          " Remove spaces before commas
```

## Complex Patterns

### Pattern 1: HTML/XML Processing

```vim
" Remove all HTML tags
:%s/<[^>]*>//g

" Convert specific tags
:%s/<b>\(.*\)<\/b>/**\1**/g     " Bold to Markdown

" Extract attribute values
:%s/.*href="\([^"]*\)".*/\1/g

" Add classes to divs
:%s/<div>/<div class="container">/g
```

### Pattern 2: Log File Processing

```vim
" Extract timestamps
:%s/.*\[\(.*\)\].*/\1/

" Remove debug messages
:g/DEBUG/s/.*//

" Highlight errors
:%s/ERROR: \(.*\)/>>> ERROR: \1 <<</g

" Count error types
:%s/ERROR: \(\w\+\).*/\1/gn
```

### Pattern 3: Code Documentation

```vim
" Convert comments to JSDoc
:%s/\/\/ \(.*\)/\/**\r * \1\r *\//

" Extract TODOs
:g/TODO/s/.*TODO: \(.*\)/\1/

" Generate getter signatures
:%s/private \(\w\+\) \(\w\+\);/public \1 get\u\2() { return \2; }/
```

## Interactive Substitution

### The Confirm Flag

```vim
" Interactive replacement with 'c' flag
:%s/pattern/replacement/gc

" Options when confirming:
y  " Yes, replace
n  " No, skip
a  " All remaining
q  " Quit
l  " Last - replace and quit
^E " Scroll up
^Y " Scroll down
```

### Building Complex Substitutions Interactively

```vim
" Start simple, build complexity:
:s/old/new/           " Test on current line
:s//newer/g           " Reuse pattern, change replacement
:%s//newer/gn         " Count occurrences first
:%s//newer/gc         " Confirm each replacement
```

## Practice Exercises

### Exercise 1: Basic Substitutions

```vim
" Text to transform:
The quick brown fox jumps over the lazy dog.
The QUICK brown FOX jumps over the LAZY dog.

" Tasks:
" 1. Replace all 'the' with 'a' (case insensitive)
" 2. Capitalize all words
" 3. Remove duplicate words
" 4. Count occurrences of 'o'
```

### Exercise 2: Code Refactoring

```javascript
// Transform this code:
var firstName = "John";
var lastName = "Doe";
var userAge = 30;
function getUserInfo() {
    return firstName + " " + lastName;
}

// Into:
const first_name = "John";
const last_name = "Doe";
const user_age = 30;
const getUserInfo = () => {
    return first_name + " " + last_name;
}
```

### Exercise 3: Data Processing

```csv
// Clean and format this CSV:
John  ,  Doe,30  ,   Engineer
Jane,Smith   ,  25,Designer
Bob  ,  Johnson,  35  ,  Manager

// Expected result:
"John","Doe","30","Engineer"
"Jane","Smith","25","Designer"
"Bob","Johnson","35","Manager"
```

## Common Pitfalls & Solutions

### Pitfall 1: Greedy Matching
**Problem**: `.*` matches too much
**Solution**: Use `.\{-}` for non-greedy
```vim
" Greedy (matches entire line):
:%s/<.*>//g

" Non-greedy (matches individual tags):
:%s/<.\{-}>//g
```

### Pitfall 2: Special Characters
**Problem**: Special characters need escaping
**Solution**: Use backslash or very magic mode
```vim
" Normal (lots of escaping):
:%s/\$\d\+\.\d\{2\}/PRICE/g

" Very magic mode (less escaping):
:%s/\v\$\d+\.\d{2}/PRICE/g
```

### Pitfall 3: Newline Handling
**Problem**: Can't match across lines
**Solution**: Use `\_` atoms
```vim
" Match including newlines:
:%s/start\_.\{-}end/REPLACED/g
```

## Practice Goals

### Beginner (20 mins)
- [ ] Perform 10 different basic substitutions
- [ ] Use ranges effectively
- [ ] Master common flags (g, c, n)
- [ ] Use word boundaries and anchors

### Intermediate (30 mins)
- [ ] Use capture groups for reordering
- [ ] Apply case modifications
- [ ] Create multi-line substitutions
- [ ] Use expressions in replacements

### Advanced (40 mins)
- [ ] Build complex regex patterns
- [ ] Create code refactoring substitutions
- [ ] Master very magic mode
- [ ] Combine with global commands

## Quick Reference Card

```
BASIC SYNTAX
:s/old/new/      Current line, first
:s/old/new/g     Current line, all
:%s/old/new/g    Entire file
:5,10s/old/new/g Lines 5-10

FLAGS
g  Global (all in line)
c  Confirm each
n  Count only
i  Case insensitive
I  Case sensitive
e  No error if not found

PATTERNS
\<  Word boundary start
\>  Word boundary end
^   Line start
$   Line end
.   Any character
\_. Any including newline
\+  One or more
\{-} Non-greedy

REPLACEMENTS
&       Whole match
\1-\9   Capture groups
\u      Uppercase next
\U..\E  Uppercase range
\l      Lowercase next
\L..\E  Lowercase range

SPECIAL RANGES
%       Entire file
.       Current line
$       Last line
'<,'>   Visual selection
/p1/,/p2/ Between patterns
```

## Connection to Other Lessons

**Previous**: Day 32's visual operations provide selection scopes for substitutions.

**Next**: Day 34 will explore global commands that combine patterns with operations beyond substitution.

**Related Concepts**:
- Search patterns (Day 22) form the basis of substitution patterns
- Regular expressions knowledge enhances pattern creation
- Visual mode (Day 10, 32) for range selection

## Summary

The substitute command transforms Vim into a powerful text processing engine. Master substitution to:
- Refactor code systematically
- Clean and transform data
- Apply complex pattern-based changes
- Automate repetitive text modifications

Remember: Start simple, test on single lines, then expand scope. The power of substitution lies not just in replacement, but in pattern recognition and transformation at scale.