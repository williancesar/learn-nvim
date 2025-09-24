# Day 50: Session Management - Persistent Workspace Mastery

## Learning Objectives

By the end of this lesson, you will:
- Master Vim session management for persistent workspace setups
- Save and restore complex window layouts, buffer states, and settings
- Create project-specific session workflows
- Understand session options and customization
- Build automated session management systems
- Integrate sessions with version control and team workflows

## The Session Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VIM SESSION FILE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   SESSION COMPONENTS                   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  📁 Buffers       - All open files and positions      │  │
│  │  🪟 Windows       - Layout and sizes                  │  │
│  │  📑 Tabs          - Tab pages configuration           │  │
│  │  📍 Marks         - Global marks (A-Z)                │  │
│  │  ⚙️  Options       - Window-local and global settings  │  │
│  │  📂 Current Dir   - Working directory                 │  │
│  │  🔧 Mappings      - Session-specific keymaps          │  │
│  │  📝 Command History- Ex command history               │  │
│  │  🔍 Search History- Search pattern history            │  │
│  │  ➰ Registers     - Named register contents           │  │
│  │                                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Saved State → File (Session.vim) → Restored State          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Session Commands

### Creating and Saving Sessions

```vim
" Save current session
:mksession              " Save to Session.vim in current directory
:mks                    " Short form
:mksession ~/my.vim     " Save to specific file
:mks!                   " Overwrite existing session

" With options
:mksession! ~/project.vim
:mks! .vim/session.vim  " Hidden directory

" Auto-save on exit
:autocmd VimLeave * mks! ~/.vim/sessions/last.vim
```

### Loading Sessions

```vim
" Restore session
:source Session.vim     " Load session file
:so Session.vim        " Short form
vim -S Session.vim     " Start Vim with session
vim -S                 " Load Session.vim from current dir

" Load specific session
:source ~/projects/web/session.vim
vim -S ~/projects/web/session.vim
```

### Session Options Configuration

```vim
" Configure what gets saved
:set sessionoptions=blank,buffers,curdir,folds,help,tabpages,winsize

" Options breakdown:
" blank    - Empty windows
" buffers  - Hidden and unloaded buffers
" curdir   - Current directory
" folds    - Manual folds
" globals  - Global variables (g:)
" help     - Help windows
" localoptions - Window & buffer options
" options  - All options and mappings
" resize   - Window sizes
" sesdir   - Session directory becomes current
" slash    - Replace \ with / in file paths
" tabpages - All tab pages
" terminal - Terminal windows
" unix     - Unix line endings
" winpos   - GUI window position
" winsize  - Window sizes

" Recommended configuration
:set sessionoptions=buffers,curdir,folds,tabpages,winsize,localoptions
```

## Advanced Session Management Patterns

### 1. Project-Based Sessions

```vim
" Project session structure
~/projects/
├── web-app/
│   ├── .vim/
│   │   ├── session.vim       " Main development session
│   │   ├── debug.vim          " Debugging layout
│   │   └── review.vim         " Code review layout
│   └── src/
├── mobile-app/
│   ├── .vim/
│   │   ├── session.vim
│   │   └── testing.vim
│   └── src/

" Loading project
cd ~/projects/web-app
vim -S .vim/session.vim

" Switching contexts
:source .vim/debug.vim
```

### 2. Named Session Management

```vim
" Session manager functions
function! SaveSession(name)
    let l:session_dir = expand('~/.vim/sessions/')
    if !isdirectory(l:session_dir)
        call mkdir(l:session_dir, 'p')
    endif
    let l:session_file = l:session_dir . a:name . '.vim'
    execute 'mksession! ' . l:session_file
    echo 'Session saved: ' . a:name
endfunction

function! LoadSession(name)
    let l:session_file = expand('~/.vim/sessions/') . a:name . '.vim'
    if filereadable(l:session_file)
        execute 'source ' . l:session_file
        echo 'Session loaded: ' . a:name
    else
        echo 'Session not found: ' . a:name
    endif
endfunction

" Commands
command! -nargs=1 SaveSession call SaveSession(<q-args>)
command! -nargs=1 LoadSession call LoadSession(<q-args>)

" Usage
:SaveSession project1
:LoadSession project1
```

### 3. Auto-Session Management

```vim
" Automatic session handling
augroup AutoSession
    autocmd!
    " Save session on exit if one was loaded
    autocmd VimLeave * if v:this_session != '' |
        \ execute 'mksession! ' . v:this_session | endif

    " Load last session on start if no files specified
    autocmd VimEnter * nested if argc() == 0 &&
        \ filereadable(expand('~/.vim/last-session.vim')) |
        \ source ~/.vim/last-session.vim | endif

    " Auto-save session periodically
    autocmd BufEnter * if v:this_session != '' |
        \ execute 'mksession! ' . v:this_session | endif
augroup END

" Quick session switching
nnoremap <Leader>ss :SaveSession<Space>
nnoremap <Leader>sl :LoadSession<Space>
nnoremap <Leader>sn :mksession! ~/.vim/sessions/new.vim<CR>
```

## Session Workflow Patterns

### 1. Development Workflow

```vim
" Morning startup routine
cd ~/projects/myapp
vim -S .vim/dev-session.vim

" During development
:mks!                    " Save progress regularly

" Context switching
:SaveSession feature-x   " Save current work
:LoadSession main-dev    " Switch to main development

" End of day
:mks! .vim/dev-session.vim
:qa
```

### 2. Debugging Session

```vim
" Create debugging layout
:e src/main.js           " Main code
:vsp src/debug.log       " Log file
:sp test/main.test.js    " Test file
:bot sp                  " Bottom split
:terminal npm test       " Test runner

" Save as debug session
:mks! .vim/debug-session.vim

" Quick reload during debugging
:so .vim/debug-session.vim
```

### 3. Code Review Session

```vim
" Setup review layout
:args `git diff --name-only main`  " Changed files
:vertical ball 2                   " Show 2 buffers
:windo diffthis                    " Diff mode

" Save review session
:mks! .vim/review-session.vim

" Navigate during review
:so .vim/review-session.vim
]c                                  " Next change
[c                                  " Previous change
```

### 4. Multi-Project Management

```vim
" Session launcher script
function! ProjectSession()
    let l:projects = {
        \ '1': ['Web App', '~/projects/web-app/.vim/session.vim'],
        \ '2': ['Mobile App', '~/projects/mobile/.vim/session.vim'],
        \ '3': ['API Server', '~/projects/api/.vim/session.vim'],
        \ '4': ['Documentation', '~/docs/.vim/session.vim']
    \ }

    echo "Select project:"
    for [key, value] in items(l:projects)
        echo key . ': ' . value[0]
    endfor

    let l:choice = input('Enter number: ')
    if has_key(l:projects, l:choice)
        execute 'source ' . l:projects[l:choice][1]
    endif
endfunction

command! Projects call ProjectSession()
```

## Practical Exercises

### Exercise 1: Basic Session Creation

```bash
# Setup practice environment
mkdir -p ~/vim-sessions/project1
cd ~/vim-sessions/project1
echo "Main file" > main.js
echo "Utils" > utils.js
echo "Config" > config.json
```

Practice:
1. `vim main.js`
2. `:e utils.js`
3. `:vsp config.json`
4. `:sp README.md`
5. Arrange windows as desired
6. `:mks! project1.vim`
7. `:qa`
8. `vim -S project1.vim` - Everything restored!

### Exercise 2: Complex Layout Preservation

```vim
" Create complex layout
:e file1.txt
:vsp file2.txt
:sp file3.txt
Ctrl-w l
:sp file4.txt

" Set specific sizes
:vertical resize 40
Ctrl-w h
:resize 15

" Add marks
ma  " In file1
Ctrl-w l
mb  " In file2

" Save session
:mks! complex.vim

" Test restoration
:qa!
vim -S complex.vim
" Check: Layout preserved? Sizes correct? Marks intact?
```

### Exercise 3: Session Options Experimentation

```vim
" Test different sessionoptions
:set sessionoptions=buffers,winsize
:mks! minimal.vim

:set sessionoptions=all
:mks! everything.vim

" Compare file sizes and contents
:!ls -lh *.vim
:!head -20 minimal.vim
:!head -20 everything.vim
```

### Exercise 4: Project Session Workflow

```bash
# Create project structure
mkdir -p myproject/{src,test,docs}/.vim
```

```vim
" Development session
cd myproject
vim src/app.js
:vsp test/app.test.js
:bot sp docs/api.md
:mks! .vim/dev.vim

" Test session
:only
:e test/app.test.js
:vsp test/utils.test.js
:bot sp
:terminal npm test
:mks! .vim/test.vim

" Documentation session
:only
:e docs/README.md
:vsp docs/api.md
:sp docs/guide.md
:mks! .vim/docs.vim

" Switch between them
:so .vim/test.vim    " Testing layout
:so .vim/dev.vim     " Back to development
:so .vim/docs.vim    " Documentation
```

### Exercise 5: Auto-Session Setup

Add to your `.vimrc`:
```vim
" Auto-session management
let g:session_autosave = 'yes'
let g:session_autoload = 'yes'
let g:session_default_to_last = 1

" Create session directory
if !isdirectory($HOME . '/.vim/sessions')
    call mkdir($HOME . '/.vim/sessions', 'p')
endif

" Auto-save current session
autocmd VimLeave * if exists('g:current_session') |
    \ execute 'mksession! ' . g:current_session | endif

" Load last session if no args
autocmd VimEnter * nested if argc() == 0 |
    \ let g:last_session = $HOME . '/.vim/sessions/last.vim' |
    \ if filereadable(g:last_session) |
    \ execute 'source ' . g:last_session |
    \ let g:current_session = g:last_session |
    \ endif | endif

" Quick session commands
nnoremap <Leader>ss :let g:current_session = $HOME . '/.vim/sessions/' .
    \ input('Session name: ') . '.vim'<CR>:mksession! <C-R>=g:current_session<CR><CR>
nnoremap <Leader>so :source $HOME/.vim/sessions/
```

## Session Best Practices

### 1. Organization Structure

```
~/.vim/sessions/
├── projects/
│   ├── web-app.vim
│   ├── mobile-app.vim
│   └── api-server.vim
├── contexts/
│   ├── debugging.vim
│   ├── writing.vim
│   └── reviewing.vim
├── temporary/
│   ├── experiment1.vim
│   └── quick-fix.vim
└── last.vim  " Auto-saved last session
```

### 2. Version Control Integration

```bash
# .gitignore for project sessions
.vim/session.vim
.vim/local-session.vim

# But track shared sessions
# !.vim/default-session.vim
# !.vim/review-session.vim
```

### 3. Session Templates

```vim
" Template for new projects
function! NewProjectSession()
    " Standard layout
    :e README.md
    :vsp src/main.js
    :sp TODO.md
    Ctrl-w h
    :30vsp .

    " Save as template
    :mks! ~/.vim/templates/project.vim
endfunction

" Use template
:source ~/.vim/templates/project.vim
```

## Common Pitfalls and Solutions

### 1. Absolute vs Relative Paths
**Problem**: Sessions break when moving projects
```vim
" Solution: Use relative paths
:set sessionoptions+=sesdir
:cd ~/projects/myapp  " cd before saving
:mks! .vim/session.vim
```

### 2. Plugin State Not Saved
**Problem**: Plugin windows/states not restored
```vim
" Solution: Save plugin state separately
function! SavePluginState()
    " Save NERDTree state
    if exists('g:NERDTree')
        let g:nerdtree_state = NERDTreeGetState()
    endif
endfunction

autocmd SessionLoadPost * call RestorePluginState()
```

### 3. Terminal Windows Issues
**Problem**: Terminal windows don't restore properly
```vim
" Solution: Re-create terminals after load
autocmd SessionLoadPost * call OpenTerminals()

function! OpenTerminals()
    " Find and recreate terminal windows
    for winnr in range(1, winnr('$'))
        if getbufvar(winbufnr(winnr), '&buftype') == 'terminal'
            execute winnr . 'wincmd w'
            :terminal
        endif
    endfor
endfunction
```

### 4. Session Conflicts
**Problem**: Multiple Vim instances overwriting sessions
```vim
" Solution: Lock files
function! LockSession(session)
    let lockfile = a:session . '.lock'
    if filereadable(lockfile)
        echo "Session is locked by another instance"
        return 0
    endif
    call writefile([getpid()], lockfile)
    return 1
endfunction

autocmd VimLeave * call delete(v:this_session . '.lock')
```

## Integration with Previous Lessons

### With Buffers (Day 43)
```vim
" Save buffer list with session
:set sessionoptions+=buffers
" All buffers restored with layout
```

### With Windows (Day 44)
```vim
" Preserve exact window layout
:set sessionoptions+=winsize,winpos
" Complex layouts saved perfectly
```

### With Tabs (Day 45)
```vim
" Include all tab pages
:set sessionoptions+=tabpages
" Multi-tab workspace restored
```

### With Marks (Day 49)
```vim
" Global marks saved
:set sessionoptions+=globals
" Project-wide navigation preserved
```

## Quick Reference Card

```
Session Commands
════════════════
:mksession [file]    Create session
:mks!                Overwrite session
:source file.vim     Load session
:so Session.vim      Load default
vim -S [file]        Start with session

Session Options
═══════════════
blank               Empty windows
buffers             All buffers
curdir              Current directory
folds               Manual folds
globals             Global variables
help                Help windows
localoptions        Buffer/window options
options             All options
resize              Window sizes
tabpages            Tab pages
terminal            Terminal windows
winsize             Window dimensions

Common Patterns
═══════════════
:mks! .vim/session.vim       Save project session
vim -S .vim/session.vim      Load project session
:set ssop+=buffers,winsize   Configure options

Automation
══════════
autocmd VimLeave * mks!      Auto-save on exit
autocmd VimEnter * so         Auto-load on start
v:this_session                Current session file
```

## Practice Goals

### Beginner (10 minutes)
- [ ] Create and restore basic session
- [ ] Save session with multiple windows
- [ ] Load session from command line
- [ ] Understand sessionoptions basics

### Intermediate (20 minutes)
- [ ] Create project-specific sessions
- [ ] Manage multiple named sessions
- [ ] Configure appropriate sessionoptions
- [ ] Implement session switching workflow

### Advanced (30 minutes)
- [ ] Build automated session system
- [ ] Create session templates
- [ ] Integrate with version control
- [ ] Handle complex multi-tab sessions

## Mastery Checklist

- [ ] Can save and restore any workspace instantly
- [ ] Use sessions for context switching
- [ ] Maintain project-specific session files
- [ ] Configure optimal sessionoptions for workflow
- [ ] Integrate sessions with daily development
- [ ] Never lose workspace setup again
- [ ] Create session management functions
- [ ] Build team-shareable session templates

Remember: Sessions are your workspace memory. They transform Vim from an editor into a persistent development environment. Every complex setup you create can be instantly recalled!