/**
 * Tomcat Configuration API
 */
export module tomcat {
    export class Config {
        private static HOST: string = process.env.TOMCAT_NAME || "127.0.0.1";
        private static PORT: string = process.env.TOMCAT_PORT || "8893";

        /* ********************** SmartCRF   ***************************/
        private static tacoVersion: string = "taco-0.0.1";
        private static testDetection: string = "TestDetectTACO";

        /**
         * URL to testDetection
         */
        public static getTestDetectionAPI(): string {
            return ("http://" + this.HOST + ":" + this.PORT + "/" + this.tacoVersion + "/" + this.testDetection);
        }
    }
}