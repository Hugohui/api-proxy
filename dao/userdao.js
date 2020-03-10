//userdao.js
const BaseDao = require('./basedao')
const User = require('../models/ddUserInfo')

class UserDao extends BaseDao {
    constructor() {
        super(User)
    }
}
module.exports = UserDao;