// Day 24: Marks Practice - ma, 'a, `a, :marks
// Practice setting marks (ma, mb, mc) and jumping to them ('a, `a)
// This file has distinct sections perfect for marking and navigation

/**
 * Interactive Code Tutorial System
 * Different sections marked for easy navigation using vim marks
 * Set marks at important locations and jump between them efficiently
 */

// MARK A: Configuration and Constants Section
// Set mark 'a' here with: ma
const TUTORIAL_CONFIG = {
    version: '2.1.0',
    author: 'JavaScript Tutorial Team',
    license: 'MIT',
    supportedLanguages: ['javascript', 'typescript', 'jsx', 'tsx'],
    maxStudents: 1000,
    sessionTimeout: 3600000, // 1 hour in milliseconds

    database: {
        host: 'localhost',
        port: 5432,
        name: 'tutorial_db',
        maxConnections: 100,
        connectionTimeout: 30000
    },

    redis: {
        host: 'localhost',
        port: 6379,
        maxRetries: 3,
        retryDelay: 1000
    },

    features: {
        interactiveCodeEditor: true,
        realTimeCollaboration: true,
        videoStreaming: true,
        chatSupport: true,
        progressTracking: true,
        certificateGeneration: true
    }
};

// MARK B: Data Models and Classes Section
// Set mark 'b' here with: mb
class Student {
    constructor(id, name, email, enrollmentDate = new Date()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.enrollmentDate = enrollmentDate;
        this.completedLessons = [];
        this.currentProgress = 0;
        this.achievements = [];
        this.studyStreak = 0;
        this.totalStudyTime = 0;
        this.preferredLanguage = 'javascript';
        this.skillLevel = 'beginner';
        this.isActive = true;
    }

    enrollInCourse(courseId) {
        if (!this.enrolledCourses) {
            this.enrolledCourses = [];
        }

        if (!this.enrolledCourses.includes(courseId)) {
            this.enrolledCourses.push(courseId);
            this.updateProgress();
        }
    }

    completeLesson(lessonId, timeSpent, score) {
        const completion = {
            lessonId,
            completedAt: new Date(),
            timeSpent,
            score,
            attempts: 1
        };

        this.completedLessons.push(completion);
        this.totalStudyTime += timeSpent;
        this.updateProgress();
        this.checkAchievements();
    }

    updateProgress() {
        // Calculate progress based on completed lessons
        const totalLessons = this.getTotalLessonsInEnrolledCourses();
        this.currentProgress = (this.completedLessons.length / totalLessons) * 100;
    }

    checkAchievements() {
        // Check for various achievements
        if (this.completedLessons.length >= 10 && !this.hasAchievement('first_10_lessons')) {
            this.addAchievement('first_10_lessons', 'Completed first 10 lessons');
        }

        if (this.studyStreak >= 7 && !this.hasAchievement('week_streak')) {
            this.addAchievement('week_streak', 'Studied for 7 consecutive days');
        }

        if (this.totalStudyTime >= 3600000 && !this.hasAchievement('dedicated_learner')) {
            this.addAchievement('dedicated_learner', 'Spent over 1000 hours studying');
        }
    }

    addAchievement(id, description) {
        this.achievements.push({
            id,
            description,
            earnedAt: new Date()
        });
    }

    hasAchievement(achievementId) {
        return this.achievements.some(achievement => achievement.id === achievementId);
    }

    getTotalLessonsInEnrolledCourses() {
        // Mock implementation - would query actual course data
        return this.enrolledCourses ? this.enrolledCourses.length * 20 : 0;
    }
}

// MARK C: Course Management Section
// Set mark 'c' here with: mc
class Course {
    constructor(id, title, description, instructor, difficulty = 'beginner') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.difficulty = difficulty;
        this.lessons = [];
        this.prerequisites = [];
        this.estimatedDuration = 0;
        this.enrollmentCount = 0;
        this.rating = 0;
        this.reviews = [];
        this.isPublished = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    addLesson(lesson) {
        lesson.courseId = this.id;
        lesson.order = this.lessons.length + 1;
        this.lessons.push(lesson);
        this.updateEstimatedDuration();
        this.updatedAt = new Date();
    }

    removeLesson(lessonId) {
        const initialLength = this.lessons.length;
        this.lessons = this.lessons.filter(lesson => lesson.id !== lessonId);

        if (this.lessons.length !== initialLength) {
            this.reorderLessons();
            this.updateEstimatedDuration();
            this.updatedAt = new Date();
        }
    }

    reorderLessons() {
        this.lessons.forEach((lesson, index) => {
            lesson.order = index + 1;
        });
    }

    updateEstimatedDuration() {
        this.estimatedDuration = this.lessons.reduce((total, lesson) => {
            return total + lesson.estimatedDuration;
        }, 0);
    }

    addReview(studentId, rating, comment) {
        const review = {
            studentId,
            rating,
            comment,
            createdAt: new Date()
        };

        this.reviews.push(review);
        this.updateRating();
    }

    updateRating() {
        if (this.reviews.length === 0) {
            this.rating = 0;
            return;
        }

        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
    }

    publish() {
        if (this.lessons.length === 0) {
            throw new Error('Cannot publish course without lessons');
        }

        this.isPublished = true;
        this.updatedAt = new Date();
    }

    unpublish() {
        this.isPublished = false;
        this.updatedAt = new Date();
    }
}

// MARK D: Lesson Management Section
// Set mark 'd' here with: md
class Lesson {
    constructor(id, title, content, type = 'reading') {
        this.id = id;
        this.title = title;
        this.content = content;
        this.type = type; // 'reading', 'video', 'exercise', 'quiz'
        this.order = 0;
        this.courseId = null;
        this.estimatedDuration = 0;
        this.objectives = [];
        this.resources = [];
        this.exercises = [];
        this.quiz = null;
        this.isPublished = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    addObjective(objective) {
        this.objectives.push({
            id: this.generateId(),
            description: objective,
            achieved: false
        });
        this.updatedAt = new Date();
    }

    addResource(title, url, type = 'link') {
        this.resources.push({
            id: this.generateId(),
            title,
            url,
            type,
            addedAt: new Date()
        });
        this.updatedAt = new Date();
    }

    addExercise(exercise) {
        exercise.id = this.generateId();
        exercise.createdAt = new Date();
        this.exercises.push(exercise);
        this.updatedAt = new Date();
    }

    setQuiz(quiz) {
        quiz.lessonId = this.id;
        quiz.createdAt = new Date();
        this.quiz = quiz;
        this.updatedAt = new Date();
    }

    updateContent(newContent) {
        this.content = newContent;
        this.updatedAt = new Date();
    }

    setEstimatedDuration(minutes) {
        this.estimatedDuration = minutes;
        this.updatedAt = new Date();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}

// MARK E: Interactive Exercises Section
// Set mark 'e' here with: me
class InteractiveExercise {
    constructor(id, title, description, difficulty = 'easy') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.exerciseType = 'coding'; // 'coding', 'multiple_choice', 'fill_blank'
        this.initialCode = '';
        this.solutionCode = '';
        this.testCases = [];
        this.hints = [];
        this.timeLimit = null;
        this.allowedAttempts = -1; // -1 for unlimited
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    setInitialCode(code) {
        this.initialCode = code;
        this.updatedAt = new Date();
    }

    setSolutionCode(code) {
        this.solutionCode = code;
        this.updatedAt = new Date();
    }

    addTestCase(input, expectedOutput, description = '') {
        this.testCases.push({
            id: this.generateId(),
            input,
            expectedOutput,
            description,
            createdAt: new Date()
        });
        this.updatedAt = new Date();
    }

    addHint(hintText, revealAfterAttempts = 1) {
        this.hints.push({
            id: this.generateId(),
            text: hintText,
            revealAfterAttempts,
            createdAt: new Date()
        });
        this.updatedAt = new Date();
    }

    validateSolution(submittedCode) {
        // Mock validation - in real implementation would run code against test cases
        const results = {
            passed: false,
            testResults: [],
            executionTime: 0,
            feedback: ''
        };

        this.testCases.forEach((testCase, index) => {
            const testResult = {
                testCaseId: testCase.id,
                passed: Math.random() > 0.3, // Mock result
                actualOutput: 'mock output',
                expectedOutput: testCase.expectedOutput,
                executionTime: Math.floor(Math.random() * 100)
            };

            results.testResults.push(testResult);
        });

        results.passed = results.testResults.every(result => result.passed);
        results.executionTime = results.testResults.reduce((total, result) => total + result.executionTime, 0);

        if (results.passed) {
            results.feedback = 'Excellent! All test cases passed.';
        } else {
            const failedCount = results.testResults.filter(result => !result.passed).length;
            results.feedback = `${failedCount} test case(s) failed. Please review your solution.`;
        }

        return results;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}

// MARK F: Progress Tracking Section
// Set mark 'f' here with: mf
class ProgressTracker {
    constructor(studentId) {
        this.studentId = studentId;
        this.sessions = [];
        this.milestones = [];
        this.weeklyGoals = [];
        this.statistics = {
            totalStudyTime: 0,
            lessonsCompleted: 0,
            exercisesCompleted: 0,
            quizzesCompleted: 0,
            averageScore: 0,
            currentStreak: 0,
            longestStreak: 0
        };
    }

    startSession() {
        const session = {
            id: this.generateId(),
            startTime: new Date(),
            endTime: null,
            activitiesCompleted: 0,
            timeSpent: 0,
            isActive: true
        };

        this.sessions.push(session);
        return session.id;
    }

    endSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session && session.isActive) {
            session.endTime = new Date();
            session.timeSpent = session.endTime - session.startTime;
            session.isActive = false;

            this.updateStatistics();
        }
    }

    recordActivity(sessionId, activityType, details = {}) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session && session.isActive) {
            session.activitiesCompleted++;

            if (!session.activities) {
                session.activities = [];
            }

            session.activities.push({
                type: activityType,
                timestamp: new Date(),
                details
            });
        }
    }

    addMilestone(title, description, targetDate) {
        const milestone = {
            id: this.generateId(),
            title,
            description,
            targetDate: new Date(targetDate),
            achieved: false,
            achievedDate: null,
            createdAt: new Date()
        };

        this.milestones.push(milestone);
        return milestone.id;
    }

    achieveMilestone(milestoneId) {
        const milestone = this.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            milestone.achieved = true;
            milestone.achievedDate = new Date();
        }
    }

    setWeeklyGoal(goal, targetValue) {
        const weekStart = this.getWeekStart();
        const weekEnd = this.getWeekEnd(weekStart);

        const weeklyGoal = {
            id: this.generateId(),
            goal,
            targetValue,
            currentValue: 0,
            weekStart,
            weekEnd,
            achieved: false,
            createdAt: new Date()
        };

        this.weeklyGoals.push(weeklyGoal);
        return weeklyGoal.id;
    }

    updateStatistics() {
        // Recalculate all statistics
        this.statistics.totalStudyTime = this.sessions
            .filter(s => !s.isActive)
            .reduce((total, s) => total + s.timeSpent, 0);

        // Update other statistics based on session activities
        this.updateStreaks();
        this.updateCompletionCounts();
        this.updateAverageScore();
    }

    updateStreaks() {
        // Calculate current and longest study streaks
        const today = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Sort sessions by date
        const sortedSessions = this.sessions
            .filter(s => !s.isActive)
            .sort((a, b) => b.startTime - a.startTime);

        // Implementation of streak calculation would go here
        this.statistics.currentStreak = currentStreak;
        this.statistics.longestStreak = Math.max(longestStreak, this.statistics.longestStreak);
    }

    updateCompletionCounts() {
        let lessonsCompleted = 0;
        let exercisesCompleted = 0;
        let quizzesCompleted = 0;

        this.sessions.forEach(session => {
            if (session.activities) {
                session.activities.forEach(activity => {
                    switch (activity.type) {
                        case 'lesson_completed':
                            lessonsCompleted++;
                            break;
                        case 'exercise_completed':
                            exercisesCompleted++;
                            break;
                        case 'quiz_completed':
                            quizzesCompleted++;
                            break;
                    }
                });
            }
        });

        this.statistics.lessonsCompleted = lessonsCompleted;
        this.statistics.exercisesCompleted = exercisesCompleted;
        this.statistics.quizzesCompleted = quizzesCompleted;
    }

    updateAverageScore() {
        const allScores = [];

        this.sessions.forEach(session => {
            if (session.activities) {
                session.activities.forEach(activity => {
                    if (activity.details && activity.details.score) {
                        allScores.push(activity.details.score);
                    }
                });
            }
        });

        if (allScores.length > 0) {
            this.statistics.averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
        }
    }

    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day;
        return new Date(now.setDate(diff));
    }

    getWeekEnd(weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return weekEnd;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}

// MARK G: API Integration Section
// Set mark 'g' here with: mg
class TutorialAPI {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };
    }

    async getAllCourses(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`${this.baseUrl}/courses?${queryParams}`, {
            headers: this.defaultHeaders
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }

        return await response.json();
    }

    async getCourseById(courseId) {
        const response = await fetch(`${this.baseUrl}/courses/${courseId}`, {
            headers: this.defaultHeaders
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch course: ${response.statusText}`);
        }

        return await response.json();
    }

    async enrollStudent(studentId, courseId) {
        const response = await fetch(`${this.baseUrl}/enrollments`, {
            method: 'POST',
            headers: this.defaultHeaders,
            body: JSON.stringify({
                studentId,
                courseId,
                enrollmentDate: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to enroll student: ${response.statusText}`);
        }

        return await response.json();
    }

    async submitExercise(studentId, exerciseId, solution) {
        const response = await fetch(`${this.baseUrl}/exercises/${exerciseId}/submit`, {
            method: 'POST',
            headers: this.defaultHeaders,
            body: JSON.stringify({
                studentId,
                solution,
                submittedAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to submit exercise: ${response.statusText}`);
        }

        return await response.json();
    }

    async getStudentProgress(studentId) {
        const response = await fetch(`${this.baseUrl}/students/${studentId}/progress`, {
            headers: this.defaultHeaders
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch student progress: ${response.statusText}`);
        }

        return await response.json();
    }

    async updateStudentProfile(studentId, profileData) {
        const response = await fetch(`${this.baseUrl}/students/${studentId}`, {
            method: 'PUT',
            headers: this.defaultHeaders,
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update student profile: ${response.statusText}`);
        }

        return await response.json();
    }
}

// MARK H: Main Application Export Section
// Set mark 'h' here with: mh
export {
    TUTORIAL_CONFIG,
    Student,
    Course,
    Lesson,
    InteractiveExercise,
    ProgressTracker,
    TutorialAPI
};