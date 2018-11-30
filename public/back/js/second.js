$(function(){
  var currentPage = 1;
  var pageSize = 5;
  
render();
  function render(){
    $.ajax({
      url:'/category/querySecondCategoryPaging',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function( info ){
        console.log(info);
        var htmlStr = template('secondTpl',info);
        $('tbody').html(htmlStr);

        //得到返回后，初始化分页
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

  //1.添加一个添加按钮，显示添加的模态框
  $('#addBtn').click(function(){
    $('#addModal').modal('show');
     // 2.发送请求, 获取一级分类的全部数据
    // 通过写死 page 和 pageSize 模拟获取全部一级分类的接口
    $.ajax({
      url:'/category/queryTopCategoryPaging',
      type:'get',
      dataType:'json',
      data:{
        page:1,
        pageSize:100,
      },
      success:function( info ){
        console.log( info );
        var htmlStr = template('dropdownTpl',info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
//3.给下拉列表的a 注册点击事件（通过事件委托）
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
})

  //4. 配置文件上传插件, 让插件发送异步文件上传请求
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e,data){
      // console.log(data.result);

      var picObj = data.result; // 后台返回的数据
      // 获取图片地址, 设置给 img src
      var picUrl = picObj.picAddr;
      $('#imgBox img').attr('src',picUrl);
      // 给隐藏域设置图片地址
      $('[name="brandLogo"]').val( picUrl );
      $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID"); 
    }
  })
  })

 // 5. 添加表单校验功能
  $('#form').bootstrapValidator({
    // 重置排除项, 都校验, 不排除
    excluded: [],
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 指定校验字段
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
       balidators:{
         notEmpty:{
           message:"请上传图片"
         }
       }
     }
   }
  })

//6.注册表单校验成功事件，阻止默认的提交，通过ajax提交
$('#form').on('success.form.bv',function(e){
  e.preventDefault();
  $.ajax({
    url:'/category/addSecondCategory',
    type:'post',
    dataType:'json',
    data:$('#form').serialize(),
    success:function( info ){
      console.log(info);
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