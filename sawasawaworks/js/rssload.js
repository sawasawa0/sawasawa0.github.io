google.load("feeds", "1"); //APIを読み込みます

function initialize(){
	
	var feed = new google.feeds.Feed("http://blog.sawasawaworks.com/rss"); //読み込むRSSフィードを設定します
	var noPhoto = ("<img src='画像がなかった場合に表示する画像のURL'>"); //画像がなかった場合に表示する画像を指定します
	
	feed.setNumEntries(5); //記事を読み込む件数を設定します
	feed.load(dispfeed);
	
	function dispfeed(result){

		if(!result.error){
			var container = document.getElementById("blogrss"); //HTMLに書き出す対象のIDを指定します

			for (var i = 0; i < result.feed.entries.length; i++) {

				var entry = result.feed.entries[i];
				var entryImg = "";
				var imgCheck = entry.content.match(/(src="http:)[\S]+((\.jpg)|(\.JPG)|(\.jpeg)|(\.JPEG)|(\.gif)|(\.GIF)|(\.png)|(\.PNG))/); //画像のチェックをします　拡張子はここで増やします
				if(imgCheck){
					entryImg += '<img class="rssimg"' + imgCheck[0] + '" >';
					} else {
						entryImg += noPhoto;
				}

				container.innerHTML += '<div class="rss"><a href="' + entry.link + '">'
				+ entryImg  
				+'<h3 class="rss">'
				+ entry.title + '</h3>'
				+ '</a></div><div class="clear-float"></div>';
			}
			var linkBlank = container.getElementsByTagName('a'); // targetに'_blank'を設定します。不要な場合は、以下4行を削除
			for (var j = 0, l = linkBlank.length; j < l; j++) {
				linkBlank[j].target = '_blank';
			} //target'_blank'ここまで
		}
	}
}
google.setOnLoadCallback(initialize);

function initialize(){
	
	var feed = new google.feeds.Feed("http://3books.hateblo.jp/rss"); //読み込むRSSフィードを設定します
	var noPhoto = ("<img src='画像がなかった場合に表示する画像のURL'>"); //画像がなかった場合に表示する画像を指定します
	
	feed.setNumEntries(5); //記事を読み込む件数を設定します
	feed.load(dispfeed);
	
	function dispfeed(result){

		if(!result.error){
			var container = document.getElementById("3books"); //HTMLに書き出す対象のIDを指定します

			for (var i = 0; i < result.feed.entries.length; i++) {

				var entry = result.feed.entries[i];
				var entryImg = "";
				var imgCheck = entry.content.match(/(src="http:)[\S]+((\.jpg)|(\.JPG)|(\.jpeg)|(\.JPEG)|(\.gif)|(\.GIF)|(\.png)|(\.PNG))/); //画像のチェックをします　拡張子はここで増やします
				if(imgCheck){
					entryImg += '<img class="rssimg"' + imgCheck[0] + '" >';
					} else {
						entryImg += noPhoto;
				}

				container.innerHTML += '<div class="rss"><a href="' + entry.link + '">'
				+ entryImg  
				+'<h3 class="rss">'
				+ entry.title + '</h3>'
				+ '</a></div><div class="clear-float"></div>';
			}
			var linkBlank = container.getElementsByTagName('a'); // targetに'_blank'を設定します。不要な場合は、以下4行を削除
			for (var j = 0, l = linkBlank.length; j < l; j++) {
				linkBlank[j].target = '_blank';
			} //target'_blank'ここまで
		}
	}
}
google.setOnLoadCallback(initialize);
