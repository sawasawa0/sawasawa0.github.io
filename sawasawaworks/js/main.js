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
    var domain ="blog.sawasawaworks.com", //記事を取得したいtumblrブログのドメイン
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
        limit = "5", //取得したい記事数
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
                                            post_url = this['post_url'],
                                            obj_id = this['id'];

                                    if (obj_id == my_id) {

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
                                    }

                                        post_no = post_no +1;
                                    });
                            }
                        });
                }
            });
});


//http://b.hatena.ne.jp/entrylist/json?sort=count&url=blog.sawasawaworks.com&callback=hatebuCallback

//◆人気記事取得
$(function() {
    var siteurl = "http://blog.sawasawaworks.com";
    var domain="blog.sawasawaworks.com";
    var api_key="xq2COMO7SeFjKSapb2VRKTfnm8FGeduoHspOB13aGYLN9rJSsK";
    var popurarEntry = $("#PopularPost_list")
    $.ajax({
        dataType: "jsonp",
        data: {'sort':'count', 'url':siteurl},
        cache: true,
        url: "https://b.hatena.ne.jp/entrylist/json",
        success: function (data){
            $.each(data, function(i,item){
                if(item.link != siteurl) {
                        var my_url = item.link;
                        var my_id_index = my_url.indexOf("post/")+5;
                        var my_id_str = my_url.substr(my_id_index);
                        var my_id_str2 = my_id_str.indexOf("/");
                        var my_id = my_id_str.substring(0 ,my_id_str2);
                        var post_title = item.title;
                        $.getJSON(
                                "https://api.tumblr.com/v2/blog/"+ domain +"/posts?api_key="+ api_key +"&limit=1&id="+ my_id +"&jsonp=?",
                                function(data){
                                    //jsonを取得した時のみ動作する
                                    if( data['meta']['status']==200){
                                        var post_type = data['response']['posts'][0]['type'];

                                        //テキスト投稿の場合
                                        if (post_type == "text") {

                                            //投稿の本文から最初のimgのsrcを切り出す
                                            var post_body = data['response']['posts'][0]['body'],
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
                                            var post_img = data['response']['posts'][0]['photos'][0]['alt_sizes'][0]['url'];
                                        }
                                        popurarEntry.append("<a href='" + my_url +"'>"
                                                + "<li>"
                                                    + "<div class='bl_postList_box'>"
                                                        + "<div class='bl_postList_img'><img src='" + post_img + "'></div>"
                                                        + "<div class='bl_postList_ttl'>" + post_title +"</div>"
                                                    + "</div>"
                                                + "</li>"
                                            +"</a>"
                                        );
                                    }
                                });
                }
            });
        }
    });
});


//Twitterのシェア数を取得
function getTwitterCount(url, selcter) {
  $.ajax({
  url:'https://json.digitiminimi.com/twitter/count.json',
  dataType:'jsonp',
  data:{
    url:url
  }}).then(
  function(res){$( selcter ).text( res.count || 0 );},
  function(){$( selcter ).text('0');}
  );
}
//HatenaBookMarkのシェア数
function getHatenaBookmarkCount(entryUrl, selcter) {
  entryUrl = 'http://api.b.st-hatena.com/entry.count?url=' + encodeURIComponent(entryUrl)
  $.ajax({
    url:entryUrl,
    dataType:'jsonp',
  }).then(
    function(result){ $(selcter).text(result || 0); },
    function(){ $(selcter).text('0'); }
  );
}
//Facebookのシェア数
function getFacebookCount(entryUrl, selcter) {
  entryUrl = 'https://graph.facebook.com/' + encodeURIComponent(entryUrl)
  $.ajax({
    url:entryUrl,
    dataType:'jsonp'
  }).then(
    function(result){
        if(result.share && result.share.share_count) {
            $(selcter).text(result.share.share_count);
        } else {
            $(selcter).text('0');
        }
    },
    function(){ $(selcter).text('0'); }
  );
}
//Google＋のシェア数を取得
function getGoogleplusCount(url, selcter) {
  jQuery.ajax({
    type: "get", dataType: "xml",
    url: "http://query.yahooapis.com/v1/public/yql",
    data: {
      q: "SELECT content FROM data.headers WHERE url='https://plusone.google.com/_/+1/fastbutton?hl=ja&url=" + url + "' and ua='#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36'",
      format: "xml",
      env: "store://datatables.org/alltableswithkeys"
    },
    success: function (data) {
      var content = jQuery(data).find("content").text();
      var match = content.match(/window\.__SSR[\s*]=[\s*]{c:[\s*](\d+)/i);
      var count = (match != null) ? match[1] : 0;

      jQuery( selcter ).text(count);
    },
    error: function (data) {
      jQuery( selcter ).text("share");
    }
  });
}
//ポケットのストック数を取得
// function getPocketCount(url, selcter) {
//   jQuery.ajax({
//     type: "get", dataType: "xml",
//     url: "http://query.yahooapis.com/v1/public/yql",
//     data: {
//       q: "SELECT content FROM data.headers WHERE url='https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=" + url + "' and ua='#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36'",
//       format: "xml",
//       env: "store://datatables.org/alltableswithkeys"
//     },
//     success: function (data) {
//       var content = jQuery(data).find("content").text();
//       console.log("debug:");
//       console.log(data);
//       var match = content.match(/<em id="cnt">(\d+)<\/em>/i);
//       var count = (match != null) ? match[1] : 0;

//       jQuery( selcter ).text(count);
//     },
//     error: function (data) {
//       jQuery( selcter ).text("save");
//     }
//   });
// }
function getPocket(pocketElm) {
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if ((xml.readyState == 4) && (xml.status == 200)) {

            //受け取った text を JSON にパースする
            var json = JSON.parse(this.responseText);

            //指定した id を持つ要素に Pocket 数を挿入
            // document.getElementById(pocketElm).textContent = json.query.results.body.div.a.span.em.content;
            var elems = document.getElementsByClassName(pocketElm);
            for(var elem of elems) {
                elem.textContent = json.query.results.body.div.a.span.em.content;
            }
        }
    };

    //YQL と非同期通信 URLはエンコードする
    var xmlUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwidgets.getpocket.com%2Fv1%2Fbutton%3Fv%3D1%26count%3Dhorizontal%26url%3D" + encodeURIComponent(location.href) + "%26src%3D" + encodeURIComponent(location.href) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    xml.open("GET", xmlUrl, true);
    xml.send(null);
}
$(function(){
  getHatenaBookmarkCount('{Permalink}', '.hatena-bookmark-count');
  getFacebookCount('{Permalink}', '.facebook-count');
  getTwitterCount('{Permalink}', '.twitter-count');
});


//◆photo投稿のタイトルをなんとかするやつ
$(function(){
    articleSet();

    function articleSet(){
        $('article.box').each(function(index, el) {     //各記事ブロック毎に実行

            var getText = $('.replace',this),           // {Caption}が入っているdivを指定
                targetH2 = $('h2.title_h2',this),         // タイトルを挿入したいdivを指定
                title = $('h2',getText);                // 投稿内容中のh1部分

            var setTitle = title.text();                // h1の中の文章を取得・代入
                title.remove();                         // タイトル部分は本文に不要なので削除

                targetH2.html(setTitle);                // タイトルを挿入
        });
    }
    //投稿の最初のh2内のtextを取得する

    //h2タグごと取得した範囲を削除する
    //指定のt1tleにtextを代入する
    //指定のクラスのh2にtextを代入する

});
