const mysql = require('mysql');
import {Parameters}  from "../../front/shared/Parameters"

import {ResultsSignaux} from "../../front/shared/Signaux";
import { UpdateStatus } from "../../front/shared/UpdateStatus";

export class RetrieveSignals {
	constructor() {
		
    }

    public getSignals(parameters:Parameters): Promise<Array<ResultsSignaux>>{
		let  {from, to, validation} = parameters; 
		return new Promise(function (resolve, reject) {
            let query:string = `select id, txt, npat, nsej, date, loc, validation
			from signaux where validation = ${validation} 
			and date>='${from}'
			and date<='${to}'`;
			console.log(query);
			mysql.connection.query(query, function (error:Error, result:Array<ResultsSignaux>) {
				if (error) {
					console.log("error " + error);
					reject(error);
				} else {
                    resolve(result);
				}
			});
		})
	}
	
	public getPatient(npat:string): Promise<Array<ResultsSignaux>>{
		return new Promise(function (resolve, reject) {
            let query:string = `select id, txt, npat, nsej, date, loc, validation
			from signaux where npat = ${npat}` 
			console.log(query);
			mysql.connection.query(query, function (error:Error, result:Array<ResultsSignaux>) {
				if (error) {
					console.log("error " + error);
					reject(error);
				} else {
                    resolve(result);
				}
			});
		})
    }

    public updateStatus(idSignal: number, validation: number): Promise<void>{
        return new Promise(function (resolve, reject) {
            let query:string = `update signaux set validation=${validation} where id=${idSignal}`;
			mysql.connection.query(query, function (error:Error, result:any) {
				if (error) {
					console.log("error " + error);
					reject(error);
				} else {
                    resolve();
				}
			});
		})
    }

    public getStatus(idSignal: number): Promise<UpdateStatus>{
        return new Promise(function (resolve, reject) {
            let query:string = `select id, validation from signaux where id=${idSignal}`;
			mysql.connection.query(query, function (error:Error, result:Array<UpdateStatus>) {
				if (error) {
					console.log("error " + error);
					reject(error);
				} else {
                    let updateStatus:UpdateStatus = {
                        idSignal: idSignal,
                        validation: result[0].validation
                    }
                    resolve(updateStatus);
				}
			});
		})
    }
}

exports.RetrieveSignals = RetrieveSignals;
