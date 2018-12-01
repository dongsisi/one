

$(function(){
  var currentPage = 1;
  var pageSize = 5;

  var currentId; //当前的用户ID
  var isDelete; //状态：是否启用或禁止
  //1、一进入页面，发送ajax请求，请求数据列表，渲染当前页面
  render();
 function render(){
  $.ajax({
    url:'/user/queryUser',
    type:'get',
    dataType:'json',
    data:{
      page:currentPage,
      pageSize:pageSize,
    },
    success:function( info ){
      console.log(info);

      var htmlStr = template('tmp',info);
      $('tbody').html(htmlStr);
      //返回结果后，进行分页初始化
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion:3,
        currentPage:info.page,
        totalPages:Math.ceil(info.total/info.size),
        onPageClicked:function(a,b,c,page){
          console.log(page);
          //更新当前页
          currentPage = page;
          //重新渲染
          render();
        }
      })

    }
  })
}
//2.给所有的按钮添加点击事件（事件委托）
$('tbody').on('click','.btn',function(){
  //显示提示的模态框
  $('#userModal').modal('show');
  //获取按钮的id（通过添加的自定义ID）
   currentId = $(this).parent().data('id');
  //  console.log(currentId);
   //根据状态，修改 0：禁用 1 启用  增加类名
  //  console.log(111)
  isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  // isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  
})

//3.模态框确认按钮被点击后，发送ajax请求，修改用户状态
$('#comfirmBtn').click(function(){
  $.ajax({
    url:'/user/updateUser',
    type:'post',
    data:{
      id:currentId,
      isDelete:isDelete
    },
    dataType:'json',
    success:function( info ){
      console.log(info);
      if(info.success){
        //关闭模态框
        $('#userModal').modal('hide');
        //重新渲染
        render();
      }
    }
  })
})

})