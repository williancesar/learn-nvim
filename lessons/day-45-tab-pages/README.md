# Day 45: Tab Pages - Workspace Organization

## Learning Objectives

By the end of this lesson, you will:
- Master Vim's tab page system for workspace organization
- Understand the relationship between tabs, windows, and buffers
- Navigate efficiently between multiple workspaces
- Create task-specific tab layouts
- Build mental models for when to use tabs vs splits vs buffers

## The Complete Vim Hierarchy

```
┌──────────────────────────────────────────────────────────┐
│                      VIM INSTANCE                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    TAB PAGE 1                        │ │
│  │  ┌──────────────┬──────────────┬────────────────┐  │ │
│  │  │   Window 1   │   Window 2   │    Window 3    │  │ │
│  │  │              │              │                 │  │ │
│  │  │ Buffer: main │ Buffer: test │ Buffer: config │  │ │
│  │  └──────────────┴──────────────┴────────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    TAB PAGE 2                        │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │                 Window 1                     │   │ │
│  │  │                                              │   │ │
│  │  │           Buffer: documentation              │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    TAB PAGE 3                        │ │
│  │  ┌──────────────────────┬────────────────────────┐ │ │
│  │  │      Window 1         │       Window 2         │ │ │
│  │  │  Buffer: debug.log    │  Buffer: terminal      │ │ │
│  │  └──────────────────────┴────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  HIERARCHY: Vim → Tabs → Windows → Buffers              │
└──────────────────────────────────────────────────────────┘
```

## Understanding Tabs vs Windows vs Buffers

### Mental Model: The Office Analogy

- **Buffers**: Documents (files in memory)
- **Windows**: Views of documents on your desk
- **Tabs**: Different desks for different projects

```
Tab 1: Development Desk
├── Window: main.js
├── Window: test.js
└── Window: terminal

Tab 2: Documentation Desk
└── Window: README.md (maximized)

Tab 3: Debugging Desk
├── Window: debug.log
└── Window: application output
```

## Core Tab Commands

### Creating and Closing Tabs

```vim
" Creating tabs
:tabnew [file]       " Create new tab (with optional file)
:tabedit [file]      " Same as :tabnew
:tab split           " Open current buffer in new tab
:tabc[lose]          " Close current tab
:tabo[nly]           " Close all other tabs

" With position
:0tabnew             " New tab at beginning
:$tabnew             " New tab at end
:tabnew +/pattern file " Open at pattern

" From command line
vim -p file1 file2   " Open files in tabs
vim -p *.js          " Open all JS files in tabs
```

### Tab Navigation

```vim
" Moving between tabs
gt                   " Go to next tab
gT                   " Go to previous tab
[N]gt                " Go to tab N (e.g., 3gt)
:tabn[ext]           " Next tab
:tabp[revious]       " Previous tab
:tabfirst            " First tab
:tablast             " Last tab
:tabs                " List all tabs

" Direct navigation
1gt                  " Go to tab 1
2gt                  " Go to tab 2
5gt                  " Go to tab 5
```

### Tab Management

```vim
" Moving tabs
:tabmove             " Move tab to end
:tabmove 0           " Move tab to beginning
:tabmove 2           " Move tab to position 2
:tabmove +1          " Move tab right
:tabmove -1          " Move tab left

" Tab operations
:tabdo {cmd}         " Execute command in all tabs
:tabdo w             " Save all tabs
:tabdo %s/old/new/g  " Replace in all tabs
```

## Advanced Tab Workflows

### 1. Project-Based Tabs

```vim
" Tab 1: Source Code
:tabedit src/main.js
:vsp src/utils.js
:sp src/config.js

" Tab 2: Tests
:tabnew test/main.test.js
:vsp test/utils.test.js

" Tab 3: Documentation
:tabnew README.md
:vsp CHANGELOG.md

" Tab 4: Configuration
:tabnew package.json
:vsp .eslintrc
:sp .gitignore
```

### 2. Task-Oriented Layout

```vim
" Development Tab
:tabedit
:e src/feature.js
:vsp test/feature.test.js
:sp term://npm test

" Research Tab
:tabnew
:e reference.md
:vsp examples.js

" Debug Tab
:tabnew
:e debug.log
:vsp src/buggy-code.js
:sp term://node debug
```

### 3. Client-Server Development

```vim
" Frontend Tab
:tabedit frontend/App.jsx
:vsp frontend/styles.css
:sp frontend/index.html

" Backend Tab
:tabnew backend/server.js
:vsp backend/routes.js
:sp backend/models.js

" Database Tab
:tabnew database/schema.sql
:vsp database/migrations/
```

## Tab Page Indicators

### Understanding the Tabline

```
┌──────────────────────────────────────────────────┐
│  1 main.js  2 tests +  3 docs  4 config *       │
└──────────────────────────────────────────────────┘
   │          │          │        │
   │          │          │        └─ Current tab
   │          │          └─ Tab 3 (docs)
   │          └─ Tab 2 (modified with +)
   └─ Tab 1 (main.js)
```

### Custom Tab Labels

```vim
" Set custom tab label
:set guitablabel=%t%(\ %M%)

" Show tab number and filename
:set guitablabel=%N:\ %t

" Function for custom labels
function! MyTabLabel(n)
  let buflist = tabpagebuflist(a:n)
  let winnr = tabpagewinnr(a:n)
  return bufname(buflist[winnr - 1])
endfunction
:set guitablabel=%!MyTabLabel(v:lnum)
```

## Practical Tab Strategies

### Strategy 1: Feature Development

```vim
" Setup for new feature
:tabnew              " New feature tab
:e src/new-feature.js
:vsp test/new-feature.test.js
:sp TODO.md

" Quick access pattern
1gt                  " Main codebase
2gt                  " New feature
3gt                  " Documentation
```

### Strategy 2: Bug Investigation

```vim
" Bug hunting setup
:tabnew              " Investigation tab
:e src/buggy-file.js
:vsp debug.log
:sp git-blame.txt

" Original code tab (for reference)
:tabnew
:e src/working-version.js
```

### Strategy 3: Code Review

```vim
" Review setup
:args `git diff --name-only main`
:argdo tabedit       " Each changed file in tab

" Navigate reviews
gt                   " Next file
gT                   " Previous file
:tabdo diffthis      " Compare all
```

## Tab-Specific Settings

### Per-Tab Configuration

```vim
" Different settings per tab
:tabnew
:setlocal spell      " Spell check in docs tab
:setlocal wrap       " Word wrap for text

:tabnew
:setlocal number     " Line numbers in code tab
:setlocal noexpandtab " Tabs for makefile
```

### Tab-Local Variables

```vim
" Store tab-specific data
:let t:project_root = '/path/to/project'
:let t:test_command = 'npm test'

" Access in any window of that tab
:echo t:project_root
```

## Practical Exercises

### Exercise 1: Basic Tab Operations

```bash
# Create test files
echo "console.log('main');" > main.js
echo "function test() {}" > test.js
echo "# Documentation" > docs.md
echo '{"name": "project"}' > package.json
```

Practice sequence:
1. `vim main.js`
2. `:tabnew test.js` - Open in new tab
3. `:tabnew docs.md` - Another tab
4. `:tabnew package.json` - Fourth tab
5. Practice `gt` and `gT` navigation
6. Try `2gt` to jump to tab 2
7. `:tabs` to see all tabs
8. `:tabmove 0` to reorder
9. `:tabclose` to close current
10. `:tabonly` to keep only current

### Exercise 2: Multi-Tab Workflow

```vim
" 1. Create development environment
:tabedit src/app.js
:vsp src/utils.js

" 2. Create test environment
:tabnew test/app.test.js
:vsp test/utils.test.js

" 3. Create documentation
:tabnew README.md

" 4. Work pattern
1gt                  " To development
/function            " Find function
yiw                  " Copy name
2gt                  " To tests
/<Ctrl-r>"          " Search for function
3gt                  " To documentation
o<Ctrl-r>"          " Document function
```

### Exercise 3: Project Organization

```vim
" Setup multi-context project
" Tab 1: Frontend
:tabedit frontend/index.html
:vsp frontend/app.js
:sp frontend/style.css

" Tab 2: Backend
:tabnew backend/server.js
:vsp backend/database.js

" Tab 3: Config
:tabnew .env
:vsp docker-compose.yml

" Tab 4: Terminal
:tabnew
:terminal

" Navigation practice
:tabdo echo expand('%')  " Show files in each tab
:tabdo w                  " Save all tabs
```

### Exercise 4: Advanced Tab Management

```vim
" Complex refactoring setup
:tabedit old_code.js
:tab split            " Duplicate in new tab
2gt                   " Go to new tab
:e new_code.js        " Open new version

" Side-by-side comparison
1gt                   " Old code tab
:vsp new_code.js      " Show new in split
:diffthis
Ctrl-w l
:diffthis

" Documentation tab
:tabnew REFACTORING.md
:r !git diff old_code.js new_code.js
```

## Common Pitfalls and Solutions

### 1. Too Many Tabs
**Problem**: Tab bar becomes cluttered
```vim
" Solution: Use meaningful groupings
:tabonly              " Start fresh
:tabs                 " Review open tabs
:tabclose 3 5 7       " Close specific tabs

" Better: Use buffers for many files
:b partial_name       " Instead of many tabs
```

### 2. Lost Tab Context
**Problem**: Forgot what's in each tab
```vim
" Solution: Name your tabs
:let t:name = "Testing"
:tabs                 " See all tabs

" Or use descriptive first file
:tabedit PROJECT_FRONTEND.md
:e actual_file.js
```

### 3. Duplicate Windows Across Tabs
**Problem**: Same file open in multiple tabs
```vim
" Check before opening
:tabs                 " See what's open
:buffers              " See all loaded files

" Jump to existing
:drop filename        " Goes to window with file
```

### 4. Tab Navigation Confusion
**Problem**: Can't remember tab numbers
```vim
" Solutions:
:set showtabline=2    " Always show tab bar
:tabs                 " Quick reference

" Mental model:
" Tab 1 = Main work
" Tab 2 = Tests
" Tab 3 = Docs
" Tab 4 = Temp/Debug
```

## Mental Models for Tab Usage

### The Workspace Model
```
Each Tab = Different Project Context
├── Tab 1: Active Development
├── Tab 2: Testing & Debugging
├── Tab 3: Documentation
└── Tab 4: Research & Reference
```

### The Stage Model
```
Tab Flow → Development Pipeline
Tab 1: Write Code
Tab 2: Write Tests
Tab 3: Debug Issues
Tab 4: Update Docs
```

### The Context Switch Model
```
Tabs = Mental Contexts
- Don't mix contexts in one tab
- Each tab has single purpose
- Close tab when task complete
```

## When to Use Tabs vs Splits vs Buffers

### Use Tabs When:
- Working on distinct tasks/projects
- Need different window layouts per task
- Context switching between work types
- Want to preserve complex layouts

### Use Splits When:
- Need to see multiple files simultaneously
- Comparing or referencing files
- Copy/paste between files
- Working on related files

### Use Buffers When:
- Quickly switching between many files
- Don't need simultaneous viewing
- Working on single task/feature
- Want minimal UI overhead

## Integration with Previous Lessons

### With Buffers (Day 43)
```vim
" Buffers are shared across tabs
:e shared.js          " Load buffer
:tabnew               " New tab
:b shared             " Same buffer, different tab
```

### With Windows (Day 44)
```vim
" Each tab has independent window layout
:vsp | sp             " Complex layout in tab 1
:tabnew               " Tab 2 starts fresh
:vsp                  " Different layout
```

### With Marks (Day 21)
```vim
" Global marks work across tabs
1gt ma                " Set mark A in tab 1
3gt 'a                " Jump to mark (changes tab!)
```

## Quick Reference Card

```
Tab Commands
════════════
:tabnew [file]    New tab with file
:tabedit [file]   Edit file in new tab
:tabclose         Close current tab
:tabonly          Close other tabs
gt                Next tab
gT                Previous tab
[N]gt             Go to tab N

Navigation
══════════
1gt, 2gt, 3gt    Direct tab access
:tabs            List all tabs
:tabfirst        First tab
:tablast         Last tab

Management
══════════
:tabmove N       Move tab to position N
:tabmove +1      Move tab right
:tabmove -1      Move tab left
:tabdo cmd       Run cmd in all tabs

Settings
════════
:set showtabline=2    Always show tabs
:set tabpagemax=20    Max tabs to open
```

## Practice Goals

### Beginner (5 minutes)
- [ ] Open 3 files in separate tabs
- [ ] Navigate with gt/gT (20 times)
- [ ] Jump directly with 2gt, 3gt
- [ ] Close and reopen tabs

### Intermediate (10 minutes)
- [ ] Create 3-tab project layout
- [ ] Move tabs with :tabmove
- [ ] Use :tabdo for batch operations
- [ ] Mix tabs with splits

### Advanced (15 minutes)
- [ ] Build complete dev environment with tabs
- [ ] Implement feature across multiple tabs
- [ ] Create custom tab workflow
- [ ] Master quick tab switching

## Mastery Checklist

- [ ] Can organize 5+ tabs meaningfully
- [ ] Navigate tabs without thinking
- [ ] Know when to use tabs vs splits
- [ ] Create task-specific tab layouts
- [ ] Use :tabdo for batch operations
- [ ] Integrate tabs with buffers and windows
- [ ] Never lose context when switching tabs
- [ ] Can explain the complete Vim hierarchy

Remember: Tabs are workspaces for different contexts. Use them to organize distinct tasks, not just to open more files. Think of each tab as a different desk for a different project!