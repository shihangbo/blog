/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由
var router = express.Router();

var Category = require('../models/categories');
var Content = require('../models/content');

//中间件处理“通用数据”
var data = {}
router.use(function(req, res, next) {
  data = {
    userInfo: req.userInfo,
    categories: []
  }
  Category.find().then(function(categories) {
    data.categories = categories;
    next();
  })
})

//监听路由
router.get('/', function(req, res, next) {
  data.category = req.query.category || '' //分类id
  data.page = Number(req.query.page || 1) //当前页
  data.limit = 2 //每页条数
  data.pages = 0 //总页数
  data.count = 0 //总条数-数据库查询得到
  // data.userInfo = req.userInfo //当前用户信息
  // data.categories = [] //当前用户分类列表
  data.contents = [] //当前用户的文章列表
  var where = {} //文章查询条件
  if (data.category) {
    where.category = data.category
  }

  //读取所有分类信息-----经过通用数据提起
  // Category.find().then(function(categories) {
  //   // res.send("watson");
  //   data.categories = categories;
  //   return Content.where(where).count();
  // }).then(function(count) {

  Content.where(where).count().then(function(count) {
    data.count = count;
    data.pages = Math.ceil(count / data.limit);
    data.page = Math.min(data.page, data.pages);
    data.page = Math.max(data.page, 1);
    var skip = (data.page - 1) * data.limit; //从 skip 开始查
    return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    });
  }).then(function(contents) {
    data.contents = contents;
    // console.log(data)
    res.render("main/index", data);
  })
})

//文章详情路由
router.get('/view', function(req, res, next) {
  var contentId = req.query.contentId;
  Content.findOne({
    _id: contentId
  }).then(function(content) {
    data.content = content
    //处理阅读数
    content.views++;
    content.save();
    res.render('main/view', data)
  })
})

//对app.use()暴露router对象
module.exports = router;