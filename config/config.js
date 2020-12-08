/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

module.exports = {
	development: {
                entrypoint: process.env.PASSPORT_ENTRYPOINT,
                issuer: process.env.PASSPORT_ISSUER,
                callbackurl: process.env.PASSPORT_CALLBACKURL //,
                //privatecert: process.env.PASSPORT_PRIVATECERT,
                //cert: process.env.PASSPORT_CERT
	},
	test: {
                entrypoint: process.env.PASSPORT_ENTRYPOINT,
                issuer: process.env.PASSPORT_ISSUER,
                callbackurl: process.env.PASSPORT_CALLBACKURL //,
                //privatecert: process.env.PASSPORT_PRIVATECERT,
                //cert: process.env.PASSPORT_CERT
        },
	production: {
                entrypoint: process.env.PASSPORT_ENTRYPOINT,
                issuer: process.env.PASSPORT_ISSUER,
                callbackurl: process.env.PASSPORT_CALLBACKURL //,
                //privatecert: process.env.PASSPORT_PRIVATECERT,
                //cert: process.env.PASSPORT_CERT
	}
};
