
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
        console.log(responseData);
      }
    })
  })
})