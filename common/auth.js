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
async function Auth (req, res, next){
    const params = req.query;

    let code = params['code'] || req.body['code'];
    let params_website_id = params['website_id'] || req.body['website_id'];

    const website_info = await Util.getWebsiteInfoByDomain(req.headers.host);
    const website_id = website_info['_id'] || params_website_id

    console.log('website_id====' + website_id)

    if (!website_id){
        _noAuth(res, 404, 'Domain name that does not exist.')
        console.log('Domain name that does not exist.')
        return
    }

    code = Array.isArray(code) ? code[code.length - 1] : code;

    console.log('get query..')
    console.log(params)

    console.log('get body...')
    console.log(req.body)

    if (code) {

        console.log('read redis starting...')

        // 获取redis中存的用户信息
        rds.get(code, (err, res_rds)=>{
            const redis_info = res_rds;
            let res_dict = {};
            if (redis_info) {
                res_dict = JSON.parse(redis_info)
                // 有请求进来更新时间
                rds.expire(code, 10800)
                _auth(req, res, next, res_dict, website_id)
            } else {
                scanCodeUnionid(code, website_id).then((info)=>{
                    // 如果redis中不存在临时code 缓存code 3小时
                    rds.setex(code, 10800, JSON.stringify(info))
                    _auth(req, res, next, info, website_id)
                })
            }
        });
    }else{
        _noAuth(res)
    }
}

/**
 * 鉴权
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {Objec} info 用户信息
 */
function _auth(req, res, next, info, website_id) {

    console.log('start auth...')
    console.log('website_id is ' + website_id)

    const fullPath = Util.getFullPath(req);
    // 判断权限
    const errcode = info['errcode']
    console.log('errcode',errcode)
    if ( errcode == 0) {
        const userInfo = info['user_info'] || {}
        const unionid = userInfo['unionid']
        console.log('unionid is ' + unionid)
        unionidWebsite(unionid).then((data_list)=>{
            let auth_success = false
            for(let i=0; i < data_list.length; i++){
                if (data_list[i]['website_id'].toString() == website_id){
                    auth_success = true
                    console.log(data_list[i]['website_id'].toString())
                    break;
                }
            }
            if(auth_success){
                console.log('auth_success!!!')
                next()
            }else{
                console.log('auth_fail!!!')
                _noAuth(res)
            }
        })
    }else{
        _noAuth(res)
    }
}

/**
 * 无权限
 * @param {*} res 
 */
function _noAuth(res, code, message) {
    const result = JSON.stringify({
        code: code || 401,
        msg: message || '无权限'
    })
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(result)
    res.end()
}

module.exports = Auth