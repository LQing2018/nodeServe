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
var picsnames = ["background.png", "bullet1.png", "bullet2.png", "enemy1.png", "enemy2.png", "enemy3.png",
    "herofly.png", "loading.gif", "prop.png"
];
var musicNames = ["bullet.mp3", "enemy1_down.mp3", "enemy2_down.mp3", "enemy3_down.mp3", "game_music.mp3",
    "game_over.mp3"
];
var picCount = 0;
var musicCount = 0;
var musics = [];
for (var i = 0; i < picsnames.length; i++) {
    var img = new Image();
    img.src = "img/" + picsnames[i];
    img.onload = function () {
        picCount++;
        //判断图片是否加载完成
        if (picCount == picsnames.length) {
            // loadMusic();

            loadingDiv.style.display = "none";
            starGame.style.display = "block"
            //开始游戏
            background.draw();
        }
    }
}
//音乐预加载
function loadMusic() {

    for (var i = 0; i < musicNames.length; i++) {
        var music = new Audio(); //自动预加载
        music.src = "audio/" + musicNames[i];
        musics.push(music);
        music.onloadedmetadata = function () {
            musicCount++;
            if (musicCount == musicNames.length) {
                //隐藏loading标志
                loadingDiv.style.display = "none";
                starGame.style.display = "block"
                //开始游戏
                background.draw();

                //播放背景音乐
                musics[4].volume = 0.5; //音量(0-1)
                musics[4].loop = true; //循环播放
                musics[4].play();
            }
        }
    }
}

//背景图
var bgImage = new Image();
bgImage.src = "img/background.png";
//背景图对象(只有一个)
var background = {
    //属性
    x: 0,
    y: 0,
    w: mapCanvas.width,
    h: mapCanvas.height,
    //方法
    draw: function () {
        //如何满屏, 并且不调整图片比例
        //1.求最大行和最大列
        var row = Math.ceil(mapCanvas.height / 568);
        var col = Math.ceil(mapCanvas.width / 320);
        //2.循环添加图片
        //为了保证图片无限滚动, 画两张一样的背景图
        for (var i = -row; i < row; i++) { //行
            for (var j = 0; j < col; j++) { //列
                ctx.drawImage(bgImage, 320 * j, 568 * i + this.y);
            }
        }
    },
    //移动
    move: function () {
        this.y += (20);
        // this.y ++;
        var row = Math.ceil(mapCanvas.height / 568);
        //判断一张图片滚动完成, 重置位置
        if (this.y > row * 568) {
            this.y = 0;
        }
    },
};

//sprite image: 精灵图, 雪碧图, 降低的服务器的压力, 把常见的logo/icon放到图片中
//游戏中把一个物体的不同状态下的图片, 做出雪碧图

//飞机图片
var heroImg = new Image();
heroImg.src = "img/herofly.png";
//飞机对象
var hero = {
    //属性
    x: mapCanvas.width / 2 - 33,
    y: mapCanvas.height - 82 - 100,
    w: 66,
    h: 82,
    i: 0, //第几张图片(从0开始算)
    flagI: 0, //图片切换的频率
    bullets: [], //用于记录发射出去的子弹
    flagShot: 0, //子弹发射频率
    armType: 0, //武器类型(0: 单排; 1:双排)
    boom: false, //是否爆炸
    //方法
    draw: function () {
        //控制图片切换
        this.flagI++;
        if (this.flagI == 10) {
            if (this.boom) {
                this.i++;
                if (this.i == 5) {
                    //飞机死亡
                    gameOver();
                }
            } else {
                this.i = (this.i++) % 2;
            }
            //重置
            this.flagI = 0;
        }
        //  
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
            hero.y = event.offsetY - hero.h / 2;

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
            hero.y = event.touches[0].clientY - hero.h / 2;
            console.log(hero.x, hero.y);
            //禁止系统事件行为
            event.preventDefault();
        }
    }
}

mapCanvas.ontouchend = function () {
    mapCanvas.ontouchmove = null;
}

//子弹类
function Bullet(x, y, w, h, img, hurt) {
    //属性
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.hurt = hurt; //伤害
}
//绘制方法
Bullet.prototype.draw = function () {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
}
//移动方法
Bullet.prototype.move = function () {
    this.y -= 15;
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
    this.flagI = 0; //图片切换的频率
}
//方法
Enemy.prototype.draw = function () {
    //爆炸, 切换图片
    if (this.boom) {
        this.flagI++;
        if (this.flagI == 5) {
            this.i++;
            if (this.i == this.maxI) {
                //当图片切换结束,飞机死亡
                this.isDie = true;
            }
            //重置
            this.flagI = 0;
        }
    }
    // ctx.drawImage(this.img, this.i * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(this.img, this.i * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);

}
Enemy.prototype.move = function () {
    var spacex = Math.abs(hero.x) - Math.abs(this.x);
    var spacey = Math.abs(hero.y) - Math.abs(this.y);
    if (this.y > hero.y) {
        this.y -= (spacey * this.speed / 100);
    } else {
        this.y += (spacey * this.speed / 100);
    }

    if (this.x > hero.x) {
        this.x -= (-spacex * this.speed / 100);
    } else {
        this.x += (spacex * this.speed / 100);
    }
}
//随机数
function random(x, y) {
    return parseInt(Math.random() * (y - x + 1) + x);
}
//敌机图片
var enemyImg1 = new Image();
enemyImg1.src = "img/enemy1.png";
var enemyImg2 = new Image();
enemyImg2.src = "img/enemy2.png";
var enemyImg3 = new Image();
enemyImg3.src = "img/enemy3.png";
//记录创建的敌机
var enemies = [];
//随机产生敌机
function randomEnemy() {
    //控制飞机产生的概率
    var num = random(20, 1500);
    // var num = random(49, 50);


    if (num <= 50) {
        //随机位置 
        var randomX = random(0, mapCanvas.width - 46);
        var randomY = random(0, (mapCanvas.height * 1) / 5);
        //随机速度
        var randomSpeed = random(2, 6);
        //创建中型飞机
        var enemy = new Enemy(randomX, randomY, 46, 64, enemyImg2, randomSpeed, 6, 200, 6);
        //记录飞机
        enemies.push(enemy);
    }

    //移动飞机
    for (var i = 0; i < enemies.length; i++) {
        //判断飞机是否超出屏幕
        if (enemies[i].y >= mapCanvas.height || enemies[i].isDie) {
            //删除飞机
            enemies.splice(i, 1);
            //数组中删除某个元素, 为了保证相邻的下一个元素能够遍历到, 需要i--
            i--;
            // console.log(+1);
        } else {
            enemies[i].move();
            enemies[i].draw();
        }
    }
}

//道具图片
var propImg = new Image();
propImg.src = "img/prop.png";
//道具类
function Prop(x, y, w, h, type, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type; //道具类型(0:炸弹, 1:双排子弹)
    this.speed = speed;
    this.isUsed = false; //道具有没有被使用
}
//方法
Prop.prototype.draw = function () {
    ctx.drawImage(propImg, this.type * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
}
//移动
Prop.prototype.move = function () {
    this.y += this.speed;
}

//记录创建出来的道具
var props = [];
//两个矩形碰撞检测
function crash(obj1, obj2) {
    //两个物体上下左右的位置
    var left1 = obj1.x;
    var right1 = obj1.x + obj1.w;
    var top1 = obj1.y;
    var bottom1 = obj1.y + obj1.h;

    var left2 = obj2.x;
    var right2 = obj2.x + obj2.w;
    var top2 = obj2.y;
    var bottom2 = obj2.y + obj2.h;

    //判断是否发生碰撞
    if (right1 < left2 || bottom1 < top2 || left1 > right2 || top1 > bottom2) {
        return false;
    } else {
        return true;
    }
}

//记录子弹持续时间的计时器
var timeout = null;
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
        //发生碰撞
        if (props[i].type) { //双排子弹
            hero.armType = 1;
            //清除之前的定时器
            clearTimeout(timeout);
            //双排子弹持续5秒
            timeout = setTimeout(function () {
                hero.armType = 0;
            }, 5000);
        } else { //炸弹
            //所有飞机爆炸
            for (var j = 0; j < enemies.length; j++) {
                enemies[j].boom = true;
                //计分
                scoreSpan.innerHTML = parseInt(scoreSpan.innerText) + enemies[j].score;
                limitgameover(scoreSpan.innerHTML)
            }
        }
        //修改道具状态为使用
        props[i].isUsed = true;
    }

    //子弹(hero.bullets)和敌机(enemies)
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < hero.bullets.length; j++) {
            if (enemies[i].boom) {
                break;
            }
            //检测是否发生碰撞
            if (!crash(enemies[i], hero.bullets[j])) {
                continue;
            }
            //发生碰撞💥
            //1.掉血
            enemies[i].hp -= hero.bullets[j].hurt;
            //2.判断敌机是否死亡
            if (enemies[i].hp <= 0) {
                enemies[i].boom = true;
                //计分
                scoreSpan.innerHTML = parseInt(scoreSpan.innerText) + enemies[i].score;
                limitgameover(scoreSpan.innerHTML)
                //判断飞机类型
                switch (enemies[i].score) {
                    case 100:
                        // musics[1].play();
                        break;
                    case 200:
                        // musics[2].play();
                        break;
                    case 300:
                        // musics[3].play();
                        break;
                    default:
                        break;
                }
            }
            //3.子弹消失
            hero.bullets.splice(j, 1);
            j--;
        }
    }

    //敌机和飞机
    for (var i = 0; i < enemies.length; i++) {
        //如果敌机已经爆炸, 不做碰撞检测
        if (enemies[i].boom) {
            continue;
        }
        if (crash(enemies[i], hero)) {
            //飞机爆炸
            hero.boom = true;
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
    // 制造飞机
    randomEnemy();
    // 产生道具
    // randomProp();
    if (!hero.boom) {
        //检测
        justify();
    }

    //同步刷新
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
    //暂停背景音乐
    // musics[4].pause();
    //播放游戏结束
    // musics[5].play();
    //修改分数
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