"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MariaDB;
(function (MariaDB) {
    var Config = /** @class */ (function () {
        function Config() {
        }
        Config.HOST = "127.0.0.1";
        Config.PORT = "3306";
        Config.USER = "user";
        Config.PASSWORD = "password";
        Config.TIMEZONE = "utc";
        Config.DATABASE = "database";
        Config.ID_TASK_VERSION = 1;
        return Config;
    }());
    MariaDB.Config = Config;
})(MariaDB = exports.MariaDB || (exports.MariaDB = {}));
