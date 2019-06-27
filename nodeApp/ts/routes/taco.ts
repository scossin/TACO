
var path = require('path');

import {User, MyReq} from './Request';
import {MyRes} from './Response';
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth2');
const { RetrieveSignals } = require('../lib/RetrieveSignals');
import {ResultsSignaux} from "../../front/shared/Signaux";
import { UpdateStatus } from '../../front/shared/UpdateStatus';
import {Parameters}  from "../../front/shared/Parameters"

let retrieveSignals = new RetrieveSignals();

// when user resquests /taco
router.get('/', ensureAuthenticated, (req: MyReq, res: MyRes) => {
	res.render('taco', {
		layout: 'layouttaco.ejs'
	})
});

router.get('/getSignauxtoValidate', ensureAuthenticated, (req: MyReq, res: MyRes) => {
	var parameters:Parameters = req.query.qs;
	var promise1 = retrieveSignals.getSignals(parameters);
	promise1
	.then((results:Array<ResultsSignaux>)=>{
		console.log("retrieved signaux successfully");
		res.send(results);
	})
	.catch((error:Error)=> {
		console.log(error);
		res.status(500);
		res.end();
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

router.get("/updateStatus", ensureAuthenticated, (req: MyReq, res: MyRes) => {
	let updateStatus = req.query.updateStatus;
	let {idSignal, validation} = updateStatus;
	retrieveSignals.updateStatus(idSignal, validation)
	.then(() => {
		console.log("updated status successfully");
		res.send("ok");
	})
	.catch((error:Error) => {
		console.log(error);
		res.status(500);
		res.end();
	})
});

router.get("/getStatus", ensureAuthenticated, (req: MyReq, res: MyRes) => {
	let updateStatus = req.query.updateStatus;
	let {idSignal} = updateStatus;
	retrieveSignals.getStatus(idSignal)
	.then((updateStatus:UpdateStatus) => {
		console.log("retrieve status successul")
		res.send(updateStatus);
	})
	.catch((error:Error) => {
		console.log(error);
		res.status(500);
		res.end();
	})
});

module.exports = router;
