/*
 * @Author: huying 
 * @Date: 2018-12-01 11:46:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-12-02 19:20:53
 */
var wrap = document.querySelector('.main-wrap');

var xml = new XMLHttpRequest();
xml.open('get', '/api/data', true);
xml.onload = function(res) {
    if (res.target.status === 200) {
        var data = JSON.parse(res.target.response)
        xrswiper(data.result)
    }
}
xml.send()

/**
 * [xrswiper description]
 *
 * @param   {[type]}  data  [渲染数据的data]
 *
 * @return  {[type]}        [return description]
 */
function xrswiper(data) {
    var html = '';
    data.forEach(function(file) {
        html += `<div class="swiper-slide">`
        file.forEach(function(item) {
            html += `<dl>
                        <dt><img src="${item.url}" alt=""></dt>
                        <dd>${item.name}</dd>
                    </dl>`;
        })
        html += `</div>`;
    })
    wrap.innerHTML = html;
    new Swiper('.main-ban', {
        loop: true,
        autoplay: {
            delay: 1000,
        },
        pagination: {
            el: "#pagination",
            clickable: true,
        },
    });

}

var cr1 = new BScroll(".main", {
    // click: true,
    // probeType: 2, //可使用事件
})