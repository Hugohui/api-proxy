
const WebsiteDao = require('../dao/websitedao');
const UserDao = require('../dao/userdao');
const websiteDao = new WebsiteDao()
const userDao = new UserDao()

async function unionidWebsite(unionid){

    const dduserinfo = await userDao.findOne({_id: unionid})

    const isAdmin = dduserinfo['isadmin'] || false
    
    let websiteinfo = [];
    if (isAdmin) {
        websiteinfo = await websiteDao.findAll()
    } else {
        state_arr = dduserinfo['state_arr'] || []
        websiteinfo = await websiteDao.findAll({
            _id: {
                "$in": state_arr
            }
        })
    }

    let dataList = []
    websiteinfo.forEach(item => {
        dataList.push({
            name: item['name'], 
            des: item['des'], 
            icon: item['icon'],
            src: item['src'],
            website_id: item['_id']
        })
    });

    return dataList
}


module.exports = {
    unionidWebsite
}