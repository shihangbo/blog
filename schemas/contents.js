/**
 * Created by watson on 2018/01/07
*/

//引入mongoose模块
var mongoose = require("mongoose");
//创建内容表结构
module.exports = new mongoose.Schema({

  //关联字段 - 内容分类id
  category: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用
    ref: 'Category'
  },
  //关联字段 - 用户id
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //时间
  addTime: {
    type: Date,
    default: new Date()
  },
  //阅读量
  views: {
    type: Number,
    default: 0
  },
  //标题
  title: String,
  //简介
  desc: {
    type: String,
    default: ''
  },
  //内容
  content: {
    type: String,
    default: ''
  },
  //评论字段
  comments: {
    type: Array,
    default: []
  }

})