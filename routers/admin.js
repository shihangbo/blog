/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由对象
var router = express.Router();

//身份验证
router.use(function(req, res, next) {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理');
    return;
  }
  next();
})
//监听路由
router.get('/', function(req, res, next) {
  res.render('admin/index', {
    userInfo: req.userInfo
  });
})
//对app.use()暴露路由对象
module.exports = router;
