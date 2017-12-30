/**
 * Created by watson on 2017/12/28
*/

(function() {
  var self = this;
  //box区域控制
  var loginBox = document.getElementById('loginBox');
  var registerBox = document.getElementById('registerBox');
  var welcomeBox = document.getElementById('welcomeBox');
  //切换界面
  var registerBoxShow = document.getElementById('registerBoxShow');
  var loginBoxShow = document.getElementById('loginBoxShow');
  //注册登陆按钮
  var register = document.getElementById('register');
  var login = document.getElementById('login');
  //失败的html
  var failResponseTextDom = document.getElementById('failResponseText'); 
  //退出按钮
  var quitBtn = document.getElementById('quit');

  registerBoxShow.addEventListener('click', function() {
    loginBox.style.display = 'none';
    registerBox.style.display = 'block';
    welcomeBox.style.display = 'none';
  }, false);

  loginBoxShow.addEventListener('click', function() {
    loginBox.style.display = 'block';
    registerBox.style.display = 'none';
    welcomeBox.style.display = 'none';
  }, false);

  //退出操作
  quitBtn.addEventListener('click', function() {
    loginBox.style.display = 'block';
    registerBox.style.display = 'none';
    welcomeBox.style.display = 'none';
  }, false)

  //注册请求
  register.addEventListener('click', function() {
    var registerUsername = document.getElementById('registerUsername').value;
    // if (!registerUsername) return alert('请输入注册用户名');
    var registerPassword = document.getElementById('registerPassword').value;
    // if (!registerPassword) return alert('请输入注册密码');
    var repeatRegisterPassword = document.getElementById('repeatRegisterPassword').value;
    // if (!repeatRegisterPassword) return alter('请重复输入注册密码');

    var data = 'username=' + registerUsername + '&password=' + registerPassword +'&repassword=' + repeatRegisterPassword
    request('POST', '/api/user/register', data).then(function(res) {
      setTimeout(function() {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
      }, 1000);
      //清空信息
      document.getElementById('registerUsername').value = '';
      document.getElementById('registerPassword').value = '';
      document.getElementById('repeatRegisterPassword').value = '';
    }).catch(function(res) {
      failResponseTextDom.innerHTML = res.message;
      //清空信息
      document.getElementById('registerUsername').value = '';
      document.getElementById('registerPassword').value = '';
      document.getElementById('repeatRegisterPassword').value = '';
    })

  }, false)

  //登陆请求
  login.addEventListener('click', function() {
    var loginUsername = document.getElementById('loginUsername').value;
    var loginPassword = document.getElementById('loginPassword').value;

    var data = 'username=' + loginUsername + '&password=' + loginPassword;
    request('POST', '/api/user/login', data).then(function(res) {
      document.getElementById('welcomeText').innerHTML = '欢迎回来：' + res.username;
      loginBox.style.display = 'none';
      registerBox.style.display = 'none';
      welcomeBox.style.display = 'block';
      //清空数据
      document.getElementById('loginUsername').value = '';
      document.getElementById('loginPassword').value = '';
    }).catch(function(res) {
      document.getElementById('loginFailResponseText').innerHTML = res.message;
      //清空数据
      document.getElementById('loginUsername').value = '';
      document.getElementById('loginPassword').value = '';
    })

  }, false)


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
      } else if (type === 'POST') {
        xhr.open(type, url, true);
      }
      
      if (type === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
      
      if (type === 'GET') {
        xhr.send(null);
      } else if(type === 'POST') {
        xhr.send(data);
      }
    })
    
  }

})()