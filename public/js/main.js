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
    var obj = new XMLHttpRequest();
    obj.open("POST", '/api/user/register', true);
    obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  // 添加http头，发送信息至服务器时内容编码类型
    obj.onreadystatechange = function() {
        if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
          console.log(obj);
        } else {
          console.log(obj);
        }
    };
    obj.send(data);




  }, false);

})()