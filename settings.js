// const NODE_ENV = 'development'
const NODE_ENV = 'production'

const serverPort = 5233

// mongodb
const mongoUrl = NODE_ENV == 'development' ? 'mongodb://liquid:n3tw0rk@dds-2ze5fffe69c1c5541874-pub.mongodb.rds.aliyuncs.com:3717,dds-2ze5fffe69c1c5542283-pub.mongodb.rds.aliyuncs.com:3717/activity?replicaSet=mgset-13269097' : 'mongodb://liquid:n3tw0rk@dds-2ze5fffe69c1c5541.mongodb.rds.aliyuncs.com:3717,dds-2ze5fffe69c1c5542.mongodb.rds.aliyuncs.com:3717/activity?replicaSet=mgset-13269097';

// redis
let redisConfig = {
    host: NODE_ENV == 'development' ? '127.0.0.1' : 'r-2zefe4ff53318e04.redis.rds.aliyuncs.com',
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