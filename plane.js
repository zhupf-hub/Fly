window.onload = function() {
    // 获取标签元素的方法
    function $(idName) {
        return document.getElementById(idName);
    }
    // 获取样式使用最终值的函数
    function getStyle(ele, attr) {
        var res = null;
        if (ele.currentStyle) { //考虑浏览器的兼容1
            res = ele.currentStyle[attr];
        } else {
            res = window.getComputedStyle(ele, null)[attr];
        }
        return parseFloat(res);
    }
    // 获取需要使用到的标签元素
    var game = $("game")
        // 游戏开始的界面
        ,

        plane = $("plane"),
        gameStart = $("gameStart")
        // 进入游戏的界面
        ,
        gameEnter = $("gameEnter"),
        myPlane = $("myPlane"),
        bulletsP = $("bullets"),
        enemysP = $("enemys"),
        s = $("scores").firstElementChild.firstElementChild; //span标签
    l = $("scores").firstElementChild.firstElementChild.nextElementSibling;
    // 获取需要使用到的元素样式
    // 1、获取游戏界面的宽高
    var gameW = getStyle(game, "width"),
        gameH = getStyle(game, "height");
    // 2、游戏界面的左上外边距
    var gameML = getStyle(game, "marginLeft"),
        gameMT = getStyle(game, "marginTop");
    // 3、获取己方飞机的宽高
    var myPlaneW = getStyle(myPlane, "width"),
        myPlaneH = getStyle(myPlane, "height");
    // 4、子弹的宽高
    var bulletW = 6,
        bulletH = 14;


    // 声明需要使用到的全局变量
    var gameStatus = false // 当前的游戏状态
        ,
        a = null // 创建子弹的定时器
        ,
        b = null // 创建敌机的定时器
        ,
        c = null // 背景图运动的定时器
        ,
        backgroundPY = 0 // 背景图y轴的值
        ,
        bullets = [] // 所有子弹元素的集合
        ,
        enemys = [] // 所有敌机元素的集合
        ,
        scores = 0 // 得分
    ;
    var btn = document.getElementsByClassName("Btn")[0];
    var aboutgame = document.getElementsByClassName("aboutgame")[0];
    aboutgame.onclick = function() {
        window.open("file:///C:/Users/17689/Desktop/plane/aboutgame.html");
    }

    var mark = true;
    // 开始游戏

    gameStart.firstElementChild.onclick = function() {

            gameStart.style.display = "none";
            gameEnter.style.display = "block";
            // 给当前的文档添加键盘事件
            document.onkeyup = function(evt) {
                var e = evt || window.event;
                // 获取到键盘的键值
                var keyVal = e.keyCode; //获取键盘值
                if (keyVal == 32) { //空格键，游戏开始
                    if (mark) {
                        myMusic.play();
                        mark = false;

                    }
                    if (!gameStatus) {
                        // 初始化得分
                        scores = 0;
                        // 开始游戏
                        this.onmousemove = myPlaneMove;
                        // 实现开始游戏之后背景图的运动


                        bgMove();
                        // 实现射击
                        shot();
                        // 出现敌机
                        appearEnemy();
                        // 暂停游戏之后的开始游戏
                        // 子弹的继续运动
                        if (bullets.length != 0) reStart(bullets, 1);
                        // 敌机的继续运动
                        if (enemys.length != 0) reStart(enemys);
                    } else {
                        if (!mark) {
                            myMusic.pause();
                            mark = true;
                        }

                        // 暂停游戏
                        this.onmousemove = null;
                        // 清除创建敌机和创建子弹的定时器
                        clearInterval(a);
                        clearInterval(b);
                        clearInterval(c);
                        a = null;
                        b = null;
                        c = null;
                        // 清除所有子弹和所有敌机上的运动定时器
                        clear(bullets);
                        clear(enemys);
                    }
                    gameStatus = !gameStatus;
                }
            }
        }
        // 己方飞机的移动
    function myPlaneMove(evt) {
        var e = evt || window.event;
        // 获取鼠标移动时的位置
        var mouse_x = e.x || e.pageX,
            mouse_y = e.y || e.pageY;

        // 计算得到鼠标移动时己方飞机的左上边距
        var last_myPlane_left = mouse_x - gameML - myPlaneW / 2,
            last_myPlane_top = mouse_y - gameMT - myPlaneH / 2;
        // 控制飞机不能脱离当前的游戏界面
        if (last_myPlane_left <= 0) {
            last_myPlane_left = 0;
        } else if (last_myPlane_left >= gameW - myPlaneW) {
            last_myPlane_left = gameW - myPlaneW;
        }
        if (last_myPlane_top <= 0) {
            last_myPlane_top = 0;
        } else if (last_myPlane_top >= gameH - myPlaneH) {
            last_myPlane_top = gameH - myPlaneH;
        }
        myPlane.style.left = last_myPlane_left + "px";
        myPlane.style.top = last_myPlane_top + "px";
    }
    // 单位时间内创建子弹
    function shot() {

        if (a) return;
        a = setInterval(function() {
            Zidan.play();
            // 创建子弹
            createBullet();
        }, 100);
    }



    function change() {
        gameEnter.setAttribute('class', ' abc');

    }



    // 制造子弹
    function createBullet() {
        var bullet = new Image();
        if (scores < 3000) {
            bullet.src = "image/bullet0.png";
        } else {

            bullet.src = "image1/bullet1.png";

        }

        bullet.className = "b";
        // 创建每一颗子弹都需要确定己方飞机的位置：
        var myPlaneL = getStyle(myPlane, "left"),
            myPlaneT = getStyle(myPlane, "top");
        // 确定创建子弹的位置
        var bulletL = myPlaneL + myPlaneW / 2 - bulletW / 2,
            bulletT = myPlaneT - bulletH;

        bullet.style.left = bulletL + "px";
        bullet.style.top = bulletT + "px";
        bulletsP.appendChild(bullet);
        bullets.push(bullet);
        move(bullet, "top");
    }
    // 子弹的运动:运动函数(匀速运动)
    function move(ele, attr) {
        var speed = -8;
        ele.timer = setInterval(function() {
            var moveVal = getStyle(ele, attr);
            // 子弹运动出游戏界面：清除子弹的定时器，删除子弹元素
            if (moveVal <= -bulletH) {
                clearInterval(ele.timer);
                ele.parentNode.removeChild(ele);
                bullets.splice(0, 1);
            } else {
                ele.style[attr] = moveVal + speed + "px";
            }
        }, 10);
    }
    // 创建敌机数据对象
    var enemysObj = {
            enemy1: {
                width: 34,
                height: 24,
                score: 100,
                hp: 100
            },
            enemy2: {
                width: 80,
                height: 60,
                score: 500,
                hp: 800
            },
            enemy3: {
                width: 130,
                height: 110,
                score: 1000,
                hp: 2000
            }
        }
        // 创建敌机的定时器
    function appearEnemy() {
        if (b) return;
        b = setInterval(function() {
            // 制造敌机
            createEnemy();
            // 删除死亡敌机
            delEnemy();
        }, 1000);
    }
    // 制造敌机的函数
    function createEnemy() {
        var percentData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3];
        // 敌机出现概率的数据
        var enemyType = percentData[Math.floor(Math.random() * percentData.length)];
        // 得到当前随机敌机的数据
        var enemyData = enemysObj["enemy" + enemyType];
        // 创建敌机所在的元素
        var enemy = new Image(enemyData.width, enemyData.height);
        if (scores <= 3000) {
            enemy.src = "image/enemy" + enemyType + ".png";

        } else if (scores > 3000) {
            planechange();
            enemy.src = "image1/enemy" + enemyType + ".png";
        }

        enemy.t = enemyType;
        enemy.score = enemyData.score;
        enemy.hp = enemyData.hp;
        enemy.className = "e";
        enemy.dead = false; // 敌机存活
        // 确定当前敌机出现时的位置
        var enemyL = Math.floor(Math.random() * (gameW - enemyData.width + 1)),
            enemyT = -enemyData.height;
        enemy.style.left = enemyL + "px";
        enemy.style.top = enemyT + "px";
        enemysP.appendChild(enemy);
        enemys.push(enemy);
        enemyMove(enemy, "top");
    }
    // 敌机的运动
    function enemyMove(ele, attr) {

        var speed = null;
        if (scores <= 1000) {
            if (ele.t == 1) {
                speed = 1.2;
            } else if (ele.t == 2) {
                speed = 1;
            } else if (ele.t == 3) {
                speed = 0.7;
            }
        } else if (scores > 1000 && scores <= 3000) {
            if (ele.t == 1) {

                speed = 2.0;
            } else if (ele.t == 2) {
                speed = 1.7;
            } else if (ele.t == 3) {
                speed = 1.2;
            }
        } else if (scores > 3000 && scores <= 5000) {
            change();
            if (ele.t == 1) {

                speed = 2.7;
            } else if (ele.t == 2) {
                speed = 2.2;
            } else if (ele.t == 3) {
                speed = 1.7;
            }
        } else if (scores > 5000) {
            change();
            if (ele.t == 1) {

                speed = 3.2;
            } else if (ele.t == 2) {
                speed = 2.7;
            } else if (ele.t == 3) {
                speed = 2.2;
            }
        }

        // if (ele.t == 1) {

        //     speed = 1.7;
        // } else if (ele.t == 2) {
        //     speed = 1.2;
        // } else if (ele.t == 3) {
        //     speed = 0.8;
        // }
        ele.timer = setInterval(function() {
            var moveVal = getStyle(ele, attr);
            if (moveVal >= gameH) {
                clearInterval(ele.timer);
                enemysP.removeChild(ele);
                enemys.splice(0, 1);
            } else {
                ele.style[attr] = moveVal + speed + "px";
                // 每一架敌机运动时，检测和每一颗子弹的碰撞
                danger(ele);
                // 检测碰撞
                gameOver();
            }
        }, 10);
    }
    // 清除所有敌机和所有子弹上的运动定时器
    function clear(childs) {
        for (var i = 0; i < childs.length; i++) {
            clearInterval(childs[i].timer);
        }
    }
    // 暂停游戏之后的开始游戏
    function reStart(childs, type) {
        for (var i = 0; i < childs.length; i++) {
            type == 1 ? move(childs[i], "top") : enemyMove(childs[i], "top");
        }
    }
    // 开始游戏之后的背景图的运动
    function bgMove() {

        c = setInterval(function() {
            backgroundPY += 0.5;
            if (backgroundPY >= gameH) {
                backgroundPY = 0;
            }
            gameEnter.style.backgroundPositionY = backgroundPY + "px";
        }, 10);
    }
    // 检测子弹和敌机的碰撞
    function danger(enemy) {


        for (var i = 0; i < bullets.length; i++) {
            // 得到子弹的左上边距
            var bulletL = getStyle(bullets[i], "left"),
                bulletT = getStyle(bullets[i], "top");
            // 得到敌机的左上边距
            var enemyL = getStyle(enemy, "left"),
                enemyT = getStyle(enemy, "top");
            // 得到敌机的宽高
            var enemyW = getStyle(enemy, "width"),
                enemyH = getStyle(enemy, "height");
            var condition = bulletL + bulletW >= enemyL && bulletL <= enemyL + enemyW && bulletT <= enemyT + enemyH && bulletT + bulletH >= enemyT;
            if (condition) {
                //子弹和敌机的碰撞：删除子弹
                // 1、先清除碰撞子弹的定时器
                clearInterval(bullets[i].timer);
                // 2、删除元素
                bulletsP.removeChild(bullets[i]);
                // 3、从集合中删除子弹
                bullets.splice(i, 1);
                // 4、子弹和敌机发生碰撞后，敌机血量减少，血量为0时，删除敌机
                enemy.hp -= 100;
                if (enemy.hp == 0) {
                    Bomb.play();
                    // 删除敌机
                    clearInterval(enemy.timer);
                    // 替换爆炸图片
                    enemy.src = "image/bz" + enemy.t + ".gif";
                    // 标记死亡敌机
                    enemy.dead = true;
                    // 计算得分
                    scores += enemy.score;
                    s.innerHTML = scores;
                    if (scores > 3000) {
                        l.innerHTML = 2;
                    }
                }
            }
        }
    }
    // 在创建敌机时，延时删除掉集合和文档中的死亡敌机
    function delEnemy() {
        for (var i = enemys.length - 1; i >= 0; i--) {
            if (enemys[i].dead) {
                (function(index) {
                    // 从文档中删除死亡敌机元素
                    enemysP.removeChild(enemys[index]);
                    // 从集合中删除死亡敌机元素
                    enemys.splice(index, 1);
                })(i)
            }
        }
    }
    // 飞机碰撞，游戏结束
    function gameOver() {

        for (var i = 0; i < enemys.length; i++) {
            if (!enemys[i].dead) { // 游戏机界面内存活的敌机
                // 检测碰撞
                // 1、获取敌机的左上边距
                var enemyL = getStyle(enemys[i], "left"),
                    enemyT = getStyle(enemys[i], "top");;
                // 2、获取敌机的宽高
                var enemyW = getStyle(enemys[i], "width"),
                    enemyH = getStyle(enemys[i], "height");
                // 3、获取己方飞机的左上边距
                var myPlaneL = getStyle(myPlane, "left"),
                    myPlaneT = getStyle(myPlane, "top");
                var condition = myPlaneL + myPlaneW >= enemyL && myPlaneL <= enemyL + enemyW && myPlaneT <= enemyT + enemyH && myPlaneT + myPlaneH >= enemyT;
                if (condition) { // 己方飞机和敌机的碰撞
                    myMusic.pause();
                    // console.log("碰撞了...");
                    // 清除定时器：创建子弹的定时器、创建飞机的定时器、游戏背景图的定时器
                    clearInterval(a);
                    clearInterval(b);
                    clearInterval(c);
                    a = null;
                    b = null;
                    c = null;
                    // 删除子弹和敌机元素
                    remove(bullets);
                    remove(enemys);
                    // 集合清空
                    bullets = [];
                    enemys = [];
                    // 清除己方飞机的移动事件
                    document.onmousemove = null;
                    // 提示得分：
                    alert("Game over: " + scores + "分");
                    // 回到游戏开始界面
                    gameStart.style.display = "block";
                    gameEnter.style.display = "none";
                    myPlane.style.left = "127px";
                    myPlane.style.top = gameH - myPlaneH + "px";
                }
            }
        }
    }
    // 删除元素
    function remove(childs) {
        for (var i = childs.length - 1; i >= 0; i--) {
            clearInterval(childs[i].timer);
            childs[i].parentNode.removeChild(childs[i]);
        }
    }
}

function ReturnGame() {

    window.close();


}

function ExitGame() {
    if (confirm("你确定退出吗?")) {
        window.close();
    }

}

function planechange() {

    myPlane.firstElementChild.src = "image1/My_plane.png";
}