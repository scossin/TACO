"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MariaDB;
(function (MariaDB) {
    var Config = /** @class */ (function () {
        function Config() {
        }
        Config.HOST = "127.0.0.1";
        Config.PORT = "3307";
        Config.USER = "hemovigilants";
        Config.PASSWORD = "hemovigilantspwd";
        Config.TIMEZONE = "utc";
        Config.DATABASE = "TACO";
        return Config;
    }());
    MariaDB.Config = Config;
})(MariaDB = exports.MariaDB || (exports.MariaDB = {}));
