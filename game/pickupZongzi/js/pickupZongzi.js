// 开始游戏
var start = document.getElementById("start");
var restartLi = document.getElementById("restart");
var gotohome = document.getElementById("gotohome");
var gameRules = document.getElementById("gameRules");
var rankingList = document.getElementById("rankingList");
var rulesClose = document.getElementById("rulesClose");
var rankClose = document.getElementById("rankClose");
var mapCanvas = document.getElementById("map");
var ctx = mapCanvas.getContext("2d");
var loadingDiv = document.getElementById("loading");
var starGame = document.getElementById("starGame");
var scoreSpan = document.querySelector("#current-score>span");
var menuUl = document.getElementById("menu");
var endScoreLi = document.getElementById("end-score");
mapCanvas.width = document.documentElement.clientWidth;
mapCanvas.height = document.documentElement.clientHeight;
var picsnames = ["background.png", "enemy3.png", "herofly.png", "loading.gif", "prop.png"];
var picCount = 0;
var musicCount = 0;
var musics = [];
for (var i = 0; i < picsnames.length; i++) {
    var img = new Image();
    img.src = "img/" + picsnames[i];
    img.onload = function () {
        picCount++;
        if (picCount == picsnames.length) {
            loadingDiv.style.display = "none";
            starGame.style.display = "block"
            background.draw();
        }
    }
}
var bgImage = new Image();
bgImage.src = "img/background.png";
var background = {
    x: 0,
    y: 0,
    w: mapCanvas.width,
    h: mapCanvas.height,
    draw: function () {
        var row = Math.ceil(mapCanvas.height / 568);
        var col = Math.ceil(mapCanvas.width / 320);
        for (var i = -row; i < row; i++) { //行
            for (var j = 0; j < col; j++) { //列
                ctx.drawImage(bgImage, 320 * j, 568 * i + this.y);
            }
        }
    },
    move: function () {
        this.y += (20);
        var row = Math.ceil(mapCanvas.height / 568);
        if (this.y > row * 568) {
            this.y = 0;
        }
    },
};
var heroImg = new Image();
heroImg.src = "img/herofly.png";
var hero = {
    //属性
    x: mapCanvas.width / 2 - 33,
    y: mapCanvas.height - 82 - 100,
    w: 66,
    h: 82,
    i: 0, //第几张图片(从0开始算) 
    //方法
    draw: function () {

        //把图片的某一部分画到canvas上某个区域
        ctx.drawImage(heroImg, this.i * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
    },
}

//鼠标控制飞机
mapCanvas.onmousedown = function (event) {
    //1.鼠标位置
    var x = event.offsetX;
    var y = event.offsetY;
    //2.判断是否选中飞机
    if (x >= hero.x && x <= hero.x + hero.w && y >= hero.y && y <= hero.y + hero.h) {
        //选中飞机, 才能移动
        mapCanvas.onmousemove = function (event) {
            //飞机的中心在鼠标的位置
            hero.x = event.offsetX - hero.w / 2;
            // hero.y = event.offsetY - hero.h / 2;
            hero.y = hero.y;


        }
    }
}
//松开鼠标, 移除事件
mapCanvas.onmouseup = function () {
    mapCanvas.onmousemove = null;
}

//触摸屏的控制
mapCanvas.ontouchstart = function (event) {
    //1.手指的位置
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;
    //2.判断是否选中飞机
    if (x >= hero.x && x <= hero.x + hero.w && y >= hero.y && y <= hero.y + hero.h) {
        //选中飞机, 才能移动
        mapCanvas.ontouchmove = function (event) {
            //飞机的中心在鼠标的位置
            hero.x = event.touches[0].clientX - hero.w / 2;
            // hero.y = event.touches[0].clientY - hero.h / 2;
            hero.y = hero.y;

            //禁止系统事件行为
            event.preventDefault();
        }
    }
}

mapCanvas.ontouchend = function () {
    mapCanvas.ontouchmove = null;
}

//敌机
function Enemy(x, y, w, h, img, speed, hp, score, maxI) {
    //属性
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.speed = speed; //速度
    this.hp = hp; //血量
    this.score = score; //分数
    this.boom = false; //是否爆炸
    this.i = 0; //第几张图片
    this.maxI = maxI; //播放的图片张数
    this.isDie = false; //是否死亡 
}
//方法
Enemy.prototype.draw = function () {
    ctx.drawImage(this.img, this.i * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
}
Enemy.prototype.move = function () {
    this.y += this.speed;
}
//随机数
function random(x, y) {
    return parseInt(Math.random() * (y - x + 1) + x);
}
var enemyImg3 = new Image();
enemyImg3.src = "img/enemy3.png";
var enemies = [];

function randomEnemy() {
    var num = random(20, 1500);
    if (num <= 50) {
        //随机位置
        var randomX = random(0, mapCanvas.width - 110);
        //随机速度
        var randomSpeed = random(10, 20);
        var enemy = new Enemy(randomX, -164, 110, 164, enemyImg3, randomSpeed, 12, 300, 10);

        enemies.push(enemy);
    }
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].y >= mapCanvas.height || enemies[i].isDie) {
            enemies.splice(i, 1);
            i--;
        } else {
            enemies[i].move();
            enemies[i].draw();
        }
    }
}
var propImg = new Image();
propImg.src = "img/prop.png";

function Prop(x, y, w, h, type, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.speed = speed;
    this.isUsed = false;
}
//方法
Prop.prototype.draw = function () {
    ctx.drawImage(propImg, this.type * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
}
//移动
Prop.prototype.move = function () {
    this.y += this.speed;
}
var props = [];

function randomProp() {
    if (random(1, 1000) <= 10) {
        var randomX = random(0, mapCanvas.width - 38);
        var randomType = random(0, 1);
        var randomSpeed = random(5, 10);
        var prop = new Prop(randomX, -68, 38, 68, randomType, randomSpeed);
        props.push(prop);
    }
    for (var i = 0; i < props.length; i++) {
        if (props[i].y >= mapCanvas.height || props[i].isUsed) {
            props.splice(i, 1);
            i--;

        } else {
            props[i].move();
            props[i].draw();

        }
    }
}

function crash(obj1, obj2) {
    var left1 = obj1.x;
    var right1 = obj1.x + obj1.w;
    var top1 = obj1.y;
    var bottom1 = obj1.y + obj1.h;

    var left2 = obj2.x;
    var right2 = obj2.x + obj2.w;
    var top2 = obj2.y;
    var bottom2 = obj2.y + obj2.h;
    if (right1 < left2 || bottom1 < top2 || left1 > right2 || top1 > bottom2) {
        return false;
    } else {
        return true;
    }
}
//碰撞检测
function justify() {
    //道具和飞机
    for (var i = 0; i < props.length; i++) {
        if (hero.boom) {
            continue;
        }
        if (!crash(props[i], hero)) {
            continue;
        }
        console.log("得分+1");
        scoreSpan.innerHTML -- 
    }

    //敌机和飞机
    for (var i = 0; i < enemies.length; i++) {
        if (crash(enemies[i], hero)) {
            //扣分炸弹
            enemies.splice(i, 1);
            console.log("得分-1");
            scoreSpan.innerHTML ++
        }
    }
}

//游戏主程序
function main() {
    //清除画布内容
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    background.draw();
    background.move();
    hero.draw();
    randomEnemy();
    // 产生道具
    randomProp();
    if (!hero.boom) {
        justify();
    }
    requestAnimationFrame(main);
}

//用户改变窗口大小
window.onresize = function () {
    mapCanvas.width = document.documentElement.clientWidth;
    mapCanvas.height = document.documentElement.clientHeight;
    background.draw();
}

//游戏结束
function gameOver() { 
    endScoreLi.innerText = scoreSpan.innerText;
    //显示菜单
    menuUl.style.display = "block";

    stopAirwar(endScoreLi.innerText)
}
//开始
start.onclick = function () {
    // console.log('1');
    starGame.style.display = "none";
    main();
    // startAirwar()


}
//重新开始
restartLi.onclick = function () {
    //location.reload();
    //通过产生不同的随机数, 来刷新网页, 保证每次刷新的url不同
    location.href = location.href + "?id=" + 10000 * Math.random();
}
gotohome.onclick = function () {
    var params = JSON.parse(localStorage.getItem('params'))
    location.href = '../home/home.html?accountId=' + params.accountId + '&openId=' + params.openId + '&phone=' + params.userPhone
}
//游戏规则
gameRules.onclick = function () {
    console.log('gameRules');
    document.getElementById("rulesDilog").style.display = "block"
}
//排行榜
rankingList.onclick = function () {
    console.log('rankingList');
    getAirwarList()

}
//排行榜关闭
rankClose.onclick = function () {
    console.log('dilogClose');
    document.getElementById("rankDilog").style.display = "none"
    document.getElementById("rulesDilog").style.display = "none"
}
//活动规则关闭
rulesClose.onclick = function () {
    document.getElementById("rulesDilog").style.display = "none"
}

// 是否可以游戏
function startAirwar() {
    var parms = JSON.parse(localStorage.getItem('params'))
    let _param = {
        data: {
            accountId: parms.accountId,
            openId: parms.openId,
            userPhone: parms.userPhone,
            gameType: '0',
            bindStatus: 0,
            activityId: '556994329394864128',
        },
        loading: true,
        succall: true
    };
    muiAjax.get(baseApi + `/special/gameApi/doStartGame`, _param, function (res) {
        // console.log(res);
        if (res.code == 200) {
            if (res.message.includes('开始游戏')) {
                starGame.style.display = "none";
                main();
            } else {
                mui.alert(res.message)
            }
        } else {
            mui.alert(res.message)
        }
    })
};

// 游戏结束
function stopAirwar(scrode) {
    var parms = JSON.parse(localStorage.getItem('params'))
    let _param = {
        data: {
            accountId: parms.accountId,
            openId: parms.openId,
            userPhone: parms.userPhone,
            gameType: '0',
            bindStatus: 0,
            activityId: '556994329394864128',
            gameScore: scrode,
        },
        loading: true,
        succall: true
    };
    muiAjax.get(baseApi + `/special/gameApi/doStopGame`, _param, function (res) {
        // console.log(res);
        if (res.code == 200) {

        } else {
            mui.alert(res.meesage)
        }
    })
};

// 排行榜
function getAirwarList() {
    var parms = JSON.parse(localStorage.getItem('params'))
    let _param = {
        data: {
            accountId: parms.accountId,
            openId: parms.openId,
            userPhone: parms.userPhone,
            gameType: '0',
            bindStatus: 0,
            activityId: '556994329394864128',
        },
        loading: true,
        succall: true
    };
    muiAjax.get(baseApi + `/special/gameApi/getGameLeaderBoard`, _param, function (res) {
        // console.log(res);
        if (res.code == 200) {
            $('#rankDilog ul').empty();
            document.getElementById("rankDilog").style.display = "block"
            if (res.data.length > 0) {
                var lilist = '';
                res.data.forEach((element, index) => {
                    lilist += `<li> <span>${index+1}</span> <span>${element.userPhone}</span><span>${element.gameScore}</span></li> `
                });
                $('#rankDilog ul').append(lilist);
            }

        } else {
            mui.alert(res.message)
        }
    })
};

function limitgameover(num) {
    if (num > 50000) {
        hero.boom = true;
        scoreSpan.innerHTML = Number('50000')
    }
}