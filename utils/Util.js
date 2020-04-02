const WebsiteDao = require('../dao/websitedao');
const websiteDao = new WebsiteDao()
const ObjectId = require('mongodb').ObjectId;

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

/**
 * 根据域名获取website_id
 * @param {*} domain 
 */
async function getWebsiteInfoByWebsiteId(id){
  let data = await websiteDao.findAll()
  let result = {}
  data.forEach((item)=>{
      const _id = item['_id'].toString()
      if (id == _id){
        result = item
      }
  })
  return result || {}
}

module.exports = {
    getFullPath,
    getWebsiteInfoByDomain,
    getWebsiteInfoByWebsiteId
}