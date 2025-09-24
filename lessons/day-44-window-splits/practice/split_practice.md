# Window Split Practice Guide

## Setup Files

This directory contains files designed for practicing window split operations. Each file has specific content for different split scenarios.

## Basic Split Practice

### Exercise 1: Two-Way Split
1. Open `left_pane.txt`
2. `:vsp right_pane.txt` - Create vertical split
3. Practice `Ctrl-w h` and `Ctrl-w l` navigation
4. Resize with `30Ctrl-w <` and `30Ctrl-w >`

### Exercise 2: Four-Way Split
1. Start with `vim top_left.txt`
2. `:vsp top_right.txt` - Split vertically
3. `:sp bottom_left.txt` - Split horizontally
4. `Ctrl-w l` then `:sp bottom_right.txt`
5. Navigate with `Ctrl-w hjkl`
6. Make equal with `Ctrl-w =`

### Exercise 3: IDE Layout
```
┌──────┬─────────────┬──────┐
│ File │    Code     │ Help │
│ Tree │             │      │
├──────┤             ├──────┤
│ Find │             │ Term │
└──────┴─────────────┴──────┘
```

1. `vim code_main.py`
2. `:20vsp file_tree.txt` - Left sidebar
3. `Ctrl-w l :80vsp help_docs.md` - Right sidebar
4. `Ctrl-w h :sp search_results.txt` - Bottom left
5. `Ctrl-w l Ctrl-w l :sp terminal_output.txt` - Bottom right

## Advanced Split Workflows

### TDD Layout
1. Open test file and implementation side-by-side
2. Add terminal at bottom for test runner
3. Navigate efficiently while coding

### Code Review Layout
1. Original code on left
2. Modified code on right
3. Diff output at bottom
4. Comments/notes in fourth pane

### Documentation Layout
1. Code file in main pane
2. Documentation to the right
3. Examples at bottom
4. Quick reference on left

## Window Management Drills

### Rapid Navigation (30 seconds each)
- Create 6 windows
- Visit each using only `Ctrl-w hjkl`
- Visit each using `Ctrl-w w`
- Close every other window
- Recreate closed windows

### Resize Challenge
- Create 4 equal windows
- Make top-left take 60% width and height
- Make bottom-right smallest possible
- Return to equal sizing
- Make vertical windows narrow, horizontal tall

### Rotation Practice
- Create 4 windows in specific order
- Use `Ctrl-w r` to rotate
- Use `Ctrl-w x` to swap
- Use `Ctrl-w HJKL` to move windows
- Achieve target layout from any start

## Practical Scenarios

### Scenario 1: Bug Investigation
- Main code in center (large)
- Stack trace on right
- Log file at bottom
- Test file on left
- Navigate while debugging

### Scenario 2: Feature Development
- Implementation file (main)
- Test file (right)
- Documentation (bottom)
- Reference code (left)
- Terminal (bottom-right corner)

### Scenario 3: Code Comparison
- Version 1 (left)
- Version 2 (right)
- Diff output (bottom)
- Notes file (top strip)

## Timing Goals

### Beginner (Complete in 5 minutes)
- [ ] Create horizontal and vertical splits
- [ ] Navigate between 4 windows
- [ ] Close and reopen windows
- [ ] Make windows equal size

### Intermediate (Complete in 3 minutes)
- [ ] Create specific 6-window layout
- [ ] Resize to exact proportions
- [ ] Swap window positions
- [ ] Save and restore layout

### Advanced (Complete in 1 minute)
- [ ] Create IDE layout from scratch
- [ ] Rearrange any layout to target
- [ ] Implement split navigation macros
- [ ] Handle 10+ windows efficiently

## Quick Reference Card

Keep this visible while practicing:

```
CREATE          NAVIGATE        SIZE            MANAGE
:sp (:vsp)      Ctrl-w hjkl    Ctrl-w +/-     Ctrl-w r/R
Ctrl-w s (v)    Ctrl-w w/W     Ctrl-w </>     Ctrl-w x
:new (:vnew)    Ctrl-w p       Ctrl-w _|      Ctrl-w HJKL
                Ctrl-w t/b     Ctrl-w =       Ctrl-w c/q/o
```