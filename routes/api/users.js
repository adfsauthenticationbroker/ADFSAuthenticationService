/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

const passport    = require('passport');
const router      = require('express').Router();
const getTenantCallBackUrl = require('../../utils/getTenantCallBackUrl');
const initPassportRequest = require('../../utils/initPassportRequest');
const md5 = require('../../utils/md5.js').md5;
const generateJwtToken = require('../../utils/generateJwtToken');
const url = require('url');
const SAML = require("saml-encoder-decoder-js");
const jwt = require("jsonwebtoken");
const dateFormat = require('dateformat');
const srs = require('secure-random-string');

/* POST login route - to adfs */
router.get('/login',
    initPassportRequest,
    passport.authenticate('saml', {
        failureRedirect: '/error.html', failureFlash: true
    }),
    function (req, res) {
        res.redirect('/error.html');
    }
);

/* POST adfs/postResponse route - from adfs */
router.post('/adfs/postResponse',
    passport.authenticate('saml', { failureRedirect: '/error.html', failureFlash: true }),
    function (req, res) {
        try {
            var info = "";
            console.log('Begin adfs postResponse');
            if (req.user) {
                console.log('Login Success - valid user - req.user object: %s \n', JSON.stringify(req.user));
                // get tenant callbackUrl from Env or DB
                var tenantId = "";
                var tenantRelayState = "";
                var encodedRelayState = req.body["RelayState"];

                // decode relay state base64
                const data = encodedRelayState; // jwt token payload  
                const buff = Buffer.from(data, 'base64');
                const decodedRelayState = buff.toString('utf-8');

                var relayStateObject = JSON.parse(decodedRelayState);
                tenantId = relayStateObject.tenantid;
                tenantRelayState = relayStateObject.tenantrelaystate;
                var redirecturi = relayStateObject.redirecturi;

                // check if tenantid is empty or whitespace
                if (!tenantId.trim()) {
                    console.error("Error: 0003 - Invalid tenant id in relay state.");
                    throw new Error("0003 - Invalid tenant id in relay state.");
                }

                var callBackUrl = getTenantCallBackUrl(tenantId);
                // check if callbackurl is empty or whitespace
                if (!redirecturi.trim()) {
                    if (!callBackUrl.trim()) {
                        console.error("Error: 0004 - Call Back URL is empty.");
                        throw new Error("0004 - Call Back URL is empty.");
                    }
                }
                else {
                    callBackUrl = redirecturi;
                }

                // generate jwt token
                var encodedSecretOrPublicKey = process.env.JWT_SECRET || 'secret';
                var secretOrPublicKey = Buffer.from(encodedSecretOrPublicKey, 'base64');
                var token = generateJwtToken(tenantId, relayStateObject, req.user, secretOrPublicKey)

                // generate html for post back
                var html = process.env.RESPONSE_POST_JWT_TEMPLATE || '';
                html = html.replace("{@token}", token.toString());
                html = html.replace("{@callbackurl}", callBackUrl.toString());

                // post back to tenant callBackUrl with the Jwt body and headers using javacript
                console.log('End adfs postResponse');
                res.status(200).send(html);
            }
            else {
                info = "0007 - Invalid User - login failed. Please try again or contact system administrator.";
                console.log(info);
                console.log('End adfs postResponse');
                res.status(401).send(info);
            }

        } catch (error) {
            console.error("Error while adfs-postResponse: ", error);
            throw ("Error while [adfs-postResponse]. Please retry again or contact system administrator.");
        }
    }
);

module.exports = router;
