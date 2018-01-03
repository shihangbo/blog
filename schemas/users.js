/**
 * Created by watson on 2017/12/27
*/

//引入mongoose模块
var mongoose = require("mongoose");
//创建用户表结构
module.exports = new mongoose.Schema({

  //用户名
  username: String,
  //密码
  password: String,
  //是否是管理员
  isAdmin: {
    type: Boolean,
    default: false
  }

})