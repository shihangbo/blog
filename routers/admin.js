/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由对象
var router = express.Router();

var User = require('../models/users');

//身份验证
router.use(function(req, res, next) {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理');
    return;
  }
  next();
})
//监听路由--首页
router.get('/', function(req, res, next) {
  res.render('admin/index', {
    userInfo: req.userInfo
  });
})
//监听路由--用户管理
router.get('/user', function(req, res, next) {
  var page = Number(req.query.page || 1);
  var limit = 2;
  var pages = 0;

  User.count().then(function(count) {
    // 计算总页数，向上取整
    pages = Math.ceil(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能小于 1
    page = Math.max(page, 1);

    var skip = (page - 1) * limit;

    // 从数据库中读取用户数据
    User.find().limit(limit).skip(skip).then(function(users) {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        page: page,
        count: count,
        pages: pages,
        limit: limit,
        page: page
      })
    });
  })
  
})
//对app.use()暴露路由对象
module.exports = router;
