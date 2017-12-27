/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由
var router = express.Router();
//监听路由
router.get('/', function(req, res, next) {
  // res.send("watson");
  res.render("main/index");
})
//对app.use()暴露router对象
module.exports = router;