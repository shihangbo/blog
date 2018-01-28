/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由对象
var router = express.Router();
//引入数据库models
var User = require('../models/users');
var Content = require('../models/content');

// 统一返回格式，并进行初始化
var responseData;
router.use(function(req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next();
});

/**用户注册
 *  注册逻辑
 *  1.用户不能为空
 *  2.密码不能为空
 *  3.两次输入密码必须一致
 *  4.用户是否已经被注册了---数据库查询
 * */
//监听路由
router.post('/user/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;

  //判断：1.用户是否为空
  if (username == '') {
    responseData.code = 1;
    responseData.message = '用户不能为空';
    res.json(responseData);
    return;
  }
  //判断：2.密码不能为空
  if (password == '') {
    responseData.code = 2;
    responseData.message = '密码不能为空';
    res.json(responseData);
    return;
  }
  //判断：3.两次输入密码必须一致
  console.log(req.body);
  if (password != repassword) {
    responseData.code = 3;
    responseData.message = '两次输入密码不一致';
    res.json(responseData);
    return;
  }

  //判断：4.用户是否已经被注册了---数据库查询
  User.findOne({
    username: username
  }).then(function(userInfo) {
    if (userInfo) {
      responseData.code = 4;
      responseData.message = '用户名已经被注册了';
      res.json(responseData);
      return;
    }
    //保存用户注册的信息到数据库中
    var user = new User({
      username: username,
      password: password
    });
    return user.save();
  }).then(function(newUserInfo) {
    responseData.message = '注册成功了！'
    res.json(responseData);
  });

})
//监听路由
//登陆
router.post('/user/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username) {
    responseData.code = 5;
    responseData.message = '用户名不能为空';
    res.json(responseData);
    return;
  }
  if (!password) {
    responseData.code = 6;
    responseData.message = '密码不能为空';
    res.json(responseData);
    return;
  }

  User.findOne({
    username: username,
    password: password
  }).then(function(userInfo) {
    if (userInfo) {
    //用户登陆成功
      responseData.userInfo = {
        _id: userInfo._id,
        username: userInfo.username
      }
      req.cookies.set('userInfo', JSON.stringify({
        _id: userInfo._id,
        username: userInfo.username
      }))

      responseData.message = '用户登陆成功';
      res.json(responseData);
    } else {
    //没有该用户
      responseData.message = '用户名或密码错误';
      responseData.code = 7;
      res.json(responseData);
    }
  })
})
//监听路由
//退出
router.get('/user/logout', function(req, res, next) {
  req.cookies.set('userInfo', null);
  res.json(responseData);
})

//评论提交
router.post('/comment/post', function(req, res, next) {
  //内容的id
  var contentId = req.body.contentId || '';
  //评论内容
  var postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  }
  //查询当前文章信息
  Content.findOne({
    _id: contentId
  }).then(function(content) {
    //数组的push方法填坑！！
    var tmpArr = []
    tmpArr.push(postData);
    tmpArr = tmpArr.concat(content.comments);

    content.comments = tmpArr;
    return content.save();
  }).then(function(newUserInfo) {
    responseData.message = '评论成功！';
    responseData.data = newUserInfo;
    res.json(responseData);
  });

})

//获取指定文章的所有评论
router.get('/comment', function(req, res, next) {
  var contentId = req.query.contentId || ""
  //查询当前文章信息
  Content.findOne({
    _id: contentId
  }).then(function(content) {
    responseData.data = content.comments
    res.json(responseData)
  })
})

//对app.use()暴露路由对象
module.exports= router;