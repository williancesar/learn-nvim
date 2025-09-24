# Day 14: Week 2 Review - Mastering Intermediate Operations

## Learning Objectives

By the end of this lesson, you will:
- Consolidate all Week 2 skills into fluid workflows
- Combine multiple operations for complex edits
- Build speed and accuracy with intermediate commands
- Identify and strengthen weak areas
- Prepare for advanced Vim techniques in Week 3

## Week 2 Skill Summary

### Commands Mastered This Week

```
Day 08: Undo/Redo & Repeat
├── u, U          - Undo operations
├── Ctrl-r        - Redo
└── .             - Repeat last change

Day 09: Character Search
├── f, F          - Find character
├── t, T          - Till character
└── ;, ,          - Continue/reverse search

Day 10: Visual Modes
├── v             - Character-wise
├── V             - Line-wise
├── Ctrl-v        - Block-wise
└── gv            - Reselect

Day 11: Change Operations
├── c{motion}     - Change with motion
├── cc, C         - Line changes
└── s, S          - Substitutions

Day 12: Number Operations
├── Ctrl-a/x      - Increment/decrement
├── [count]motion - Multiplied movements
└── gCtrl-a       - Sequential numbers

Day 13: File Operations
├── :w, :q, :wq   - Save and quit
├── :e            - Edit files
└── :w!, :q!      - Force operations
```

## Integrated Practice Exercises

### Exercise 1: The Refactoring Challenge
```javascript
// Starting code (poorly formatted, needs refactoring)
var x = 1;
var x = 1;
var x = 1;
var x = 1;
function calc(a,b,c) {
return a+b+c;
}

Tasks (use Week 2 skills):
1. Fix variable names:
   - Visual block select "x", change to meaningful names
   - Use gCtrl-a to number them if needed
2. Fix indentation:
   - Use V to select function lines
   - Use = to auto-indent
3. Format parameters:
   - Use f( to find parentheses
   - Use ci( to reformat parameters with spaces
4. Save your work:
   - Use :w refactored.js
```

### Exercise 2: Data Transformation Sprint
```
Starting data:
item_1:100
item_1:100
item_1:100
item_1:100
item_1:100

Required output:
product_1: $150
product_2: $150
product_3: $150
product_4: $150
product_5: $150

Tasks:
1. Use Ctrl-v to select "item_1" column
2. Change to "product_" with c
3. Select numbers after "_", use gCtrl-a
4. Use f: to navigate to colons
5. Use a<Space> to add space after colon
6. Visual block select "100", change to "$150"
7. Save with :w transformed.txt
```

### Exercise 3: Rapid Navigation and Editing
```html
<div class="old-container" id="container-1">
    <span class="old-text">Content 1</span>
    <span class="old-text">Content 2</span>
    <span class="old-text">Content 3</span>
</div>

Tasks (time yourself):
1. Change all "old-" to "new-" using:
   - /old- to find first
   - cw to change to "new-"
   - n and . to repeat
2. Update Content numbers:
   - Use f1, f2, f3 to navigate
   - Use s to substitute each number
3. Visual block to add data- prefix:
   - Ctrl-v to select all class attributes
   - Navigate to = sign with f=
   - Insert data- before class
```

### Exercise 4: Complex Undo Scenarios
```python
def process_data(input):
    # Make multiple changes, then practice undo
    result = input * 2
    result = result + 10
    return result

Tasks:
1. Change function name to analyze_data (ciw)
2. Change parameter to data (ci()
3. Change 2 to 5 (f2r5)
4. Change 10 to 100 (f1c2w100)
5. Press u four times (watch each undo)
6. Press Ctrl-r twice (redo two changes)
7. Use . to repeat last change
8. Save with :w
```

### Exercise 5: Visual Mode Mastery
```
Select and transform this text:
apple,banana,cherry,date,elderberry
orange,grape,kiwi,mango,papaya
peach,pear,plum,apricot,nectarine

Tasks:
1. Visual line select middle line (V)
2. Delete it (d)
3. Visual block select first word of each line (Ctrl-v, then expand)
4. Uppercase selection (gU)
5. Select everything (ggVG)
6. Indent everything (>)
7. Reselect last (gv) and indent again
```

### Exercise 6: File Operations Workflow
```
Complete workflow exercise:

1. Create new file: vim practice.txt
2. Insert text: "Version 1.0.0"
3. Save: :w
4. Increment version: /0<Enter>Ctrl-a
5. Save as new version: :sav practice_v2.txt
6. Make more changes
7. View changes: :w !diff practice.txt -
8. Save and quit: :x
9. Open both files: vim practice*.txt
10. Navigate between: :n and :prev
```

## Time Challenges

### Challenge 1: Speed Refactoring (Target: 60 seconds)
```javascript
// Fix this code
var a=1;var b=2;var c=3;
function x(){return a+b+c;}

// Transform to:
const num1 = 1;
const num2 = 2;
const num3 = 3;

function calculate() {
    return num1 + num2 + num3;
}
```

### Challenge 2: Bulk Rename (Target: 45 seconds)
```
Rename all occurrences:
oldFunction() to newFunction()
oldVariable to newVariable
OLD_CONSTANT to NEW_CONSTANT

In this code:
const OLD_CONSTANT = 42;
let oldVariable = oldFunction();
if (oldVariable > OLD_CONSTANT) {
    oldVariable = oldFunction() * 2;
}
```

### Challenge 3: Number Sequence (Target: 30 seconds)
```css
/* Add sequential z-index values */
.layer { z-index: 1; }
.layer { z-index: 1; }
.layer { z-index: 1; }
.layer { z-index: 1; }
.layer { z-index: 1; }

/* Result should be 10, 20, 30, 40, 50 */
```

## Combined Skills Assessment

Rate your proficiency (1-5) for each skill:

### Undo/Redo & Repeat
- [ ] Can undo/redo without thinking
- [ ] Use . repeat effectively
- [ ] Understand undo branches
- [ ] Navigate undo history
- Rating: ___/5

### Character Search
- [ ] Instant f/F/t/T navigation
- [ ] Fluid use of ; and ,
- [ ] Combine with operators
- [ ] Choose right search type
- Rating: ___/5

### Visual Modes
- [ ] Choose correct mode instantly
- [ ] Visual block for columns
- [ ] Text object selection
- [ ] Combine with operations
- Rating: ___/5

### Change Operations
- [ ] Prefer c over d+i
- [ ] Use text objects with c
- [ ] Appropriate s/S usage
- [ ] Combine with counts
- Rating: ___/5

### Number Operations
- [ ] Quick Ctrl-a/x usage
- [ ] Sequential numbers with gCtrl-a
- [ ] Count with motions
- [ ] Count with operators
- Rating: ___/5

### File Operations
- [ ] Save without thinking
- [ ] Navigate multiple files
- [ ] Handle edge cases
- [ ] Use force operations safely
- Rating: ___/5

## Week 2 Muscle Memory Drills

### Drill 1: Repeat Patterns (2 minutes)
```
Type ciw, change word, press n, press .
Repeat 20 times on different words
Goal: Automatic n. pattern
```

### Drill 2: Character Jump (2 minutes)
```
Use f and ; to navigate this line rapidly:
(function(a,b,c) { return [a,b,c].map(x => x*2); })
Jump to each punctuation mark in order
```

### Drill 3: Visual Block (2 minutes)
```
Create a 5x5 grid of X's using:
- Type X
- Ctrl-v, 4l, 4j to select 5x5
- r to replace all with different characters
```

### Drill 4: Number Increments (2 minutes)
```
Start with: 0 0 0 0 0 (on separate lines)
Create: 5 10 15 20 25
Using visual block and number operations
```

## Common Patterns to Master

### Pattern 1: Search-Change-Repeat
```vim
/pattern<Enter>  " Find
ciw              " Change
n                " Next occurrence
.                " Repeat change
n.               " Continue pattern
```

### Pattern 2: Visual-Block-Edit
```vim
Ctrl-v           " Block select
3j               " Extend down
I                " Insert at start
text             " Type text
<Esc>            " Apply to all
```

### Pattern 3: Quick-Save-Continue
```vim
:w               " Quick save
Ctrl-o           " Jump back
Continue editing " No context switch
```

### Pattern 4: Increment-Patterns
```vim
qa               " Record macro (preview)
Ctrl-a           " Increment
j                " Next line
q                " Stop recording
10@a             " Replay 10 times
```

## Quick Reference - Week 2 Power Combos

```
POWER COMBINATIONS
┌─────────────────────────────┐
│ /word → n → ciw → n → .     │
│ V → 5j → > → gv → >         │
│ Ctrl-v → $ → I → text → Esc │
│ f( → ci( → new → Esc → .    │
│ 3dd → :w → :e other.txt     │
└─────────────────────────────┘

EFFICIENCY PATTERNS
┌─────────────────────────────┐
│ Use . instead of repeating  │
│ Use counts: 3dd not dd dd dd│
│ Use text objects: ciw not dw i│
│ Use C not c$ for line ends  │
│ Use :x not :wq when possible│
└─────────────────────────────┘

VISUAL MODE SECRETS
┌─────────────────────────────┐
│ o   - Switch selection end  │
│ gv  - Reselect last         │
│ I/A - Block mode insert     │
│ r   - Replace in block      │
│ ~   - Toggle case           │
└─────────────────────────────┘
```

## Week 3 Preview

Next week, you'll learn:
- **Day 15-16**: Macros and registers for automation
- **Day 17-18**: Advanced search/replace with regex
- **Day 19-20**: Buffers, windows, and tabs
- **Day 21**: Week 3 review and integration

## Final Week 2 Challenge

Complete this refactoring without using the mouse or arrow keys:

```javascript
// Original messy code
var x=10;var y=20;var z=30;
function calc(){return x+y+z;}
var result=calc();console.log(result);

// Target clean code
const value1 = 10;
const value2 = 20;
const value3 = 30;

function calculate() {
    return value1 + value2 + value3;
}

const result = calculate();
console.log(result);

Time limit: 2 minutes
Allowed: All Week 1 & 2 commands
Not allowed: Mouse, arrow keys, manual retyping
```

## Mastery Metrics

You've mastered Week 2 if you can:
- [ ] Complete final challenge under 2 minutes
- [ ] Score 4+ on all skill assessments
- [ ] Execute power combinations without thinking
- [ ] Navigate and edit without arrow keys
- [ ] Feel faster than before starting Week 2

---

*Congratulations on completing Week 2! You've moved from basic navigation to intermediate editing operations. Your fingers are learning to speak Vim fluently. Week 3 will add power tools that multiply your efficiency even further.*