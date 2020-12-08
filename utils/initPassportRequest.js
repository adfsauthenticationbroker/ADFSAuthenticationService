/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

const url = require('url');
const md5 = require('./md5.js').md5;

/**
 * initialise the passport saml request for authentication
 * 
 * @since 1.0.0
 * @category authentication
 * @param    {Any} req The request
 * @param    {String} response The reponse
 * @returns  nil
 */

/* Set relay state to adfs */
const initPassportRequest = (req, res, next) => {
    try {

        console.log("Begin initPassportRequest");
        // get tenant id in query string
        var queryObject = url.parse(req.url, true).query;
        var tenantId = decodeBase64(queryObject["tenantid"]);
        var redirectUri = decodeBase64(queryObject["redirecturi"]);
        var state = decodeBase64(queryObject["state"]); // session id
        var nonce = decodeBase64(queryObject["nonce"]); // [datetime] + [session id] - must be a datetime salt in the format "dd-MMM-yyyy HH:MM:ss.[random number]" e.g. 05-May-2020 16:25:31
        var loginTime = nonce.substring(0, 19); // [datetime] + [session id] - must be a datetime salt in the format "dd-MMM-yyyy HH:MM:ss.[random number]" e.g. 05-May-2020 16:25:31
        var clientHash = ""; // set empty

        console.log("tenantId: " + tenantId);
        console.log("redirectUri:" + redirectUri);
        console.log("state: " + state); 
        console.log("nonce: " + nonce); // dd-MMM-yyyy HH:mm:ss + "." + random # or guid

        // get tenant id
        var tenant = getTenant(tenantId);
        var validTenantId = tenant.tenantid;

        // validation - check for valid hash
        if (process.env.ISHASH == "1") {
            clientHash = queryObject["hash"]; // hash hex of clientId + "" + nonce - optional - do not need to decode base64
            console.log("clientHash: " + clientHash); 
        
            if (!clientHash.trim()) {
                // hash is empty    
                console.log("0006 - Invalid hash.");
                throw new Error('Error: 0006 - Invalid hash.');
            }
                
            // re-hash client id + ":" + nonce
            var s = tenantId + ":" + nonce;
            var serverHash = md5(s, "hex");

            // check for valid hash
            if (clientHash.trim() == serverHash.trim()) {
                console.log("Validate hash - hash is valid. client id and nonce is valid.");
            }
            else {
                console.log("0006 - Invalid hash.");
                throw new Error('Error: 0006 - Invalid hash.');
            }
        }

        // validation - check nonce login time is within the last 60 sec to prevent replay
        if (process.env.ISNONCE == "1") {
            // check logintime is valid - within the last 60 seconds
            var inputDate = new Date(loginTime);
            var currentDate = new Date();
            let secondDiff = (currentDate - inputDate) / 1000;
            if (secondDiff <= 60 && secondDiff >= -5) {
                console.log("Validate nonce - valid nonce token - logintime difference: " + secondDiff);
            }
            else {
                console.error("0001 - Invalid token or token expired: " + secondDiff);
                throw new Error('Error: 0001 - Invalid token.');
            }
        }

        // validation - check referrer url is valid
        var referrerUrl = req.headers.referer;
        var referrerLength = referrerUrl.length;

        const env = process.env.NODE_ENV || 'development';
        if (env != "development") {  // this check if for production only
            console.error("Validate referrer.");
            console.log("  referrer: " + referrerUrl);
            console.log("  identifier: " + tenant.identifier);
                if (referrerUrl.trim().length == tenant.identifier.trim().length) {
                if (referrerUrl.trim().toUpperCase() != tenant.identifier.trim().toUpperCase()) {
                    console.error("Error: 0005 - Invalid referrer.");
                    throw new Error("0005 - Invalid referrer.");
                }
            } else {
                if (referrerUrl.trim().length > tenant.identifier.trim().length) {
                    if (referrerUrl.trim().substring(0, tenant.identifier.trim().length).toUpperCase() != tenant.identifier.toUpperCase()) {
                        console.log("referrerUrl.trim.substring: " + referrerUrl.trim().substring(0, tenant.identifier.trim().length).toUpperCase())
                        console.error("Error: 0005 - Invalid referrer with different referrer and identifer.");
                        throw new Error("0005 - Invalid referrer.");
                    }
                }
                else {
                    console.error("Error: 0005 - Invalid referrer with eeferrer less characters.");
                    throw new Error("0005 - Invalid referrer.");
                }
            }
        }

        // validation - check valid tenantid configure in .env TENANTS json
        if (!validTenantId.trim()) {
            // is empty or whitespace
            console.error("Error: 0002 - Relay state is empty.");
            throw new Error("0002 - Relay state is empty.");
        }
        else {
            // set the adfs RelayState and next
            var relayStateToAdfs = '{"tenantid":"' + tenantId + '","state":"' + state + '","redirecturi":"' + redirectUri + '","nonce":"' + nonce + '"}';
            var buffRelayStateToAdfs = Buffer.from(relayStateToAdfs, 'utf-8');
            var encodeRelayStateToAdfs = buffRelayStateToAdfs.toString('base64');
            req.query.RelayState = encodeRelayStateToAdfs;
            console.error("End initPassportRequest - validation passed - redirect to ADFS.");
            next();
        }

    } catch (error) {
        console.error("Error while initPassportRequest: ", error);
        throw ("Error while [initPassportRequest]. Please retry again or contact system administrator.");
    }
};

/* Get Tenant object */
function getTenant(tenantId) {
    var tenants = process.env.TENANTS;
    var obj = JSON.parse(tenants);
    var tenant;

    for (const index in obj) {
        if (obj[index].tenantid == tenantId) {
            tenant = obj[index];
            break;
        }
    }

    return tenant;
};

/* Decode base64 string */
function decodeBase64(data) {
    var buff = Buffer.from(data, 'base64');
    return buff.toString('utf-8');
};

module.exports = initPassportRequest;
