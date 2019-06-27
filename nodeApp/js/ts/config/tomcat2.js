"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tomcat Configuration API
 */
var tomcat;
(function (tomcat) {
    var Config = /** @class */ (function () {
        function Config() {
        }
        /**
         * URL to testDetection
         */
        Config.getTestDetectionAPI = function () {
            return ("http://" + this.HOST + ":" + this.PORT + "/" + this.tacoVersion + "/" + this.testDetection);
        };
        Config.HOST = process.env.TOMCAT_NAME || "127.0.0.1";
        Config.PORT = process.env.TOMCAT_PORT || "8893";
        /* ********************** SmartCRF   ***************************/
        Config.tacoVersion = "taco-0.0.1";
        Config.testDetection = "TestDetectTACO";
        return Config;
    }());
    tomcat.Config = Config;
})(tomcat = exports.tomcat || (exports.tomcat = {}));
