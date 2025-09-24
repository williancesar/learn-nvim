/**
 * Day 01 - Neovim Modes Practice File
 * Focus: Escape Key & Mode Switching
 *
 * PRACTICE INSTRUCTIONS:
 * 1. Start in Normal mode (press <Esc> to ensure you're there)
 * 2. Practice entering Insert mode with: i, I, a, A, o, O
 * 3. Practice Visual mode with: v (character), V (line), Ctrl+v (block)
 * 4. Always return to Normal mode with <Esc>
 *
 * TODO: Practice switching modes at each marked location below
 */

// TODO: Enter Insert mode here and add your name as a comment
// Author:

// TODO: Use 'o' to open a new line below and add today's date
const practiceDate = '2025-09-23';

/**
 * Simple User Management System
 * TODO: Practice Visual mode by selecting the entire JSDoc comment above
 */
class UserManager {
    constructor() {
        this.users = [];
        // TODO: Enter Insert mode with 'A' and add a comment about initialization
    }

    // TODO: Use 'I' to go to beginning of line and add proper indentation
    addUser(user) {
        if (!user.name || !user.email) {
            throw new Error('Name and email are required');
            // TODO: Practice Visual line mode (V) to select this entire if block
        }

        this.users.push({
            id: this.generateId(),
            ...user,
            createdAt: new Date()
        });
        // TODO: Use 'a' to append after cursor and add a semicolon if missing
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
        // TODO: Select this entire method using Visual mode
    }

    // TODO: Practice 'o' to open new line and add a method comment
    findUser(id) {
        return this.users.find(user => user.id === id);
    }

    // TODO: Use Visual block mode (Ctrl+v) to select the method names column
    updateUser(id, updates) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return null;
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updates,
            updatedAt: new Date()
        };
        // TODO: Practice entering Insert mode and adding return statement
    }

    deleteUser(id) {
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        return this.users.length < initialLength;
    }

    // TODO: Add a new method here using 'O' to open line above
}

// TODO: Practice Visual mode to select the entire class definition above

// Example usage for testing different modes
const manager = new UserManager();

// TODO: Use Insert mode to complete these user objects
const user1 = {
    name: '', // TODO: Add a name here
    email: '' // TODO: Add an email here
};

const user2 = {
    name: '', // TODO: Practice 'A' to go to end and add content
    email: ''
};

// TODO: Practice Visual mode to select multiple lines of the try-catch block
try {
    manager.addUser(user1);
    manager.addUser(user2);

    console.log('Users added successfully');
    // TODO: Use 'o' to add a new line and log the users array
} catch (error) {
    console.error('Error adding users:', error.message);
    // TODO: Practice Visual line mode to select this entire catch block
}

// TODO: Complete this arrow function using Insert mode
const displayUser = (user) => {
    // TODO: Add function body here
};

// TODO: Practice mode switching while completing this async function
async function fetchUserData(userId) {
    try {
        // TODO: Add fetch logic here using Insert mode
        const response = null; // TODO: Replace with actual fetch call
        return response;
    } catch (error) {
        // TODO: Use Visual mode to select and replace this comment
        console.error('Fetch error:', error);
    }
}

/**
 * PRACTICE CHECKLIST:
 * TODO: Check off each mode transition you've practiced:
 * □ Normal to Insert (i)
 * □ Normal to Insert at beginning (I)
 * □ Normal to Insert after cursor (a)
 * □ Normal to Insert at end of line (A)
 * □ Normal to Insert new line below (o)
 * □ Normal to Insert new line above (O)
 * □ Normal to Visual character (v)
 * □ Normal to Visual line (V)
 * □ Normal to Visual block (Ctrl+v)
 * □ Any mode back to Normal (Esc)
 */

// TODO: End by ensuring you're in Normal mode - press <Esc>