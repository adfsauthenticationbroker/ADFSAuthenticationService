/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

const jwt = require("jsonwebtoken");

/**
 * generate the json web token that we'll use for authentication
 * 
 * @since 1.0.0
 * @category authentication
 * @param    {Any} tenantId The tenant ID
 * @param    {String} tenantRelayState The current relay state
 * @param    {String} user The user information
 * @param    {String} secretOrPublicKey The public key to create JWT
 * @returns  {Object} The generated JWT
 */


const generateJwtToken = (tenantId, tenantRelayState, user, secretOrPublicKey) => {
    try {
        var jwtTokenExpiresIn = process.env.JWTTOKEN_EXPIRESIN_SEC || '3600';
        jwtTokenExpiresIn = jwtTokenExpiresIn + "s"; // value is in seconds

        // note: nameid is missing for user01 but administrator has it.
        var token = jwt.sign(
            {
                tenantid: tenantId,
                userid: user.upn,
                emailaddress: user.emailaddress,
                givenname: user.givenname,
                surname: user.surname,
                displayname: user.displayname,
                redirecturi: tenantRelayState.redirecturi,
                nonce: tenantRelayState.nonce,
                state: tenantRelayState.state
           },
            secretOrPublicKey,
            { expiresIn: jwtTokenExpiresIn });  // 3600s = 1 hour

        return token;
    } catch (error) {
        console.error("Error with verifying and decoding JWS: ", error);
        throw ("Error with verifying and decoding JWS.");
    }
};

module.exports = generateJwtToken;
