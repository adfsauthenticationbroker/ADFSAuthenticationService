const crypto = require('crypto');
/**
 * hash method
 *
 * @param {String} e.g.: 'md5', 'sha1'
 * @param {String|Buffer} s
 * @param {String} [format] 'hex'£¬'base64'. default is 'hex'.
 *@ return {string} encoded value
 * @private
 */
const hash = (method, s, format) => {
    var sum = crypto.createHash(method);
    var isBuffer = Buffer.isBuffer(s);
    if (!isBuffer && typeof s === 'object') {
        s = JSON.stringify(sortObject(s));
    }
    sum.update(s, isBuffer ? 'binary' : 'utf8');
    return sum.digest(format || 'hex');
};

/**
 - MD5 coding
 -  3. @param {String|Buffer} s
 - @param {String} [format] 'hex'£¬'base64'. default is 'hex'.
 - @return {String} md5 hash string
 - @public
 */
const md5 = (s, format) => {
    return hash('md5', s, format);
};

module.exports = {
    md5
};



/*

// Part of https://github.com/chris-rock/node-crypto-examples

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

var hw = encrypt("hello world")
// outputs hello world
console.log(decrypt(hw));


function extractKeyFromCert(cert) {
    var certificates = cert; // [];
    var matches;
    var regex = /-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----/g;
    while ((matches = regex.exec(PEM)) !== null) {
        certificates.push(matches[0].replace('\r\n', '\n'));
        }
    return certificates;
}

*/