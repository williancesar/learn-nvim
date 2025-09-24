# Day 41: The Dot Formula - Optimal Repeatable Changes

## Learning Objectives

By the end of this lesson, you will:
- Master the dot command (`.`) for repeating changes
- Understand what makes a change repeatable
- Learn to structure edits for maximum dot efficiency
- Build the "one keystroke, multiple applications" mindset
- Create dot-optimized workflows and mappings

## The Dot Command Philosophy

### Mental Model: The Repetition Engine

The dot command is Vim's **repetition engine**—it replays your last change. Think of it as:
- **Change Recorder**: Captures your last modification
- **One-Key Macro**: Instant replay with a single keystroke
- **Efficiency Multiplier**: One action, unlimited applications
- **Intention Crystallizer**: Forces you to think in repeatable units

```
┌─────────────────────────────────────────┐
│         THE DOT FORMULA                 │
├─────────────────────────────────────────┤
│                                          │
│  One Keystroke + One Command = Magic    │
│                                          │
│  SETUP:    Make a change                │
│     ↓                                    │
│  NAVIGATE: Move to next target          │
│     ↓                                    │
│  REPEAT:   Press . (dot)                │
│     ↓                                    │
│  RESULT:   Change replicated            │
│                                          │
│  Formula:  [change] → n → . → n → .     │
│           (n = navigation)              │
└─────────────────────────────────────────┘
```

## What the Dot Command Repeats

### 1. Repeatable Changes

```vim
" Text modifications (from Normal mode to Normal mode)
cw          " Change word (repeatable)
daw         " Delete around word (repeatable)
x           " Delete character (repeatable)
r           " Replace character (repeatable)
~           " Toggle case (repeatable)
I           " Insert at line start (repeatable)
A           " Append at line end (repeatable)
o           " Open line below (repeatable)

" Complete operations
ciw"hello"<Esc>    " Change word to "hello" (entire sequence repeats)
f,dt;              " Find comma, delete to semicolon (both repeat)
```

### 2. Non-Repeatable Actions

```vim
" Movements (don't change text)
h j k l     " Cursor movement
w b e       " Word movement
f F t T     " Character search alone

" Visual mode operations
v           " Entering visual mode
V           " Visual line mode
<C-v>       " Visual block

" Yank operations
y           " Yank doesn't repeat with dot
yy          " (use registers instead)

" Undo/Redo
u           " Undo
<C-r>       " Redo
```

### 3. The Last Change Concept

```vim
" The 'last change' is everything between:
" - Entering Insert mode → Returning to Normal mode
" - Single Normal mode command that modifies text

" Example 1: Insert mode change
ihello<Esc>     " Types "hello" - entire sequence is one change
j.              " Move down and repeat "hello"

" Example 2: Multiple inserts are ONE change
ihello<CR>world<Esc>    " Both lines are one change
j.                      " Repeats both lines

" Example 3: Normal mode change
daw             " Delete around word
w.              " Move to next word, delete it too
```

## The Dot Formula Pattern

### Core Pattern: Setup → Move → Repeat

```vim
" The optimal pattern:
" 1. Make a surgical, complete change
" 2. Navigate to next occurrence
" 3. Press dot

" Example: Add semicolons to line ends
A;<Esc>     " Setup: Append semicolon
j           " Move: Next line
.           " Repeat: Add semicolon
j.          " Move and repeat
j.          " Again...

" Bad approach (not repeatable):
$a;<Esc>    " End of line, then append
j$a;<Esc>   " Can't use dot, must repeat all
```

### Advanced Pattern: Search and Repeat

```vim
" Combine with search for powerful workflows
/pattern<CR>    " Find first occurrence
ciwreplacement<Esc>  " Change it
n               " Next occurrence
.               " Repeat change
n.              " Next and repeat
n.              " Continue...

" Even more powerful with 'n.' fingerroll
" Position fingers: n on index, . on middle
" Roll: n. n. n. n. (very fast)
```

### Power Pattern: Text Objects + Dot

```vim
" Text objects create perfect repeatable changes
ci"new text<Esc>    " Change inside quotes
f".                 " Find next quote, repeat
f".                 " Again...

" Works with any text object:
cit<p>New</p><Esc>  " Change inside tags
/<<CR>.             " Find next tag, repeat

ci{<CR>new code<CR>}<Esc>  " Change inside braces
%.                  " Jump to matching, repeat
```

## Dot-Optimized Editing Strategies

### Strategy 1: Prefer Operators Over Visual Mode

```vim
" Visual mode breaks the dot formula
viw     " Select word
d       " Delete
w       " Move to next
.       " DOESN'T WORK! (. doesn't repeat visual selection)

" Instead, use operators:
daw     " Delete around word (single operation)
w       " Move to next
.       " Works perfectly!
```

### Strategy 2: Complete Changes in One Go

```vim
" Inefficient (multiple changes):
cwHello<Esc>    " Change 1
a world<Esc>    " Change 2 (dot only repeats this)

" Efficient (single change):
ciwHello world<Esc>    " Complete change
w.                      " Move and repeat entire phrase
```

### Strategy 3: Use Counts Wisely

```vim
" Sometimes count, sometimes dot
d3w         " Delete 3 words (when you know exactly)
dw          " Delete 1 word
..          " Repeat twice more (when unsure)

" Dot allows inspection between changes:
dw          " Delete word
" (check if correct)
.           " Delete another
" (check again)
.           " Delete one more
```

## Advanced Dot Techniques

### 1. The Dot Formula with Macros

```vim
" Dot repeats the last change, not macro execution
qa          " Record macro
cw<C-r>=expand('<cword>')<CR><Esc>  " Complex change
q           " End recording

@a          " Execute macro
.           " Doesn't repeat macro!

" Solution: Make the macro call repeatable
:nnoremap Q @a
Q           " Execute macro
.           " Now this works (repeats Q mapping)
```

### 2. Custom Operators for Dot

```vim
" Create custom repeatable operations
function! CommentLine()
    normal! I//
endfunction

nnoremap gc :call CommentLine()<CR>

gc          " Comment line
j.          " Move down and repeat!
```

### 3. Dot with Ex Commands

```vim
" Ex commands and dot
:s/old/new/     " Substitute on current line
j               " Move to next line
&               " Repeat substitution (not .)
" or
:.              " Repeat last Ex command

" Make Ex commands dot-repeatable:
nnoremap <leader>s :s/\<<C-r><C-w>\>/
" Now . repeats the mapping
```

## Practical Dot Workflows

### Workflow 1: Variable Renaming

```vim
" Rename variable throughout function
/oldName<CR>        " Find first occurrence
ciwNewName<Esc>     " Change to new name
n.                  " Find next, repeat
n.                  " Continue...
n.                  " Until done

" Or with word boundaries:
/\<oldName\><CR>    " More precise search
ciwNewName<Esc>     " Change
n.n.n.              " Rapid repetition
```

### Workflow 2: Format Fixing

```vim
" Add missing semicolons
/\w$<CR>        " Find line ending with word
A;<Esc>         " Append semicolon
n.              " Next and repeat
n.              " Continue...

" Fix spacing around operators
/\w=\w<CR>      " Find missing spaces around =
i <Esc>la <Esc> " Add spaces
n.              " Next and repeat
```

### Workflow 3: Structural Changes

```vim
" Convert functions to arrow functions
/^function<CR>      " Find function
^ceconst<Esc>       " Change to const
f(i = <Esc>f)a =><Esc>  " Add arrow
n                   " Next function
.                   " Repeat entire change!
```

## Dot Anti-Patterns to Avoid

### Anti-Pattern 1: Breaking Changes

```vim
" BAD: Multiple separate changes
cwthing<Esc>        " Change 1
a_new<Esc>          " Change 2 (dot only gets this)

" GOOD: Single change
ciwthing_new<Esc>   " Complete change (dot gets all)
```

### Anti-Pattern 2: Visual Mode Habits

```vim
" BAD: Visual mode for simple changes
ve                  " Visual to end of word
c                   " Change
new<Esc>           " New text
w                   " Next word
.                   " Doesn't work!

" GOOD: Operator approach
cwnew<Esc>          " Change word
w.                  " Works perfectly
```

### Anti-Pattern 3: Incomplete Patterns

```vim
" BAD: Position-dependent changes
$a;<Esc>            " Append at line end
j$a;<Esc>           " Must repeat positioning

" GOOD: Position-independent
A;<Esc>             " Append to line (position irrelevant)
j.                  " Just move and dot
```

## Practice Exercises

### Exercise 1: Basic Dot Mastery

```javascript
// Add 'const' to all variable declarations
x = 5
y = 10
z = 15
result = x + y + z

// Target:
const x = 5
const y = 10
const z = 15
const result = x + y + z

// Challenge: Do it with one change and dots
```

### Exercise 2: Complex Repetition

```html
<!-- Wrap each item in <li> tags -->
Apple
Banana
Orange
Grape

<!-- Target: -->
<li>Apple</li>
<li>Banana</li>
<li>Orange</li>
<li>Grape</li>

<!-- Use dot formula efficiently -->
```

### Exercise 3: Refactoring Challenge

```javascript
// Convert all console.log to debug function
console.log("Starting process");
console.log("Processing item");
console.log("Completed");

// Target:
debug("Starting process");
debug("Processing item");
debug("Completed");

// Accomplish with search and dot
```

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting Escape
**Problem**: Still in Insert mode when pressing dot
**Solution**: Always return to Normal mode
```vim
cwhello     " Still in Insert mode!
.           " Types a literal dot

cwhello<Esc>  " Proper completion
.             " Repeats the change
```

### Pitfall 2: Partial Changes
**Problem**: Change isn't complete in one operation
**Solution**: Think complete thoughts
```vim
" Instead of: cw<Esc>aMore<Esc>
" Do: ciwComplete Text<Esc>
```

### Pitfall 3: Wrong Repetition Scope
**Problem**: Dot repeats too much or too little
**Solution**: Understand change boundaries
```vim
o           " Open line
Line 1<CR>  " Type content
Line 2<Esc> " More content
.           " Repeats BOTH lines
```

## Practice Goals

### Beginner (15 mins)
- [ ] Master basic dot repetition
- [ ] Understand what's repeatable
- [ ] Practice with simple changes
- [ ] Learn the n. pattern

### Intermediate (25 mins)
- [ ] Build dot-optimized habits
- [ ] Combine with search effectively
- [ ] Use text objects for repeatability
- [ ] Avoid visual mode traps

### Advanced (35 mins)
- [ ] Create custom repeatable operations
- [ ] Master complex dot patterns
- [ ] Build dot-aware mappings
- [ ] Optimize workflows for dot

## Quick Reference Card

```
DOT BASICS
.           Repeat last change
n.          Find next and repeat
;.          Repeat f/t and change

REPEATABLE CHANGES
c{motion}   Change with motion
d{motion}   Delete with motion
y{motion}   Yank (but . doesn't paste)
I/A         Insert at start/end
o/O         Open line below/above
r/R         Replace mode
x/X         Delete char forward/back
~/g~        Case changes

BEST PRACTICES
ciw > viwd  Operator over visual
A > $a      Position-independent
daw > dw    Include boundaries
cw<Esc> > cw  Always escape

THE FORMULA
1. Craft perfect change
2. Navigate to target
3. Press dot
4. Repeat 2-3

POWER COMBOS
*ciwNew<Esc>n.  Replace word everywhere
/pat<CR>cgnNew<Esc>n.  Replace with confirm
f(ci(New<Esc>f(.  Change function params
```

## Connection to Other Lessons

**Previous**: Day 40's advanced yanking provides content for dot-repeatable changes.

**Next**: Day 42 will review editing patterns, with dot formula as a cornerstone.

**Related Concepts**:
- Text objects (Day 17-19) create perfect dot-repeatable changes
- Search (Day 22) combines with dot for powerful workflows
- Macros (Day 31) for complex repetition beyond dot

## Summary

The dot formula transforms Vim editing from sequential commands into a rhythm of setup and repetition. Master the dot to:
- Reduce complex repetitive tasks to single keystrokes
- Think in terms of repeatable, atomic changes
- Build muscle memory for efficient editing patterns
- Achieve "editing at the speed of thought"

Remember: The dot command isn't just about repetition—it's about **intentional, atomic changes** that can be applied anywhere with a single keystroke. Master the dot formula, and you master the essence of efficient Vim editing.