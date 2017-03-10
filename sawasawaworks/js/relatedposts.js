function isset(data) {
  return (typeof(data) != 'undefined');
};

function containsArray(arr, val) {
  for (var i=0; i<arr.length; i++) {
    if (arr[i] == val) {
      return true;
    }
  }
  return false;
}

/**
 * 関連記事取得クラス
 * http://kid0725.usamimi.info/api_v2_docs_ja.html#m-posts
 * version: 1.0.0
 *
 * @param args Object
 */
function TumblrRelationPost(args) {
  var baseHostName = isset(args.baseHostName) ? args.baseHostName : console.log( 'host name is not defined');
  
  this.postId = isset(args.postId) ? args.postId : console.log('post id is not defined');
  this.baseHostName = baseHostName.replace('/', '');
  this.tags = isset(args.tags) ? args.tags : console.log( 'tags is not defined');
  this.limit = isset(args.limit) ? Math.min(args.limit, 10) : 5;
  this.space = isset($('#tumblr-relation-space')) ? $('#tumblr-relation-space') : console.log( 'space id is not defined');
  this.offset = 0;
  this.apiKey = 'aBh1le0xMN4Lkmk3hyy18SZvYSXLi4kxvwJfvQuVqRv8Toe71N';
  this.result = [];
  this.ids = [];
};

TumblrRelationPost.prototype = {
  // 関連記事の取得
  getRelationList : function(tag) {
    var instance = this,
      url = 'http://api.tumblr.com/v2/blog/' + this.baseHostName + '/posts',
      args = {
        api_key : this.apiKey,
        tag     : tag,
        limit   : this.limit * 2,
        offset  : this.offset
      };
            
    $.ajax({
      type     : 'GET',
      url      : url,
      data     : args,
      dataType : 'jsonp', 
      success: function(response) {
        
        response = response.response;
        
        if (response.total_posts == 0) {
          console.log('totalpost is zero');
          if (instance.result.length > 0) {
            instance.showResult();
          }
          return;
        }
        
        var posts = response.posts,
          item;
        
        for (var i = 0; i < posts.length; i++) {
          
          item = posts[i];
          
          // 表示中記事なら飛ばす
          if (instance.postId == item.id) {
            continue;
          }
          
          // すでに同じものがアレばとばす
          if (containsArray(instance.ids, item.id)) {
            continue;
          }
          instance.ids.push(item.id);
          var values = {
            title : isset(item.title) ? item.title : item.type,
            url   : item.post_url,
            tags  : item.tags
          };
          // 結果を保持
          instance.result.push(values);
          
          // limit到達
          if (instance.result.length >= instance.limit) {
            break;
          }
        }
        
        // 別のタグがある かつ limitに達していない場合
        if (instance.tags.length > 0 && instance.limit > instance.result.length) {
          // 再取得
          instance.getRelationList(instance.tags.pop());
          return;
        }
        
        // 結果表示
        instance.showResult();
        
      },
      error : function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(textStatus + ':' + errorThrown.message);
      },
      beforeSend : function(xhr){
            xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
      }
    });
    
  },
  // 結果の表示<ul><li></li></ul>
  showResult : function() {
    
    var ul = $('<ul>').attr('id','tumblr-relation-list'),
      i,
      item;
      
    // 結果0件なら非表示にする
    if (this.result.length == 0) {
      this.space.hide();
      return;
    }
    
    for (i = 0; i < this.result.length; i++) {
      item = this.result[i];
      var li = $('<li>');
      li.attr('class', 'tumblr-relation-listitem')
      .text(item.title)
      .wrapInner($('<a href="' + item.url + '"></a>'))
      .append();
      
      // tags
      for (var j=0; j<item.tags.length; j++) {
        $('<span>').attr('class', 'tumblr-relation-listitem-tag')
        .text(item.tags[j])
        .appendTo(li);
      }
      
      li.appendTo(ul);
    }
    this.space.append(ul);
  },
  run : function() {

    // tags整形
    this.tags = this.tags.substr(0, this.tags.length - 1);
    this.tags = this.tags.split(',');
    
    this.getRelationList(this.tags.pop());

    
  }
};