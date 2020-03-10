const settings = require('../settings')
const Util = require('../utils/Util')
const unionidWebsite = require('./unionidWebsite').unionidWebsite
const scanCodeUnionid = require('./scanCodeUnionid').scanCodeUnionid

const redis = require('redis')
const rds = redis.createClient(settings.redisConfig)

/**
 * Auth
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function Auth (req, res, next){
    const params = req.query;
    let code = params['code'];
    const website_id = params['website_id'];

    code = Array.isArray(code) ? code[code.length - 1] : code;

    console.log('get params..')
    console.log(params)

    const fullPath = Util.getFullPath(req);

    if (code && website_id) {

        console.log('read redis starting...')

        // 获取redis中存的用户信息
        rds.get(code, (err, res_rds)=>{
            const redis_info = res_rds;
            let res_dict = {};
            if (redis_info) {
                res_dict = JSON.parse(redis_info)
                // 有请求进来更新时间
                rds.expire(code, 10800)
                _auth(req, res, next, res_dict)
            } else {
                scanCodeUnionid(code).then((info)=>{
                    // 如果redis中不存在临时code 缓存code 3小时
                    rds.setex(code, 10800, JSON.stringify(info))
                    _auth(req, res, next, info)
                })
            }
        });
    }else{
        _noAuth(res)
        // res.redirect(301, settings.scanLoginUrl + encodeURIComponent(fullPath))
    }
}

function _auth(req, res, next, info) {
    const params = req.query;
    const website_id = params['website_id'];

    console.log('start auth...')

    const fullPath = Util.getFullPath(req);
    // 判断权限
    const errcode = info['errcode']
    if ( errcode == 0) {
        const userInfo = info['user_info'] || {}
        const unionid = userInfo['unionid']
        unionidWebsite(unionid).then((data_list)=>{

            let auth_success = false
            data_list.forEach((webitem)=>{
                if (webitem.website_id == website_id){
                    auth_success = true
                }
            })
            if(auth_success){
                console.log('auth_success!!!')
                next()
            }else{
                console.log('auth_fail!!!')
                _noAuth(res)
                // res.redirect(301, settings.scanLoginUrl + encodeURIComponent(fullPath))
            }
        })
    }else{
        _noAuth(res)
        // res.redirect(301, settings.scanLoginUrl + encodeURIComponent(fullPath))
    }
}

// 无权限
function _noAuth(res) {
    const result = JSON.stringify({
        code: 0,
        msg: '无权限'
    })
    res.write(result)
    res.end()
}

module.exports = Auth