"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('../config/auth2').ensureAuthenticated;
var RetrieveSignals = require('../lib/RetrieveSignals').RetrieveSignals;
var retrieveSignals = new RetrieveSignals();
// when user resquests /taco
router.get('/', ensureAuthenticated, function (req, res) {
    res.render('npat', {
        layout: 'npatlayout.ejs'
    });
});
router.get('/getPatient', ensureAuthenticated, function (req, res) {
    var npat = req.query.qs.npat;
    console.log("npat:" + npat);
    var promise1 = retrieveSignals.getPatient(npat);
    promise1
        .then(function (results) {
        console.log("retrieved patient successfully");
        res.send(results);
    })
        .catch(function (error) {
        console.log(error);
        res.status(500);
        res.end();
    });
});
module.exports = router;
