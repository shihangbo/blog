/**
 * Created by watson on 2017/12/28
*/

//jq实现
$(function() {
  var self = this;

  $('#registerBoxShow').on('click', function() {
    $('#loginBox').addClass('hide').removeClass('show');
    $('#registerBox').addClass('show').removeClass('hide');
    $('#welcomeBox').addClass('hide').removeClass('show');
  });

  $('#loginBoxShow').on('click', function() {
    $('#loginBox').addClass('show').removeClass('hide');
    $('#registerBox').addClass('hide').removeClass('show');
    $('#welcomeBox').addClass('hide').removeClass('show');
  });

  //退出操作
  $('#quit').on('click', function() {

    request('GET', '/api/user/logout', null).then(function() {
      window.location.reload();
    })
  })

  //注册请求
  $('#register').on('click', function() {
    var data = 'username=' + $('#registerUsername').val() + '&password=' + $('#registerPassword').val() +'&repassword=' + $('#repeatRegisterPassword').val()
    request('POST', '/api/user/register', data).then(function(res) {
      setTimeout(function() {
        $('#loginBox').addClass('show').removeClass('hide');
        $('#registerBox').addClass('hide').removeClass('show');
      }, 1000);
      //清空信息
      $('#registerUsername').val('');
      $('#registerPassword').val('');
      $('#repeatRegisterPassword').val('');
    }).catch(function(res) {
      $('#failResponseText').html(res.message);
      //清空信息
      $('#registerUsername').val('');
      $('#registerPassword').val('');
      $('#repeatRegisterPassword').val('');
    })
  })

  //登陆请求
  $('#login').on('click', function() {
    var data = 'username=' + $('#loginUsername').val() + '&password=' + $('#loginPassword').val();
    request('POST', '/api/user/login', data).then(function(res) {
      window.location.reload();
    }).catch(function(res) {
      $('#loginFailResponseText').html(res.message);
      //清空数据
      $('#loginPassword').val('');
    })
  })

  //封装原生ajax
  function request(type, url, data) {
    return new Promise(function(resolve, reject) {
      var xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
          // console.log('请求成功:' + xhr.responseText);
          response = JSON.parse(xhr.responseText);
          if (!JSON.parse(response.code)) { //注册成功操作，为 0 代表成功
            resolve(response);
          } else { //注册失败操作
            reject(response);
          }
  
        }
      }
      if (type === 'GET') {
        xhr.open(type, url + '?' + data, true);
        xhr.send(null);
      } else if (type === 'POST') {
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
      }
    })
  }
})


//原生实现 --- 由于模版的定向返回，前台使用原生代码报错，找不到对应的html的id属性。
// (function() {
//   var self = this;
//   //box区域控制
//   var loginBox = document.getElementById('loginBox');
//   var registerBox = document.getElementById('registerBox');
//   var welcomeBox = document.getElementById('welcomeBox');
//   //切换界面
//   var registerBoxShow = document.getElementById('registerBoxShow');
//   var loginBoxShow = document.getElementById('loginBoxShow');
//   //注册登陆按钮
//   var register = document.getElementById('register');
//   var login = document.getElementById('login');
//   //失败的html
//   var failResponseTextDom = document.getElementById('failResponseText'); 
//   //退出按钮
//   var quitBtn = document.getElementById('quit');

//   $(registerBoxShow).on('click', function() {
//     cosnole.log(123)
//   })
//   registerBoxShow.addEventListener('click', function() {
//     loginBox.style.display = 'none';
//     registerBox.style.display = 'block';
//     welcomeBox.style.display = 'none';
//   }, false);

//   loginBoxShow.addEventListener('click', function() {
//     loginBox.style.display = 'block';
//     registerBox.style.display = 'none';
//     welcomeBox.style.display = 'none';
//   }, false);

//   //退出操作
//   quitBtn.addEventListener('click', function() {
//     loginBox.style.display = 'block';
//     registerBox.style.display = 'none';
//     welcomeBox.style.display = 'none';
//   }, false)

//   //注册请求
//   register.addEventListener('click', function() {
//     var registerUsername = document.getElementById('registerUsername').value;
//     // if (!registerUsername) return alert('请输入注册用户名');
//     var registerPassword = document.getElementById('registerPassword').value;
//     // if (!registerPassword) return alert('请输入注册密码');
//     var repeatRegisterPassword = document.getElementById('repeatRegisterPassword').value;
//     // if (!repeatRegisterPassword) return alter('请重复输入注册密码');
//     var data = 'username=' + registerUsername + '&password=' + registerPassword +'&repassword=' + repeatRegisterPassword
//     request('POST', '/api/user/register', data).then(function(res) {
//       setTimeout(function() {
//         loginBox.style.display = 'block';
//         registerBox.style.display = 'none';
//       }, 1000);
//       //清空信息
//       document.getElementById('registerUsername').value = '';
//       document.getElementById('registerPassword').value = '';
//       document.getElementById('repeatRegisterPassword').value = '';
//     }).catch(function(res) {
//       failResponseTextDom.innerHTML = res.message;
//       //清空信息
//       document.getElementById('registerUsername').value = '';
//       document.getElementById('registerPassword').value = '';
//       document.getElementById('repeatRegisterPassword').value = '';
//     })
//   }, false)

//   //登陆请求
//   login.addEventListener('click', function() {
//     var loginUsername = document.getElementById('loginUsername').value;
//     var loginPassword = document.getElementById('loginPassword').value;

//     var data = 'username=' + loginUsername + '&password=' + loginPassword;
//     request('POST', '/api/user/login', data).then(function(res) {
//       document.getElementById('welcomeText').innerHTML = '欢迎回来：' + res.userInfo.username;
//       loginBox.style.display = 'none';
//       registerBox.style.display = 'none';
//       welcomeBox.style.display = 'block';
//       //清空数据
//       document.getElementById('loginUsername').value = '';
//       document.getElementById('loginPassword').value = '';
//     }).catch(function(res) {
//       document.getElementById('loginFailResponseText').innerHTML = res.message;
//       //清空数据
//       document.getElementById('loginPassword').value = '';
//     })

//   }, false)

//   //封装原生ajax
//   function request(type, url, data) {
//     return new Promise(function(resolve, reject) {
//       var xhr = null;
//       if (window.XMLHttpRequest) {
//         xhr = new XMLHttpRequest();
//       } else {
//         xhr = new ActiveXObject('Microsoft.XMLHttp');
//       }
//       xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
//           // console.log('请求成功:' + xhr.responseText);
//           response = JSON.parse(xhr.responseText);
//           if (!JSON.parse(response.code)) { //注册成功操作，为 0 代表成功
//             resolve(response);
//           } else { //注册失败操作
//             reject(response);
//           }
  
//         }
//       }
  
//       if (type === 'GET') {
//         xhr.open(type, url + '?' + data, true);
//         xhr.send(null);
//       } else if (type === 'POST') {
//         xhr.open(type, url, true);
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.send(data);
//       }
//     })
//   }
// })()
