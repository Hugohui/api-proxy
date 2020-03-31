const http = require('http');
const url = require('url');
const settings = require('../settings')
const Util = require('../utils/Util')
const querystring = require('querystring')

const redis = require('redis')
const rds = redis.createClient(settings.redisConfig)

//获取请求的cookie和query等
let getHeader = (reqClient) => {
    let headers = reqClient.headers; 
    headers.path = reqClient.path;
    headers.query = reqClient.query;
    headers.cookie = reqClient.get('cookie') || '';
    return headers;
}

// 获取主机信息
let getHostInfo = (src) => {
    let url_parse = url.parse(src)
    let info = {
        hostname: url_parse.hostname,
        port: url_parse.port || 80
    }
    return info
}

//代理函数，options是代理设置，包括目标服务器ip，port等
const proxy  = () => {
    //返回请求处理函数，reqClient浏览器的请求，resClient是响应浏览器的对象
    return async function (reqClient, resClient) {

        let params = reqClient.query;
        let code = params['code'] || reqClient.body['code'];

        //从redis中获取用户信息
        let doc = await new Promise( (resolve) => {
            rds.get(code,function(err, res){
                return resolve(res);
            });
        });
        let userInfo = JSON.parse(doc)['user_info'] || {}
        let user_id = userInfo['unionid']

        // 获取website_info
        const website_info = await Util.getWebsiteInfoByDomain(reqClient.headers.host);

        // 获取代理信息
        const proxyPath = website_info['proxyPath']
        const proxyHost = website_info['proxyHost']

        let reqOptions = getHostInfo(proxyHost)

        console.log('start proxy...')
        // console.log(reqOptions)

        //设置目标服务器的请求参数，头中的各项参数
        let headers = getHeader(reqClient);

        reqOptions.headers = reqClient.headers;

        let query = [];
        // 钉钉用户信息
        headers.query = Object.assign({}, { user_id: user_id }, headers.query)
        Object.keys(headers.query).map(key => {
            query.push(key + '=' + headers.query[key]);
        });
        
        reqOptions.path = proxyPath + headers.path + (query.length === 0 ? '' : ('?' + query.join('&')));
        reqOptions.cookie = headers.cookie;
        reqOptions.method = reqClient.method;

        // 拼接用户信息
        if(reqOptions.method != 'GET'){
            reqClient.body = Object.assign({}, reqClient.body, {user_id: user_id})
        }

        //普通JSON数据代理
        let reqBody;
        if (Object.keys(reqClient.body).length) {
            if (reqClient.headers['content-type'].indexOf('application/x-www-form-urlencoded') != -1) {
                reqBody = querystring.stringify(reqClient.body)
            }else{
                reqBody = JSON.stringify(reqClient.body)
            }
            // 此处需要计算buffer字节长度
            reqOptions.headers['Content-Length'] = Buffer.byteLength(reqBody, 'utf8')
            reqOptions.headers['Content-Type'] = reqClient.headers['content-type']
         }

        console.log('start send http request...')
        console.log(reqOptions)

        //向目标服务器发送请求,reqProxy是向目标服务器的请求，resProxy是目标服务器的响应。
        let reqProxy = http.request(reqOptions, (resProxy) => {
            resProxy.setEncoding('utf8');
            //设置返回http头
            resClient.set(resProxy.headers);
            resClient.status(resProxy.statusCode);
            //接收从目标服务器返回的数据
            resProxy.on('data', (chunk) => {
                //接收目标服务器数据后，以流的方式向浏览器返回数据
                resClient.write(chunk);
            });

            //接收目标服务器数据结束
            resProxy.on('end', () => {
                //向浏览器写数据结束。
                resClient.end();
            });
            //目标服务器响应错误
            resProxy.on('error', () => {
                //响应错误，结束向浏览器返回数据
                resClient.end();
            });
        });

        //接收浏览器数据
        reqClient.on('data', (chunk) => {
           //以流的方式向目标服务器发送数据
            reqProxy.write(chunk);
        });
        //接收数据结束
        reqClient.on('end', () => {
          //向目标服务器写数据结束
            reqProxy.end();
        });
        
        //普通JSON数据代理
         if (Object.keys(reqClient.body).length) {
            console.log('send json body')
            console.log(reqBody)
            reqProxy.write(reqBody)
            reqProxy.end();
         }
    }
}

module.exports = proxy;