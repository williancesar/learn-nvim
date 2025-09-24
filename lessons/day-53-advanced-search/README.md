# Day 53: Advanced Search - Very Magic Mode and Lookaround Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master Vim's regex flavors and Very Magic mode
- Use lookahead and lookbehind assertions effectively
- Build complex search patterns for real-world scenarios
- Understand regex atoms and character classes
- Create reusable search patterns and functions
- Integrate advanced search with substitution and global commands

## Vim's Regex Modes Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VIM REGEX MODES                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Mode │ Prefix │ Example Pattern           │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Very No Magic  │ \V     │ \Va.b  matches "a.b"      │  │
│  │                │        │ (literal search)          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ No Magic       │ \M     │ \Ma.*b matches "a.*b"     │  │
│  │                │        │ (mostly literal)          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Magic (default)│ \m     │ a.*b   matches "aXXXb"    │  │
│  │                │        │ (standard regex)          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Very Magic     │ \v     │ \va.+b matches "aXXXb"    │  │
│  │                │        │ (extended regex)          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Escaping Requirements:                                      │
│  Very No Magic: Everything literal except \                 │
│  No Magic:      ^ $ . * \ [ ~ literal, others need \        │
│  Magic:         Most special, some need \                   │
│  Very Magic:    All special chars work without \            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Very Magic Mode - The Power Mode

### Why Very Magic Mode?

```vim
" Standard (Magic) mode - lots of backslashes
/\(group\)\{2,4\}    " Match "group" 2-4 times
/\<word\>            " Word boundaries
/a\|b\|c             " Alternation

" Very Magic mode - clean and readable
/\v(group){2,4}      " Match "group" 2-4 times
/\v<word>            " Word boundaries
/\va|b|c             " Alternation

" Real-world example
" Magic:    /\<\(public\|private\|protected\)\s\+\w\+(\@=/
" Very Magic: /\v<(public|private|protected)\s+\w+\(/
```

### Very Magic Syntax

```vim
" Quantifiers
/\v.+                " One or more (greedy)
/\v.+?               " One or more (non-greedy)
/\v.*                " Zero or more (greedy)
/\v.*?               " Zero or more (non-greedy)
/\v.?                " Zero or one
/\v.{3}              " Exactly 3
/\v.{3,5}            " Between 3 and 5
/\v.{3,}             " 3 or more
/\v.{,5}             " Up to 5

" Groups and Alternation
/\v(group)           " Capturing group
/\v%(group)          " Non-capturing group
/\va|b|c             " Alternation
/\v(a|b)+            " Group with alternation

" Anchors
/\v^line             " Start of line
/\vline$             " End of line
/\v<word>            " Word boundaries
/\v\<word\>          " Alternative word boundaries

" Character Classes
/\v[a-z]+            " Lowercase letters
/\v[^0-9]            " Not digits
/\v\w+               " Word characters
/\v\s+               " Whitespace
/\v\d{3}-\d{4}       " Phone pattern
```

## Lookaround Assertions

### Lookahead

```vim
" Positive lookahead: (?=pattern)
" Matches position followed by pattern
/\v\w+(\s+)@=        " Word followed by space
/\vfoo(bar)@=        " "foo" only if followed by "bar"
/\v\d+(\.)@=         " Numbers followed by period

" Negative lookahead: (?!pattern)
" Matches position NOT followed by pattern
/\v\w+(\s+)@!        " Word NOT followed by space
/\vfoo(bar)@!        " "foo" NOT followed by "bar"
/\vimport(!ant)@!    " "import" NOT followed by "ant"

" Practical examples
/\v<if>(def)@!       " "if" not followed by "def" (not "ifdef")
/\vpassword.{0,20}(@)@!  " Password not containing @
```

### Lookbehind

```vim
" Positive lookbehind: (?<=pattern)
" Matches position preceded by pattern
/\v(foo)@<=bar       " "bar" preceded by "foo"
/\v(\$)@<=\d+        " Numbers preceded by $
/\v(<\w+>)@<=.*      " Content after opening tag

" Negative lookbehind: (?<!pattern)
" Matches position NOT preceded by pattern
/\v(foo)@<!bar       " "bar" NOT preceded by "foo"
/\v([A-Z])@<![a-z]+  " Lowercase not after uppercase
/\v(\.)@<!\d+        " Numbers not after period

" Practical examples
/\v(//\s*)@<!TODO    " TODO not in comments
/\v(\$)@<!\d+        " Numbers without $ prefix
```

### Complex Lookaround Patterns

```vim
" Variable not in string
/\v("[^"]*")@<!\$\w+("[^"]*")@!

" Email validation with lookahead
/\v^[a-z0-9._%+-]+\@[a-z0-9.-]+\.[a-z]{2,}$

" Find duplicated words
/\v<(\w+)\s+\1>

" Match balanced parentheses
/\v\([^()]*\)

" Find functions with specific parameter
/\vfunction\s+\w+\([^)]*user[^)]*\)
```

## Advanced Search Patterns

### 1. Code Pattern Matching

```vim
" Find function definitions
/\v^\s*%(public|private|protected)?\s*function\s+\w+\(

" Find variable declarations
/\v^\s*%(var|let|const)\s+\w+\s*\=

" Find import statements
/\v^import\s+.{-}\s+from\s+['"][^'"]+['"]

" Find TODO comments with author
/\v\/\/\s*TODO\(\w+\):

" Find console.log with variables
/\vconsole\.log\([^)]*\$\{[^}]+\}[^)]*\)

" Find arrow functions
/\v\w+\s*\=\s*\([^)]*\)\s*\=\>

" Find async functions
/\vasync\s+%(function)?\s*\w*\s*\([^)]*\)
```

### 2. Data Pattern Matching

```vim
" IP addresses
/\v\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}

" More precise IP (0-255)
/\v%(25[0-5]|2[0-4]\d|[01]?\d\d?)\.%(25[0-5]|2[0-4]\d|[01]?\d\d?)\.%(25[0-5]|2[0-4]\d|[01]?\d\d?)\.%(25[0-5]|2[0-4]\d|[01]?\d\d?)

" URLs
/\vhttps?:\/\/[^\s]+

" Email addresses
/\v[a-z0-9._%+-]+\@[a-z0-9.-]+\.[a-z]{2,}

" Phone numbers (various formats)
/\v\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}

" Credit card numbers
/\v\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}

" Hex colors
/\v#[0-9A-Fa-f]{3}%([0-9A-Fa-f]{3})?

" UUID
/\v[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
```

### 3. Text Pattern Matching

```vim
" Quoted strings (handling escapes)
/\v"%(\\.|[^"\\])*"
/\v'%(\\.|[^'\\])*'

" Markdown headers
/\v^#{1,6}\s+.*$

" Markdown links
/\v\[[^\]]+\]\([^)]+\)

" HTML tags
/\v\<\/?[a-z]+[^>]*\>

" CSS selectors
/\v^[#.]?[a-z][-_a-z0-9]*\s*\{

" JSON key-value pairs
/\v"[^"]+"\s*:\s*("[^"]*"|\d+|true|false|null)
```

## Search and Replace with Advanced Patterns

### 1. Complex Substitutions

```vim
" Convert function syntax
:%s/\vfunction\s+(\w+)\((.*)\)/const \1 = (\2) =>/g

" Convert var to let/const
:%s/\vvar\s+(\w+)\s*\=\s*(.+)$/const \1 = \2/g

" Wrap console.log arguments
:%s/\vconsole\.log\(([^)]+)\)/console.log('DEBUG:', \1)/g

" Convert snake_case to camelCase
:%s/\v_([a-z])/\u\1/g

" Add missing semicolons
:%s/\v^(.*[^;{\s])$/\1;/g

" Format phone numbers
:%s/\v\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/(\1) \2-\3/g
```

### 2. Conditional Replacements

```vim
" Replace only in strings
:%s/\v("[^"]*)"([^"]*")/\1'\2/g  " Double to single quotes

" Replace only outside comments
:%s/\v^([^\/]|\/[^\/])*\zsTODO/FIXME/g

" Replace with capture groups
:%s/\v<(\w+)\s+\1>/\1/g  " Remove duplicated words

" Replace with expressions
:%s/\v\d+/\=submatch(0) * 2/g  " Double all numbers

" Conditional replacement with lookbehind
:%s/\v(class\s+)@<=\w+/\u&/g  " Uppercase class names
```

## Search Functions and Commands

### Custom Search Commands

```vim
" Search for merge conflicts
command! Conflicts /\v^[<>=]{7}

" Search for debugging statements
command! Debug /\vconsole\.(log|debug|info|warn|error)

" Search for TODOs with optional author
command! -nargs=? Todo execute '/\vTODO' .
    \ (<q-args> != '' ? '.*' . <q-args> : '')

" Search for long lines
command! -nargs=? LongLines execute '/\v^.{' .
    \ (<q-args> != '' ? <q-args> : '80') . ',}$'
```

### Search Functions

```vim
" Highlight all instances of word under cursor
function! HighlightWord()
    let @/ = '\v<' . expand('<cword>') . '>'
    set hlsearch
endfunction
nnoremap <Leader>* :call HighlightWord()<CR>

" Search for visual selection
function! SearchVisual()
    let temp = @"
    normal! gvy
    let @/ = '\V' . substitute(escape(@", '/\'), '\n', '\\n', 'g')
    let @" = temp
endfunction
vnoremap // :call SearchVisual()<CR>

" Interactive search and replace
function! SearchAndReplace()
    let search = input('Search: ')
    let replace = input('Replace: ')
    execute '%s/\v' . search . '/' . replace . '/gc'
endfunction
nnoremap <Leader>sr :call SearchAndReplace()<CR>
```

## Practical Exercises

### Exercise 1: Very Magic Mode Basics

```vim
" Create test file
:e test.txt
:put ='function test() { return true; }'
:put ='const value = 123;'
:put ='if (condition) { doSomething(); }'

" Practice searches
/\vfunction\s+\w+\(\)        " Find functions
/\v\{\s*return\s+\w+;\s*\}   " Find return blocks
/\vif\s*\([^)]+\)            " Find if statements
/\v\d+                       " Find numbers
```

### Exercise 2: Lookaround Practice

```vim
" Create test content
:put ='foo bar foobar'
:put ='test testing tested'
:put ='$100 200 $300'

" Lookahead practice
/\vfoo(bar)@=         " foo followed by bar
/\vtest(ing)@!        " test not followed by ing

" Lookbehind practice
/\v(\$)@<=\d+         " Numbers after $
/\v(test)@<!ed        " 'ed' not after 'test'
```

### Exercise 3: Complex Pattern Building

```vim
" Email validation
/\v^[a-z0-9._%+-]+\@[a-z0-9.-]+\.[a-z]{2,}$

" URL extraction
/\vhttps?:\/\/%(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b%([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)

" Function with specific parameters
/\vfunction\s+\w+\([^)]*\<(id|name)\>[^)]*\)

" Balanced brackets
/\v\[[^\[\]]*\]
```

### Exercise 4: Search and Replace Mastery

```vim
" Convert arrow functions
:%s/\v(\w+)\s*\=\s*\((.*)\)\s*\=\>\s*\{/function \1(\2) {/g

" Extract URLs to list
:g/\vhttps?:\/\/[^\s]+/t$

" Remove console statements
:g/\vconsole\.\w+\([^)]*\)/d

" Format data
:%s/\v(\w+):\s*([^,}]+)/"\1": "\2"/g
```

### Exercise 5: Real-World Scenarios

```vim
" Find security issues
/\vpassword\s*\=\s*["'][^"']+["']  " Hardcoded passwords
/\veval\([^)]+\)                    " eval usage
/\vinnerHTML\s*\=                   " Direct HTML assignment

" Find code smells
/\v^\s*\/\/.*TODO|FIXME|XXX|HACK   " Technical debt
/\vfunction\s+\w+\([^)]{50,}\)     " Long parameter lists
/\v\{[^{}]{500,}\}                 " Long blocks

" Data validation
/\v^\s*$                            " Empty lines
/\v\s+$                             " Trailing whitespace
/\v^\t* {1,3}[^\s]                  " Mixed indentation
```

## Common Pitfalls and Solutions

### 1. Regex Mode Confusion
**Problem**: Pattern works in one mode but not another
```vim
" Solution: Be explicit about mode
/\v(group)+          " Very magic
/\(group\)\+         " Magic (default)

" Always start with \v for complex patterns
```

### 2. Greedy vs Non-Greedy
**Problem**: Matching too much
```vim
" Greedy (default)
/\v.+         " Matches as much as possible

" Non-greedy
/\v.+?        " Matches as little as possible

" Example: Extract string content
/\v"[^"]*"    " Better than /".*"/
```

### 3. Lookaround Limitations
**Problem**: Variable-length lookbehind not supported
```vim
" Won't work:
/\v(.+)@<=pattern

" Workarounds:
/\v(\w+)@<=pattern   " Fixed length OK
/\vzs pattern        " Start match here
```

### 4. Special Characters
**Problem**: Forgetting to escape special chars
```vim
" Very magic mode special chars:
" . * + ? { } [ ] ( ) | \ ^ $ < >

" To match literally:
/\v\$\d+\.\d{2}      " Match $123.45
/\v\(\d{3}\)         " Match (123)
```

## Integration with Previous Lessons

### With Substitution (Day 33)
```vim
" Advanced substitution
:%s/\v<(\w+)\s+\1>/\1/g            " Remove duplicates
:%s/\v(\w)(\w*)/\u\1\L\2/g         " Title case
```

### With Global Commands (Day 34)
```vim
" Complex global operations
:g/\v^\s*function/+1,/\v^\s*\}/p   " Print function bodies
:g/\v<TODO>/.-1,.+1p                " Print TODO context
```

### With Macros (Day 31)
```vim
" Search-based macro
qa/\v<function><CR>Oexport <Esc>nq
100@a                               " Export all functions
```

### With Buffer Operations (Day 52)
```vim
" Project-wide advanced search
:bufdo g/\vconsole\.log/d          " Remove all console.log
:argdo %s/\v<var>/const/g | up     " Update var declarations
```

## Quick Reference Card

```
Very Magic Mode
═══════════════
\v              Enable very magic
.+ .* .?        Quantifiers
(group)         Capturing group
%(group)        Non-capturing group
a|b|c           Alternation
<word>          Word boundaries
^  $            Line anchors

Lookaround
══════════
(pat)@=         Positive lookahead
(pat)@!         Negative lookahead
(pat)@<=        Positive lookbehind
(pat)@<!        Negative lookbehind
\zs  \ze        Start/end match

Character Classes
═════════════════
\w  \W          Word/non-word
\d  \D          Digit/non-digit
\s  \S          Space/non-space
[a-z]           Range
[^a-z]          Negated class

Common Patterns
═══════════════
\v<(\w+)\s+\1>              Duplicated words
\v"[^"]*"                   Quoted strings
\v\d{1,3}(\.\d{1,3}){3}     IP address
\v[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}  Email
\vhttps?://[^\s]+           URLs

Modes Comparison
════════════════
\V  Very no magic (literal)
\M  No magic
\m  Magic (default)
\v  Very magic (recommended)
```

## Practice Goals

### Beginner (15 minutes)
- [ ] Master very magic mode syntax
- [ ] Use basic lookahead/lookbehind
- [ ] Build common search patterns
- [ ] Convert between regex modes

### Intermediate (25 minutes)
- [ ] Create complex lookaround patterns
- [ ] Build data validation searches
- [ ] Use search in substitutions
- [ ] Create reusable search functions

### Advanced (35 minutes)
- [ ] Master all lookaround combinations
- [ ] Build security audit searches
- [ ] Create project-specific patterns
- [ ] Integrate with global commands

## Mastery Checklist

- [ ] Default to very magic mode for complex patterns
- [ ] Use lookaround assertions fluently
- [ ] Build regex patterns without trial and error
- [ ] Create reusable search commands
- [ ] Combine search with other Vim features
- [ ] Debug regex patterns efficiently
- [ ] Build project-specific search tools
- [ ] Never struggle with complex searches again

Remember: Very magic mode is your regex superpower. It makes patterns readable and powerful. Combined with lookaround assertions, you can match virtually any pattern with surgical precision!