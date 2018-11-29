$(function(){
//1.表单校验配置
$('#form').bootstrapValidator({
  //配置校验图标
  feedbackIcons:{
    valid:'glyphicon glyphicon-ok',
    invalid:'glyphicon glyphicon-remove',
    validating:'glyphicon glyphicon-refresh'
  },
  //指定校验字段
  fields:{
    //校验用户名
    username:{
      validators:{
        //非空检验
        notEmpty:{
          message:'用户名不能为空'
        },
        //长度校验
        stringLength:{
          min:2,
          max:6,
          message:"用户名长度必须2-6位"
        }
      }
    },
    //校验密码
    password:{
      validators:{
        //非空检验
        notEmpty:{
          message:'密码不能为空'
        },
        //长度检验
        stringLength:{
          min:6,
          max:12,
          message:"密码长度必须6-12位"
        }
      }
    }
  }
});

// 当表单校验成功时，会触发success.form.bv事件，此时会提交表单，这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交
$('#form').on('success.form.bv',function(e){
//阻止默认跳转
  e.preventDefault();

  //使用ajax提交
  $.ajax({
    type:'post',
    url:"/employee/employeeLogin",
    data:$('#form').serialize(),
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.error === 1000){
        alert('用户名不存在');
        return;
      }
      if(info.error === 1001){
        alert('密码错误');
        return;
      }
      if(info.success){
        location.href = "index.html";
      }
    }
  })

});
 /*
  * 3. 重置功能, 本身重置按钮, 就可以重置内容, 需要额外的重置状态
  * */
 $('[type="reset"]').click(function(){
   $('#form').data('bootstrapValidator').resetForm();
 })




})