# Day 55: Command-line Mode - Ex Commands Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master Vim's command-line mode and Ex commands
- Understand command-line editing and history
- Build complex command combinations and pipes
- Use ranges, flags, and command modifiers effectively
- Create custom commands and command-line mappings
- Integrate Ex commands with scripts and automation

## Command-Line Mode Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  COMMAND-LINE MODE SYSTEM                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  COMMAND STRUCTURE                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  :[range]command[!] [arguments] [| command2]          │  │
│  │                                                        │  │
│  │  Components:                                           │  │
│  │  • range     - Lines to operate on (%, 1,5, ., $)     │  │
│  │  • command   - Ex command (s, g, w, r, !)             │  │
│  │  • !         - Force/override modifier                │  │
│  │  • arguments - Command-specific parameters            │  │
│  │  • |         - Command separator (pipe)               │  │
│  │                                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  COMMAND CONTEXTS                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  : Ex command mode        (normal mode)               │  │
│  │  / Forward search         (search mode)               │  │
│  │  ? Backward search        (search mode)               │  │
│  │  ! Filter command         (filter mode)               │  │
│  │  @ Execute register       (indirect mode)             │  │
│  │  > Indent command         (operator mode)             │  │
│  │                                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Command-Line Navigation and Editing

### Movement Commands

```vim
" In command-line mode (after pressing :)
<Left>/<Right>      " Character movement
<C-Left>/<C-Right>  " Word movement
<Home>/<End>        " Line start/end
<C-b>/<C-e>         " Beginning/End (alternative)

" Advanced movement
<C-w>               " Delete word before cursor
<C-u>               " Delete to line start
<C-k>               " Delete to line end
<C-a>               " Go to start
<C-f>               " Open command-line window

" History navigation
<Up>/<Down>         " Previous/next command
<C-p>/<C-n>         " Previous/next (alternative)
<Tab>               " Command completion
<C-d>               " Show completions
```

### Command-Line Window

```vim
" Open command-line window
q:                  " Command history window
q/                  " Search history window
q?                  " Backward search history
<C-f>               " From command-line to window

" In command-line window
" - Edit commands like normal text
" - Use all Vim motions
" - Press Enter to execute
" - :q to close without executing

" Example workflow
q:                  " Open command window
5k                  " Go up 5 commands
cc:w | !python %    " Edit command
<Enter>             " Execute
```

## Range Specifications

### Basic Ranges

```vim
:5                  " Line 5
:5,10               " Lines 5 to 10
:.                  " Current line
:$                  " Last line
:%                  " Entire file (1,$)
:.,$                " Current to end
:.,+5               " Current and next 5
:-3,+3              " 3 before to 3 after
:'a,'b              " From mark a to mark b
:/<pattern>/        " Next line matching pattern
:?<pattern>?        " Previous line matching pattern
```

### Advanced Ranges

```vim
" Complex range expressions
:.+1,$-1            " Next line to second-to-last
:/start/,/end/      " From pattern to pattern
:/func/+1,/^}/−1    " Inside function body
:'<,'>              " Visual selection
:g/pattern/         " All lines matching pattern

" Range modifiers
:5,10+2             " Lines 5 to 12 (10+2)
:/pattern/−2,+3     " 2 before to 3 after pattern
:.;+5               " Current to current+5 (semicolon)

" Marks in ranges
:'a,'b              " Between marks
:.,'a               " Current to mark a
:'<,'>              " Last visual selection
:[,]                " Last changed text
```

## Ex Command Categories

### 1. File Operations

```vim
" Read/Write commands
:w [file]           " Write file
:w!                 " Force write
:w >> file          " Append to file
:r file             " Read file after cursor
:r! command         " Read command output
:0r header.txt      " Read at beginning
:$r footer.txt      " Read at end

" File information
:f                  " Show file info
:f newname          " Rename buffer
:pwd                " Print working directory
:cd path            " Change directory
:lcd path           " Local directory change

" Multiple files
:n                  " Next file
:prev               " Previous file
:args               " Show file list
:argadd             " Add to argument list
```

### 2. Text Manipulation

```vim
" Substitute command
:[range]s/pattern/replacement/flags
:s/old/new/         " Current line
:%s/old/new/g       " Entire file
:5,10s/^/# /        " Comment lines 5-10
:'a,'bs/\t/  /g     " Tabs to spaces in range

" Global command
:[range]g/pattern/command
:g/TODO/p           " Print TODO lines
:g/^$/d             " Delete empty lines
:g/console/s//log/g " Replace in matching lines
:v/keep/d           " Delete non-matching (inverse)

" Delete/Yank/Put
:5,10d              " Delete lines
:5,10y a            " Yank to register a
:5pu                " Put after line 5
:0pu                " Put at beginning

" Join/Format
:5,10j              " Join lines
:5,10!fmt           " Format with external
:5,10center         " Center lines
:5,10left 4         " Left align with indent
```

### 3. Advanced Commands

```vim
" Execute and evaluate
:normal command     " Execute normal mode
:normal! @a         " Execute macro (no remaps)
:execute "command"  " Execute string as command
:@"                 " Execute yanked text
:source file.vim    " Execute script file

" Expression evaluation
:echo "Hello"       " Display message
:echom "Message"    " Display and log message
:let var = value    " Set variable
:if condition | cmd | endif  " Conditional
:for i in range(5) | echo i | endfor  " Loop

" System interaction
:!command           " Execute shell command
:r !date            " Read command output
:.!sort             " Filter through command
:w !wc -l           " Pipe to command
:terminal           " Open terminal
```

## Command Combinations and Pipes

### Command Chaining

```vim
" Multiple commands with |
:w | source %       " Save and source
:g/old/s//new/g | update  " Replace and save
:%s/\s\+$//e | %s/\t/  /g | w  " Clean and save

" Conditional execution
:if &mod | w | endif  " Save if modified
:g/pattern/ if getline('.') =~ 'test' | d | endif

" Complex chains
:e file | %s/old/new/g | w | bd | e next.txt
```

### Command-Line Functions

```vim
" Using functions in commands
:put =range(1,10)   " Insert numbers 1-10
:g/^/exe "normal! 0i" . line('.') . ". "  " Number lines
:s/\d\+/\=submatch(0)*2/g  " Double all numbers

" Custom command functions
function! Cleanup()
    %s/\s\+$//e     " Trailing whitespace
    %s/\r//ge       " Windows line endings
    %s/\t/    /g    " Tabs to spaces
endfunction
command! Clean call Cleanup()
```

## Custom Commands

### Command Definition

```vim
" Basic syntax
:command Name action
:command! Name action  " Override if exists

" With arguments
:command -nargs=0 Name action  " No arguments
:command -nargs=1 Name action  " One argument
:command -nargs=* Name action  " Any number
:command -nargs=+ Name action  " One or more
:command -nargs=? Name action  " Zero or one

" With ranges
:command -range Name action    " Accept range
:command -range=% Name action  " Default to whole file

" Examples
:command WQ wq
:command Vimrc e ~/.vimrc
:command -nargs=1 Find g/<args>/p
:command -range=% Format <line1>,<line2>!prettier
```

### Advanced Custom Commands

```vim
" With completion
:command -nargs=1 -complete=file Edit e <args>
:command -nargs=1 -complete=buffer Bd bd <args>
:command -complete=command Which verbose command <args>

" With multiple features
:command -range=% -nargs=* -complete=file
    \ Search <line1>,<line2>g/<args>/p

" Using <q-args> for quotes
:command -nargs=+ Grep execute 'vimgrep /<q-args>/ **/*'

" Using functions
function! MyCommand(...)
    echo "Arguments: " . join(a:000, ', ')
endfunction
:command -nargs=* My call MyCommand(<f-args>)

" Bang commands
:command -bang Write w<bang>
:command -bang -nargs=? Quit qa<bang> <args>
```

## Command-Line Mappings

### Creating Mappings

```vim
" Command-line mappings
:cnoremap <C-a> <Home>
:cnoremap <C-e> <End>
:cnoremap <C-p> <Up>
:cnoremap <C-n> <Down>

" Insert common commands
:cnoremap w!! w !sudo tee % >/dev/null
:cnoremap <C-r><C-w> <C-r>=expand('<cword>')<CR>

" Abbreviations
:cabbrev W w
:cabbrev Q q
:cabbrev Wq wq
:cabbrev git Git

" Expression mappings
:cnoremap <expr> <C-j> pumvisible() ? "\<C-n>" : "\<C-j>"
```

### Useful Command-Line Tools

```vim
" Quick substitution
:nnoremap <Leader>s :%s/\<<C-r><C-w>\>//g<Left><Left>

" Range commands
:vnoremap <Leader>s :s/\%V

" Execute line as command
:nnoremap <Leader>x :exe getline('.')<CR>

" Repeat last substitution
:nnoremap & :&&<CR>
:xnoremap & :&&<CR>
```

## Practical Command-Line Workflows

### 1. Project-Wide Operations

```vim
" Find and replace across files
:args **/*.js
:argdo %s/old/new/gc | update

" Delete all console.log statements
:g/console\.log/d

" Add headers to files
:args *.py
:argdo 0put ='#!/usr/bin/env python3' | w

" Format all files
:bufdo exe "normal gg=G" | update
```

### 2. Data Processing

```vim
" Sort and unique
:2,$!sort -u

" Process CSV
:%s/,/\t/g          " Convert to TSV
:g/^$/d             " Remove empty lines
:%!column -t        " Align columns

" JSON formatting
:%!python -m json.tool
:%!jq .

" SQL operations
:g/^INSERT/s/);/),/g  " Fix formatting
:g/^SELECT/.!sqlformat -  " Format query
```

### 3. Code Generation

```vim
" Generate getters/setters
:g/private \(\w\+\) \(\w\+\);/exe "normal opublic \1 get" .
    \ substitute(submatch(2), '^\w', '\u&', '') . "() { return " .
    \ submatch(2) . "; }"

" Create test stubs
:g/function \(\w\+\)(/exe "normal otest('" . submatch(1) .
    \ "', () => {\n  expect(" . submatch(1) . "()).toBe();\n});"

" Generate documentation
:g/^function/exe "normal O/**\n * \n */"
```

### 4. Debugging Helpers

```vim
" Add debug output
:g/^function/exe "normal oconsole.log('Entering " .
    \ matchstr(getline('.'), 'function \zs\w\+') . "');"

" Comment out blocks
:5,20s/^/\/\/ /

" Timing code
:g/^function/exe "normal oconsole.time('" .
    \ matchstr(getline('.'), '\w\+') . "')" |
    \ exe "normal }Oconsole.timeEnd('" .
    \ matchstr(getline(search('function', 'bn')), '\w\+') . "')"
```

## Advanced Command-Line Techniques

### 1. Command History Management

```vim
" History settings
:set history=1000   " Increase history size
:set wildmenu       " Enhanced completion
:set wildmode=longest:full,full

" Search history
:his                " Show all history
:his :              " Command history
:his /              " Search history
:his ?              " Backward search history

" Clear history
:call histdel(':')  " Clear command history
:call histdel('/', -1)  " Clear last search
```

### 2. Command-Line Completion

```vim
" Completion settings
:set wildignorecase " Case insensitive
:set wildignore=*.o,*.obj,*.pyc  " Ignore patterns

" Custom completion
function! MyCompletion(ArgLead, CmdLine, CursorPos)
    return ['option1', 'option2', 'option3']
endfunction
:command -nargs=1 -complete=customlist,MyCompletion MyCmd echo <args>

" Using completion
<Tab>               " Next match
<S-Tab>             " Previous match
<C-d>               " List all matches
<C-a>               " Insert all matches
```

### 3. Command Scripting

```vim
" Batch operations script
let files = glob('**/*.txt', 1, 1)
for file in files
    execute 'e ' . file
    %s/old/new/g
    update
endfor

" Interactive commands
let choice = confirm('Continue?', "&Yes\n&No")
if choice == 1
    echo 'Proceeding...'
endif

" Error handling
try
    execute risky_command
catch /E486/
    echo 'Pattern not found'
endtry
```

## Common Pitfalls and Solutions

### 1. Escaping Issues
**Problem**: Special characters in commands
```vim
" Solution: Use escape() and shellescape()
:exe "!grep " . shellescape(pattern)
:exe "s/" . escape(pattern, '/\') . "/replace/"
```

### 2. Range Confusion
**Problem**: Command affects wrong lines
```vim
" Be explicit with ranges
:.,$s/old/new/      " Current to end
:'<,'>s/old/new/    " Visual selection
:g/pattern/s/old/new/  " Only matching lines
```

### 3. Command Timing
**Problem**: Commands execute in wrong order
```vim
" Use | carefully
:e file | %d | put ='new'  " Clear happens after edit
:silent! g/pattern/d | update  " Update after all deletes
```

### 4. Performance Issues
**Problem**: Slow on large files
```vim
" Optimize commands
:set lazyredraw     " Don't redraw during
:silent command     " Suppress output
:g//d               " Reuse last search
```

## Quick Reference Card

```
Command Structure
═════════════════
:[range]cmd[!] args
:5,10s/old/new/g    Full example
:%s//replace/       Reuse last search
:g/pat/cmd          Global command

Ranges
══════
.       Current line
$       Last line
%       Entire file (1,$)
5,10    Lines 5-10
.,$     Current to end
'a,'b   Mark a to b
/p1/,/p2/  Pattern range

Common Commands
═══════════════
:w :q :wq           File operations
:e file :n :prev    File navigation
:s :g :v            Search/replace
:d :y :put          Delete/yank/put
:! :r! :.!          Shell commands
:normal :exe        Execute commands

Special Keys
════════════
<C-w>   Delete word
<C-u>   Delete to start
<C-f>   Command window
<Tab>   Completion
<C-d>   Show matches
<C-r>   Insert register

Command Definition
══════════════════
:command Name cmd
:command! -nargs=* Name cmd
:command -range=% Name cmd
:cabbrev ab full
:cnoremap key mapping
```

## Practice Goals

### Beginner (15 minutes)
- [ ] Master command-line navigation
- [ ] Use ranges effectively
- [ ] Chain commands with |
- [ ] Create simple custom commands

### Intermediate (25 minutes)
- [ ] Use command-line window fluently
- [ ] Build complex global commands
- [ ] Create commands with arguments
- [ ] Master command-line completion

### Advanced (35 minutes)
- [ ] Build sophisticated command chains
- [ ] Create interactive commands
- [ ] Optimize command performance
- [ ] Build command-line automation

## Mastery Checklist

- [ ] Navigate command-line like normal text
- [ ] Use ranges precisely and efficiently
- [ ] Chain multiple operations seamlessly
- [ ] Create project-specific commands
- [ ] Use command history effectively
- [ ] Build complex automation scripts
- [ ] Handle errors in command chains
- [ ] Never type long commands twice

Remember: Command-line mode is Vim's control center. It's where individual operations become powerful workflows. Master Ex commands, and you'll orchestrate complex file operations with simple, elegant commands!