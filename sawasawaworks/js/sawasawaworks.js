/*
Author: sawasawa
 */
jQuery(function($){


	// ページトップへ移動ボタンの表示
	$(function() {
		var topBtn = $('#toTop');
		topBtn.hide();
		$(window).scroll(function () {
			if ($(this).scrollTop() > 200) {
				topBtn.fadeIn();
			} else {
				topBtn.fadeOut();
			}
		});
	});

	$(function(){
     $("#toTop").click(function () {
		$('html,body').animate({ scrollTop: 0 }, 'slow','swing');
		return false;
	});
});

	// ソーシャルボタンを隠す
	$(function(){
	var fixedbtn = $('#fixedbtn');
	fixedbtn.hide();

		$(window).bind("scroll", function() {
		scrollHeight = $(document).height();
		scrollPosition = $(window).height() + $(window).scrollTop();
			if ( (scrollHeight - scrollPosition) > 450) {
				//スクロールの位置が下部450pxに来た場合
				fixedbtn.fadeIn();
			} else {
				//それ以外のスクロールの位置の場合
				fixedbtn.fadeOut();
			}
		});

	});

});
