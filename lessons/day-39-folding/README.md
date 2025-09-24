# Day 39: Folding - Code Organization Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master fold commands: `zo`, `zc`, `za`, `zR`, `zM`
- Understand different fold methods (manual, indent, syntax, expr, marker)
- Learn to navigate and manipulate folds efficiently
- Build custom folding strategies for your code
- Create persistent fold configurations

## Folding System Architecture

### Mental Model: Collapsible Code Structure

Folding transforms your code into a **collapsible outline**. Think of it as:
- **Code Accordion**: Expand and collapse sections at will
- **Focus Tool**: Hide irrelevant code to concentrate on current task
- **Navigation Aid**: Jump between logical sections quickly
- **Organization System**: View code at different levels of abstraction

```
┌──────────────────────────────────────────┐
│           FOLDING COMMANDS MAP           │
├──────────────────────────────────────────┤
│  Opening/Closing:                        │
│  zo - Open fold                         │
│  zc - Close fold                        │
│  za - Toggle fold                       │
│  zv - View cursor line                  │
│                                          │
│  Recursive Operations:                   │
│  zO - Open all folds under cursor       │
│  zC - Close all folds under cursor      │
│  zA - Toggle all folds under cursor     │
│                                          │
│  Global Operations:                      │
│  zR - Open all folds (Reduce folding)   │
│  zM - Close all folds (More folding)    │
│  zr - Reduce folding level by one       │
│  zm - More folding level by one         │
│                                          │
│  Navigation:                             │
│  zj - Next fold                         │
│  zk - Previous fold                     │
│  [z - Start of current fold             │
│  ]z - End of current fold               │
└──────────────────────────────────────────┘
```

## Core Folding Operations

### 1. Basic Fold Commands

```vim
" Single fold operations
zo          " Open fold under cursor
zc          " Close fold under cursor
za          " Toggle fold under cursor
zv          " Open enough to view cursor line

" Example workflow:
" Navigate to function → zc (close it)
" Need to see it → zo (open it)
" Quick toggle → za
```

### 2. Recursive Fold Operations

```vim
" Work with nested folds
zO          " Open all nested folds
zC          " Close all nested folds
zA          " Toggle all nested folds

" Useful for:
" - Opening entire class with methods
" - Closing complex nested structures
" - Toggling documentation sections
```

### 3. Global Fold Control

```vim
" File-wide operations
zR          " Open all folds in file
zM          " Close all folds in file
zr          " Decrease fold level (open one level)
zm          " Increase fold level (close one level)

" Fold levels workflow:
zM          " Start with everything folded
zr          " Open first level (see functions)
zr          " Open second level (see inside functions)
zR          " Open everything
```

### 4. Fold Navigation

```vim
" Move between folds
zj          " Jump to next fold
zk          " Jump to previous fold
[z          " Jump to start of current fold
]z          " Jump to end of current fold

" Navigate folded document:
zM          " Fold everything
zj          " Next fold
zo          " Open to inspect
zc          " Close
zj          " Next fold
```

## Fold Methods

### 1. Manual Folding

```vim
" Set fold method
:set foldmethod=manual

" Create folds manually
zf{motion}   " Create fold
zf5j         " Fold next 5 lines
zfap         " Fold around paragraph
zfi{         " Fold inside braces
v5jzf        " Visual selection then fold

" Delete folds
zd           " Delete fold
zD           " Delete fold recursively
zE           " Delete all folds
```

### 2. Indent Folding

```vim
" Automatic folding based on indentation
:set foldmethod=indent
:set foldlevel=1    " Show only first level

" Perfect for:
" - Python code
" - YAML files
" - Any indentation-based structure

" Fine-tune indent folding:
:set shiftwidth=4
:set foldnestmax=3  " Maximum fold depth
```

### 3. Syntax Folding

```vim
" Language-aware folding
:set foldmethod=syntax

" Folds based on syntax highlighting
" - Functions in C/JavaScript
" - Classes in OOP languages
" - Sections in Markdown

" Control syntax folding:
:let g:xml_syntax_folding=1    " Enable for XML
:let g:rust_fold=1             " Enable for Rust
```

### 4. Expression Folding

```vim
" Custom fold logic
:set foldmethod=expr
:set foldexpr=CustomFoldExpr()

function! CustomFoldExpr()
    let line = getline(v:lnum)
    " Start fold at function declarations
    if line =~ '^function'
        return '>1'
    " End fold at closing brace
    elseif line =~ '^}'
        return '<1'
    " Continue current fold level
    else
        return '='
    endif
endfunction
```

### 5. Marker Folding

```vim
" Explicit fold markers in code
:set foldmethod=marker

" Default markers: {{{ and }}}
" Custom markers:
:set foldmarker={<,>}

" In your code:
" {{{ Section 1
function myFunction() {
    // code
}
" }}}

" {{{ Section 2
class MyClass {
    // code
}
" }}}
```

## Advanced Folding Patterns

### Pattern 1: Custom Fold Text

```vim
" Customize fold display
set foldtext=CustomFoldText()

function! CustomFoldText()
    let line = getline(v:foldstart)
    let lines_count = v:foldend - v:foldstart + 1
    let lines_text = printf("%10s", lines_count . ' lines')
    let line = substitute(line, '^\s*', '', '')
    let fillchar = '·'
    let width = winwidth(0) - len(lines_text) - len(line) - 4
    return line . ' ' . repeat(fillchar, width) . lines_text
endfunction

" Result: function myFunc() ········· 42 lines
```

### Pattern 2: Project-Specific Folding

```vim
" Different folding per file type
autocmd FileType python setlocal foldmethod=indent
autocmd FileType javascript setlocal foldmethod=syntax
autocmd FileType vim setlocal foldmethod=marker
autocmd FileType markdown setlocal foldmethod=expr

" Project-specific fold settings
autocmd BufRead */myproject/*.js setlocal foldlevel=2
autocmd BufRead */docs/*.md setlocal foldlevel=1
```

### Pattern 3: Fold Persistence

```vim
" Save and restore folds
" Method 1: Using viewoptions
set viewoptions=folds,cursor
autocmd BufWinLeave *.* mkview
autocmd BufWinEnter *.* silent! loadview

" Method 2: Manual save/restore
nnoremap <leader>fs :mkview<CR>
nnoremap <leader>fl :loadview<CR>

" Method 3: Session management
:mksession! ~/mysession.vim
:source ~/mysession.vim
```

## Folding Workflows

### Workflow 1: Code Review

```vim
" Review large file efficiently
zM          " Fold everything
zr          " Open to function level
" Review function names
/interesting<CR>
zo          " Open specific function
" Review implementation
zc          " Close when done
zj          " Next function
```

### Workflow 2: Focus Mode

```vim
" Focus on current function
zMzv        " Close all, open current
" or
:set foldlevel=0
zv          " View current only

" Focus on current class
zCzo        " Close recursively, open current
```

### Workflow 3: Outline Navigation

```vim
" Use folds as document outline
:set foldcolumn=4    " Show fold indicators
zM                   " Create outline
" Navigate with fold commands
zj zo               " Next section and open
zk zo               " Previous section and open

" Jump to specific sections quickly
```

## Practical Applications

### Application 1: Long File Management

```vim
" Working with 1000+ line files
:set foldmethod=syntax
:set foldlevel=1      " Show only top level
zM                    " Start folded
/functionName<CR>     " Find specific function
zv                    " Open to view
zO                    " Open completely if nested
```

### Application 2: Configuration Files

```vim
" Organize .vimrc with folds
" {{{ Basic Settings
set number
set relativenumber
" }}}

" {{{ Plugin Configuration
call plug#begin()
" plugins...
call plug#end()
" }}}

" {{{ Mappings
nnoremap <leader>w :w<CR>
" more mappings...
" }}}

:set foldmethod=marker
```

### Application 3: Documentation Writing

```vim
" Fold markdown by headers
:set foldmethod=expr
:set foldexpr=MarkdownFoldExpr()

function! MarkdownFoldExpr()
    let line = getline(v:lnum)
    if line =~ '^#\+ '
        return '>' . len(matchstr(line, '^#\+'))
    else
        return '='
    endif
endfunction
```

## Practice Exercises

### Exercise 1: Basic Fold Operations

```javascript
// Practice folding this code:
function processData(input) {
    // Validation
    if (!input) {
        throw new Error('Invalid input');
    }

    // Processing
    const result = input.map(item => {
        return item * 2;
    });

    return result;
}

function analyzeData(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    const avg = sum / data.length;
    return { sum, avg };
}

// Tasks:
// 1. Fold each function
// 2. Fold only the if block
// 3. Toggle all folds
// 4. Navigate between folded functions
```

### Exercise 2: Fold Method Comparison

```python
# Try different fold methods:
class DataProcessor:
    def __init__(self):
        self.data = []

    def add_data(self, item):
        """Add item to data"""
        self.data.append(item)

    def process(self):
        """Process all data"""
        result = []
        for item in self.data:
            if item > 0:
                result.append(item * 2)
        return result

# Test with:
# :set foldmethod=indent
# :set foldmethod=syntax
# :set foldmethod=manual (create custom folds)
```

### Exercise 3: Custom Fold Configuration

```vim
" Create custom folding for this TODO list:
" TODO: High Priority {{{
" - Fix critical bug
" - Update documentation
" - Review PR #123
" }}}

" TODO: Medium Priority {{{
" - Refactor old code
" - Add unit tests
" - Update dependencies
" }}}

" TODO: Low Priority {{{
" - Clean up comments
" - Optimize performance
" - Add nice-to-have features
" }}}
```

## Common Pitfalls & Solutions

### Pitfall 1: Lost Folds
**Problem**: Folds disappear when reopening file
**Solution**: Save and restore views
```vim
:set viewoptions=folds
:autocmd BufWinLeave * mkview
:autocmd BufWinEnter * silent! loadview
```

### Pitfall 2: Too Many Folds
**Problem**: Everything is folded, hard to navigate
**Solution**: Adjust fold level
```vim
:set foldlevel=2    " Start with 2 levels open
:set foldnestmax=3  " Limit nesting
```

### Pitfall 3: Slow Performance
**Problem**: Folding slows down Vim
**Solution**: Use simpler fold method
```vim
" Instead of complex expr:
:set foldmethod=indent   " Faster
" Or disable in large files:
:set nofoldenable
```

## Practice Goals

### Beginner (15 mins)
- [ ] Master zo, zc, za commands
- [ ] Use zR and zM for global control
- [ ] Navigate with zj and zk
- [ ] Create manual folds with zf

### Intermediate (25 mins)
- [ ] Try all fold methods
- [ ] Configure fold appearance
- [ ] Set up fold persistence
- [ ] Create file-type specific folding

### Advanced (35 mins)
- [ ] Write custom fold expressions
- [ ] Implement smart fold text
- [ ] Build folding workflows
- [ ] Create folding functions

## Quick Reference Card

```
BASIC OPERATIONS
zo/zc       Open/close fold
za          Toggle fold
zv          View cursor line

RECURSIVE
zO/zC       Open/close all nested
zA          Toggle all nested

GLOBAL
zR          Open all folds
zM          Close all folds
zr/zm       Reduce/more folding

NAVIGATION
zj/zk       Next/previous fold
[z/]z       Start/end of fold

CREATION (Manual)
zf{motion}  Create fold
zd          Delete fold
zE          Delete all folds

FOLD METHODS
manual      Create folds manually
indent      Based on indentation
syntax      Based on syntax
expr        Custom expression
marker      Using markers {{{ }}}

SETTINGS
foldmethod  How to fold
foldlevel   Initial fold level
foldcolumn  Show fold indicators
foldtext    Custom fold text
```

## Connection to Other Lessons

**Previous**: Day 38's completion works better with folded code for cleaner context.

**Next**: Day 40 will explore advanced yanking, which combines well with folded sections.

**Related Concepts**:
- Navigation (Day 2, 16) enhanced by fold jumping
- Visual mode (Day 10) for creating manual folds
- Functions and text objects for fold creation

## Summary

Folding transforms Vim into a code outliner, letting you work at different levels of abstraction. Master folding to:
- Navigate large files efficiently
- Focus on relevant code sections
- Create custom code organization
- Review code structure at a glance

Remember: Folding is about **selective visibility**—show what matters, hide what doesn't, and navigate your code like a well-organized outline rather than a wall of text.