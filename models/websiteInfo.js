let { Schema } = require('mongoose');
let { mongoClient } = require('./DB');

/**
 * 操作 MongoDb 时需要创建两个文件 model.js 和 modelDao.js
 *
 * 一. 对于 Model.js 以下几部分：
 * 1. Schema 必要
 * 2. plugin 可选
 * 3. hook 可选
 * 4. 调用 mongoClient.model() 创建 Model，此处注意，Model 名称与 js 文件名一样，但首字母大写
 *
 * 二. 对于 modelDao.js
 * 我们需要声明一个 ModelDao 的 class 继承自 BaseDao， BaseDao 中包含基本的 crud 操作，也可以根据需求自行定义
 *
 * 三. 外部使用
 * var dao = new ModelDao()
 * dao.crud();
 */

const websiteInfoSchema = new Schema({
    _id: String,
    name: String,
    des: String, 
    src: String,
    icon: String,
    itime: String
}, {
    runSettersOnQuery: true // 查询时是否执行 setters
});
/**
 * 参数一要求与 Model 名称一致
 * 参数二为 Schema
 * 参数三为映射到 MongoDB 的 Collection 名
 */
console.log('实体类',new Date().getTime())
let Website = mongoClient.model(`Website`, websiteInfoSchema, 'websiteInfo');

module.exports = Website;