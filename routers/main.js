/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由
var router = express.Router();

var Category = require('../models/categories');

//监听路由
router.get('/', function(req, res, next) {
  //读取所有分类信息
  Category.find().then(function(categories) {
    // res.send("watson");
    res.render("main/index", {
      userInfo: req.userInfo,
      categories: categories
    });
  })
  
})
//对app.use()暴露router对象
module.exports = router;