
$(function(){

  //一进入页面，发送ajax请求，请求左侧一级分类的所有数据，渲染页面
  $.ajax({
    url:'/category/queryTopCategory',
    type:'get',
    dataType:'json',
    success:function( info ){
      console.log(info);
      var htmlStr = template('leftTpl',info);
      $('.lt_category_left ul').html(htmlStr);

      //获取第一个一级分类的ID，完成所对应的二级分类的渲染
      renderById(info.rows[0].id);
      // console.log(info.rows[0]);
    }
  })
  //2.给左侧所有的a添加点击事件（事件委托）
  $('.lt_category_left ul').on('click','a',function(){
    //其他的杀死
    $('.lt_category_left ul a').removeClass('current');
    //让自己高亮
    $(this).addClass('current');
    //获取ID，渲染二级分类数据
    var id = $(this).data('id');
    renderById(id);

  })
  //根据一级分类的id，渲染二级分类的数据
  function renderById(id){
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success:function( info ){
        console.log(info);
        var htmlStr = template('rightTpl',info);
        $('.lt_category_right ul').html(htmlStr);
      }
    })
  }

})