$(function(){

  var currentPage = 1;
  var pageSize = 5;
  var picArr = [];
  //1.一进入页面，请求数据，渲染页面
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
        console.log( info );
        var htmlStr = template('productTpl',info);
        $('tbody').html(htmlStr);
        //返回数据后，进行分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
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
    $('#productModal').modal('show');
    //3.发送ajax请求，所有的二级分类
    $.ajax({
      url:'/category/querySecondCategoryPaging',
      type:'get',
      dataType:'json',
      data:{
        page:1,
        pageSize:100,
      },
      success:function( info ){
        console.log(info);
        var htmlStr = template('dropdownTpl',info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })

  //4.给下拉列表的a添加点击事件（事件委托）
  $('.dropdown-menu').on('click','a',function(){
    // 获取文本, 赋值给按钮
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    //获取id，赋值给隐藏域
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    //修改校验状态
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  })

  //5.配置文件上传事件
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e,data){
     // console.log(data.result); 得到返回的数据
     var picObj = data.result;  //用picObje来接收
     //将上传的图片对象添加到数组的最前面
      picArr.unshift(picObj);
      //接收一下图片地址
      var picUrl = picObj.picAddr;
      //将每次上传完的图片地址放在数组的最面前
      $('#imgBox').prepend(' <img src=" '+picUrl+' " style="width:100px;"> ');
      //如果长度超过3，将最后一个删除
      if(picArr.length>3){
        picArr.pop(); //删除数组最后一项
        //从结构上删除最后一张照片
        $('#imgBox img:last-of-type').remove(); //自杀
      }
      //如果上传满了3张，修改状态
      if(picArr.length===3){
      $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
        
      }
    }
  });

//6.表单校验
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

  //7.注册一个表单校验成功的事件，阻止默认提交，通过AJAX提交
  $('#form').on("success.form.bv", function( e ) {
    e.preventDefault();
    var paramsStr = $('#form').serialize();
    //拼接图片数据
    // paramsStr += "&picName1=xx&picAddr1=xx";
    paramsStr += " &picName1="+picArr[0].picName+"&picAddr1"+picArr[0].picAddr ;
    paramsStr += " &picName2=" +picArr[1].picName+"&picAddr2"+picArr[1].picAddr;
    paramsStr += " &picName3=" +picArr[2].picName+"&picAddr3"+picArr[2].picAddr;
    
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success:function( info ){
        console.log(info);
        if(info.success){
          $('#productModal').modal('hide');
          currentPage = 1;
          render();
          //重置内容和状态
          $('#form').data('bootstrapValidator').resetForm(true);
          //手动重置下拉列表和图片
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
          picArr=[];
        }
      }
    })
  })


})