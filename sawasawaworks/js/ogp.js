function img_find() {
    var imgs = document.getElementsByTagName("img");
    var imgSrcs = [];
    for (var i = 0; i < imgs.length; i++) {
        imgSrcs.push(imgs[i].src);
    }
    return imgSrcs;
}

var img = img_find();
var ogmetatag = document.createElement('meta');

ogmetatag.setAttribute('property', 'og:image');
ogmetatag.setAttribute('content', img[2]);
document.head.appendChild(ogmetatag);

var twimgtag = document.createElement('meta');
twimgtag.setAttribute('name', 'twitter:image:src');
twimgtag.setAttribute('content', img[2]);
document.head.appendChild(twimgtag);
