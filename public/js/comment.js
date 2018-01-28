
$(function() {

  var comments = undefined;

  $('#messageBtn').on('click', function() {
    $.ajax({
      type: 'POST',
      url: '/api/comment/post',
      data: {
        contentId: $('#contentId').val(),
        content: $('#messageContent').val()
      },
      success: function(responseData) {
        $("#messageContent").val("");
        comments = responseData.data.comments
        renderComment()
      }
    })
  })

  //每次进入页面都要进行请求评论
  $.ajax({
    type: 'GET',
    url: '/api/comment',
    data: {
      contentId: $('#contentId').val()
    },
    success: function(responseData) {
      comments = responseData.data
      renderComment()
    }
  })

  //分页处理
  var perpage = 5, page = 1, pages = 0, start = 0, end = 0;
  function handlePages() {
    // 中间 1/4
    var $lis = $('.page li')
    pages = Math.max(Math.ceil(comments.length / perpage), 1);
    $lis.eq(1).html(page + '/' + pages)
    // 处理没有上一页 没有下一页
    if (page <= 1) {
      page = 1;
      $lis.eq(0).html('<span>没有上一页</span>')
    } else {
      $lis.eq(0).html('<a href="javascript:;">上一页</a>')
    }
    if (page > pages) {
      page = pages;
      $lis.eq(2).html('<span>没有下一页</span>')
    } else {
      $lis.eq(2).html('<a href="javascript:;">下一页</a>')
    }
    //控制显示条数和页数
    start = Math.max((page - 1) * perpage, 0);
    end = Math.min(start + perpage, comments.length);
  }
  //下一页 上一页点击事件处理
  $('.page').delegate('a', 'click', function() {

    if ($(this).parent().hasClass('previous')) {
      page--
    } else {
      page++
    }
    renderComment()

  })

  //页面渲染函数
  function renderComment() {
    //分页处理
    handlePages();

    //没有评论的情况处理
    if (comments.length == 0) {
      $('.messageList').html('<div><p>还没有评论</p></div>')
    } else {
      //页面渲染
      var html = ""
      for (var i = start; end > i; i++) {
        html +=
          "<div class='messageBox'><p class='name clear'><span class='fl'>"
          +comments[i].username+
          "</span><p class='fr'>"
          +formatDate(comments[i].postTime)+
          "</p></p><p>"
          +comments[i].content+
          "</p></div>"
      }
      $('.messageList').html(html)
    }
    
    $('.messageCount').html(comments.length)
  }

  //格式化时间
  function formatDate(d) {
    var date = new Date(d)
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  }

})