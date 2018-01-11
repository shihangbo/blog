

/**
 * Created by watson on 2017/12/26
*/

//引入express框架
var express = require('express');
//创建路由对象
var router = express.Router();

var User = require('../models/users');
var Category = require('../models/categories');
var Content = require('../models/content');

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

//分类首页前台页面
router.get('/category', function(req, res, next) {

  //当前页
  var page = Number(req.query.page || 1);
  //每页条数
  var limit = 10;
  //总条数 count
  //总页数
  var pages = 0;
  //分页跨度
  var skip = 0;

  Category.count().then(function(count) {
    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);

    skip = (page - 1) * limit;
    // sort函数排序，1代表升序，-1代表降序
    Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(pagesInfo) {
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        pagesInfo: pagesInfo,
        count: count,
        pages: pages,
        limit: limit,
        page: page
      });
    })
  })


})

//分类的添加前台页面
router.get('/category/add', function(req, res, next) {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})

//post分类的保存ajax
router.post('/category/add', function(req, res, next) {

  var name = req.body.name || '';
  //验证name是否为空值
  if (name === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,// 1为成功，2为失败
      message: '名称不能为空',
      url: '/admin/category/add'
    });
    return
  }
  //验证数据库中是否存在name
  Category.findOne({
    name: name
  }).then(function(rs) {
    //如果存在
    if (rs) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        status: 2,
        message: '该分类已存在'
      })
      return Promise.reject();
    } else {
      //加入数据库
      return new Category({
        name: name
      }).save();
    }
  }).then(function(newCategory) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 1,
      message: name + '，保存成功！',
      url: '/admin/category'
    })
  })

})

//分类修改页面/admin/category/edit
router.get('/category/edit', function(req, res, next) {
  var id = req.query.id || '';
  Category.findOne({
    _id: id
  }).then(function(category) {
    if (category) {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      });
    } else {
      res.render('admin/error', {
        userInfo: req.userInfo,
        status: 2,
        message: '分类信息不存在',
        url: '/admin/category'
      })
    }
  })
})

//分类修改接口
router.post('/category/edit', function(req, res, next) {

  var id = req.query.id || '';
  var name = req.body.name || '';

  // 提交为空处理
  if (!name) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,
      message: '分类名称不能为空',
      url: '/admin/category'
    })
    return;
  }
  Category.findOne({
    _id: id
  }).then(function(category) {
    if (category) {
      //当前修改是否等于原本值，即用户没有修改进行提交
      if (name === category.name) {
        res.render('admin/error', {
          userInfo: req.userInfo,
          status: 1,
          message: '修改成功！',
          url: '/admin/category'
        })
        return Promise.reject();
      } else { //当前修改值是否已存在于数据库中
        return Category.findOne({
          _id: {$ne: id}, //不等于id，但name相等
          name: name
        })
      }
    } else {
      res.render('admin/error', {
        userInfo: req.userInfo,
        status: 2,
        message: '分类信息不存在',
        url: '/admin/category'
      })
      return Promise.reject();
    }
  }).then(function(rs) {
    if (rs) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        status: 2,
        message: '数据库中已存在该分类名称: '+ name +'，修改失败！',
        url: '/admin/category'
      })
      return Promise.reject();
    } else {
      return Category.update({
        _id: id //修改条件
      }, {
        name: name // 修改值
      })
    }
  }).then(function() {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 1,
      message: '修改成功！',
      url: '/admin/category'
    })
  })

})


//分类删除/admin/category/delete
router.get('/category/delete', function(req, res, next) {
  var id = req.query.id || '';

  Category.remove({
    _id: id
  }).then(function() {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 1,
      message: '删除成功！',
      url: '/admin/category'
    })
  })
})

// 内容首页
router.get('/content', function(req, res, next) {

   //当前页
   var page = Number(req.query.page || 1);
   //每页条数
   var limit = 10;
   //总条数 count
   //总页数
   var pages = 0;
   //分页跨度
   var skip = 0;
 
   Content.count().then(function(count) {
     pages = Math.ceil(count / limit);
     page = Math.min(page, pages);
     page = Math.max(page, 1);
 
     skip = (page - 1) * limit;
     // sort函数排序，1代表升序，-1代表降序
     Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category', 'user']).sort({
       addTime: -1
     }).then(function(contents) {
      res.render('admin/content_index', {
         userInfo: req.userInfo,
         contents: contents,
         count: count,
         pages: pages,
         limit: limit,
         page: page
       });
     })
   })

})
// 内容添加
router.get('/content/add', function(req, res, next) {

  Category.find().sort({_id: -1}).then(function(categories) {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })

})
// 内容添加ajax提交数据库
router.post('/content/add', function(req, res, next) {

  if (!req.body.category) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,
      message: '文章分类不能为空!',
      url: '/admin/content/add'
    })
    return
  }

  if (!req.body.title) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,
      message: '文章标题不能为空!',
      url: '/admin/content/add'
    })
    return
  }
  new Content({
    category: req.body.category,
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content,
    user: req.userInfo._id.toString()
  }).save().then(function(rs) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 1,
      message: '文章保存成功!',
      url: '/admin/content'
    })
  })

})

//文章修改页面获取
router.get('/content/edit', function(req, res, next) {
  
  var id = req.query.id || '';

  if (!id) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,
      message: '没有对应的文章信息',
      url: '/admin/content'
    })
  }

  Category.find().sort({_id: -1}).then(function(categories) {
    Content.findOne({
      _id: id
    }).then(function(content) {
      if (!content) {
        res.render('admin/error', {
          userInfo: req.userInfo,
          status: 2,
          message: '没有对应的文章信息',
          url: '/admin/content'
        })
      } else {
        res.render('admin/content_edit', {
          userInfo: req.userInfo,
          content: content,
          categories: categories
        })
      }
    })
  })

})

//文章修改接口处理
router.post('/content/edit', function(req, res, next) {
  var id = req.query.id || '';
  if (!req.body.category) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,
      message: '文章分类不能为空!',
      url: '/admin/content/add'
    })
    return
  }

  if (!req.body.title) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 2,
      message: '文章标题不能为空!',
      url: '/admin/content/add'
    })
    return
  }

  Content.update({
    _id: id
  }, {
    category: req.body.category,
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content
  }).then(function() {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 1,
      message: '修改成功！',
      url: '/admin/content'
    })
  })

})

//文章删除接口处理
router.get('/content/delete', function(req, res, next) {
  var id = req.query.id || '';

  Content.remove({
    _id: id
  }).then(function() {
    res.render('admin/error', {
      userInfo: req.userInfo,
      status: 1,
      message: '删除成功！',
      url: '/admin/content'
    })
  })

})


//对app.use()暴露路由对象
module.exports = router;
