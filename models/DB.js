const mongoose = require('mongoose');
const settings = require('../settings')

 /**
  * 使用 Node 自带 Promise 代替 mongoose 的 Promise,否则会报错
  */
mongoose.Promise = global.Promise;

/**
 * 配置 MongoDb options
 */
function getMongodbConfig() {
    let options = {
        useNewUrlParser: true,
        poolSize: 5, // 连接池中维护的连接数
        reconnectTries: Number.MAX_VALUE,
        keepAlive: 120,
    }
    return options;
}

/**
 * 创建 Mongo 连接，内部维护了一个连接池，全局共享
 */
let mongoClient = mongoose.createConnection(settings.mongoUrl, getMongodbConfig());

/**
 * Mongo 连接成功回调
 */
mongoClient.on('connected', function() {
    console.log(new Date().getTime())
});

/**
 * Mongo 连接失败回调
 */
mongoClient.on('error', function(err) {
    console.log('Mongoose 连接失败，原因: ' + err);
});
/**
 * Mongo 关闭连接回调
 */
mongoClient.on('disconnected', function() {
    console.log('Mongoose 连接关闭');
});

/**
 * 关闭 Mongo 连接
 */
function close() {
    mongoClient.close();
}


module.exports = {
    mongoClient: mongoClient,
    close: close,
}