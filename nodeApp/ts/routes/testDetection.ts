
var request = require('request');
import { tomcat } from '../config/tomcat2';

var path = require('path');

import { User, MyReq } from './Request';
import { MyRes } from './Response';
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth2');
import { SentenceDetection } from "../../front/shared/ResultDetection";

// when user resquests /testDetection
router.get('/', ensureAuthenticated, (req: MyReq, res: MyRes) => {
	res.render('testDetection/testDetection.ejs', {
		layout: 'npatlayout.ejs'
	})
});

router.get('/test', ensureAuthenticated, (req: MyReq, res: MyRes) => {
	let txt: string = req.query.qs.txt;
	let parameters = {
		url: tomcat.Config.getTestDetectionAPI(),
		qs: {
			txt: txt
		}
	}
	request(parameters, function (err: Error, response: any, body: string ) {
		if (err) {
			res.end();
		}
		if (response && response.statusCode === 200) {
			//res.sendStatus(200);
			let sentenceDetection: Array<SentenceDetection> = JSON.parse(body);
			console.log(sentenceDetection);
			res.json(sentenceDetection);
		} else {
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			var error = new Error(body.toString());
			console.log(error);
			res.sendStatus(500);
			res.end();
		}
	})
});


module.exports = router;
