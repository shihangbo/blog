/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由
var router = express.Router();

var Category = require('../models/categories');
var Content = require('../models/content');

//监听路由
router.get('/', function(req, res, next) {

  var data = {};
  data.page = Number(req.query.page || 1) //当前页
  data.limit = 2 //每页条数
  data.pages = 0 //总页数
  data.count = 0 //总条数-数据库查询得到
  data.userInfo = req.userInfo //当前用户信息
  data.categories = [] //当前用户分类列表
  data.contents = [] //当前用户的文章列表


  //读取所有分类信息
  Category.find().then(function(categories) {
    // res.send("watson");
    data.categories = categories;

    return Content.count();

  }).then(function(count) {

    data.count = count;
    data.pages = Math.ceil(count / data.limit);
    data.page = Math.min(data.page, data.pages);
    data.page = Math.max(data.page, 1);
    var skip = (data.page - 1) * data.limit; //从 skip 开始查

    return Content.find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    });

  }).then(function(contents) {
    data.contents = contents;
    console.log(data)
    res.render("main/index", data);
  })
  
})
//对app.use()暴露router对象
module.exports = router;