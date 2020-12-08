/**
 *
 * Author:  AppSeed.us
 *
 * License: MIT - Copyright (c) AppSeed.us
 * @link https://github.com/app-generator/nodejs-starter
 *
 */

'use strict';

const env = process.env.NODE_ENV || 'development'; 
const config = require(__dirname + '/../config/config.js')[env];

console.log("Node Env: " + env);

module.exports = config;
