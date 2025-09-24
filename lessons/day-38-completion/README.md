# Day 38: Completion - Intelligent Text Expansion

## Learning Objectives

By the end of this lesson, you will:
- Master keyword completion with `Ctrl-n` and `Ctrl-p`
- Understand the `Ctrl-x` completion sub-modes
- Learn line, filename, and omni-completion techniques
- Build efficient completion workflows
- Customize completion behavior for your needs

## Completion System Architecture

### Mental Model: Context-Aware Intelligence

Vim's completion system is a **context-aware text predictor**. Think of it as:
- **Smart Scanner**: Searches various sources for matches
- **Context Engine**: Understands what you're trying to type
- **Efficiency Tool**: Reduces keystrokes dramatically
- **Knowledge Base**: Leverages existing text and external sources

```
┌──────────────────────────────────────────────┐
│          COMPLETION SOURCES MAP              │
├──────────────────────────────────────────────┤
│  Generic Completion:                         │
│  Ctrl-n    Next keyword in file/buffers      │
│  Ctrl-p    Previous keyword in file/buffers  │
│                                               │
│  Ctrl-x Sub-modes:                          │
│  Ctrl-x Ctrl-l    Whole lines               │
│  Ctrl-x Ctrl-n    Keywords in file          │
│  Ctrl-x Ctrl-k    Dictionary                │
│  Ctrl-x Ctrl-t    Thesaurus                 │
│  Ctrl-x Ctrl-i    Keywords in includes      │
│  Ctrl-x Ctrl-]    Tags                      │
│  Ctrl-x Ctrl-f    Filenames                 │
│  Ctrl-x Ctrl-d    Definitions/macros        │
│  Ctrl-x Ctrl-v    Vim commands              │
│  Ctrl-x Ctrl-o    Omni-completion           │
│  Ctrl-x Ctrl-u    User completion           │
│  Ctrl-x s         Spelling suggestions       │
└──────────────────────────────────────────────┘
```

## Core Completion Operations

### 1. Keyword Completion (Ctrl-n/Ctrl-p)

```vim
" Basic keyword completion
" Type: func
func<Ctrl-n>    " Completes to 'function' if found

" Navigation in completion menu
<Ctrl-n>        " Next match
<Ctrl-p>        " Previous match
<Ctrl-y>        " Accept completion
<Ctrl-e>        " Cancel completion
<Enter>         " Accept and newline

" Example workflow:
" File contains: calculateTotal, calculateAverage, calculateSum
calc<Ctrl-n>    " Shows menu with all three
<Ctrl-n>        " Navigate to next
<Ctrl-y>        " Accept selection
```

### 2. Line Completion (Ctrl-x Ctrl-l)

```vim
" Complete entire lines
" Useful for repetitive structures

" If file contains:
let firstName = document.getElementById('first');
" Type:
let l<Ctrl-x><Ctrl-l>
" Completes to:
let lastName = document.getElementById('last');
" (Suggests similar line, edit the different parts)

" Multiple line completion:
<Ctrl-x><Ctrl-l>    " First line
<Ctrl-l>             " Continue with next line
<Ctrl-l>             " And next...
```

### 3. Filename Completion (Ctrl-x Ctrl-f)

```vim
" Complete file paths
" In insert mode:
./src/<Ctrl-x><Ctrl-f>    " Shows files in src/
../con<Ctrl-x><Ctrl-f>    " Completes to ../config/
/usr/lo<Ctrl-x><Ctrl-f>   " Completes to /usr/local/

" Useful for:
import './comp<Ctrl-x><Ctrl-f>'    " Complete component path
require('./mo<Ctrl-x><Ctrl-f>')    " Complete module path
```

### 4. Omni-completion (Ctrl-x Ctrl-o)

```vim
" Language-aware intelligent completion
" Requires filetype plugin

" HTML:
<di<Ctrl-x><Ctrl-o>    " Completes to <div>
<div cl<Ctrl-x><Ctrl-o> " Suggests class=""

" JavaScript:
document.<Ctrl-x><Ctrl-o>    " Shows DOM methods
Math.<Ctrl-x><Ctrl-o>        " Shows Math functions

" CSS:
color: <Ctrl-x><Ctrl-o>      " Shows color values
display: <Ctrl-x><Ctrl-o>    " Shows display options
```

## Advanced Completion Patterns

### Pattern 1: Chain Completion

```vim
" Combine different completion modes
" Type beginning
get<Ctrl-n>           " Complete to getElementById
('<Ctrl-x><Ctrl-f>    " Complete filename
').<Ctrl-x><Ctrl-o>   " Complete methods

" Result: getElementById('./path/file.js').someMethod()
```

### Pattern 2: Custom Completion Sources

```vim
" Set custom completion function
set completefunc=MyCompleteFunc

function! MyCompleteFunc(findstart, base)
    if a:findstart
        " Find start of word
        let line = getline('.')
        let start = col('.') - 1
        while start > 0 && line[start - 1] =~ '\w'
            let start -= 1
        endwhile
        return start
    else
        " Return matches
        let matches = []
        " Add custom completions
        if a:base =~ '^test'
            call add(matches, 'testCase')
            call add(matches, 'testSuite')
            call add(matches, 'testRunner')
        endif
        return matches
    endif
endfunction

" Use with Ctrl-x Ctrl-u
```

### Pattern 3: Dictionary Completion

```vim
" Set up dictionary file
set dictionary+=/usr/share/dict/words
set dictionary+=~/.vim/custom_words.txt

" Use dictionary completion
" Type: prog
prog<Ctrl-x><Ctrl-k>    " Completes from dictionary

" Project-specific dictionaries
autocmd FileType python set dictionary+=~/.vim/python_words.txt
autocmd FileType javascript set dictionary+=~/.vim/js_words.txt
```

## Completion Workflows

### Workflow 1: Code Completion Strategy

```vim
" Efficient coding completion order:
" 1. Try keyword completion first (fastest)
<Ctrl-n>

" 2. If not found, try omni-completion
<Ctrl-x><Ctrl-o>

" 3. For imports/includes, use filename
<Ctrl-x><Ctrl-f>

" 4. For repeated structures, use line completion
<Ctrl-x><Ctrl-l>
```

### Workflow 2: Documentation Writing

```vim
" Complete repeated phrases
" After writing a phrase once:
"This is an important concept"

" Later in document:
This is<Ctrl-x><Ctrl-l>    " Completes the phrase

" Complete technical terms consistently:
implement<Ctrl-n>    " Ensures consistent spelling
```

### Workflow 3: Configuration Files

```vim
" Complete configuration options
" In .vimrc:
set comp<Ctrl-x><Ctrl-v>    " Vim command completion

" In config files:
<Ctrl-x><Ctrl-l>    " Repeat similar config lines
```

## Completion Configuration

### 1. Completion Options

```vim
" Configure completion behavior
set completeopt=menu,menuone,noselect
" menu: Show popup menu
" menuone: Show menu even for single match
" noselect: Don't auto-select first match

" Set completion sources
set complete=.,w,b,u,t,i
" . : Current buffer
" w : Other windows
" b : Other buffers
" u : Unloaded buffers
" t : Tags
" i : Included files

" Ignore case in completion
set infercase    " Adjust case to match
set ignorecase   " Case insensitive matching
```

### 2. Popup Menu Colors

```vim
" Customize completion menu appearance
highlight Pmenu ctermbg=gray ctermfg=black
highlight PmenuSel ctermbg=blue ctermfg=white
highlight PmenuSbar ctermbg=gray
highlight PmenuThumb ctermbg=black
```

### 3. Completion Mappings

```vim
" Smart tab completion
function! SmartTab()
    if col('.') > 1 && getline('.')[col('.') - 2] =~ '\w'
        return "\<C-n>"
    else
        return "\<Tab>"
    endif
endfunction
inoremap <Tab> <C-r>=SmartTab()<CR>

" Quick completion mappings
inoremap <C-Space> <C-x><C-o>    " Trigger omni-completion
inoremap <C-l> <C-x><C-l>        " Quick line completion
inoremap <C-f> <C-x><C-f>        " Quick file completion
```

## Advanced Techniques

### 1. Completion with Snippets

```vim
" Combine completion with expansion
" After completion, expand snippets
function! ExpandSnippet()
    let word = expand('<cword>')
    if word == 'function'
        normal! ciw
        normal! ifunction name() {
        normal! o}
        normal! O
        startinsert
    endif
endfunction

inoremap <C-j> <Esc>:call ExpandSnippet()<CR>
```

### 2. Context-Aware Completion

```vim
" Different completion based on context
function! SmartComplete()
    let line = getline('.')
    let col = col('.')

    " In string? Use dictionary
    if line[col-2] =~ '[''"]'
        return "\<C-x>\<C-k>"
    " After dot? Use omni-completion
    elseif line[col-2] == '.'
        return "\<C-x>\<C-o>"
    " After slash? File completion
    elseif line[col-2] == '/'
        return "\<C-x>\<C-f>"
    else
        return "\<C-n>"
    endif
endfunction

inoremap <C-n> <C-r>=SmartComplete()<CR>
```

### 3. Completion Preview

```vim
" Show extra info in preview window
set completeopt+=preview

" Auto-close preview after completion
autocmd CompleteDone * if pumvisible() == 0 | pclose | endif
```

## Practice Exercises

### Exercise 1: Basic Completion

```vim
" Practice file with these words:
" function, functionality, functional, fundament

" Tasks:
" 1. Type 'fun' and use Ctrl-n to cycle through options
" 2. Type 'func' and complete to 'functionality'
" 3. Use Ctrl-p to go backwards through matches
```

### Exercise 2: Line Completion

```javascript
// Complete these similar lines:
const userId = document.getElementById('user-id');
const use[Ctrl-x Ctrl-l]  // Complete to similar line
const userEmail = // Modify the completed line
```

### Exercise 3: Path Completion

```vim
" Complete these import statements:
import Component from './src/[Ctrl-x Ctrl-f]'
require('../lib/[Ctrl-x Ctrl-f]')
include '/usr/local/[Ctrl-x Ctrl-f]'
```

## Common Pitfalls & Solutions

### Pitfall 1: Completion Not Working
**Problem**: Ctrl-n finds nothing
**Solution**: Check 'complete' option
```vim
:set complete?    " Check sources
:set complete+=i   " Add included files
```

### Pitfall 2: Wrong Completion Type
**Problem**: Getting wrong suggestions
**Solution**: Use specific completion mode
```vim
" Instead of generic Ctrl-n
" Use specific: Ctrl-x Ctrl-o for methods
```

### Pitfall 3: Slow Completion
**Problem**: Completion is sluggish
**Solution**: Limit sources
```vim
set complete-=i    " Remove included files
set complete-=t    " Remove tags
```

## Practice Goals

### Beginner (15 mins)
- [ ] Master Ctrl-n/Ctrl-p navigation
- [ ] Use Ctrl-y to accept, Ctrl-e to cancel
- [ ] Try line completion (Ctrl-x Ctrl-l)
- [ ] Practice filename completion

### Intermediate (25 mins)
- [ ] Configure completeopt settings
- [ ] Use omni-completion effectively
- [ ] Set up dictionary completion
- [ ] Create basic completion mappings

### Advanced (35 mins)
- [ ] Build custom completion functions
- [ ] Implement context-aware completion
- [ ] Create smart tab completion
- [ ] Master all Ctrl-x sub-modes

## Quick Reference Card

```
BASIC COMPLETION
<C-n>        Next keyword
<C-p>        Previous keyword
<C-y>        Accept completion
<C-e>        Cancel completion

CTRL-X SUB-MODES
<C-x><C-l>   Whole lines
<C-x><C-n>   Keywords in file
<C-x><C-k>   Dictionary
<C-x><C-t>   Thesaurus
<C-x><C-i>   Include files
<C-x><C-]>   Tags
<C-x><C-f>   Filenames
<C-x><C-d>   Definitions
<C-x><C-v>   Vim commands
<C-x><C-o>   Omni-completion
<C-x><C-u>   User defined
<C-x>s       Spelling

NAVIGATION IN MENU
<C-n>        Next item
<C-p>        Previous item
<C-y>        Accept
<C-e>        Cancel
<CR>         Accept + newline

SETTINGS
complete     Completion sources
completeopt  Menu behavior
infercase    Case matching
```

## Connection to Other Lessons

**Previous**: Day 37's black hole register helps maintain completion context without register pollution.

**Next**: Day 39 will explore folding, which can improve completion performance by hiding irrelevant code.

**Related Concepts**:
- Insert mode techniques for efficient completion use
- File navigation (Day 13) relates to filename completion
- Tags and navigation for tag-based completion

## Summary

Vim's completion system transforms typing from character-by-character input into intelligent text expansion. Master completion to:
- Write code faster with fewer typos
- Maintain consistency across your document
- Leverage existing text as a knowledge base
- Reduce repetitive typing dramatically

Remember: Completion is about **contextual intelligence**—let Vim predict what you want to type based on what's already there, turning repetitive typing into smart selection.