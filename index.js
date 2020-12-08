/**
 *
 * Author:  AppSeed.us - Full Stack App Generator
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/rosoftdeveloper/appseed
 *
 */

const express    = require('express');
const bodyParser = require('body-parser');
const session    = require('express-session');
const cors       = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const passport = require('passport');
const helmet = require('helmet')

/* Make all variables from our .env file available in our process */
require('dotenv').config();

/* Add timestamp to log - console.log */
const logtimestamp = require('log-timestamp');

/* Init express */
const app = express();

console.log("Starting NodeJs express");
 
/* Here we setup the middlewares & configs */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./config/passport');
// Session is not required in Auth Svc 
//app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

/*  Initialize passport */
app.use(passport.initialize());
app.use(passport.session());

/* Define the api routes */
app.use(require('./routes'));

/* Include css and .js file in public folder */
app.use(express.static('./public'));

/* Protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately */
app.use(helmet())

const port = process.env.PORT || 8111;

if (process.env.NODE_ENV == "test") {
    const serverCert = process.env.SERVER_CERT || './cert/localhost_3000.cert';
    const serverCertKey = process.env.SERVER_CERTKEY || './cert/localhost_3000.key';
    const cert = {
        key: fs.readFileSync(serverCertKey),
        cert: fs.readFileSync(serverCert) 
    };

    /* Start the server https */
    var server = https.createServer(cert, app);
    server.listen(port, () => {
        console.log("HTTPS server starting on port : " + port);
    });
}
else {
    /* Start the server http */
    var server = http.createServer(app);
    server.listen(port, () => {
        console.log("HTTP server starting on port : " + port);
    });
}

module.exports = app;