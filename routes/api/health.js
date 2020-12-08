/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

const router      = require('express').Router();
const md5 = require('../../utils/md5.js').md5;
const dateFormat = require('dateformat');
const srs = require('secure-random-string');
const url = require('url');

/* GET default page */
router.get('/',
    function (req, res) {
        var html = 'Server Health is OK.';
        res.status(200).send(html);
    }
    
);

/* GET health listing check*/
router.get('/tenantlisting',
    function (req, res) {
        // list out all tenant login link from env for testing
        var currentDate = new Date();
        var currentDateString = dateFormat(new Date(), "dd-mmm-yyyy HH:MM:ss");
        var data = ""; 
        var buff = ""; 
        var encodeTenantToken = ""; 
        var tenants = process.env.TENANTS || '{}';
        var obj = JSON.parse(tenants);
        var tenant;
        var html = "Click on the link to login:<br/>";
        var sessionId = srs({ length: 20 });
        var redirectUri = "https://mha_aws_auth_adfs_nprd.htd.gov.sg:8111/api/users/login/callback";
        var encodeTenantId = "";
        var encodeReturnUri = "";
        var encodeNonce = "";
        var encodeState = "";
        var queryString = "";
        var hash = "";

            // get tenant id in query string
        var queryObject = url.parse(req.url, true).query;
        var keyQueryString = queryObject["key"];
        var apikey = process.env.KEY || "49ab5a1b-b40b-42ad-9ae1-99ead597ef47";

        if(keyQueryString == apikey)
        {

            for (const index in obj) {
                tenant = obj[index];
                sessionId = srs({ length: 20 });
                // form ahref
                encodeTenantId = Buffer.from(tenant.tenantid, 'utf-8').toString('base64');
                encodeRedirectUri = Buffer.from(tenant.callbackurl, 'utf-8').toString('base64');
                encodeNonce = Buffer.from(currentDateString + "." + sessionId, 'utf-8').toString('base64');
                encodeState = Buffer.from(sessionId, 'utf-8').toString('base64');
                hash = md5(tenant.tenantid + ":" + currentDateString + "." + sessionId, "hex");
                queryString = "?tenantid=" + encodeTenantId +
                    "&redirecturi=" + encodeRedirectUri +
                    "&nonce=" + encodeNonce +
                    "&state=" + encodeState +
                    "&hash=" + hash;     

                html = html + '<br/>' + '<a href="/api/users/login' + queryString + '">' + tenant.tenantname + '</a> : callback url - ' + tenant.callbackurl;
            }

        }
        res.status(200).send(html);
    }
);

/* sample node js code POST api to decode JwtToken and get user info */
router.post('/login/callback',
    function (req, res) {
        var token = req.body["token"];
        var parts = token.split("."); // split out the "parts" (header, payload and signature)

        const data = parts[1]; // jwt token payload  
        const buff = Buffer.from(data, 'base64');
        const decodedToken = buff.toString('utf-8');

        console.log("decodedToken :" + decodedToken);

        var jsonObject = JSON.parse(decodedToken);
        req.isAuthenticated = true;
        req.user = {
            userid: jsonObject.userid,
            emailaddress: jsonObject.emailaddress,
            givenname: jsonObject.givenname,
            surname: jsonObject.surname,
            displayname: jsonObject.displayname,
            tenantid: jsonObject.tenantid,
            redirecturi: jsonObject.redirecturi,
            nonce: jsonObject.nonce,
            state: jsonObject.state
        };
        res.send("Node JS - login successfully:" + "<br/>" + JSON.stringify(req.user));
    }
);


/* POST verifyToken route */
/*
router.post('/verifyToken',
    function (req, res) {

        var signToken = req.body["token"];
        // generate jwt token
        var secretOrPublicKey = process.env.JWT_SECRET || 'secret';
        var token = jwt.verify(signToken, secretOrPublicKey); 
        if (token.error) {
            return res.status(422).json({
                errors: result.error
            });
        }
        // post back to tenant callBackUrl with the Jwt body and headers using javacript
        var info = '{status: "1", statusmessage: "valid token"}';
        res.status(200).send();

    }
);
*/

module.exports = router;
