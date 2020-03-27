const WebsiteDao = require('../dao/websitedao');
const websiteDao = new WebsiteDao()

/**
 * getFullPath
 * @param {*} req 
 */
function getFullPath(req) {
  return req.protocol + '://' + req.get('host') + req.originalUrl
}

/**
 * 根据域名获取website_id
 * @param {*} domain 
 */
async function getWebsiteInfoByDomain(domain){
  let data = await websiteDao.findOne({
      "src": {
          "$regex": eval(`/${domain}/ig`)
      }
  })
  return data || {}
}

module.exports = {
    getFullPath,
    getWebsiteInfoByDomain
}