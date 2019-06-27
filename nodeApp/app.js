const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const mysql = require('mysql');//module nodeJs pour interaction avec une base MySQL ou mariaDB
const passport = require('passport');

const app = express();

// DB Config
const mariaDBconfig = require("./js/ts/config/MariaDB2.js").MariaDB.Config;
mysql.connection = mysql.createPool({
    connectionLimit: 10,
    host: mariaDBconfig.HOST,
    port: mariaDBconfig.PORT,
    user: mariaDBconfig.USER,
    password: mariaDBconfig.PASSWORD,
    timezone: mariaDBconfig.TIMEZONE,
    database: mariaDBconfig.DATABASE
});

const MariaUserAuth = require('./js/ts/lib/MariaUserAuth2').MariaUserAuth;
var userAuth = new MariaUserAuth();
require('./lib/passport')(passport,userAuth);


// EJS 
app.use(expressLayouts);
app.set('view engine','ejs');

// Bodyparser
app.use(express.urlencoded({ extended: true}));
app.use(express.json()); // important to parse json !
app.use(express.static('static'));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport Middle 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./js/ts/routes/index2'))
app.use('/users', require('./js/ts/routes/users2'))
app.use('/taco', require('./js/ts/routes/taco'))
app.use('/npat', require('./js/ts/routes/npat'))
app.use('/testDetection', require('./js/ts/routes/testDetection'))

const PORT = process.env.NODE_PORT || 5001;

app.listen(PORT, console.log('Server started port: ', PORT));