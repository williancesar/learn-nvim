# Day 49: Advanced Marks - Global Navigation and Special Marks

## Learning Objectives

By the end of this lesson, you will:
- Master global marks for cross-file navigation
- Understand and use special automatic marks
- Build sophisticated bookmark systems
- Create navigation workflows with mark stacks
- Leverage marks for complex editing operations

## The Complete Mark System

```
┌──────────────────────────────────────────────────────────┐
│                    VIM MARK SYSTEM                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  LOCAL MARKS (a-z): File-specific                       │
│  ├── ma: Line 10, Col 5 in current file                │
│  ├── mb: Line 25, Col 12 in current file               │
│  └── mz: Line 100, Col 1 in current file               │
│                                                          │
│  GLOBAL MARKS (A-Z): Cross-file navigation              │
│  ├── mA: ~/project/src/main.js, Line 45                 │
│  ├── mB: ~/project/test/test.js, Line 78                │
│  └── mZ: ~/project/README.md, Line 1                    │
│                                                          │
│  SPECIAL MARKS: Automatic positioning                    │
│  ├── '': Position before last jump                      │
│  ├── '.: Last change position                           │
│  ├── '^: Last insert position                           │
│  ├── '[: Start of last change/yank                      │
│  ├── ']: End of last change/yank                        │
│  ├── '<: Start of last visual selection                 │
│  ├── '>: End of last visual selection                   │
│  └── '": Last position when file was closed             │
│                                                          │
│  NUMBERED MARKS (0-9): Previous file positions          │
│  ├── '0: Position when vim exited                       │
│  └── '1-'9: Previous file edit positions                │
└──────────────────────────────────────────────────────────┘
```

## Global Marks (A-Z)

### Setting and Using Global Marks

```vim
" Setting global marks
mA                  " Set global mark A at current position
mB                  " Set global mark B
mZ                  " Set global mark Z

" Jumping to global marks
'A                  " Jump to line of mark A (in its file)
`A                  " Jump to exact position of mark A
''                  " Return to position before jump

" Listing global marks
:marks A-Z          " Show all global marks
:marks              " Show all marks
:delmarks A-Z       " Delete all global marks
```

### Global Mark Workflows

```vim
" Project landmark system
mA                  " Mark A: Project entry point (main.js)
mT                  " Mark T: Test file
mC                  " Mark C: Configuration
mD                  " Mark D: Documentation
mS                  " Mark S: Styles/CSS
mR                  " Mark R: Routes/Router

" Quick navigation
'A                  " Jump to main entry
'T                  " Jump to tests
'R                  " Jump to routes
```

## Special Automatic Marks

### Jump and Change Marks

```vim
'' (two single quotes)  " Previous jump position
`. (backtick period)    " Last change position
'^ (quote caret)        " Last insert position

" Examples:
/pattern            " Search for pattern
n                   " Next match
n                   " Next match
''                  " Back to where search started

ciw                 " Change word
<Esc>               " Exit insert
`.                  " Back to change position
```

### Operation Boundary Marks

```vim
'[ and ']           " Start and end of last change/yank
'< and '>           " Start and end of last visual selection

" Examples:
yap                 " Yank paragraph
'[                  " Jump to start of yanked text
']                  " Jump to end of yanked text

viw                 " Select word
<Esc>               " Exit visual
gv                  " Reselect (uses '< and '>)
'<                  " Start of last selection
'>                  " End of last selection
```

### File Position History

```vim
'" (quote double)   " Last position in current file
'0                  " Position when Vim last exited
'1 through '9       " Positions in previously edited files

" Workflow:
:q                  " Quit vim
vim                 " Restart vim
'0                  " Jump to where you were
'1                  " Previous file position
'2                  " File before that
```

## Advanced Mark Techniques

### Mark Stack Navigation

```vim
" Building a navigation stack
mA                  " Mark position A
/pattern1           " Search
mB                  " Mark position B
/pattern2           " Search
mC                  " Mark position C

" Navigate the stack
'A                  " To mark A
'B                  " To mark B
'C                  " To mark C
''                  " Toggle between last two
```

### Cross-File Refactoring

```vim
" Mark refactoring positions
:e src/old.js
/oldFunction
mO                  " Mark Old function

:e src/new.js
/newFunction
mN                  " Mark New function

" Quick comparison
'O                  " Check old implementation
'N                  " Check new implementation
'O                  " Back to old
d}                  " Delete old function
'N                  " To new location
```

### Project Navigation System

```vim
" Establish project landmarks
:e src/index.js
gg
mI                  " Mark I: Index/entry

:e src/api/endpoints.js
/userRoute
mU                  " Mark U: User routes

:e database/schema.sql
mD                  " Mark D: Database

:e tests/main.test.js
mT                  " Mark T: Tests

" Navigation commands
'I                  " Entry point
'U                  " User routes
'D                  " Database
'T                  " Tests
```

## Mark Combinations and Patterns

### Visual Selection with Marks

```vim
" Select from mark to mark
ma                  " Set mark a
20j                 " Move down
mb                  " Set mark b
'a                  " Go to mark a
v'b                 " Visual select to mark b

" Delete between marks
:'a,'bd             " Delete lines from mark a to b

" Yank between marks
:'a,'by             " Yank lines from mark a to b
```

### Command Ranges with Marks

```vim
" Operations on marked ranges
:'a,'bs/old/new/g   " Substitute in range
:'a,'b>             " Indent range
:'<,'>normal @a     " Apply macro in visual range

" Complex ranges
:.,'as/foo/bar/g    " From current line to mark a
:'a,$d              " Delete from mark a to end of file
:1,'bp              " Print from start to mark b
```

### Mark-Based Macros

```vim
" Record macro using marks
ma                  " Mark start position
qa                  " Start recording
/pattern            " Find pattern
cw                  " Change word
newtext             " New text
<Esc>
'a                  " Return to start mark
q                   " Stop recording

" Use: @a will always return to marked position
```

## Practical Mark Workflows

### 1. Code Review Workflow

```vim
" Mark review points
mR                  " Mark R: Review starting point
/REVIEW
mA                  " Mark A: First review comment
n
mB                  " Mark B: Second review comment
n
mC                  " Mark C: Third review comment

" Navigate review
'A                  " Address first comment
" Make changes
'B                  " Address second comment
" Make changes
'C                  " Address third comment
'R                  " Return to start
```

### 2. Debugging Navigation

```vim
" Mark debugging positions
mE                  " Mark E: Error location
mL                  " Mark L: Log statement
mB                  " Mark B: Breakpoint
mF                  " Mark F: Function start

" Debug cycle
'E                  " Check error
'L                  " Check logs
'F                  " Function beginning
'B                  " Breakpoint location
```

### 3. Documentation Updates

```vim
" Mark documentation sections
:e README.md
/## Installation
mI                  " Mark I: Installation

/## Usage
mU                  " Mark U: Usage

/## API
mA                  " Mark A: API

" Update cycle
'I                  " Update installation
'U                  " Update usage
'A                  " Update API
```

### 4. Multi-File Comparison

```vim
" Compare implementations
:e version1.js
/criticalFunction
mV                  " Mark V: Version 1

:e version2.js
/criticalFunction
mW                  " Mark W: Version 2

:e version3.js
/criticalFunction
mX                  " Mark X: Version 3

" Quick comparison
'V                  " Check version 1
'W                  " Check version 2
'X                  " Check version 3
```

## Advanced Mark Features

### Persistent Marks with Viminfo

```vim
" Enable mark persistence
:set viminfo='100,f1  " Save marks for 100 files

" Marks survive vim restart
mA                  " Set global mark
:q                  " Quit vim
vim                 " Restart
'A                  " Mark still available!
```

### Mark Visualization

```vim
" Show marks in sign column
:sign define mark text=>> texthl=Search
:exe 'sign place 1 name=mark line='.line("'a").' buffer='.bufnr('%')

" Plugin-free mark indicators
:set listchars+=tab:>-
:match Search /\%'a/  " Highlight line with mark a
```

### Custom Mark Commands

```vim
" Jump to next/previous mark
function! NextMark()
    let [bufnum, lnum, col, off] = getpos("'a")
    let marks = ['a','b','c','d','e','f']
    for m in marks
        if line("'" . m) > line('.')
            exe "normal! '" . m
            return
        endif
    endfor
endfunction

nnoremap ]m :call NextMark()<CR>

" Delete all marks in current buffer
:delmarks a-z

" Delete specific marks
:delmarks aB  " Delete marks a and B
```

## Practical Exercises

### Exercise 1: Global Mark Navigation

```bash
# Create project structure
mkdir -p project/{src,test,docs}
echo "function main() {}" > project/src/main.js
echo "test('main', () => {})" > project/test/main.test.js
echo "# Project Documentation" > project/docs/README.md
```

Practice:
1. `vim project/src/main.js`
2. `mM` - Mark M for main
3. `:e project/test/main.test.js`
4. `mT` - Mark T for test
5. `:e project/docs/README.md`
6. `mD` - Mark D for docs
7. `'M` - Jump to main
8. `'T` - Jump to test
9. `'D` - Jump to docs

### Exercise 2: Special Marks

```vim
" Practice automatic marks
:e test.txt
iFirst line<Esc>
o<Esc>
iSecond line<Esc>
gg
/Second
cwChanged<Esc>

" Now test:
''  " Previous jump position
`.  " Last change
'^  " Last insert
'[  " Start of last change
']  " End of last change
```

### Exercise 3: Mark Ranges

```vim
" Create test file
:e range-test.txt
i1. First item
2. Second item
3. Third item
4. Fourth item
5. Fifth item<Esc>

" Mark operations
gg ma  " Mark start
3G mb  " Mark middle
G mc   " Mark end

:'a,'b>  " Indent from a to b
:'b,'cs/item/ITEM/g  " Replace in range
:'a,'cd  " Delete range
```

### Exercise 4: Cross-File Workflow

```vim
" Setup workspace
:e ~/file1.txt
iFile 1 important line<Esc>
mA  " Global mark A

:e ~/file2.txt
iFile 2 important line<Esc>
mB  " Global mark B

:e ~/file3.txt
iFile 3 important line<Esc>
mC  " Global mark C

" Navigate workspace
'A  " To file 1
'B  " To file 2
'C  " To file 3
:marks A-C  " View all global marks
```

## Common Pitfalls and Solutions

### 1. Overwriting Important Marks
**Problem**: Accidentally overwriting frequently used marks
```vim
" Solution: Use a mark naming convention
" A-E: Entry points
" F-J: Functions
" K-O: Key sections
" P-T: Temporary
" U-Z: User-defined
```

### 2. Lost After Jump
**Problem**: Can't return after jumping to mark
```vim
" Solution: Use '' to return
'A  " Jump to mark A
''  " Return to previous position

" Or use Ctrl-O
'A       " Jump to mark A
Ctrl-O   " Jump back in jumplist
```

### 3. Marks in Wrong File
**Problem**: Local mark doesn't work across files
```vim
" Solution: Use global marks (uppercase)
mA  " not ma for cross-file
'A  " Works from any file
```

### 4. Forgotten Mark Positions
**Problem**: Can't remember what marks are set
```vim
" Solution:
:marks      " Show all marks
:marks aA   " Show specific marks
:marks A-Z  " Show all global marks
```

## Mental Models

### The Bookmark Model
```
Marks = Bookmarks in a Book
- Lowercase = Page markers (local)
- Uppercase = Chapter markers (global)
- Special = Automatic bookmarks
```

### The GPS Waypoint Model
```
Marks = GPS Waypoints
- Set waypoints at important locations
- Navigate directly between waypoints
- Special marks = "Last position", "Home"
```

### The Anchor Model
```
Marks = Anchors in Document
- Drop anchors at key positions
- Jump between anchored positions
- Range operations between anchors
```

## Integration with Previous Lessons

### With Buffers (Day 43)
```vim
" Marks work across buffers
:e file1.txt
mA  " Global mark
:e file2.txt
'A  " Jumps back to file1.txt
```

### With Quickfix (Day 47)
```vim
" Mark before quickfix navigation
mQ  " Mark current position
:cn  " Next quickfix entry
:cn  " Next quickfix entry
'Q  " Return to marked position
```

### With Macros (Day 33)
```vim
" Marks in macros
qa
ma  " Mark position
/pattern
cw replacement<Esc>
'a  " Return to mark
q
" Macro always returns to start
```

## Quick Reference Card

```
Setting Marks
═════════════
ma-mz           Set local mark (current file)
mA-mZ           Set global mark (across files)
m{             Set { mark
m}             Set } mark

Jumping to Marks
════════════════
'a             Jump to line of mark a
`a             Jump to position of mark a
''             Previous jump position
`.             Last change
'^             Last insert
'[, ']         Start/end of last change
'<, '>         Start/end of visual selection
'"             Last position in file
'0-'9          Previous file positions

Mark Commands
═════════════
:marks         List all marks
:marks aB      List specific marks
:delmarks a    Delete mark a
:delmarks!     Delete all marks
:delmarks a-z  Delete all lowercase marks

Ranges with Marks
════════════════
:'a,'b         From mark a to mark b
:'a,'bs/x/y/   Substitute in range
:'a,'bd        Delete range
:.,'a          From current to mark a
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Set and jump to global marks
- [ ] Use '' to return after jumps
- [ ] Navigate with special marks (`. and '^)
- [ ] List marks with :marks

### Intermediate (10 minutes)
- [ ] Build project navigation with global marks
- [ ] Use mark ranges for operations
- [ ] Master special automatic marks
- [ ] Create cross-file workflows

### Advanced (15 minutes)
- [ ] Implement complex navigation systems
- [ ] Combine marks with macros
- [ ] Use numbered marks for history
- [ ] Build custom mark functions

## Mastery Checklist

- [ ] Use global marks for project navigation
- [ ] Leverage special marks automatically
- [ ] Perform operations on mark ranges
- [ ] Navigate mark history efficiently
- [ ] Combine marks with other features
- [ ] Never lose position when jumping
- [ ] Can explain all special marks
- [ ] Build sophisticated bookmark systems

Remember: Marks are your navigation anchors. Global marks create a project-wide GPS system, while special marks automatically track your editing history. Master them for lightning-fast navigation!