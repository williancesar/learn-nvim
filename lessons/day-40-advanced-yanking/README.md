# Day 40: Advanced Yanking - Register Orchestration

## Learning Objectives

By the end of this lesson, you will:
- Master yanking to specific registers strategically
- Build multi-register workflows for complex operations
- Understand register persistence and scope
- Create advanced yank-based automation
- Develop register management best practices

## Advanced Register Strategy

### Mental Model: Register Orchestra

Think of registers as an **orchestra of clipboards**, each with a specific role:
- **Conductor** ("): The unnamed register directing operations
- **Soloists** (a-z): Named registers for featured content
- **Section** (0-9): Numbered registers maintaining history
- **Special Instruments** (+, *, /, etc.): Purpose-built registers

```
┌────────────────────────────────────────────┐
│        REGISTER ORCHESTRA MAP              │
├────────────────────────────────────────────┤
│  Strategic Allocation:                     │
│                                            │
│  Project Registers (a-h):                 │
│  a: API endpoints                         │
│  b: Boilerplate code                      │
│  c: Configuration snippets                │
│  d: Documentation templates               │
│                                            │
│  Temporary Registers (t-w):               │
│  t: Temporary operations                  │
│  u: Undo buffer                          │
│  v: Variable names                       │
│  w: Working clipboard                    │
│                                            │
│  Special Purpose (x-z):                   │
│  x: Exchange buffer                      │
│  y: Yank collection                      │
│  z: Zen mode (cleared regularly)         │
└────────────────────────────────────────────┘
```

## Advanced Yanking Patterns

### 1. Multi-Register Collection

```vim
" Collect related content in different registers
" Function signature → register f
/^function<CR>
"fyy

" Function body → register b
vi{
"by

" Function documentation → register d
?\/\*\*<CR>
v/\*\/<CR>
"dy

" Now you have function parts in f, b, d
" Reconstruct elsewhere:
"fp    " Paste signature
"dp    " Paste documentation
"bp    " Paste body
```

### 2. Register Rotation Pattern

```vim
" Rotate through multiple yanks
function! RotateRegister()
    " Save current to temp
    let @z = @"
    " Rotate: a→", b→a, c→b, "→c
    let @" = @a
    let @a = @b
    let @b = @c
    let @c = @z
endfunction

" Map to leader-r
nnoremap <leader>r :call RotateRegister()<CR>

" Usage:
"ayiw    " Yank word 1 to a
"byiw    " Yank word 2 to b
"cyiw    " Yank word 3 to c
" Now rotate through them with <leader>r and p
```

### 3. Append Collection Pattern

```vim
" Collect multiple items into single register

" Clear register first
qaq         " Clear register a

" Append multiple selections
/pattern1<CR>
"Ayy        " Append line (uppercase A)
/pattern2<CR>
"Ayy        " Append another
/pattern3<CR>
"Ayy        " And another

" Register a now contains all three lines
"ap         " Paste all collected lines
```

### 4. Register Exchange Pattern

```vim
" Swap content between locations
" Using register x as exchange buffer

" At location 1:
"xyiw       " Yank word to register x
viw"xp      " Replace with register x (first swap)

" At location 2:
viw"xp      " Complete the swap

" As a mapping:
nnoremap <leader>x "xyiw
nnoremap <leader>X viw"xp
```

## Complex Yanking Workflows

### Workflow 1: Template System

```vim
" Build template system with registers

" Store templates in registers
let @h = "<!DOCTYPE html>\n<html>\n<head>\n\t<title></title>\n</head>\n<body>\n\n</body>\n</html>"
let @f = "function name() {\n\t// TODO: Implement\n\treturn null;\n}"
let @c = "class ClassName {\n\tconstructor() {\n\t\t// Initialize\n\t}\n}"

" Quick insertion commands
nnoremap <leader>th "hp    " HTML template
nnoremap <leader>tf "fp    " Function template
nnoremap <leader>tc "cp    " Class template

" Persistent templates (save in vimrc)
autocmd VimEnter * let @h = "..." " Load on startup
```

### Workflow 2: Code Extraction

```vim
" Extract and reorganize code sections

function! ExtractToFile(register, filename)
    " Save current position
    mark Z
    " Create new file with register content
    execute 'edit ' . a:filename
    execute 'put ' . a:register
    " Clean up
    normal! ggdd
    write
    " Return to original
    normal! 'Z
endfunction

" Usage:
" 1. Yank code section to register
"ayip       " Yank paragraph to 'a'
" 2. Extract to file
:call ExtractToFile('a', 'extracted.js')
```

### Workflow 3: Register History

```vim
" Implement register history tracking

let g:register_history = {}

function! SaveToHistory(reg)
    if !exists('g:register_history[a:reg]')
        let g:register_history[a:reg] = []
    endif
    call add(g:register_history[a:reg], getreg(a:reg))
    " Keep last 10 items
    if len(g:register_history[a:reg]) > 10
        call remove(g:register_history[a:reg], 0)
    endif
endfunction

function! RestoreFromHistory(reg, index)
    if exists('g:register_history[a:reg]')
        let history = g:register_history[a:reg]
        if a:index < len(history)
            call setreg(a:reg, history[-(a:index + 1)])
        endif
    endif
endfunction

" Auto-save on yank
autocmd TextYankPost * call SaveToHistory(v:register)
```

### Workflow 4: Multi-File Register Operations

```vim
" Yank across multiple files

" Step 1: Collect from multiple files
:args *.js              " Open all JS files
:argdo /function/       " Find function in each
:argdo normal "Ayy      " Append to register A

" Step 2: Process collected content
:new                    " New buffer
"ap                     " Paste all functions
:sort                   " Sort them
:%s/function/export function/g  " Modify

" Step 3: Distribute back
:saveas allfunctions.js
```

## Advanced Register Techniques

### 1. Register Macros

```vim
" Use registers for dynamic macros

" Store macro components in registers
let @a = "yiw"          " Yank inner word
let @b = "/\\<\\C\<C-r>\"\<CR>"  " Search for yanked word
let @c = "ciwReplacement\<Esc>"  " Replace with "Replacement"

" Combine registers into macro
let @q = @a . @b . @c

" Execute combined macro
@q
```

### 2. Conditional Register Use

```vim
function! SmartYank()
    " Yank to different registers based on content
    let line = getline('.')

    if line =~ '^function'
        normal! "fyy
        echo "Yanked function to register f"
    elseif line =~ '^class'
        normal! "cyy
        echo "Yanked class to register c"
    elseif line =~ '^import\|^require'
        normal! "iyy
        echo "Yanked import to register i"
    else
        normal! yy
        echo "Yanked to default register"
    endif
endfunction

nnoremap Y :call SmartYank()<CR>
```

### 3. Register Transformation

```vim
" Transform register contents

function! TransformRegister(reg, transformation)
    let content = getreg(a:reg)

    if a:transformation == 'upper'
        let content = toupper(content)
    elseif a:transformation == 'lower'
        let content = tolower(content)
    elseif a:transformation == 'reverse'
        let content = join(reverse(split(content, '\n')), '\n')
    elseif a:transformation == 'sort'
        let content = join(sort(split(content, '\n')), '\n')
    endif

    call setreg(a:reg, content)
endfunction

" Commands
command! -nargs=1 UpperReg call TransformRegister(<f-args>, 'upper')
command! -nargs=1 LowerReg call TransformRegister(<f-args>, 'lower')
command! -nargs=1 ReverseReg call TransformRegister(<f-args>, 'reverse')
command! -nargs=1 SortReg call TransformRegister(<f-args>, 'sort')
```

### 4. Register Arithmetic

```vim
" Perform calculations on register contents

function! RegisterMath(reg, operation)
    let content = getreg(a:reg)

    " Extract numbers
    let numbers = []
    call substitute(content, '\d\+', '\=add(numbers, submatch(0))', 'g')

    if a:operation == 'sum'
        let result = 0
        for num in numbers
            let result += str2nr(num)
        endfor
        echo "Sum: " . result
        let @r = result
    elseif a:operation == 'avg'
        let sum = 0
        for num in numbers
            let sum += str2nr(num)
        endfor
        let result = sum / len(numbers)
        echo "Average: " . result
        let @r = result
    endif
endfunction

" Sum numbers in register a
:call RegisterMath('a', 'sum')
```

## Practice Exercises

### Exercise 1: Register Collection

```javascript
// Collect all function names into register f
function calculateTotal() { }
function validateInput() { }
function processData() { }
function generateReport() { }

// Tasks:
// 1. Yank all function names to register f (append)
// 2. Create a list of exports using register f
// 3. Generate documentation template from names
```

### Exercise 2: Multi-Register Workflow

```vim
" Build a code snippet using multiple registers:
" Register a: variable declaration
" Register b: function call
" Register c: return statement

" Source code:
let result = null;
processData(input);
return { status: 'success', data: result };

" Task: Reconstruct in different order using registers
```

### Exercise 3: Register Transformation

```sql
-- Transform this SQL using registers:
select * from users where age > 18;
select * from products where price < 100;
select * from orders where status = 'pending';

-- Tasks:
-- 1. Yank all table names to register t
-- 2. Uppercase all SQL keywords using register operations
-- 3. Create INSERT statements from SELECT using yanked data
```

## Common Pitfalls & Solutions

### Pitfall 1: Register Overwriting
**Problem**: Accidentally overwriting important registers
**Solution**: Use consistent naming conventions
```vim
" Reserve registers:
" a-h: Persistent project data
" i-p: Current session work
" q-w: Temporary operations
" x-z: Special purposes
```

### Pitfall 2: Lost Register Content
**Problem**: Register content lost after Vim restart
**Solution**: Save important registers
```vim
" In .vimrc:
autocmd VimLeave * call SaveRegisters()
autocmd VimEnter * call LoadRegisters()

function! SaveRegisters()
    let @/ = ''  " Clear search to avoid issues
    redir > ~/.vim/registers.vim
    silent registers
    redir END
endfunction
```

### Pitfall 3: Register Size Limits
**Problem**: Large yanks fail
**Solution**: Use files for large content
```vim
" For large content:
:w! /tmp/largeyank.txt   " Save to file
:r /tmp/largeyank.txt    " Read when needed
```

## Practice Goals

### Beginner (20 mins)
- [ ] Yank to 5 different named registers
- [ ] Use uppercase to append
- [ ] Build multi-register workflow
- [ ] Practice register rotation

### Intermediate (30 mins)
- [ ] Create register templates
- [ ] Implement register exchange
- [ ] Use registers in macros
- [ ] Build collection patterns

### Advanced (40 mins)
- [ ] Create register management system
- [ ] Implement register transformations
- [ ] Build cross-file workflows
- [ ] Master register arithmetic

## Quick Reference Card

```
YANKING TO REGISTERS
"[a-z]y     Yank to named register
"[A-Z]y     Append to register
"0y         Cannot yank to 0 (read-only)
"+y         Yank to system clipboard

REGISTER OPERATIONS
:let @a=@b  Copy register b to a
:let @a=""  Clear register a
:let @A="x" Append "x" to register a
:reg        View all registers
:reg abc    View registers a, b, c

SPECIAL YANKS
"ayip       Yank paragraph to 'a'
"Ayip       Append paragraph to 'a'
ggVG"+y     Yank entire file to clipboard
:g/pat/y A  Yank all matching lines

REGISTER TRICKS
qaq         Clear register 'a'
"ay$        Yank to EOL into 'a'
"ayit       Yank inner tag to 'a'
:put a      Put register 'a' on new line

PERSISTENCE
:wv         Write viminfo (saves registers)
:rv         Read viminfo (loads registers)
```

## Connection to Other Lessons

**Previous**: Day 39's folding helps organize code for strategic yanking.

**Next**: Day 41 will explore the dot formula, which combines with yanking for powerful repetition.

**Related Concepts**:
- Registers (Day 29-30) fundamental knowledge
- Visual mode (Day 10, 32) for precise yanking
- Macros (Day 31) can use yanked content dynamically

## Summary

Advanced yanking transforms registers from simple clipboards into a sophisticated content management system. Master these techniques to:
- Orchestrate multi-register workflows
- Build reusable template systems
- Extract and reorganize code efficiently
- Create register-based automation

Remember: Yanking is not just about copying—it's about **strategic content placement** across your register orchestra, enabling complex text manipulations that would be impossible with a single clipboard.