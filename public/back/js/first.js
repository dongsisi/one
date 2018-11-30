$(function(){
var currentPage = 1;
var pageSize = 5;

render();
function render(){
    $.ajax({
      url:'/category/queryTopCategoryPaging',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function( info ){
        console.log( info );
        var htmlStr = template('firstTpl',info);
        $('tbody').html(htmlStr);

        //数据回来后，对分页进行初始化
        $('#piginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            // console.log(11)
            console.log(page);
            currentPage = page;
            render();
          }
        })
        
      }
    })

  }
//2.点击添加按钮，显示模态框
$('#addBtn').click(function(){
  //显示模态框
  $('#addModal').modal('show');

  //3.进行表单校验
console.log(111)
$('#form').bootstrapValidator({

  // 配置校验图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',    // 校验成功
    invalid: 'glyphicon glyphicon-remove',   // 校验失败
    validating: 'glyphicon glyphicon-refresh'  // 校验中
  },

  // 校验字段
  fields: {    // input框中需要配置 name
    categoryName: {
      validators: {
        notEmpty: {
          message: "请输入一级分类名称"
        }
      }
    }
  }
});
console.log(222)
//4.注册表单校验成功事件，阻止默认的提交，通过ajax提交
$('#form').on('success.form.bv',function(e){
  e.preventDefault();
  $.ajax({
    url:'/category/addTopCategory',
    type:'post',
    dataType:'json',
   data:$('#form').serialize(),
    success:function( info ){
      console.log( info );
      if(info.success){
        //关闭模态框
        $('#addModal').modal('hide');
        //重新渲染
        render();
      }
    }
  })
})

})


})