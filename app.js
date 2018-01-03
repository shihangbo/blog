
/**
 * Created by watson on 2017/12/25
*/

//【应用创建】-1.加载express模块
var express = require('express');
//【使用模版】-加载模版处理模块
var swig = require('swig');
//【数据库链接】-1
var mongoose = require('mongoose');
//【请求处理】-1接收来自前端post请求的数据
var bodyParse = require('body-parser');
//【cookies处理】-1引入
var Cookies = require('cookies');

//【应用创建】-2.创建app应用 -> NodeJS Http.createServer();
var app = express();

//引入models
var User = require('./models/users');

//【静态文件托管】-2.设置静态文件托管，当用户访问以‘／public’开始，那么直接返回对应‘__dirname + '/public'’下的文件
app.use('/public', express.static(__dirname + '/public'));

//【使用模版】-1.模版配置 定义当前应用使用的模版引擎，第一个参数：模版引擎名称，同时也是模版文件的后缀，第二个参数表示用于解析处理模版内容的方法；
app.engine('html', swig.renderFile);
//【使用模版】-2.模版配置 设置模版文件存放的目录，第一个参数必须是views，第二个参数是目录；
app.set('views', './views');
//【使用模版】-3.模版配置 注册所使用的模版引擎，第一个参数必须是 view engine，第二个参数和 方法app.engine() 第一个参数一致；
app.set('view engine', 'html');
//在开发过程中，取消模版缓存
swig.setDefaults({cache: false});

//【请求处理】-2 bodyParse设置，在路由回调函数的第一个参数 req.body 中注入前台传过来的数据对象;
app.use(bodyParse.urlencoded({extended: true}));

//【cookies处理】-2设置／【普通用户和管理员功能的实现】-2
app.use(function(req, res, next) {
  req.cookies = new Cookies(req, res);
  //验证前台是否登陆
  req.userInfo = {};
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
    
      //获取当前登陆用户是否是管理员
      User.findById(req.userInfo._id).then(function(userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
        next();
      })
    
    } catch(e){ next(); }
  } else {
    next();
  }

})

//【分模块发开的实现】
/**
 * 根据三个模块进行开发
*/
app.use('/admin', require('./routers/admin')); //后台管理
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main')); //前台展示


//【应用创建】-3.监听http请求
//【处理请求输出】-首页，get函数的参数：req request对象，res response对象，next函数
// app.get('/', function(req, res, next) {
//   // res.send('<h1>欢迎访问watson的blog</h1>')

//   //【使用模版】（使用模版之后，这么来做）读取views目录下的指定文件，解析并返回给客户端，第一个参数是模版文件，第二个参数是传递给模版使用的数据；
//   res.render('index');
// })
//----------------------------------------
//【静态文件托管】-1.css文件路由-基础使用
// app.get('/main.css', function(req, res, next) {
//   res.setHeader('content-type', 'text/css'); // 默认发送get请求，默认发送 'text/html'，重启然后清除缓存
//   res.send('body {background: #ddd;}');
// })



//【数据库链接】-2
mongoose.connect('mongodb://localhost:27018/blog', function(err) {

  if (err) {
    console.log('数据库连接失败！' + err);
  } else {
    console.log('数据库链接成功，开始代码吧～');
    app.listen(8081);
  }


})



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
 * 四、静态文件托管
 *  1. css文件路由
 *  2. 静态文件托管
 *      使用express框架提供的静态文件托管的处理，app.use()
 * 阶段总结：
 *  1. 用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则 -> 执行指定的绑定函数，返回对应内容至客户
 *  2. 静态文件处理
 *      /public -> 处理静态文件 -> 直接读取制定目录下的文件，返回用户
 *  3. 动态数据处理
 *      / -> 动态 -> 处理业务逻辑，加载模版，解析模版 -> 返回数据给用户
 * 五、分模块发开的实现
 *  1. 划分模块
 *      根据更能进行模块划分：前台模块／后台管理模块／api模块
 *      使用app.use()进行模块划分：app.use('/admin', require('./router/admin')); //后台管理
 *                              app.use('/api', require('./router/api'));
 *                              app.use('/', require('./router/mian')); //前台展示
 *  2. 前台路由 + api路由 + 后台路由
 *      a. main模块
 *          /                     首页
 *          /view                 内容页
 *      b. api模块
 *          ／                    首页
 *          ／register            用户注册
 *          ／login               用户登陆
 *          ／comment             评论获取
 *          ／comment/post        评论提交
 *      c. admin模块
 *              ／                首页
 *          用户管理
 *              /user             用户列表
 *          分类管理
 *              /category         分类列表
 *              /category/add     分类添加
 *              /category/edit    分类编辑
 *              /category/delete  分类删除
 *          文章内容管理
 *              /article          内容列表
 *              /article/add      内容添加
 *              /article/edit     内容编辑
 *              /article/delete   内容修改
 *          评论内容管理
 *              /comment          评论列表
 *              /comment/delete   评论删除
 * 开发总结
 *  1. 功能模块开发顺序
 *        用户：登陆功能／注册功能／管理员验证
 *        栏目：先后台管理／后前台展示
 *        内容：先后台 后前台
 *        评论：先后台 后前台
 *  2. 编码顺序
 *        通过 Schema 定义设计数据储存结构：定义数据库结构，如先定义存储用户信息的数据库结构
 *        功能逻辑：功能逻辑
 *        页面展示：前台功能实现
 * 六、用户注册
 *  1. UserSchema 结构设计
 *        a. 加载数据库模块
 *        b. 连接数据库
 *        c. 开启mongodb数据库，官网：www.mongodb.com
 *              安装mongodb数据库
 *              命令行启动数据库：mongod --dbpath=当前项目的db文件夹 --port=27018
 *              /Users/shihangbo/Documents/download/mongodb-osx-x86_64-3.6.0/bin/mongod --dbpath=/Users/shihangbo/Documents/project/watsonBlog/db --port=27018
 *        d. 图形界面管理软件
 *        e. 定义 schema 表结构
 *        f. 定义 model 类来操作增删改查
 *  2. 注册界面
 *  3. 注册逻辑：使用ajax方式实现注册，api接口编写
 *  4. 注册实现
 *  5. 用户登陆实现
 * 七、cooikes 实现
 *  1. 引入依赖 cookies
 *  2. 设置 cookies -- 通过 express 中间件，注入 req 对象中
 *      服务器判断是否是登陆状态的原理：验证客户端的请求头部信息中的 cookies 信息
 *  3. 解析的登陆用户的cookies信息
 *  4. cookies信息分配到模版
 *  5. 退出，删除 cookies 信息
 * 八、普通用户和管理员功能的实现
 *  1. 数据结构新增字段：isAdmin //是否是管理员
 *  2. 管理员数据需要实时验证，在入口文件进行处理
 *  3. 模板中注入管理员逻辑
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */