(function($){
    $.fn.extend({
        jq_tumblrPostList: function(options){

            var defaults={
                api_key: "xq2COMO7SeFjKSapb2VRKTfnm8FGeduoHspOB13aGYLN9rJSsK",
                domain: "blog.sawasawaworks.com",
                limit: 5,
                width: 100
            }
            var o = $.extend(defaults, options);
            var objList = this;
            //console.log(objList);
            return this.each(function() {

                $.getJSON(
                    "http://api.tumblr.com/v2/blog/"+o.domain+"/posts?api_key="+o.api_key+"&limit="+o.limit+"&jsonp=?",
                    function(data){
                        //console.log(data);
                        var post_no = 0;
                        if( data['meta']['status']==200){

                            $(objList).append('<ul class="tumblr_post_list"></ul>');

                            $.each(data['response']['posts'],function(){
                                post_no = post_no +1;
                                //var post_url = "http://"+o.domain+"/post/"+ this['id'];
                                var post_url = this['post_url'];
                                var post_class = 'postno_'+post_no;
                                var test_body = this['body'];
                                var img_index = test_body.indexOf("<img ");

                                var img_src = "";
                                if (img_index >= 0) {

	                                var img_karia = test_body.substr(img_index);
                                  var img_indexc = img_karia.indexOf('src="http://');
	                                var img_end = img_karia.indexOf("/>");
	                                var img_karib = img_karia.substring(img_indexc + 12,img_end);
	                                //var img_indexb = img_karib.indexOf("66.media.tumblr.com");
                                  //var img_karic = img_karib.substr(img_indexb);
	                                img_src = '<div class="rssimgcut"><span class="rssimg" style="background-image: url(\'http://' + img_karib + '"></span></div>';
                                  //img_src = '<div class="rssimgcut"><img class="rssimg" ' + img_karic + '></div>';

                                } else {

                                	img_src = '<div class="rssimgcut"><img class="rssimg" src ="https://dl.dropboxusercontent.com/u/66235401/noimage.png"/></div>'
                                }



                                $(".tumblr_post_list",objList).append('<li class="tpl_post '+post_class+'"></li>');

                                //タイトルの取得
                                if( this['title'] !== void 0 ){
                                    $('.'+post_class,objList).append('<a href="' + post_url + '" >' + img_src + '<div class="post_title" >' + this['title'] + '</div></a><div class="clear-float"></div>');
                                }
                                else if(this['photos'] === void 0 ){
                                    objDate = new Date(this['timestamp']*1000);
                                    date_str = (objDate.getMonth()+1) +"/" + objDate.getDate() +" ";
                                    date_str += (objDate.getHours()) +":" + objDate.getMinutes();
                                    $('.'+post_class,objList).append('<div class="post_title" ><a href="' + post_url + '" >' + date_str +':'+ this['type'] + '</a></div><hr>');
                                }

                                //画像の取得
                                if( this['photos'] !== void 0 && this['photos'].length > 0 ){
                                    //var img_url = this['original_size']['url'];
                                    for( var no=0; no < this['photos'][0]['alt_sizes'].length; no++ ){
                                        if( o.width <= this['photos'][0]['alt_sizes'][no]['width'] ){
                                            break;
                                        }
                                    }
                                    var img_url = this['photos'][0]['alt_sizes'][no]['url'];
                                    $('.'+post_class,objList).append('<div class="photo" ><a href="' + post_url + '" >' + '<img src="' + img_url + '" width="'+o.width+'" />' + '</a></div>');

                                }
                            });

                        }
                    }
                );
            });
        }
    });
})(jQuery);
