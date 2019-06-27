const mysql = require('mysql');

export class MariaUserAuth {
	constructor() {
		this.createUserTableIfNotExists();
	}

	createUserTableIfNotExists() {
		mysql.connection.query("CREATE TABLE IF NOT EXISTS `UsersAuth` (email VARCHAR(255) PRIMARY KEY,pw TEXT,username TEXT,organisme text);");
	}
	
	// find a user in the usersAuth by the email
	findOne(email:string) {
		return new Promise(function (resolve, reject) {
			mysql.connection.query(`select a.email, a.username, a.pw
			from UsersAuth a 
			where a.email='${email}'
			`, function (error:Error, result:Array<any>, fields:any) {
				if (error) {
					console.log("error " + error);
					reject(error);
				} else {
					if (result.length == 0) {
						console.log("no email " + email + " found");
						resolve(undefined);
					} else {
						var user = result[0];
						//console.log(user);
						resolve(user);
					}
				}
			});
		})
	}

	// findById user the email as the Id (primary key in the table)
	findById(email:string, callback: { (arg0: any, arg1: {}): void; (arg0: any, arg1: any): void; }) {
		this.findOne(email)
			.then((user) => callback(null, user))
			.catch((err) => callback(err, null));
	}

	// register a user:
	registerUser(username:string, hash:string, email:string) {
		return new Promise(function (resolve, reject) {
			// check email already exists:
			mysql.connection.query("select * from UsersAuth where email=?", [email], function (error:Error, results:any, fields:any) {
				if (error) {
					reject(error);
				}
				if (results.length != 0) {
					var error = new Error('email already exists!');
					reject(error);
				}
				// add the email :
				mysql.connection.query("insert into UsersAuth set ?", { 'username': username, 'pw': hash, 'email': email }, function (error:Error, results:any, fields:any) {
					if (error) {
						reject(error);
					}
					resolve(email);
				});
			});
		});
	}
}

exports =  {
   mariaUserAuth: MariaUserAuth
}