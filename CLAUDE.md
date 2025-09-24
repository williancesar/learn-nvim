# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an educational repository designed to teach Neovim/Vim through progressive lessons. The goal is to help users master keyboard-driven development, eliminate mouse dependency, and become proficient with Vim motions and keymaps.

## Repository Structure

```
learn-nvim/
├── lessons/           # Progressive learning modules
│   ├── 01-basics/    # Basic movement and editing
│   ├── 02-motions/   # Vim motions and text objects
│   ├── 03-keymaps/   # Custom keymappings
│   └── ...           # Advanced topics
├── practice/         # Practice files for exercises
└── configs/          # Example configurations
```

## Development Commands

### Validate Neovim Configuration
```bash
# Check Lua configuration syntax
nvim --headless -c "luafile %" -c "q" <file.lua>

# Test vim script syntax
nvim --headless -c "source %" -c "q" <file.vim>
```

### Test Lesson Examples
```bash
# Open practice file with minimal config
nvim -u NONE practice/<filename>

# Open with specific lesson config
nvim -u configs/lesson-<number>.lua practice/<filename>
```

## Creating Lessons

When creating or modifying lessons:
1. Maintain progressive difficulty - each lesson builds on previous ones
2. Include clear learning objectives at the start of each lesson
3. Provide practice exercises with expected outcomes
4. Focus on keyboard-only workflows - no mouse interactions
5. Use practical coding examples rather than abstract exercises

## Key Principles

- **Keyboard-First**: All lessons emphasize keyboard navigation and editing
- **Progressive Learning**: Start with basic movements, advance to complex operations
- **Practical Focus**: Use real coding scenarios for practice
- **Muscle Memory**: Repetitive exercises to build automatic responses