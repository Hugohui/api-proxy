
const ObjectId = require('mongodb').ObjectId;
const WebsiteDao = require('../dao/websitedao');
const UserDao = require('../dao/userdao');
const websiteDao = new WebsiteDao()
const userDao = new UserDao()

async function unionidWebsite(unionid){

    console.log('start get weblist...')

    const dduserinfo = await userDao.findOne({_id: unionid})

    const isAdmin = dduserinfo['isadmin'] || false
    
    let websiteinfo = [];
    if (isAdmin) {
        websiteinfo = await websiteDao.findAll()
    } else {
        let state_arr = dduserinfo['state_arr'] || []

        // 此处可优化
        const temp_websiteinfo = await websiteDao.findAll()
        temp_websiteinfo.forEach((item)=>{
            const _id = item['_id'].toString()
            if (state_arr.indexOf(_id) != -1){
                websiteinfo.push(item)
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
    console.log('=====weblist====')
    console.log(dataList)
    return dataList
}

module.exports = {
    unionidWebsite
}