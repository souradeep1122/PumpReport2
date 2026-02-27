require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// --- Database Connection (Fixed to prevent multiple connection attempts) ---
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pumpsense')
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.error("MongoDB Connection Error:", err));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Passport & Session Setup (CRITICAL ORDER) ---

// 1. Session must come before Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'pumpsense_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// 2. Initialize Flash for error messages
app.use(flash());

// 3. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Global variables for views (Optional)
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// --- Routes ---
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;