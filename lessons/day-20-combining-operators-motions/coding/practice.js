// Day 20: Combining Operators and Motions Practice
// Practice combining operators (d, c, y) with motions (w, e, b, f, t, etc.)
// Examples: dw, d2w, c3e, yt;, df), y$, etc.

/**
 * Task Management and Productivity System
 * Practice file designed for operator+motion combinations
 * Focus on efficient editing using combined commands
 */

// Task status enumeration and priority levels
const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    ON_HOLD: 'on_hold'
};

const PRIORITY_LEVELS = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4,
    CRITICAL: 5
};

const CATEGORY_TYPES = {
    WORK: 'work',
    PERSONAL: 'personal',
    SHOPPING: 'shopping',
    HEALTH: 'health',
    LEARNING: 'learning',
    FINANCE: 'finance'
};

// Task data structure with comprehensive fields
class Task {
    constructor(title, description = '', category = CATEGORY_TYPES.WORK) {
        this.id = generateUniqueId();
        this.title = title;
        this.description = description;
        this.category = category;
        this.status = TASK_STATUS.PENDING;
        this.priority = PRIORITY_LEVELS.MEDIUM;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.dueDate = null;
        this.completedAt = null;
        this.tags = [];
        this.subtasks = [];
        this.attachments = [];
        this.comments = [];
        this.estimatedTime = null;
        this.actualTime = null;
        this.assignedTo = null;
        this.dependencies = [];
    }

    updateStatus(newStatus) {
        this.status = newStatus;
        this.updatedAt = new Date();

        if (newStatus === TASK_STATUS.COMPLETED) {
            this.completedAt = new Date();
        }
    }

    setPriority(priority) {
        this.priority = priority;
        this.updatedAt = new Date();
    }

    setDueDate(dueDate) {
        this.dueDate = new Date(dueDate);
        this.updatedAt = new Date();
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.updatedAt = new Date();
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.updatedAt = new Date();
    }

    addSubtask(subtaskTitle, subtaskDescription = '') {
        const subtask = {
            id: generateUniqueId(),
            title: subtaskTitle,
            description: subtaskDescription,
            completed: false,
            createdAt: new Date()
        };
        this.subtasks.push(subtask);
        this.updatedAt = new Date();
        return subtask;
    }

    completeSubtask(subtaskId) {
        const subtask = this.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            subtask.completed = true;
            subtask.completedAt = new Date();
            this.updatedAt = new Date();
        }
    }

    addComment(author, content) {
        const comment = {
            id: generateUniqueId(),
            author: author,
            content: content,
            createdAt: new Date()
        };
        this.comments.push(comment);
        this.updatedAt = new Date();
        return comment;
    }

    getCompletionPercentage() {
        if (this.subtasks.length === 0) {
            return this.status === TASK_STATUS.COMPLETED ? 100 : 0;
        }

        const completedSubtasks = this.subtasks.filter(st => st.completed).length;
        return Math.round((completedSubtasks / this.subtasks.length) * 100);
    }

    isOverdue() {
        if (!this.dueDate || this.status === TASK_STATUS.COMPLETED) {
            return false;
        }
        return new Date() > this.dueDate;
    }

    getDaysUntilDue() {
        if (!this.dueDate) return null;
        const today = new Date();
        const diffTime = this.dueDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

// Task manager class for handling collections of tasks
class TaskManager {
    constructor() {
        this.tasks = new Map();
        this.projects = new Map();
        this.users = new Map();
        this.settings = {
            defaultCategory: CATEGORY_TYPES.WORK,
            defaultPriority: PRIORITY_LEVELS.MEDIUM,
            autoArchiveCompleted: true,
            reminderSettings: {
                enabled: true,
                reminderDays: [1, 3, 7],
                reminderTime: '09:00'
            }
        };
    }

    createTask(title, description, category, priority = PRIORITY_LEVELS.MEDIUM) {
        const task = new Task(title, description, category);
        task.setPriority(priority);
        this.tasks.set(task.id, task);
        return task;
    }

    updateTask(taskId, updates) {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        Object.keys(updates).forEach(key => {
            if (key in task && key !== 'id' && key !== 'createdAt') {
                task[key] = updates[key];
            }
        });

        task.updatedAt = new Date();
        return task;
    }

    deleteTask(taskId) {
        const deleted = this.tasks.delete(taskId);
        if (!deleted) {
            throw new Error(`Task with ID ${taskId} not found`);
        }
        return deleted;
    }

    getTasksByStatus(status) {
        return Array.from(this.tasks.values()).filter(task => task.status === status);
    }

    getTasksByPriority(priority) {
        return Array.from(this.tasks.values()).filter(task => task.priority === priority);
    }

    getTasksByCategory(category) {
        return Array.from(this.tasks.values()).filter(task => task.category === category);
    }

    getTasksDueSoon(days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + days);

        return Array.from(this.tasks.values()).filter(task => {
            return task.dueDate &&
                   task.dueDate <= cutoffDate &&
                   task.status !== TASK_STATUS.COMPLETED;
        });
    }

    getOverdueTasks() {
        return Array.from(this.tasks.values()).filter(task => task.isOverdue());
    }

    searchTasks(query) {
        const lowercaseQuery = query.toLowerCase();
        return Array.from(this.tasks.values()).filter(task => {
            return task.title.toLowerCase().includes(lowercaseQuery) ||
                   task.description.toLowerCase().includes(lowercaseQuery) ||
                   task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));
        });
    }

    getTaskStatistics() {
        const tasks = Array.from(this.tasks.values());
        const stats = {
            total: tasks.length,
            byStatus: {},
            byPriority: {},
            byCategory: {},
            overdue: 0,
            completedThisWeek: 0,
            averageCompletionTime: 0
        };

        // Initialize counters
        Object.values(TASK_STATUS).forEach(status => {
            stats.byStatus[status] = 0;
        });

        Object.values(PRIORITY_LEVELS).forEach(priority => {
            stats.byPriority[priority] = 0;
        });

        Object.values(CATEGORY_TYPES).forEach(category => {
            stats.byCategory[category] = 0;
        });

        // Calculate statistics
        let totalCompletionTime = 0;
        let completedTasksWithTime = 0;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        tasks.forEach(task => {
            stats.byStatus[task.status]++;
            stats.byPriority[task.priority]++;
            stats.byCategory[task.category]++;

            if (task.isOverdue()) {
                stats.overdue++;
            }

            if (task.status === TASK_STATUS.COMPLETED && task.completedAt > oneWeekAgo) {
                stats.completedThisWeek++;
            }

            if (task.status === TASK_STATUS.COMPLETED && task.actualTime) {
                totalCompletionTime += task.actualTime;
                completedTasksWithTime++;
            }
        });

        if (completedTasksWithTime > 0) {
            stats.averageCompletionTime = totalCompletionTime / completedTasksWithTime;
        }

        return stats;
    }

    exportTasks(format = 'json') {
        const tasks = Array.from(this.tasks.values());

        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(tasks, null, 2);

            case 'csv':
                return this.exportToCSV(tasks);

            case 'markdown':
                return this.exportToMarkdown(tasks);

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    exportToCSV(tasks) {
        const headers = [
            'ID', 'Title', 'Description', 'Status', 'Priority',
            'Category', 'Due Date', 'Created At', 'Completed At', 'Tags'
        ];

        const rows = tasks.map(task => [
            task.id,
            `"${task.title.replace(/"/g, '""')}"`,
            `"${task.description.replace(/"/g, '""')}"`,
            task.status,
            task.priority,
            task.category,
            task.dueDate ? task.dueDate.toISOString() : '',
            task.createdAt.toISOString(),
            task.completedAt ? task.completedAt.toISOString() : '',
            `"${task.tags.join(', ')}"`
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    exportToMarkdown(tasks) {
        let markdown = '# Task Export\n\n';

        const tasksByCategory = {};
        tasks.forEach(task => {
            if (!tasksByCategory[task.category]) {
                tasksByCategory[task.category] = [];
            }
            tasksByCategory[task.category].push(task);
        });

        Object.keys(tasksByCategory).forEach(category => {
            markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;

            tasksByCategory[category].forEach(task => {
                const checkbox = task.status === TASK_STATUS.COMPLETED ? '[x]' : '[ ]';
                const priority = '★'.repeat(task.priority);
                const dueDate = task.dueDate ? ` (Due: ${task.dueDate.toLocaleDateString()})` : '';
                const tags = task.tags.length > 0 ? ` #${task.tags.join(' #')}` : '';

                markdown += `- ${checkbox} **${task.title}** ${priority}${dueDate}${tags}\n`;

                if (task.description) {
                    markdown += `  ${task.description}\n`;
                }

                if (task.subtasks.length > 0) {
                    task.subtasks.forEach(subtask => {
                        const subCheckbox = subtask.completed ? '[x]' : '[ ]';
                        markdown += `  - ${subCheckbox} ${subtask.title}\n`;
                    });
                }

                markdown += '\n';
            });
        });

        return markdown;
    }

    importTasks(data, format = 'json') {
        let importedTasks = [];

        switch (format.toLowerCase()) {
            case 'json':
                importedTasks = JSON.parse(data);
                break;

            case 'csv':
                importedTasks = this.parseCSVTasks(data);
                break;

            default:
                throw new Error(`Unsupported import format: ${format}`);
        }

        importedTasks.forEach(taskData => {
            const task = new Task(taskData.title, taskData.description, taskData.category);

            // Restore properties
            Object.keys(taskData).forEach(key => {
                if (key in task && key !== 'id') {
                    if (key.includes('At') || key.includes('Date')) {
                        task[key] = taskData[key] ? new Date(taskData[key]) : null;
                    } else {
                        task[key] = taskData[key];
                    }
                }
            });

            this.tasks.set(task.id, task);
        });

        return importedTasks.length;
    }
}

// Utility functions for task management
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

function calculateBusinessDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

function getRelativeTimeString(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return `${Math.floor(diffDays / 365)} years ago`;
}

// Export all classes and utilities
export {
    TASK_STATUS,
    PRIORITY_LEVELS,
    CATEGORY_TYPES,
    Task,
    TaskManager,
    generateUniqueId,
    formatDuration,
    calculateBusinessDays,
    getRelativeTimeString
};