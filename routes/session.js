const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const User = require("../models/User");
var authenticate = require("../middlewares/authenticate");

const routes = express.Router();

routes.post('/login', (req, res) => {
    let {email, password} = req.body;

    User.findByCredentials(email, password).then((user) => {
        user.generateAuthToken().then((user) => {
            res.writeHead(200, { 'Content-Type': 'application-json' });
            res.end(JSON.stringify({user: user}));
        });
    }).catch((e) => {
        res.status(400).send({
            errors: {
                message: "Invalid credentials"
            }
        });
    });
});

routes.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

module.exports = routes;
