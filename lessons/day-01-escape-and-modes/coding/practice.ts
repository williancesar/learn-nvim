/**
 * Day 01: Escape & Modes - TypeScript Practice
 *
 * NEOVIM PRACTICE INSTRUCTIONS:
 * 1. Press 'i' to enter INSERT mode at different locations
 * 2. Practice <Esc> to return to NORMAL mode
 * 3. Use 'a' to append after cursor
 * 4. Use 'o' to open new line below
 * 5. Use 'O' to open new line above
 * 6. Navigate between different interface properties using h, j, k, l
 */

// Type-safe interface with practice markers for mode switching
interface EditorMode {
  readonly name: string;
  readonly description: string;
  readonly keyBinding: string;
  readonly isInsertMode: boolean;
}

// Practice marker: ENTER INSERT MODE HERE (press 'i')
interface KeyBindings {
  normal: EditorMode;
  insert: EditorMode;
  visual: EditorMode;
  command: EditorMode;
}

// Practice marker: APPEND AFTER THIS LINE (press 'a')
const NORMAL_MODE: EditorMode = {
  name: "Normal",
  description: "Default mode for navigation and commands",
  keyBinding: "<Esc>",
  isInsertMode: false
};

// Practice marker: OPEN NEW LINE BELOW (press 'o')
const INSERT_MODE: EditorMode = {
  name: "Insert",
  description: "Mode for inserting text",
  keyBinding: "i",
  isInsertMode: true
};

// Practice marker: OPEN NEW LINE ABOVE (press 'O')
const VISUAL_MODE: EditorMode = {
  name: "Visual",
  description: "Mode for selecting text",
  keyBinding: "v",
  isInsertMode: false
};

type ModeTransition<T extends EditorMode> = {
  from: T;
  to: T;
  trigger: string;
  validTransition: boolean;
};

// Advanced TypeScript: Conditional types for mode validation
type ValidModeTransition<From extends EditorMode, To extends EditorMode> =
  From extends { isInsertMode: true }
    ? To extends { keyBinding: "<Esc>" }
      ? true
      : false
    : true;

// Generic decorator for mode tracking
function ModeTracker<T extends new (...args: any[]) => any>(constructor: T) {
  return class extends constructor {
    private currentMode: EditorMode = NORMAL_MODE;

    switchMode(newMode: EditorMode): void {
      console.log(`Switching from ${this.currentMode.name} to ${newMode.name}`);
      this.currentMode = newMode;
    }

    getCurrentMode(): EditorMode {
      return this.currentMode;
    }
  };
}

// Practice marker: USE 'i' TO ENTER INSERT MODE
@ModeTracker
class VimEditor {
  private modes: KeyBindings;

  constructor() {
    this.modes = {
      normal: NORMAL_MODE,
      insert: INSERT_MODE,
      visual: VISUAL_MODE,
      command: {
        name: "Command",
        description: "Mode for executing commands",
        keyBinding: ":",
        isInsertMode: false
      }
    };
  }

  // Practice marker: ESCAPE TO NORMAL MODE
  executeCommand(command: string): void {
    console.log(`Executing: ${command}`);
  }

  // Practice marker: NAVIGATE TO THIS METHOD
  getModeByKey<K extends keyof KeyBindings>(key: K): KeyBindings[K] {
    return this.modes[key];
  }
}

// Utility type for mode state management
type ModeState = {
  [K in keyof KeyBindings]: {
    active: boolean;
    lastUsed: Date;
    usage: number;
  };
};

// Practice marker: ADD TEXT AFTER THIS COMMENT
// TODO: Implement mode history tracking

// Advanced generic type for command validation
interface Command<T = any> {
  name: string;
  execute: (editor: VimEditor) => T;
  requiredMode: EditorMode;
}

// Mapped type for all possible mode combinations
type ModeMatrix = {
  [K in keyof KeyBindings]: {
    [P in keyof KeyBindings]: ValidModeTransition<KeyBindings[K], KeyBindings[P]>;
  };
};

// Practice marker: MOVE CURSOR HERE AND PRACTICE NAVIGATION
export { VimEditor, EditorMode, KeyBindings, ModeTransition };