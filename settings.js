// const NODE_ENV = 'development'
const NODE_ENV = 'production'

const serverPort = 5233

// mongodb
const mongoUrl = NODE_ENV == 'development' ? 'xxx' : 'xxx';

// redis
let redisConfig = {
    host: NODE_ENV == 'development' ? '127.0.0.1' : 'xxx',
    port: 6379,
    db: 1
}
if (NODE_ENV == 'production') {
    redisConfig.password = 'bI2CXR5usUhfve'
}

// 配置后台服务
const scancodeUrl = NODE_ENV == 'development' ? 'scancode.liquidnetwork.com' : 'base-login:80';

module.exports = {
    serverPort,
    mongoUrl,
    redisConfig,
    scancodeUrl
}