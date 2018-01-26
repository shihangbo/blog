
$(function() {
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
        renderComment(responseData.data.comments)
      }
    })
  })

  function renderComment(comments) {
    var html = ""
    for (var i = 0; comments.length > i; i++) {
      html +=
        "<div class='messageBox'><p class='name clear'><span class='fl'>"
        +comments[i].username+
        "</span><p class='fr'>"
        +comments[i].postTime+
        "</p></p><p>"
        +comments[i].content+
        "</p></div>"
    }
    $('.messageList').html(html)
  }
})