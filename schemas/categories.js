/**
 * Created by watson on 2018/01/05
*/

//引入mongoose模块
var mongoose = require("mongoose");
//创建分类的表结构
module.exports = new mongoose.Schema({
  //分类名称
  name: String,
})