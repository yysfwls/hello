//清除全部
$(".content_toolbar-del").click(function () {
    var msg = "您确定要清空播放列表吗？";
    if (confirm(msg)==true){
        $(".list_music").remove();
    }else{
        return false;
    }
});

//点击登录
$(".register li").click(function () {
    // alert("11111");
    $(".log").css("display", 'block');
});
//点击叉号关闭登录框
$(".log_top img").click(function () {
    $(".log").css("display", 'none');

});
//QQ微信登录切换
$('.menu-item').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
     var target = $(this).attr('a');
     $('.qh').children("[b='"+ target+"']").removeClass('hide').siblings().addClass('hide');
});

//给微信登录动态的增加样式
$(".hide").children(".img").css({
    "margin": "0 auto",
    "width": "90px",
    "height": "90px",
    "background-color": "yellow",
    "margin-top": "30px"

});
$(".hide").children("h5").eq(0).css({
    "text-align": "center",
    "color": "rgb(55, 63, 69)",
    "margin-top": "20px"

});
$(".hide").children("h5").eq(1).css({
    "text-align": "center",
"color": "rgb(155, 153, 153)",
    "margin-top": "10px"

});
$(".hide").children("h5").eq(2).css({
    "text-align": "center",
    "color": "rgb(153, 153, 153)",
    "margin-top": "50px",
    "margin-bottom": "20px"

});
//点击下载时提示
$(".music_down").click(function () {
    // alert("11111");
    $(".wrong").css("display", 'block');
});
//点击叉号关闭提示框
$(".wrong_top img").click(function () {
    $(".wrong").css("display", 'none');

});





