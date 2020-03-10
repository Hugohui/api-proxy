//websitedao.js
const BaseDao = require('./basedao')
const Website = require('../models/websiteInfo')

class WebsiteDao extends BaseDao {
    constructor() {
        super(Website)
    }
}
module.exports = WebsiteDao;