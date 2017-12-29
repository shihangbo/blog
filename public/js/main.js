/**
 * Created by watson on 2017/12/28
*/

(function() {
  //box区域控制
  var loginBox = document.getElementById('loginBox');
  var registerBox = document.getElementById('registerBox');
  //切换界面
  var registerBoxShow = document.getElementById('registerBoxShow');
  var loginBoxShow = document.getElementById('loginBoxShow');
  //注册登陆按钮
  var register = document.getElementById('register');
  var login = document.getElementById('login');


  registerBoxShow.addEventListener('click', function() {
    loginBox.style.display = 'none';
    registerBox.style.display = 'block';
  }, false);

  loginBoxShow.addEventListener('click', function() {
    loginBox.style.display = 'block';
    registerBox.style.display = 'none';
  }, false);

  //注册请求
  register.addEventListener('click', function() {
    var registerUsername = document.getElementById('registerUsername').value;
    if (!registerUsername) return alert('请输入注册用户名');
    var registerPassword = document.getElementById('registerPassword').value;
    if (!registerPassword) return alert('请输入注册密码');

    var data = 'username=' + registerUsername + '&password=' + registerPassword
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    xhr.open('POST', '/api/user/register', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        console.log('请求成功:' + xhr.responseText);
        doResponse.bind(this, xhr.responseText);
      } else {
        console.log('请求失败: ' + xhr.status);
      }
    }
    xhr.send(data);


  }, false);

  function doResponse(res) {
    console.log('doResponse函数处理: ' + res);
  }

})()