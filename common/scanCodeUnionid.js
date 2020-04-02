var request = require('sync-request');
const Util = require('../utils/Util')
const settings = require('../settings')

async function scanCodeUnionid(code, website_id){

    const websiteInfo = await Util.getWebsiteInfoByWebsiteId(website_id);
    const appSecret = websiteInfo['appSecret']
    const appId = websiteInfo['appId']

    const url = 'http://' + settings.scancodeUrl + '/white/getuserinfo_bycode?code=' + code + '&appsecret='+ appSecret + '&appid=' + appId;
    const response = request('GET', url)
    const info = JSON.parse(response.getBody('utf8')).data

    console.log('get userinfo....')
    console.log(info)

    return info
}

module.exports = {
    scanCodeUnionid
}