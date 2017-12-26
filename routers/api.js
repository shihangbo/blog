/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由对象
var router = express.Router();
//监听路由
router.get('/user', function(req, res, next) {
  res.send('api - user');
})
//对app.use()暴露路由对象
module.exports= router;