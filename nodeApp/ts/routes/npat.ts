var path = require('path');

import {User, MyReq} from './Request';
import {MyRes} from './Response';
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth2');
const { RetrieveSignals } = require('../lib/RetrieveSignals');
import {ResultsSignaux} from "../../front/shared/Signaux";
let retrieveSignals = new RetrieveSignals();

// when user resquests /taco
router.get('/', ensureAuthenticated, (req: MyReq, res: MyRes) => {
	res.render('npat', {
		layout: 'npatlayout.ejs'
	})
});

router.get('/getPatient', ensureAuthenticated, (req: MyReq, res: MyRes) => {
	let npat:string = req.query.qs.npat;
	console.log("npat:" + npat);
	var promise1 = retrieveSignals.getPatient(npat);
	promise1
	.then((results:Array<ResultsSignaux>)=>{
		console.log("retrieved patient successfully");
		res.send(results);
	})
	.catch((error:Error)=> {
		console.log(error);
		res.status(500);
		res.end();
	})
});

module.exports = router;
