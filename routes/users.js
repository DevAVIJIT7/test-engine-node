const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const routes = express.Router();
const User = require('../models/User');

routes.get('/', (req, res) => {
    res.json({
        users: []
    })
});

routes.get('/login', (req, res) => {
    res.render('login')
})

routes.get('/register', (req, res) => {
    res.render('register')
})

routes.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    if(password !== password2) {
        errors.push({ msg: 'Password do not match'});
    }

    if(password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 characters'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email: email })
            .then(user => {
                errors.push({ msg: 'Email already exists'})
                if(user) {
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;

                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                        });
                    });
                }
            })
    }
})

// Login Handle
routes.post('/login', (req, res, next) => {
    passport.authenticate('local', { 
        failureRedirect: '/users/login',
        successRedirect: '/dashboard',
        failureFlash: true
    })(req, res, next)
});

// Logout Handle
routes.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login');
})
module.exports = routes;
