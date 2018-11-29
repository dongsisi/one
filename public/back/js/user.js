$(function(){
 var currentPage = 1;//当前页
 var pageSize = 5;//每页条数
 var currentId;
 var isDelete;
  //一进入页面，向后台发送请求，请求数据列表，后天返回数据，渲染页面
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      dataType:'json',
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function( info ){
        console.log( info );
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);
        // 在ajax请求回来后, 根据最新的数据, 进行初始化分页插件
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

//给所有的按钮，添加点击事件（事件委托）
$('tbody').on('click','.btn',function(){
  //显示模态框
  $('#userModal').modal('show');
  //获取用户ID
  currentId = $(this).parent().data('id');
  // 根据按钮的类名, 决定修改用户成什么状态 0=禁用
    // 禁用按钮 ? 0 : 1;
    isDelete = $(this).hasClass('btn-danger') ? 0: 1;
})
//模态框确认按钮被点击，应该发送ajax请求
$('#comfirmBtn').click(function(){
  $.ajax({
    type:'post',
    url:'/user/updateUser',
    dataType:'json',
    data:{
      id:currentId,
      isDelete:isDelete
    },
    success:function( info ){
      console.log( info );
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