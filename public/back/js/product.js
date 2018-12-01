$(function(){

  var currentPage = 1;
  var pageSize = 5;
  var picArr = []; //专门存储用来提交的图片对象
  render();
  function render(){
    $.ajax({
      url:'/product/queryProductDetailList',
      type:'get',
      dataType:'json',
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function( info ){
        console.log(info);
        var htmlStr = template('productTpl',info);
        $('tbody').html(htmlStr);
        //得到结果后，进行分页初始化
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
    $('#addModal').modal('show');
    //发送ajax请求，所有的二级分类列表
    $.ajax({
      url:'/category/querySecondCategoryPaging',
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
  })

  //3.给下拉列表的a添加点击事件（事件委托）
   $('.dropdown-menu').on('click','a',function(){
    //获取文本
    var txt = $(this).text();
    //赋值给按钮
    $('#dropdownText').text(txt);
    //获取ID
    var id = $(this).data('id');
    //赋值给隐藏域
    $('[name="brandId"]').val(id);
     // 将隐藏域的校验状态, 更新成 VALID
     $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  })

    //4.配置文件上传插件
    $('#fileupload').fileupload({
      //返回回来的数据
      dataType:'json',
      //文件上传的回调函数
      done:function(e,data){
        console.log(data.result);
        //将返回的结果用一个对象接收
        var picObj = data.result;
        //将上传的图片对象，添加到数组的最前面
        picArr.unshift(picObj);
        //用一个变量接收图片地址
        var picUrl = picObj.picAddr;
        //将每次上传完成的图片，放在结构的最面前
        $('#imgBox').prepend('<img src=" '+ picUrl +' " style="width:100px;">');
        //如果长度超过3，需要将最后一个移除
        if(picArr.length>3){
          //移除数组的最后一项
          picArr.pop();
          //从结构上，删除数组的最后一项
          $('#imgBox img:last-of-type').remove();//让他自杀
        }
        //如果上传长度等于3，当前picStatu的状态改成VALID
        if(picArr.length===3){
          //修改状态
          $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
        }
        
      }
      
    })

    //5.添加表单校验
    $('#form').bootstrapValidator({
      // 重置排除项, 都校验, 不排除
      excluded: [],
  
      // 配置校验图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',    // 校验成功
        invalid: 'glyphicon glyphicon-remove',   // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
      },
  
      // 配置校验字段
      fields: {
        brandId: {
          validators: {
            notEmpty: {
              message: "请选择二级分类"
            }
          }
        },
        proName: {
          validators: {
            notEmpty: {
              message: "请输入商品名称"
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: "请输入商品描述"
            }
          }
        },
        num: {
          validators: {
            notEmpty: {
              message: "请输入商品库存"
            },
            //正则校验
            // \d  0-9
            // ?   0次或1次
            // +   1次或多次
            // *   0次或多次
            // {n,m}  出现n次到m次
            // {n}  出现n次
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '商品库存格式, 必须是非零开头的数字'
            }
          }
        },
        size: {
          validators: {
            notEmpty: {
              message: "请输入商品尺码"
            },
            //正则校验
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: '尺码格式, 必须是 xx-xx格式, xx为两位数字, 例如 36-44'
            }
          }
        },
        oldPrice: {
          validators: {
            notEmpty: {
              message: "请输入商品原价"
            }
          }
        },
        price: {
          validators: {
            notEmpty: {
              message: "请输入商品现价"
            }
          }
        },
        picStatus: {
          validators: {
            notEmpty: {
              message: "请上传3张图片"
            }
          }
        }
      }
    });

    //6.注册一个表单校验成功事件，阻止默认表单提交，用ajax提交
    $('#form').on('success.form.bv',function(e){
      e.preventDefault();
      //表单提交的所有数据用一个变量接收
      var paramsStr = $('#form').serialize();
      //还需要额外的拼接图片的地址提交
    // paramsStr += "&picName1=xx&picAddr1=xx";
      paramsStr += "$picName1=" + picArr[0].picName + "$picAddr1 ="+ picArr[0].picAddr;   
      paramsStr += "$picName2=" + picArr[1].picName + "$picAddr2=" + picArr[1].picAddr ;   
      paramsStr += "$picName3=" + picArr[2].picName + "$picAddr3=" + picArr[2].picAddr ;  

      $.ajax({
        url:'/product/addProduct',
        type:'post',
        dataType:'json',
        data:paramsStr,
        success:function( info ){
          console.log( info );
          if(info.success){
            //关闭模态框
            $('#addModal').modal('show');
            //重新渲染第一呀
            currentPage = 1;
            render();
            //重置内容和状态
            $('#form').data('bootstrapValidator').resetForm(true);
            //按钮文本和上传图片需要手动重置
            $('#dropdownText').text('请选择二级分类：')
            $('#imgBox img').remove();
            picArr = [];
          }
        }
      })
    })
 

  
})