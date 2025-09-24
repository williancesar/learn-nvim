/**
 * DAY 08: UNDO & REDO PRACTICE
 * =============================
 *
 * LEARNING OBJECTIVES:
 * - Master undo (u) and redo (Ctrl-r) commands
 * - Practice the repeat command (.) for efficient editing
 * - Learn to navigate undo history effectively
 *
 * EXERCISE INSTRUCTIONS:
 * 1. This file contains intentional mistakes and incomplete code
 * 2. Fix errors using undo/redo and repeat commands
 * 3. Practice making changes, then undoing and redoing them
 * 4. Use the repeat command (.) to duplicate similar operations
 *
 * KEY COMMANDS TO PRACTICE:
 * - u         : Undo last change
 * - Ctrl-r    : Redo last undone change
 * - .         : Repeat last change
 * - U         : Undo all changes on current line
 * - g-        : Go to older text state
 * - g+        : Go to newer text state
 */

// TODO: Fix the syntax errors below using undo/redo practice
// 1. Make intentional wrong edits first
// 2. Use 'u' to undo them
// 3. Use Ctrl-r to redo them
// 4. Use '.' to repeat similar changes

class TaskManager {
    constructor() {
        this.tasks = [];
        this.completedTasks = [];
        this.nextId = 1;
    }

    // BUG: Method name is wrong (should be addTask)
    addTsk(title, description = '') {
        const task = {
            id: this.nextId++,
            title: title,
            description: description,
            completed: false,
            createdAt: new Date(),
            priority: 'medium'
        };

        // BUG: Missing closing bracket
        this.tasks.push(task;
        return task;
    }

    // BUG: Parameter name inconsistent (should be taskId)
    completeTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex !== -1) {
            const task = this.tasks[taskIndex];
            task.completed = true;
            task.completedAt = new Date();

            // BUG: Wrong method name (should be splice)
            this.tasks.slice(taskIndex, 1);
            this.completedTasks.push(task);

            return task;
        }

        return null;
    }

    // BUG: Missing return statement
    getTasks(includeCompleted = false) {
        if (includeCompleted) {
            [...this.tasks, ...this.completedTasks];
        }
        this.tasks;
    }

    // BUG: Wrong comparison operator
    getTasksByPriority(priority = 'medium') {
        return this.tasks.filter(task => task.priority = priority);
    }

    // Practice area: Add similar methods using repeat command (.)
    // After fixing one method, use '.' to repeat similar fixes

    updateTaskTitle(taskId, newTitle) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.title = newTitle;
            task.updatedAt = new Date();
        }
        // BUG: Missing return
    }

    updateTaskDescription(taskId, newDescription) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.description = newDescription;
            task.updatedAt = new Date();
        }
        // BUG: Missing return (use '.' to repeat the fix from above)
    }

    updateTaskPriority(taskId, newPriority) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.priority = newPriority;
            task.updatedAt = new Date();
        }
        // BUG: Missing return (use '.' to repeat the fix)
    }

    // BUG: Inconsistent naming pattern (should be deleteTask)
    removeTask(taskId) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            return this.tasks.splice(index, 1)[0];
        }
        return null;
    }
}

// Practice with array methods - intentional mistakes to fix
const sampleData = [
    { name: 'John', age: 25, department: 'Engineering' },
    { name: 'Sarah', age: 30, department: 'Marketing' },
    { name: 'Mike', age: 28, department: 'Engineering' },
    { name: 'Lisa', age: 26, department: 'Design' },
    { name: 'Tom', age: 32, department: 'Marketing' }
];

// BUG: Missing return statement
const getEngineeringTeam = () => {
    sampleData.filter(person => person.department === 'Engineering');
};

// BUG: Wrong arrow function syntax
const getAverageAge = () =>
    const total = sampleData.reduce((sum, person) => sum + person.age, 0);
    return total / sampleData.length;
};

// BUG: Missing arrow in arrow function
const getYoungestPerson = () {
    return sampleData.reduce((youngest, person) =>
        person.age < youngest.age ? person : youngest
    );
};

// BUG: Incorrect method call (should be includes)
const hasMarketingTeam = () => {
    return sampleData.some(person => person.department.include('Marketing'));
};

// Async/Await practice with intentional errors
// BUG: Missing async keyword
function fetchUserData(userId) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        const userData = await response.json();

        // BUG: Missing return
        userData;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}

// BUG: Missing async keyword and wrong parameter destructuring
function processUserData({ userId, includeProfile = true }) {
    const userData = await fetchUserData(userId);

    if (includeProfile) {
        const profileData = await fetch(`https://api.example.com/profile/${userId}`);
        userData.profile = await profileData.json();
    }

    return userData;
}

// Practice with class inheritance - fix using undo/redo
class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.isRunning = false;
    }

    // BUG: Missing method implementation
    start() {
        // Implementation missing - add it, then practice undo/redo
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            console.log(`${this.make} ${this.model} has been stopped.`);
        }
    }

    // BUG: Method name typo (should be getInfo)
    getInf() {
        return `${this.year} ${this.make} ${this.model}`;
    }
}

// BUG: Missing extends keyword
class Car Vehicle {
    constructor(make, model, year, doors) {
        super(make, model, year);
        this.doors = doors;
        this.fuel = 100;
    }

    // BUG: Missing method body
    drive(distance) {
        if (!this.isRunning) {
            console.log('Start the car first!');
            return;
        }

        if (this.fuel <= 0) {
            console.log('Out of fuel!');
            return;
        }

        // Implementation to be added
    }

    // BUG: Parameter name inconsistent with usage
    refuel(liters) {
        this.fuel = Math.min(100, this.fuel + amount);
        console.log(`Refueled. Current fuel: ${this.fuel}%`);
    }
}

// ES6+ features practice with errors
const userPreferences = {
    theme: 'dark',
    language: 'en',
    notifications: true,
    privacy: {
        shareData: false,
        analytics: true
    }
};

// BUG: Incorrect destructuring syntax
const { theme, language, privacy: { shareData } } = userPreferences;

// BUG: Missing default parameter
const createNotification = (message, type, duration) => {
    const notification = {
        id: Math.random().toString(36),
        message,
        type,
        duration,
        timestamp: new Date()
    };

    // BUG: Missing return
    notification;
};

// Practice with template literals and spread operator
// BUG: Wrong template literal syntax
const formatMessage = (user, action) => {
    return `User ${user.name} performed action: ${action} at ${new Date()}`;
};

// BUG: Incorrect spread syntax in function parameters
const mergeObjects = (...objects) => {
    return objects.reduce((merged, obj) => ({ merged, ...obj }), {});
};

// Module pattern practice
// BUG: Wrong export syntax
export default {
    TaskManager,
    Vehicle,
    Car,
    fetchUserData,
    processUserData,
    createNotification,
    formatMessage,
    mergeObjects
};

/**
 * PRACTICE EXERCISES:
 *
 * 1. UNDO/REDO BASICS:
 *    - Fix the syntax errors one by one
 *    - After each fix, press 'u' to undo it
 *    - Press Ctrl-r to redo the fix
 *    - Repeat this process to build muscle memory
 *
 * 2. REPEAT COMMAND PRACTICE:
 *    - Find the three updateTask methods
 *    - Fix the first one by adding 'return task;'
 *    - Use '.' to repeat the same fix on the other two methods
 *
 * 3. ADVANCED UNDO OPERATIONS:
 *    - Make multiple changes to the TaskManager class
 *    - Use 'g-' and 'g+' to navigate through undo history
 *    - Try 'U' to undo all changes on a single line
 *
 * 4. COMPLEX EDITING SCENARIOS:
 *    - Fix the async function signatures (add async keyword)
 *    - Use '.' to repeat the change for similar functions
 *    - Practice undoing/redoing entire method implementations
 *
 * REMEMBER:
 * - Every change can be undone with 'u'
 * - Every undo can be redone with Ctrl-r
 * - The '.' command repeats your last change
 * - Don't be afraid to experiment - you can always undo!
 */