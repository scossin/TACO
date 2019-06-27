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
    res.render('taco', {
        layout: 'layouttaco.ejs'
    });
});
router.get('/getSignauxtoValidate', ensureAuthenticated, function (req, res) {
    var parameters = req.query.qs;
    var promise1 = retrieveSignals.getSignals(parameters);
    promise1
        .then(function (results) {
        console.log("retrieved signaux successfully");
        res.send(results);
    })
        .catch(function (error) {
        console.log(error);
        res.status(500);
        res.end();
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
router.get("/updateStatus", ensureAuthenticated, function (req, res) {
    var updateStatus = req.query.updateStatus;
    var idSignal = updateStatus.idSignal, validation = updateStatus.validation;
    retrieveSignals.updateStatus(idSignal, validation)
        .then(function () {
        console.log("updated status successfully");
        res.send("ok");
    })
        .catch(function (error) {
        console.log(error);
        res.status(500);
        res.end();
    });
});
router.get("/getStatus", ensureAuthenticated, function (req, res) {
    var updateStatus = req.query.updateStatus;
    var idSignal = updateStatus.idSignal;
    retrieveSignals.getStatus(idSignal)
        .then(function (updateStatus) {
        console.log("retrieve status successul");
        res.send(updateStatus);
    })
        .catch(function (error) {
        console.log(error);
        res.status(500);
        res.end();
    });
});
module.exports = router;
