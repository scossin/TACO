"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var tomcat2_1 = require("../config/tomcat2");
var path = require('path');
var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('../config/auth2').ensureAuthenticated;
// when user resquests /testDetection
router.get('/', ensureAuthenticated, function (req, res) {
    res.render('testDetection/testDetection.ejs', {
        layout: 'npatlayout.ejs'
    });
});
router.get('/test', ensureAuthenticated, function (req, res) {
    var txt = req.query.qs.txt;
    var parameters = {
        url: tomcat2_1.tomcat.Config.getTestDetectionAPI(),
        qs: {
            txt: txt
        }
    };
    request(parameters, function (err, response, body) {
        if (err) {
            res.end();
        }
        if (response && response.statusCode === 200) {
            //res.sendStatus(200);
            var sentenceDetection = JSON.parse(body);
            console.log(sentenceDetection);
            res.json(sentenceDetection);
        }
        else {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            var error = new Error(body.toString());
            console.log(error);
            res.sendStatus(500);
            res.end();
        }
    });
});
module.exports = router;
