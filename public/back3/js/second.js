$(function(){
  var currentPage=1;
  var pageSize=5;

  render();
  function render(){
    $.ajax({
      url:'/category/querySecondCategoryPaging',
      type:'get',
      dataType:'json',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function( info ){
        console.log(info);
        var htmlStr = template('secondTpl',info);
        $('tbody').html(htmlStr);
        //分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            console.log(page);
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
    $('#secondModal').modal('show');
    //发送请求，获取一级分类的全部数据
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100,
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }

    })
  })

  //3.给下拉列表的a注册点击事件（事件委托）
  $('.dropdown-menu').on("click", 'a', function() {
    // 获取文本值
    var txt = $(this).text();
    // 设置给按钮
    $('#dropdownText').text( txt );

    // 获取 id
    var id = $(this).data("id");
    // 设置给隐藏域
    $('[name="categoryId"]').val( id );

    // 调用updateStatus更新 隐藏域 校验状态成 VALID
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  });

   // 4. 配置文件上传插件, 让插件发送异步文件上传请求
   $('#fileupload').fileupload({
    //返回的数据
    dataType:'json',
    //文件上传的回调函数
    done:function(e,data){
      console.log(data.result); //后台返回的对象
      var picObj = data.result;
      //获取图片对象的地址用picURL接收
      var picUrl = picObj.picAddr;
      //把获取到的图片地址赋值给图片
      $('#imgBox img').attr('src',picUrl);
      //同时也把地址赋值给隐藏域
      $('[name="brandLogo"]').val(picUrl);
      //更新状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
    }
   })
   //5.表单校验功能
   $('#form').bootstrapValidator({
     excluded: [],
     //配置校验图片
     feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置校验字段
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请选择二级分类"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
   })
   //注册校验成功的事件，阻止表单默认提交，发送ajax请求
   $('#form').on("success.form.bv", function( e ) {

    e.preventDefault(); // 阻止默认的提交

     $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success:function( info ){
        console.log(info);
        if(info.success){
          console.log(11)
          $('#secondModal').modal('hide');
          currentPage = 1;
          render();
          //重置表单内容
          $('#form').data('bootstrapValidator').resetForm(true);
          //由于下拉了菜单和上传图片不是表单元素，需要手动重置
          $('#dropdownText').text('请选择一级分类');
          $('#imgBox img').attr('src',"./images/none.png")
        }
      }
     })
   })
})