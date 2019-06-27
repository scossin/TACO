"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var MariaUserAuth2_1 = require("../lib/MariaUserAuth2");
var userAuth = new MariaUserAuth2_1.MariaUserAuth();
// Login Page
router.get('/login', function (req, res) { return res.render('login'); });
// Register Page
router.get('/register', function (req, res) { return res.render('register'); });
// Register Handle (private url)
router.post('/register', function (req, res) {
    var _a = req.body, name = _a.name, email = _a.email, password = _a.password, password2 = _a.password2;
    var errors = [];
    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    // 
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        });
    }
    else {
        // Validation passed
        userAuth.findOne(email)
            .then(function (user) {
            // email exists
            errors.push({ msg: 'Email is already registered' });
            if (user) {
                res.render('register', {
                    errors: errors,
                    name: name,
                    email: email,
                    password: password,
                    password2: password2
                });
            }
            else { // email doesn't exist
                var newUser_1 = {
                    name: name,
                    email: email,
                    password: password
                };
                // Hash Password
                bcrypt.genSalt(10, function (err, salt) {
                    return bcrypt.hash(newUser_1.password, salt, function (err, hash) {
                        if (err)
                            throw err;
                        // Set password to hashed
                        newUser_1.password = hash;
                        // Save user:
                        userAuth.registerUser(newUser_1.name, hash, newUser_1.email)
                            .then(function (user) {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                            .catch(function (err) { return console.log(err); });
                    });
                });
            }
        })
            .catch(function (err) { return console.log(err); });
    }
});
// Login Handle 
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/taco',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
// Logout Handle
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;
