/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

/* Passport Saml - ADFS */
const   passport = require('passport');
const   fs = require('fs');
const SamlStrategy = require('passport-saml').Strategy;
const models = require('../models'); // config is inside models 

const adfsEntryPoint = models.entrypoint;
const adfsIssuer = models.issuer;
const adfsCallbackUrl = models.callbackurl;
// const adfsPrivateCert = models.privatecert; // private key for the server cert configure under signature tab
// const adfsCert = models.cert; // adfs server cer

console.log("ADFS Entry Point: " + adfsEntryPoint);
console.log("ADFS Issuer: " + adfsIssuer);
console.log("ADFS CallBackURL: " + adfsCallbackUrl);

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new SamlStrategy(
    {
        entryPoint: adfsEntryPoint,
        issuer: adfsIssuer,
        callbackUrl: adfsCallbackUrl,
        // privateCert: fs.readFileSync(adfsPrivateCert, 'utf-8'), // server private cert key - not used 
        // cert: fs.readFileSync(adfsCert, 'utf-8'), // adfs cert - not used 
        forceAuthn: true, // force login for authentication everytime
        disableRequestedAuthnContext: true,
        // other authn contexts are available e.g. windows single sign-on
        authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
        // not sure if this is necessary?
        acceptedClockSkewMs: -1,
        identifierFormat: null,
        // this is configured under the Advanced tab in AD FS relying party
        signatureAlgorithm: 'sha256',
        RACComparison: 'exact' // , // default to exact RequestedAuthnContext Comparison Type
    },
    function (profile, done) {
        //console.log('passport.use() profile: %s \n', JSON.stringify(profile));
        return done(null,
            {
                upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
                emailaddress: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                givenname: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
                // nameid: profile['nameID'],
                surname: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
                displayname: profile['DisplayName']
                // add other attributes here...organisation .... org unit etc ...
                // e.g. if you added a Group claim
                //        group: profile['http://schemas.xmlsoap.org/claims/Group']

            }
        );
    }
));

// module.exports = passport;
