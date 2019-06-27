import Express = require('express');
import {UpdateStatus} from "../../front/shared/UpdateStatus"

export interface User {
	username:string;
	email:string;
	pw: string;
} 


export interface MyReq extends Express.Request{
	user:User;
	query:any;
	isAuthenticated:any;
	flash:any;
	updateStatus: UpdateStatus;
} 

