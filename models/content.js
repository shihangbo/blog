/**
 * Created by watson on 2017/01/07
*/

//引入mongoose
var mongoose = require('mongoose');
//加载schema
var contentsSchema = require('../schemas/contents');
//创建model
module.exports = mongoose.model('Content', contentsSchema);