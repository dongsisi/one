// 功能1.进度条
// 进度条基本使用
//NProgress.start(); // 开启进度条
//
//
//setTimeout(function() {
//  NProgress.done(); // 关闭进度条
//}, 1000)

// 需求:
// 第一个ajax发送的时候, 开启进度条
// 等待所有的ajax都完成后, 关闭进度条

// ajax全局事件

// .ajaxComplete()  每个ajax 完成时调用 (不管成功还是失败)
// .ajaxSuccess()   每个ajax 只要成功了就会调用
// .ajaxError()     每个ajax 只要失败了就会调用
// .ajaxSend()      在每个ajax 发送前调用

// .ajaxStart()     在第一个ajax请求开始时调用
// .ajaxStop()      在所有的ajax请求都完成时调用

//jquery的全局事件需要给document注册（固定写法）
$(document).ajaxStart(function(){
  //开启进度条
  NProgress.start();

  $(document).ajaxStop(function(){
    //模拟网络延迟 (不写时间，默认400)
    setTimeout(function(){
      //关闭进度条
      NProgress.done();
    })
  });

  $(function(){
  //功能二：公共功能
  //左侧侧边栏切

  $('.category').click(function() {
    $(this).next().stop().slideToggle();
  })

  //功能2：左侧侧边栏切换
  $('.icon_left').click(function(){
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
    $('.lt_topbar').toggleClass('hidemenu');
  })



  //功能3：点击按钮显示模态框
  $('.icon_right').click(function(){
    // console.log(111)
    $('#lagoutModal').modal('show');
   })
//功能3.2：点击模态框的退出按钮，退出
$('#logoutBtn').click(function(){
  console.log(111)
  //向后台发送请求，销毁当前用户的登录状态
  $.ajax({
    url:"/employee/employeeLogout",
    type:"get",
    dataType:'json',
    success:function( info ){
      console.log(info);
      if(info.success){
        //成功，跳转登录页
        location.href = "login.html";
      }
    }
  })
})

  })
 })