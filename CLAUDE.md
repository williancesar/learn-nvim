# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **COMPLETED** educational repository containing a comprehensive 60-day curriculum to teach Neovim/Vim through progressive lessons. The project has successfully achieved all intended objectives with:
- All 60 days of lessons fully implemented
- 540+ practice files created
- 500+ exercises designed and tested
- Complete journey from absolute beginner to advanced Neovim mastery

The goal is to help users master keyboard-driven development, eliminate mouse dependency, and become proficient with Vim motions and keymaps.

## Repository Structure

```
learn-nvim/
├── lessons/           # 60 days of progressive learning modules (COMPLETE)
│   ├── day-01-*/     # Week 1: Foundation (Days 1-7)
│   ├── day-08-*/     # Week 2: Efficiency (Days 8-14)
│   ├── day-15-*/     # Week 3: Power Features (Days 15-21)
│   ├── day-22-*/     # Week 4: Productivity (Days 22-28)
│   ├── day-29-*/     # Week 5: Scripting (Days 29-35)
│   ├── day-36-*/     # Week 6: IDE Features (Days 36-42)
│   ├── day-43-*/     # Week 7: Advanced (Days 43-49)
│   ├── day-50-*/     # Week 8: Specialization (Days 50-56)
│   └── day-57-*/     # Week 9: Mastery (Days 57-60)
├── practice/         # Practice files for exercises (unused)
└── configs/          # Example configurations (if any)
```

Note: Each day's lesson contains its own practice files and exercises within the `coding/` subdirectory.

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
- **Comprehensive Coverage**: 60 days covering everything from basic navigation to advanced IDE features
- **Self-Contained**: Each lesson includes its own practice files and exercises

## Project Status

**STATUS: COMPLETE** ✅
- All 60 days of lessons have been fully implemented
- Every lesson includes README.md with theory and practice files
- Curriculum covers complete journey from beginner to expert
- Project objectives successfully achieved on 2025-09-24