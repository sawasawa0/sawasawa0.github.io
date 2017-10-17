$(function(){
	var Speed = "500";
	$(".el_nav_dropdown li").hover(
		function(){
			$(">ul:not(:animated)",this).css("visibility","visible").fadeIn(Speed);
			$(">ul >li:not(:animated)",this).css("display","none").slideDown(Speed);
			$(">ul >li ul",this).css("visibility","hidden");
		},
		function(){
			$(">ul",this).fadeOut(Speed,function(){
				$("ul",this).css("visibility","hidden");
			});
			$(">ul >li",this).slideUp(Speed);
		}
	);
});

//◆上に戻るボタン
// ボタンの表示／非表示を切り替える関数
function updateButton() {
    if ($(this).scrollTop() >= 300) { // 300px以上スクロールされた
        // ボタンを表示
        $(".bl_btn_BackToTop").fadeIn();
    } else {
        // ボタンを非表示
        $(".bl_btn_BackToTop").fadeOut();
    }
}

$(document).ready(function() {
    updateButton();

    // スクロールされる度にupdateButtonを実行
    $(window).scroll(updateButton);

    // ボタンをクリックしたらページトップにスクロールする
    $(".js_BackToTop").click(function() {
        // 600ミリ秒かけてトップに戻る
        $("html, body").animate({
            scrollTop: 0,
        }, 600);

        // ボタンのhrefに遷移しない
        return false;
    });
});
