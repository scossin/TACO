"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require('mysql');
var RetrieveSignals = /** @class */ (function () {
    function RetrieveSignals() {
    }
    RetrieveSignals.prototype.getSignals = function (parameters) {
        var from = parameters.from, to = parameters.to, validation = parameters.validation;
        return new Promise(function (resolve, reject) {
            var query = "select id, txt, npat, nsej, date, loc, validation\n\t\t\tfrom signaux where validation = " + validation + " \n\t\t\tand date>='" + from + "'\n\t\t\tand date<='" + to + "'";
            console.log(query);
            mysql.connection.query(query, function (error, result) {
                if (error) {
                    console.log("error " + error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    RetrieveSignals.prototype.getPatient = function (npat) {
        return new Promise(function (resolve, reject) {
            var query = "select id, txt, npat, nsej, date, loc, validation\n\t\t\tfrom signaux where npat = " + npat;
            console.log(query);
            mysql.connection.query(query, function (error, result) {
                if (error) {
                    console.log("error " + error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    RetrieveSignals.prototype.updateStatus = function (idSignal, validation) {
        return new Promise(function (resolve, reject) {
            var query = "update signaux set validation=" + validation + " where id=" + idSignal;
            mysql.connection.query(query, function (error, result) {
                if (error) {
                    console.log("error " + error);
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    };
    RetrieveSignals.prototype.getStatus = function (idSignal) {
        return new Promise(function (resolve, reject) {
            var query = "select id, validation from signaux where id=" + idSignal;
            mysql.connection.query(query, function (error, result) {
                if (error) {
                    console.log("error " + error);
                    reject(error);
                }
                else {
                    var updateStatus = {
                        idSignal: idSignal,
                        validation: result[0].validation
                    };
                    resolve(updateStatus);
                }
            });
        });
    };
    return RetrieveSignals;
}());
exports.RetrieveSignals = RetrieveSignals;
exports.RetrieveSignals = RetrieveSignals;
