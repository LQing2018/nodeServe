// var h5base = "http://192.168.3.110:7000";
//var h5api = "http://192.168.3.110:7002";

var reSize = function () {
    var deviceWidth = document.documentElement.clientWidth > 750 ? 750 : document.documentElement.clientWidth;
    document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px';
};
reSize();
window.onresize = reSize;
window.onload = reSize;
token = localStorage.getItem("TOKEN");
mytel = localStorage.getItem("mytel");

function win_close(data) {
    if (mui.os.ios) {
        window.webkit.messageHandlers.closeWebPage.postMessage(data);
    } else if (mui.os.android) {
        window.android.closeWebPage(data);
    }
}

function win_open(url, hiddenNav, useUIWeb) {
    if (useUIWeb) {

    } else {
        useUIWeb = false;
    }
    var urlshow = {
        url: url,
        hiddenNav: hiddenNav,
        useUIWeb: useUIWeb
    };
    urlshow = JSON.stringify(urlshow);
    window.location.href = url
    // if(mui.os.ios) {
    // 	window.webkit.messageHandlers.openNewWebPage.postMessage(urlshow);
    // } else if(mui.os.android) {
    // 	window.android.openNewWebPage(urlshow);
    // }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/"
    //这个很重要代表在那个层级下可以访问cookie
    //console.log(d)
}

// 获取链接携带参数
function getParam(name) {
    var search = document.location.search;
    var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    var matcher = pattern.exec(search);
    var items = null;
    if (null != matcher) {
        try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
            try {
                items = decodeURIComponent(matcher[1]);
            } catch (e) {
                items = matcher[1];
            }
        }
    }
    return items;
};

//获取cookie 内容
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function logout() {
    if (mui.os.android) {
        window.android.logOut();
    } else if (mui.os.ios) {
        window.webkit.messageHandlers.logOut.postMessage(null);
    }
}
//input 被键盘遮挡解决
if (window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1) {
    window.addEventListener("resize", function () {
        if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    })
}
var timeDate = {
    formatDate: function (now) {
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return new Date(now).Format('yy-MM-dd hh:mm:ss'); //"2018-11-15 17:40:00"
    },
    getTime: function () {
        var newDate = new Date();
        Date.prototype.format = function (format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        }
        var times = newDate.format('yyyy-MM-dd hh:mm:ss');
        return times;
    }
}
//complete

var muiAjax = {
    get: function (url, param, success, errorback, completeback) {
        if (param.loading) {
            mui.showLoading("加载中..", "div");
        }
        param = mui.addparam(param);

        var getdata = {
            data: param.data,
            type: 'get', //HTTP请求类型
            crossDomain: true,
            timeout: 60000, //超时时间设置为10秒；
            headers: {
                Authorization: localStorage.getItem("TOKEN"),
                uuid: localStorage.getItem("uuid")
            },
            success: function (res) {
                if (param.succall) {
                    success(res)
                } else {
                    if (res.code == 200) {
                        success(res)
                    } else if (res.code == 401) {
                        console.log(res, 401)
                        logout();
                    } else {
                        mui.toast(res.message);
                    }
                }

            },
            error: function (xhr, type, errorThrown) {
                console.log(JSON.parse(xhr.responseText).code);
                var jsonret = JSON.parse(xhr.responseText);

                if (jsonret.code == "500") {
                    mui.toast(jsonret.message)
                    return;
                }
                if (jsonret.code == '403') {
                    cleanLocalStore();
                    location.href = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019091167215410&scope=auth_user&redirect_uri=' + h5api + '/passport/connectAndLogin/WAP/ALIPAY/callback?channel=' + localStorage.getItem("channel")
                    return;
                }

                //异常处理；
                if (errorback && typeof errorback == 'function') {
                    errorback();
                }
            },
            complete: function () {

                if (param.loading) {
                    mui.hideLoading();
                }
                if (completeback && typeof completeback == 'function') {
                    completeback();
                }

            }
        }
        if (param.notoken) {
            delete getdata.headers.Authorization;
        }
        mui.ajax(url, getdata);
    },
    post: function (url, param, success, errorback, completeback) {
        if (param.loading) {
            mui.showLoading("正在加载..", "div");
        }
        param = mui.addparam(param);

        var getdata = {
            data: param.data,
            type: 'post', //HTTP请求类型
            crossDomain: true,
            timeout: 60000, //超时时间设置为10秒；
            headers: {
                Authorization: localStorage.getItem("TOKEN"),
                uuid: localStorage.getItem("uuid")
            },
            success: function (res) {
                if (param.succall) {
                    success(res)
                } else {
                    if (res.code == 200) {
                        success(res)
                    } else if (res.code == 401) {
                        console.log(res, 401)
                        logout();
                    } else {
                        mui.toast(res.message);
                    }
                }

            },
            error: function (xhr, type, errorThrown) {
                console.log(JSON.parse(xhr.responseText));
                var jsonret = JSON.parse(xhr.responseText);
                if (jsonret.code == "500") {
                    mui.toast(jsonret.message)
                    return;
                }
                if (jsonret.code == "107") {
                    mui.toast(jsonret.message)
                    return;
                }
                if (jsonret.code == '403') {
                    cleanLocalStore();
                    location.href = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019091167215410&scope=auth_user&redirect_uri=' + h5api + '/passport/connectAndLogin/WAP/ALIPAY/callback?channel=' + localStorage.getItem("channel")
                    return;
                }

                //异常处理；
                if (errorback && typeof errorback == 'function') {
                    errorback();
                }
            },
            complete: function () {
                if (param.loading) {
                    mui.hideLoading();
                }
                if (completeback && typeof completeback == 'function') {
                    completeback();
                }
            }
        }
        if (param.notoken) {
            delete getdata.headers.Authorization;
        }
        mui.ajax(url, getdata);
    },
    getnew: function (url, param, success, errorback, completeback) {
        if (param.loading) {
            mui.showLoading("加载中..", "div");
        }
        param = mui.addparam(param);

        var getdata = {
            data: param.data,
            type: 'get', //HTTP请求类型
            crossDomain: true,
            timeout: 60000, //超时时间设置为10秒；
            headers: {
                Authorization: localStorage.getItem("TOKEN"),
                uuid: localStorage.getItem("uuid")
            },
            success: function (res) {
                if (param.succall) {
                    success(res)
                } else {
                    if (res.code == 200) {
                        success(res)
                    } else if (res.code == 401) {
                        console.log(res, 401)
                        logout();
                    } else {
                        mui.toast(res.message);
                    }
                }

            },
            error: function (xhr, type, errorThrown) {
                console.log(JSON.parse(xhr.responseText).code);
                var jsonret = JSON.parse(xhr.responseText);

                if (jsonret.code == "500") {
                    mui.toast(jsonret.message)
                    return;
                }
                if (jsonret.code == '403') {
                    
                    cleanLocalStore();
                    mui.toast(jsonret.message)
                    return;
                }

                //异常处理；
                if (errorback && typeof errorback == 'function') {
                    errorback();
                }
            },
            complete: function () {

                if (param.loading) {
                    mui.hideLoading();
                }
                if (completeback && typeof completeback == 'function') {
                    completeback();
                }

            }
        }
        if (param.notoken) {
            delete getdata.headers.Authorization;
        }
        mui.ajax(url, getdata);
    },
    postnew: function (url, param, success, errorback, completeback) {
        if (param.loading) {
            mui.showLoading("正在加载..", "div");
        }
        param = mui.addparam(param);

        var getdata = {
            data: param.data,
            type: 'post', //HTTP请求类型
            crossDomain: true,
            timeout: 60000, //超时时间设置为10秒； 
            headers: {
                "Content-Type":"application/json",
                Authorization: localStorage.getItem("TOKEN"),
                uuid: localStorage.getItem("uuid")
            },
            success: function (res) {
                if (param.succall) {
                    success(res)
                } else {
                    if (res.code == 200) {
                        success(res)
                    } else if (res.code == 401) {
                        console.log(res, 401)
                        logout();
                    } else {
                        mui.toast(res.message);
                    }
                }

            },
            error: function (xhr, type, errorThrown) {
                console.log(JSON.parse(xhr.responseText));
                var jsonret = JSON.parse(xhr.responseText);
                if (jsonret.code == "500") {
                    mui.toast(jsonret.message)
                    return;
                }
                if (jsonret.code == "107") {
                    mui.toast(jsonret.message)
                    return;
                }
                if (jsonret.code == '403') {
                    mui.toast(jsonret.message)
                    cleanLocalStore();
                    return;
                }

                //异常处理；
                if (errorback && typeof errorback == 'function') {
                    errorback();
                }
            },
            complete: function () {
                if (param.loading) {
                    mui.hideLoading();
                }
                if (completeback && typeof completeback == 'function') {
                    completeback();
                }
            }
        }
        if (param.notoken) {
            delete getdata.headers.Authorization;
        }
        mui.ajax(url, getdata);
    }
} 