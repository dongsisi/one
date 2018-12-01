// 一进入页面，想后台发送ajax请求，查询当前用户是否登录过，
// 如果没有登录过，登录拦截，回到login页面重新登录
$(function(){

  $.ajax({
    url:"/employee/checkRootLogin",
    type:"get",
    dataType:"json",
    success:function( info ){
      console.log(info);
    }
  })

})