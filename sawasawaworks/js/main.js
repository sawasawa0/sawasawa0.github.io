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

$(function() {
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

//◆ 新着記事取得
$(function () {
    var domain ="test-sawasawaworksblog", //記事を取得したいtumblrブログのドメイン
        limit = "5", //取得したい記事数
        api_key = "xq2COMO7SeFjKSapb2VRKTfnm8FGeduoHspOB13aGYLN9rJSsK";

    $.getJSON(
        "https://api.tumblr.com/v2/blog/"+ domain +"/posts?api_key="+ api_key +"&limit="+ limit +"&jsonp=?",
        function(data){
            //jsonを取得した時のみ動作する
            if( data['meta']['status']==200){

                //展開先
                var relatedEntry = $("#ResentPost_list"),
                    post_no = 0;

                    $.each(data['response']['posts'],function(){
                        var post_type = this['type'],
                            post_url = this['post_url'];

                        //テキスト投稿の場合
                        if (post_type == "text") {
                            //テキスト投稿の場合titleはjsonから直接取得できる
                            var post_title = this['title'];

                            //投稿の本文から最初のimgのsrcを切り出す
                            var post_body = this['body'],
                                    img_index = post_body.indexOf("<img"),
                                    img_str1 = post_body.substr(img_index),
                                    img_str2 = img_str1.indexOf('src="http'),
                                    img_end = img_str1.indexOf("/>")-1;
                            var post_img = img_str1.substring(img_str2 +5 ,img_end);

                        //画像投稿の場合
                        } else if (post_type == "photo") {

                            //画像投稿の場合アイキャッチはjsonから直接取得可能
                            //取得する画像をオリジナルにしているが、（二つ目の0）この数字を帰るとtumblr側でリサイズした画像を取得可能
                            //ただし、オリジナルサイズよりも大きなサイズの画像は生成されないため、エラーになる。
                            var post_img = this['photos'][0]['alt_sizes'][0]['url']

                            //投稿の本文から最初のh2をタイトルとして取得する
                            var post_body = this['caption'];
                            var title_index = post_body.indexOf("<h2>");
                            var title_str1 = post_body.substr(title_index);
                            var title_end = title_str1.indexOf("</h2>");
                            var post_title = title_str1.substring(4 ,title_end);
                        }

                        relatedEntry.append("<a href='" + post_url +"'>"
                                + "<li>"
                                    + "<div class='bl_postList_box'>"
                                        + "<div class='bl_postList_img'><img src='" + post_img + "'></div>"
                                        + "<div class='bl_postList_ttl'>" + post_title +"</div>"
                                    + "</div>"
                                + "</li>"
                            +"</a>"
                        );
                        post_no = post_no +1;
                    });
            }
        });
});


//◆ 関連記事取得
$(function () {
    var domain ="blog.sawasawaworks.com", //記事を取得したいtumblrブログのドメイン
        limit = "3", //取得したい記事数
        api_key = "xq2COMO7SeFjKSapb2VRKTfnm8FGeduoHspOB13aGYLN9rJSsK";
        //tag="ニコニコ動画";

    //現在の記事のタグを取得する（二つ目のタグ）
    var my_url = location.href;
    //var my_url = "http://blog.sawasawaworks.com/post/93654958557/20130217";
    var my_id_index = my_url.indexOf("post/")+5;
    var my_id_str = my_url.substr(my_id_index);
    var my_id_str2 = my_id_str.indexOf("/");
    var my_id = my_id_str.substring(0 ,my_id_str2);

    $.getJSON(
            "https://api.tumblr.com/v2/blog/"+ domain +"/posts?api_key="+ api_key +"&limit="+ limit +"&id="+ my_id +"&jsonp=?",
            function(data){
                //jsonを取得した時のみ動作する
                if( data['meta']['status']==200){
                    var tag = data['response']['posts'][0]['tags'][0];

                    $.getJSON(
                        "https://api.tumblr.com/v2/blog/"+ domain +"/posts?api_key="+ api_key +"&limit="+ limit +"&tag="+ tag +"&jsonp=?",
                        function(data){
                            //jsonを取得した時のみ動作する
                            if( data['meta']['status']==200){
                                //展開先
                                var relatedEntry = $("#RelatedPost_list"),
                                    post_no = 0;

                                    $.each(data['response']['posts'],function(){
                                        var post_type = this['type'],
                                            post_url = this['post_url'];

                                        //テキスト投稿の場合
                                        if (post_type == "text") {
                                            //テキスト投稿の場合titleはjsonから直接取得できる
                                            var post_title = this['title'];

                                            //投稿の本文から最初のimgのsrcを切り出す
                                            var post_body = this['body'],
                                                    img_index = post_body.indexOf("<img"),
                                                    img_str1 = post_body.substr(img_index),
                                                    img_str2 = img_str1.indexOf('src="http'),
                                                    img_end = img_str1.indexOf("/>")-1;
                                            var post_img = img_str1.substring(img_str2 +5 ,img_end);

                                        //画像投稿の場合
                                        } else if (post_type == "photo") {

                                            //画像投稿の場合アイキャッチはjsonから直接取得可能
                                            //取得する画像をオリジナルにしているが、（二つ目の0）この数字を帰るとtumblr側でリサイズした画像を取得可能
                                            //ただし、オリジナルサイズよりも大きなサイズの画像は生成されないため、エラーになる。
                                            var post_img = this['photos'][0]['alt_sizes'][0]['url']

                                            //投稿の本文から最初のh2をタイトルとして取得する
                                            var post_body = this['caption'];
                                            var title_index = post_body.indexOf("<h2>");
                                            var title_str1 = post_body.substr(title_index);
                                            var title_end = title_str1.indexOf("</h2>");
                                            var post_title = title_str1.substring(4 ,title_end);
                                        }

                                        relatedEntry.append("<a href='" + post_url +"'>"
                                                + "<li>"
                                                    + "<div class='bl_postList_box'>"
                                                        + "<div class='bl_postList_img'><img src='" + post_img + "'></div>"
                                                        + "<div class='bl_postList_ttl'>" + post_title +"</div>"
                                                    + "</div>"
                                                + "</li>"
                                            +"</a>"
                                        );
                                        post_no = post_no +1;
                                    });
                            }
                        });
                }
            });
});

//◆人気記事取得
//http://b.hatena.ne.jp/entrylist/json?sort=count&url=blog.sawasawaworks.com&callback=hatebuCallback

function hatebuCallback(data){
		if(data.length == 0){
			$("#hatebuList").append("<p>データを読み込めませんでした。</p>");
		}
		else {
			$("#hatebuList").append("<ul>");
			for(i = 0 ; i < data.length; i++){
				$("#hatebuList ul").append('<li><a href="' + data[i].link + '" target="_blank">' + data[i].title +'</a>（<span>' + data[i].count + '）</span></li>');
			}
		}
}


(function() {
    articleSet();

    function articleSet(){
        $('article.box').each(function(index, el) {     //各記事ブロック毎に実行

            var getText = $('.replace',this),           // {Caption}が入っているdivを指定
                targetH2 = $('.title h2',this),         // タイトルを挿入したいdivを指定
                targetText = $('.lead',this),           // 冒頭部分を挿入したいdivを指定
                title = $('h2',getText);                // 投稿内容中のh1部分

            var setTitle = title.text();                // h1の中の文章を取得・代入
                title.remove();                         // タイトル部分は本文に不要なので削除

            var postText = getText.text();              // 投稿内容の文章を取得・代入
                //setPostText = postText.substr(0,200);   // 文章を200文字に切る

                targetH2.html(setTitle);                // タイトルを挿入
                targetText.html(PostText);           // 本文冒頭を挿入
                getText.remove();                       // 最初に{Caption}を入れたハコは不要なので削除
        });
    }
})();
