const crypto = require('crypto');
// const request = require('request');
const Base64 = require('js-base64').Base64;
const Hmac = require('js-crypto-hmac')
var sha256 = require('js-sha256').sha256;
var request = require('sync-request');

async function scanCodeUnionid(code){

    const timestamp = new Date().getTime().toString()

    const appsecret = 'ufdrDP2Rxm1eQk2A7bbL20DGn95-k5Z4Nf4inwTcvJsuODpNV5GZAOb80cXLax9c'
    const appid = 'dingoa7exbo0c5fxxvyvhq'

    let hash = sha256.hmac.create(appsecret);
    hash.update(timestamp);
    const signature = encodeURIComponent(Base64.encode(hash.hex()))

    const data = {'code': code}

    const url = 'http://scancode.liquidnetwork.com:5005/gateway/scan_code_unionid?code=' + code;
    const response = request('GET', url)
    const info = JSON.parse(response.getBody('utf8')).data

    console.log('get userinfo....')
    console.log(info)

    return info
}

module.exports = {
    scanCodeUnionid
}