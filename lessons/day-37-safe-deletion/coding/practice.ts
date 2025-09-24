/**
 * Day 37: Safe Deletion - TypeScript for Deletion without Affecting Registers
 *
 * This file teaches safe deletion techniques that don't pollute vim registers.
 * Learn to delete text without overwriting your clipboard or named registers,
 * maintaining clean register state for efficient copy/paste operations.
 *
 * Safe Deletion Objectives:
 * - Use "_d to delete into black hole register
 * - Use "_x to delete character without affecting registers
 * - Use "_c to change text without storing deleted content
 * - Practice preserving register contents during cleanup operations
 * - Learn when to use black hole register vs normal deletion
 */

// ========== CODE WITH UNWANTED ELEMENTS ==========
// Practice deleting unwanted code without affecting your register contents

// DELETE ME: This entire comment block should be removed
// DELETE ME: These are temporary debugging comments
// DELETE ME: Remove all these placeholder comments
// DELETE ME: Use black hole register to keep clean registers

const TEMP_DEBUG = true; // DELETE ME: Remove debug flag
const UNUSED_CONSTANT = 'remove this'; // DELETE ME
const OLD_API_URL = 'http://old-api.com'; // DELETE ME: Deprecated

interface User {
  id: string;
  email: string;
  name: string;
  // DELETE ME: This property is no longer used
  tempField?: string;
  // DELETE ME: Remove deprecated properties
  legacyId?: number;
  // DELETE ME: Old naming convention
  user_status?: string;
  createdAt: Date;
  updatedAt: Date;
}

// DELETE ME: This function is deprecated
function oldUserProcessor(user: User) {
  // DELETE ME: Legacy implementation
  console.log('OLD:', user);
  return user;
}

class UserService {
  // DELETE ME: Remove this debug method
  private debugUser(user: User) {
    console.log('DEBUG USER:', user);
  }

  async findById(id: string): Promise<User | null> {
    console.log('Finding user:', id); // DELETE ME: Remove debug log

    try {
      const user = await this.userRepository.findById(id);
      // DELETE ME: Remove debug logging
      if (TEMP_DEBUG) {
        console.log('Found user:', user);
      }
      return user;
    } catch (error) {
      console.error('Error:', error); // KEEP THIS: Error logging is important
      throw error;
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    // DELETE ME: Remove validation debug
    console.log('Creating user with data:', userData);

    // DELETE ME: Remove old validation logic
    if (!userData.email || !userData.name) {
      throw new Error('Invalid data');
    }

    const user = await this.userRepository.create(userData);

    // DELETE ME: Remove success logging
    console.log('User created successfully:', user.id);

    return user;
  }

  // DELETE ME: This entire method is unused
  private unusedHelper(data: any): any {
    // DELETE ME: Entire method body
    console.log('Unused helper called');
    return data;
  }
}

// DELETE ME: Remove all test data below
const TEST_USER_1 = {
  id: '1',
  email: 'test1@example.com',
  name: 'Test User 1'
};

const TEST_USER_2 = {
  id: '2',
  email: 'test2@example.com',
  name: 'Test User 2'
};

const TEST_USER_3 = {
  id: '3',
  email: 'test3@example.com',
  name: 'Test User 3'
};

// Safe Deletion Practice Exercises:
/*
1. Black Hole Register Deletion:
   Position cursor on "DELETE ME" comment, use "_dd to delete line
   This removes the line without affecting your registers

2. Safe Character Deletion:
   Use "_x to delete unwanted characters without polluting registers
   Navigate through code and clean up extra spaces, semicolons, etc.

3. Safe Change Operations:
   Use "_c to change text without storing the deleted content
   Change variable names while preserving your register contents

4. Bulk Safe Deletion:
   Use visual selection with "_d to delete blocks safely
   Select entire functions or code blocks and delete cleanly

5. Preserve Important Registers:
   Keep your named registers (a-z) clean while doing cleanup
   Use black hole register for all temporary deletions

6. Mixed Deletion Strategy:
   Use normal deletion (d, x, c) when you want to store content
   Use black hole ("_d, "_x, "_c) when cleaning up unwanted code

Practice Goals:
- Delete all "DELETE ME" comments using "_dd
- Remove deprecated properties using "_d with text objects
- Clean up debug statements while preserving useful registers
- Remove test data without affecting your clipboard
*/