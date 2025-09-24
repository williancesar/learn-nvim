// Router configuration
// Practice jumping between this and main.js

const express = require('express');

class Router {
    constructor(app) {
        this.app = app;
        this.routes = [];
    }

    setupRoutes() {
        // API routes - navigate here from main.js
        this.app.get('/api/users', this.getUsers);
        this.app.post('/api/users', this.createUser);
        this.app.put('/api/users/:id', this.updateUser);
        this.app.delete('/api/users/:id', this.deleteUser);

        // Page routes - check these against config.json
        this.app.get('/', this.homePage);
        this.app.get('/about', this.aboutPage);
        this.app.get('/contact', this.contactPage);

        // Error handling - reference error.js
        this.app.use(this.errorHandler);
    }

    getUsers(req, res) {
        // TODO: Implement user fetching
        // See db.js for database queries
        res.json({ users: [] });
    }

    createUser(req, res) {
        // TODO: Implement user creation
        // Validate against models/user.js
        res.status(201).json({ created: true });
    }

    updateUser(req, res) {
        // TODO: Implement user update
        const { id } = req.params;
        res.json({ updated: id });
    }

    deleteUser(req, res) {
        // TODO: Implement user deletion
        const { id } = req.params;
        res.json({ deleted: id });
    }

    homePage(req, res) {
        // Render home view
        res.render('home');
    }

    aboutPage(req, res) {
        // Render about view
        res.render('about');
    }

    contactPage(req, res) {
        // Render contact view
        res.render('contact');
    }

    errorHandler(err, req, res, next) {
        // Handle errors - see error.js for details
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Router;