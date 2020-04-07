const express = require('express');
const { ensureAuthenticated } = require('../config/auth');

const routes = express.Router();

routes.get('/', (req, res) => {
    res.render('welcome')
})

routes.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { name: req.user.name })
});

module.exports = routes;
