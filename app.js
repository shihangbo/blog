
/**
 * Created by watson on 2017/12/25
*/

//【应用创建】-1.加载express模块
var express = require('express');
//【使用模版】-加载模版处理模块
var swig = require('swig');
//【应用创建】-2.创建app应用 -> NodeJS Http.createServer();
var app = express();
//【处理请求输出】-首页，get函数的参数：req request对象，res response对象，next函数
app.get('/', function(req, res, next) {
  // res.send('<h1>欢迎访问watson的blog</h1>')

  //【使用模版】（使用模版之后，这么来做）读取views目录下的指定文件，解析并返回给客户端，第一个参数是模版文件，第二个参数是传递给模版使用的数据；
  res.render('index');
})
//【使用模版】-1.模版配置 定义当前应用使用的模版引擎，第一个参数：模版引擎名称，同时也是模版文件的后缀，第二个参数表示用于解析处理模版内容的方法；
app.engine('html', swig.renderFile);
//【使用模版】-2.模版配置 设置模版文件存放的目录，第一个参数必须是views，第二个参数是目录；
app.set('views', './views');
//【使用模版】-3.模版配置 注册所使用的模版引擎，第一个参数必须是 view engine，第二个参数和 方法app.engine() 第一个参数一致；
app.set('view engine', 'html');
//在开发过程中，取消模版缓存
swig.setDefaults({cache: false});
//【应用创建】-3.监听http请求
app.listen(8081);


/**
 * 用户通过url访问web应用，如何 http://localhost:8081/
 * web后端根据用户访问的url处理不同的业务逻辑
 * 应用创建步骤
 * 一、应用创建
 *  1. 创建应用、监听端口 ：三步
 * 二、处理请求输出
 *  1. 路由绑定
 *      通过app.get()或app.post()等方法把一个url路径和一个或多个函数进行绑定
 *  2. 内容输出
 *      通过res.send(string)发送内容至客户端
 * 三、使用模版-html与后端逻辑的分离
 *  1. 模版使用
 *      后端逻辑和页面表现分离，前后端分离
 *  2. 模版配置
 *      三步 + 模版缓存处理（调试方法处理）
 */