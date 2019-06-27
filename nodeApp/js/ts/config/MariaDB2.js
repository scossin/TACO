"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MariaDB;
(function (MariaDB) {
    var Config = /** @class */ (function () {
        function Config() {
        }
        Config.HOST = process.env.MARIADB_NAME || "localhost";
        Config.PORT = process.env.MARIADB_PORT || "3307";
        Config.USER = process.env.USER_MARIADB || "hemovigilants";
        Config.PASSWORD = process.env.USERPWD_MARIADB || "hemovigilantspwd";
        Config.TIMEZONE = "utc";
        Config.DATABASE = "TACO";
        return Config;
    }());
    MariaDB.Config = Config;
})(MariaDB = exports.MariaDB || (exports.MariaDB = {}));
