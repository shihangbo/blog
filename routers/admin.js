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
  
  // 从数据库中读取用户数据
  User.find().then(function(users) {
    res.render('admin/user_index', {
      userInfo: req.userInfo,
      users: users
    })
  });

  
})
//对app.use()暴露路由对象
module.exports = router;
