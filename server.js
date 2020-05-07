const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const colors = require('colors');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

var authenticate = require("./middlewares/authenticate");

// DB config
const connectDB = require('./config/db');
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

// Enable cors
app.use(cors())

require('./config/passport')(passport);

// Set EJS layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
app.use(expressLayouts);

// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Use api's
app.use('/api/v1/session', require('./routes/session'));
app.use('/api/v1/tests', authenticate, require('./routes/tests'));
app.use('/api/v1/users', authenticate, require('./routes/users'));
// Use application routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
