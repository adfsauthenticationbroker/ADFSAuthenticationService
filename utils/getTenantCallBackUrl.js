/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

/**
 * get the callback url from the env file
 * 
 * @since 1.0.0
 * @category authentication
 * @param    String tenantId The unique tenant ID
 * @returns  String The callback url of the tenant application
 */

/* Get Tenant CallBackUrl */
const getTenantCallBackUrl = (tenantId) => {
    try {
        var callbackUrl = "";
        var tenants = process.env.TENANTS;
        var obj = JSON.parse(tenants);
        for (const index in obj) {
            if (obj[index].tenantid == tenantId) {
                callbackUrl = obj[index].callbackurl;
                break;
            }
        }
        return callbackUrl;
    } catch (error) {
        console.error("Error getTenantCallBackUrl: ", error);
        throw ("Error getTenantCallBackUrl.");
    }
};

module.exports = getTenantCallBackUrl;
