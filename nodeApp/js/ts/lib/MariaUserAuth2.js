"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require('mysql');
var MariaUserAuth = /** @class */ (function () {
    function MariaUserAuth() {
        this.createUserTableIfNotExists();
    }
    MariaUserAuth.prototype.createUserTableIfNotExists = function () {
        mysql.connection.query("CREATE TABLE IF NOT EXISTS `UsersAuth` (email VARCHAR(255) PRIMARY KEY,pw TEXT,username TEXT,organisme text);");
    };
    // find a user in the usersAuth by the email
    MariaUserAuth.prototype.findOne = function (email) {
        return new Promise(function (resolve, reject) {
            mysql.connection.query("select a.email, a.username, a.pw\n\t\t\tfrom UsersAuth a \n\t\t\twhere a.email='" + email + "'\n\t\t\t", function (error, result, fields) {
                if (error) {
                    console.log("error " + error);
                    reject(error);
                }
                else {
                    if (result.length == 0) {
                        console.log("no email " + email + " found");
                        resolve(undefined);
                    }
                    else {
                        var user = result[0];
                        //console.log(user);
                        resolve(user);
                    }
                }
            });
        });
    };
    // findById user the email as the Id (primary key in the table)
    MariaUserAuth.prototype.findById = function (email, callback) {
        this.findOne(email)
            .then(function (user) { return callback(null, user); })
            .catch(function (err) { return callback(err, null); });
    };
    // register a user:
    MariaUserAuth.prototype.registerUser = function (username, hash, email) {
        return new Promise(function (resolve, reject) {
            // check email already exists:
            mysql.connection.query("select * from UsersAuth where email=?", [email], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                if (results.length != 0) {
                    var error = new Error('email already exists!');
                    reject(error);
                }
                // add the email :
                mysql.connection.query("insert into UsersAuth set ?", { 'username': username, 'pw': hash, 'email': email }, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    }
                    resolve(email);
                });
            });
        });
    };
    return MariaUserAuth;
}());
exports.MariaUserAuth = MariaUserAuth;
exports = {
    mariaUserAuth: MariaUserAuth
};
