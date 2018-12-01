$(function(){

var currentPage = 1;
var pageSize = 5;

render();
function render(){
  $.ajax({
    url:'/category/queryTopCategoryPaging',
    type:'get',
    dataType:'json',
    data:{
      page:currentPage,
      pageSize:pageSize,
    },
    success:function( info ){
      console.log(info);
      var htmlStr = template('firstTpl',info);
      $('tbody').html(htmlStr);
      //分页初始化
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

//2.点击添加按钮，显示模态框
$('#addBtn').click(function(){
  $('#firstModal').modal('show');
})

//3.进行表单校验
$("#form").bootstrapValidator({
 // 配置校验图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',    // 校验成功
    invalid: 'glyphicon glyphicon-remove',   // 校验失败
    validating: 'glyphicon glyphicon-refresh'  // 校验中
  },
  //配置字段校验
  fields:{
   categoryName:{
     validators:{
       notEmpty:{
         message:"请输入一级分类名称："
       }
     }
   }
  }
})

//4.注册表单校验成功事件，阻止默认跳转，发送ajax请求提交
$('#form').on('success.form.bv',function(e){
  e.preventDefault();
  $.ajax({
    url:'/category/addTopCategory',
    type:'post',
    data:$('#form').serialize(),
    dataType:'json',
    success:function( info ){
      console.log(info);
      if(info.success){
        //关闭模态框
        $('#firstModal').modal('hide');
        //重新渲染
        currentPage = 1;
        render();
        //重置表单的内容和状态
        $('#form').data('bootstrapValidator').resetForm(true);
      }
    }
  })
})
})