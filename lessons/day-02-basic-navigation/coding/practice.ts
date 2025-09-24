/**
 * Day 02: Basic Navigation - TypeScript Practice
 *
 * NEOVIM PRACTICE INSTRUCTIONS:
 * 1. Use h/j/k/l to navigate between type definitions
 * 2. Practice $ to go to end of lines
 * 3. Use 0 to go to beginning of lines
 * 4. Use w/b to move between words in long type names
 * 5. Practice gg to go to top, G to go to bottom
 * 6. Use Ctrl+d and Ctrl+u for half-page scrolling
 */

// Complex type definitions with navigation targets
namespace NavigationTypes {
  // TARGET: Navigate here with 'gg' (top of file)

  // Complex utility types for navigation practice
  type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
  };

  // TARGET: Use 'w' to move word by word through this long type name
  type ExtremelyLongGenericTypeNameForWordNavigationPractice<
    T extends Record<string, unknown>,
    K extends keyof T,
    V extends T[K]
  > = {
    [P in K]: V extends string ? `processed_${V}` : V;
  };

  // TARGET: Navigate to end of line with '$'
  interface NavigationCoordinates { x: number; y: number; z?: number; timestamp: Date; metadata: Record<string, any>; }

  // TARGET: Use '0' to jump to beginning of this line
                    interface Position { line: number; column: number; offset: number; }

  // Complex nested interface for navigation practice
  interface DocumentStructure {
    // TARGET: Navigate between these properties using j/k
    header: {
      title: string;
      metadata: {
        author: string;
        created: Date;
        modified: Date;
        version: number;
      };
    };

    // TARGET: Practice word navigation 'w/b' on these long property names
    extremelyLongPropertyNameForWordNavigationPractice: string;
    anotherVeryLongPropertyNameToTestWordMovement: number;

    body: {
      sections: Array<{
        id: string;
        title: string;
        content: string;
        subsections: Array<{
          id: string;
          title: string;
          paragraphs: string[];
        }>;
      }>;
    };

    footer: {
      pageNumber: number;
      totalPages: number;
    };
  }

  // TARGET: Use Ctrl+d to scroll down to this section
  type NavigationCommand =
    | { type: 'move'; direction: 'up' | 'down' | 'left' | 'right'; distance: number }
    | { type: 'jump'; target: Position }
    | { type: 'scroll'; direction: 'up' | 'down'; amount: number }
    | { type: 'goto'; line: number; column?: number };

  // Discriminated union for cursor movement
  interface CursorMovement {
    // TARGET: Navigate between method signatures
    moveHorizontal(distance: number): Position;
    moveVertical(distance: number): Position;
    jumpToBeginningOfLine(): Position;
    jumpToEndOfLine(): Position;
    jumpToTopOfDocument(): Position;
    jumpToBottomOfDocument(): Position;
  }

  // TARGET: Scroll down with Ctrl+d to reach this class
  abstract class NavigationEngine<T extends DocumentStructure> {
    protected document: T;
    protected currentPosition: Position;

    constructor(document: T, initialPosition: Position = { line: 0, column: 0, offset: 0 }) {
      this.document = document;
      this.currentPosition = initialPosition;
    }

    // TARGET: Use 'w' to navigate through parameter names
    abstract navigate(command: NavigationCommand): Promise<Position>;

    // TARGET: Practice '$' to reach end of these long method signatures
    public getCurrentPosition(): Position { return this.currentPosition; }
    public setPosition(newPosition: Position): void { this.currentPosition = newPosition; }

    // Generic method with complex type constraints
    public findElement<K extends keyof T>(
      key: K,
      predicate: (value: T[K]) => boolean
    ): T[K] | undefined {
      const value = this.document[key];
      return predicate(value) ? value : undefined;
    }
  }

  // TARGET: Use 'G' to jump to bottom, then navigate back up
  class VimNavigationEngine extends NavigationEngine<DocumentStructure> {
    private history: Position[] = [];

    // TARGET: Navigate between these overloaded method signatures
    async navigate(command: NavigationCommand): Promise<Position> {
      this.history.push({ ...this.currentPosition });

      switch (command.type) {
        case 'move':
          return this.handleMove(command.direction, command.distance);
        case 'jump':
          return this.handleJump(command.target);
        case 'scroll':
          return this.handleScroll(command.direction, command.amount);
        case 'goto':
          return this.handleGoto(command.line, command.column);
        default:
          throw new Error('Unknown navigation command');
      }
    }

    // TARGET: Use Ctrl+u to scroll up to these private methods
    private handleMove(direction: 'up' | 'down' | 'left' | 'right', distance: number): Position {
      // Implementation for h/j/k/l movements
      return { ...this.currentPosition };
    }

    private handleJump(target: Position): Position {
      // Implementation for direct position jumps
      return target;
    }

    private handleScroll(direction: 'up' | 'down', amount: number): Position {
      // Implementation for Ctrl+d/Ctrl+u scrolling
      return { ...this.currentPosition };
    }

    private handleGoto(line: number, column?: number): Position {
      // Implementation for gg/G commands
      return { line, column: column ?? 0, offset: 0 };
    }
  }

  // TARGET: Navigate to this type alias using word movements
  type NavigationKeyBindings = Record<string, NavigationCommand>;

  // TARGET: End of file - practice 'G' to get here quickly
}

export { NavigationTypes };