

$(function(){

  //1.功能1：渲染功能
  // 获取本地历史，得到jsonStr字符串
  // 把jsonStr字符串转成数组
  // 根据模板引擎渲染到页面 注意，template（id， 对象） 把数组包装成对象传进去

  // //获取本地历史，得到jsonStr字符串
  // var jsonStr = localStorage.getItem("search_list");
  // //转成数组
  // var arr = JSON.parse( jsonStr );
  // //模板引擎渲染
  // var htmlStr = template('historyTpl',{list:arr});
  // $('.lt_history').html(htmlStr);
  render();
  //得到数组的封装方法
  function getHistory(){
    //获取本地历史，得到jsonStr字符串
    var jsonStr = localStorage.getItem("search_list") || '[]';
    //转成数组
    var arr = JSON.parse( jsonStr );
    //返回数组
    return arr;
  }

  //利用模板引擎渲染的封装
  function render(){
    //得到数组
    var arr = getHistory();
    //模板引擎渲染
    var htmlStr = template('historyTpl', {list:arr} );
    $('.lt_history').html(htmlStr);
  }

  //功能2:清空所有
  // 给清空所有添加点击事件（事件委托）
  // 利用remove清空search_list
  // 渲染
  $('.lt_history').on('click','.btn-empty',function(){
    //添加一个确认框
    // 参数1：内容
    // 参数2：标题
    // 参数3：文本数组
    // 参数4：关闭模态框的回调函数
    mui.confirm('你确定要清空历史记录吗？','温馨提示',['取消','确认'],function(e){
      //e.index 是点击的按钮的下标
      if(e.index ===1){
        //说明点击了确认
        //清空
        localStorage.removeItem("search_list");
        //重新渲染
        render();

      }
    })
  })

  //功能3：删除单个历史记录
  // 给所有的删除按钮添加点击事件（事件委托）
  // 得到数组，获取下标，根据下标，将数组中对应项删除自定义下标
  // 将数组转成jsonStr，存储到本地
  // 重新渲染
  $('.lt_history').on('click','.btn_delete',function(){
    //得到数组
    var arr = getHistory();
    //获取下标
    var index = $(this).data('index');
    //根据下标，删除数组中的对应项
    // arr.splice(从哪开始，删几个，替换项1，替换项2....)
    arr.splice(index,1); //从对应的下标开始，删除一个
    //转成jsonStr，存储到本地
    localStorage.setItem('search_list',JSON.stringify(arr));
    //重新渲染
    render();
  })

  //功能4：添加单个记录
  // 给搜索按钮添加点击事件
  // 获取搜索关键字
  // 获取数组，往数组最前面添加UNshift
  // 转成jsonStr，存储到本地存储中
  // 重新渲染
  $('.search_btn').click(function() {
    // 获取搜索关键字
    var key = $('.search_input').val().trim();
    if ( key === "" ) {
      // 提示搜索关键字不能为空
      //mui.toast("请输入搜索关键字", {
      //  duration: 4000
      //});
      mui.toast("请输入搜索关键字");
      return;
    }
    // 获取数组
    var arr = getHistory();
    // (1) 如果有重复项, 先将重复项删除
    var index = arr.indexOf( key );
    if ( index !== -1 ) {
      // 有重复项, 根据 index 删除对应项
      arr.splice( index, 1 )
    }
    // (2) 如果长度超过 10个, 保留最前面的, 删除最后一个
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    // 往数组最前面追加
    arr.unshift( key );
    // 转成 jsonStr, 存储到本地
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
    // 重新渲染
    render();
    // 重置搜索框
    $('.search_input').val("");
    // 跳转页面, 跳转到搜索列表页, 且将搜索关键字传递过去
    location.href = "searchList.html?key=" + key;
  })
})

