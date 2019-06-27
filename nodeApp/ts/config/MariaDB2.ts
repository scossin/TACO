export module MariaDB {
        export class Config {
        public static HOST:string = process.env.MARIADB_NAME || "localhost";
        public static PORT:string = process.env.MARIADB_PORT || "3307";
        public static USER:string = process.env.USER_MARIADB || "hemovigilants";
        public static PASSWORD: string = process.env.USERPWD_MARIADB || "hemovigilantspwd";
        public static TIMEZONE: string = "utc";
        public static DATABASE: string = "TACO";
  }
}
