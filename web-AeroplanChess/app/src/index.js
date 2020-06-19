import Web3 from "web3";
import AeroplaneChessArtifact from "../../build/contracts/AeroplaneChess.json";

var DICE;
var diceNum_local = 1;    //骰子所得数
var sixTime = 0;    //连投6的次数
var nextStep = false;   //是否可以执行下一步
var colorList = {
    0: 'red',
    1: 'blue',
    2: 'yellow',
    3: 'green',
}
var player_list_local = [];
var currentUser_blockchain = 0;
// player_list_local.push({'color':colorList[0],'state':"computer"});
// player_list_local.push({'color':colorList[1],'state':"normal"});
// player_list_local.push({'color':colorList[2],'state':"close"});
// player_list_local.push({'color':colorList[3],'state':"close"});


const App = {
    web3: null,
    account: null,
    meta: null,


    getCurrentUser_blockchain: async function () {
        const { currentUser } = this.meta.methods;
        currentUser_blockchain = await currentUser(this.account).call;
    },


    start: async function () {
        const { web3 } = this;

        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AeroplaneChessArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                AeroplaneChessArtifact.abi,
                deployedNetwork.address,
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },



    setStatus: function (message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },

    begin_blockchain: async function () {
        player_list_local = [];
        await this.setUserList_blockchain();
    },

    setUserList_blockchain: function () {
        this.setUser_blockchain('#redUser li', 0);
        this.setUser_blockchain('#blueUser li', 1);
        this.setUser_blockchain('#yellowUser li', 2);
        this.setUser_blockchain('#greenUser li', 3);
    },

    setUser_blockchain: async function (obj, color_id_blockchain) {
        let state;
        $j(obj).each(function () {
            if ($j(this).hasClass('bth')) {
                switch ($j(this).text()) {
                    case '玩家':
                        state = 'normal';
                        break;
                    case '电脑':
                        state = 'computer';
                        break;
                    case '无':
                        state = 'close';
                        break;
                }
            }
        });
        player_list_local.push({ 'color': colorList[color_id_blockchain], 'state': state })
        const { _setStateForUser } = this.meta.methods;
        await _setStateForUser(color_id_blockchain, state).send({ from: this.account });
    },

    findFirstUser_blockChain: function () {
        const { findFirstUser } = this.meta.methods;
        findFirstUser().send({ from: this.account });
    },

    getFirstUser_blockChain: async function () {
        const { currentUser } = this.meta.methods;
        currentUser_blockchain = await currentUser().call();
    },

    sendDiceNum: async function (diceNum_local) {
        const { setDiceNum } = this.meta.methods;
        await setDiceNum(diceNum_local).send({ from: this.account });
    }




};

//本地操作即可 - 可以6
function userState(color) {
    var state;
    for (var i = 0; i < player_list_local.length; i++) {
        if (color == player_list_local[i].color) {
            state = player_list_local[i].state;
        }
    }
    return state;
}

const PlaneCoord = {
    //找准飞机场的的中心点
    createPlane_blcokchain: function (type) {
        if (type && type.length > 0) {
            for (var i = 0; i < type.length; i++) {
                if (type[i].state != 'close') {
                    //只为 normal/computer 玩家配备飞机
                    switch (type[i].color) {
                        case 'red':
                            this.addPlaneDiv_blockchain(type[i].color, 73, 770);
                            break;
                        case 'blue':
                            this.addPlaneDiv_blockchain(type[i].color, 771, 770);
                            break;
                        case 'yellow':
                            this.addPlaneDiv_blockchain(type[i].color, 771, 71);
                            break;
                        case 'green':
                            this.addPlaneDiv_blockchain(type[i].color, 73, 71);
                            break;
                    }
                }
            }
        }
    },
    //为用户添加/绘制飞机
    addPlaneDiv_blockchain: function (type, top, left) {
        for (var i = 0; i < 4; i++) {
            var plane = document.createElement('div');
            plane.className = 'plane';
            //plane.innerHTML = i + 1;
            switch (i) {
                case 1:
                    left += 95;
                    break;
                case 2:
                    top += 92;
                    left -= 95;
                    break;
                case 3:
                    left += 95;
                    break;
            }
            var imgUrl = '';
            switch (type) {
                case 'red':
                    imgUrl = 'url("img/plane_red_b.png")';
                    break;
                case 'blue':
                    imgUrl = 'url("img/plane_blue_b.png")';
                    break;
                case 'yellow':
                    imgUrl = 'url("img/plane_yellow_b.png")';
                    break;
                case 'green':
                    imgUrl = 'url("img/plane_green_b.png")';
                    break;
            }
            $j(plane).attr({ 'type': type, 'num': i + 1, 'state': 'unready' }).css({
                'top': top + 'px',
                'left': left + 'px',
                'background-image': imgUrl,
                'background-size': 'cover'
            });

            //在这儿可以6广播属性
            $j('.main').append(plane);
        }
    },
};


//添加骰子的活动
//点击绑定骰子旋转
function addDiceEvent() {
    $j("#dice").unbind('click').click(function () {
        $j("#dice").unbind('click').removeClass('pointer');
        DICE.shuffle(1, onComplete);
        planeAudio.playDiceMusic();
    }).addClass('pointer');
    console.log(player_list_local);
};

async function onComplete($el, active) {
    diceNum_local = active.index + 1; //activate的点数
    console.log(diceNum_local);
    await App.sendDiceNum(diceNum_local);
    // if (rule.countSixTime()) {
    //     return;
    // }
    $j("#sdn" + colorList[currentUser_blockchain]).text(diceNum_local);
    addPlaneEvent(userState(colorList[currentUser_blockchain]));
};

//投骰子后给当前用户飞机添加事件
//@param state 当前用户状态 - normal / computer
function addPlaneEvent(state) {
    var flag = false;
    $j('.plane').each(function () {
        var currentUserPlane = ($j(this).attr('type') == colorList[currentUser_blockchain] ? $j(this) : undefined);
        //type就是颜色，选择出当前用户的飞机
        if (currentUserPlane) {
            if (diceNum_local == 6) {
                console.log("666");
                planeAudio.playRolledSixMusic();
                if ($j(this).attr('state') != 'win') {//不是win的都可以飞出来
                    currentUserPlane.click(function () {
                        movePlane(this);//触发移动飞机命令
                    }).addClass('pointer');
                    flag = true;
                }
            } else {//不是6的时候，只可以移动 ready 和 running 的飞机
                if ($j(this).attr('state') == 'ready' || $j(this).attr('state') == 'running') {
                    currentUserPlane.click(function () {
                        movePlane(this);
                    }).addClass('pointer');
                    flag = true;//已经移动飞机
                }
            }
        }
    });
    if (!flag) {
        setTimeout(nextUser(), 1000);//超时就给下一个用户执行
    } else if (state == 'computer') {  //电脑执行
        Computer.performing();
    }
};


//点击飞机移动事件
function movePlane(obj) {
    var coordId = 0, step = 0;
    $j(obj).siblings('[type=' + colorList[currentUser_blockchain] + ']').unbind('click').removeClass('pointer');
    if ($j(obj).attr('state') == 'unready') { // 仓库里的飞机
        var unTop, unLeft;
        switch (colorList[currentUser_blockchain]) {  // 找到对应的coordId
            case 'red':
                unTop = '45px';
                unLeft = '678px';
                break;
            case 'blue':
                unTop = '678px';
                unLeft = '896px';
                coordId = 13;
                break;
            case 'yellow':
                unTop = '892px';
                unLeft = '258px';
                coordId = 26;
                break;
            case 'green':
                unTop = '259px';
                unLeft = '45px';
                coordId = 39;
                break;
        }
        planeAudio.playOutMusic();
        //animate-动画效果
        $j(obj).animate({ top: unTop, left: unLeft }, 1500, function () {//模拟从停机坪到起飞ready位置
            //unready状态切换到ready状态
            $j(obj).attr({ 'state': 'ready', 'coordId': coordId, 'step': step }).unbind('click').removeClass('pointer');
            if (diceNum_local != 6) {
                nextUser();//不是6的时候切换下一个用户
            } else {    //6可连续投骰
                addDiceEvent();
                nextStep = true;
            }
        });
    } else {//正常状态的飞机
        $j(obj).attr({ 'state': 'running' });
        var yuanCoord = $j(obj).attr('coordId') ? parseInt($j(obj).attr('coordId')) : 0;//获取位置
        var yuanStep = $j(obj).attr('step') ? parseInt($j(obj).attr('step')) : 0;//获取应该走的步数
        step = yuanStep + diceNum_local;//获取新的位置
        var coordValue, currentStep = 0, i = 1, stopFlag = false, superTime = 0, backStepFlag = false, superFlag = false, currentUser = colorList[currentUser_blockchain];
        var flyAttackFlag = true;
        moveCoord();

        function moveCoord() {
            //i是一个不断增加的变量，diceNum_local不变
            if (i > diceNum_local) {  //当走完最后一步时执行的，检查停留的位置
                if (coordValue.state != null && coordValue.state == 'win') {//当前的状态是win
                    rule.planeBack('win', $j(this).attr('type'), $j(this));//凯旋而归
                    if (rule.victory()) {
                        planeAudio.playWinMusic();
                        alert(colorList[currentUser_blockchain] + '用户胜利!');
                        return;
                    }
                    planeAudio.playLitWinMusic();
                }
                stopFlag = rule.attackPlane(coordValue, obj, superFlag); // 是否自然停下
                if (coordValue.coordColor == $j(obj).attr('type') && coordValue.superCoord != null && !stopFlag) {//相同颜色 && superCoor-加油站 &&不是停飞
                    superTime++;
                    coordValue = selectCoordValue(coordValue.superCoord);//通过Id获取棋盘点信息
                    coordId = parseInt(coordValue.id);//获取坐标
                    step += 12;//加油站就是加速12格
                    superFlag = true;//使用了加油站
                    planeAudio.playFlyAcrossMusic();
                    $j(obj).animate({ 'top': coordValue.top, 'left': coordValue.left }, 600);//模拟移动 - 模拟连跳
                    if (superTime == 1) {//如果是第一次使用道具，不可以攻击
                        moveCoord();
                        flyAttackFlag = false;
                    } else {    //多次使用道具 //飞越后检测是否有攻击的飞机
                        rule.attackPlane(coordValue, obj, superFlag);
                        flyAttackFlag = true;
                    }
                } else if (coordValue.coordColor == $j(obj).attr('type') && !stopFlag && coordValue.r == null) {//如果是相同颜色的格子，就跳跃到下一个
                    superTime++; // 使用道具次数
                    coordId += 4;
                    if (coordId > 52) { // 棋盘总共52格
                        coordId -= 52;
                    }
                    coordValue = selectCoordValue(coordId);//通过Id获取棋盘点信息
                    coordId = parseInt(coordValue.id);//获取棋盘的Id
                    step += 4;//新的位置加4
                    planeAudio.playJumpMusic();
                    $j(obj).animate({ 'top': coordValue.top, 'left': coordValue.left }, 600);
                    if (coordValue.superCoord != null) {//有super，能连跳
                        moveCoord();
                        flyAttackFlag = false;
                    } else {    //飞越后检测是否有攻击的飞机
                        rule.attackPlane(coordValue, obj, superFlag);
                        flyAttackFlag = true;
                    }
                }
                if (flyAttackFlag) {
                    $j(obj).attr({ 'coordId': coordValue.id, 'step': step }).unbind('click').removeClass('pointer');
                    if (diceNum_local != 6) {
                        nextUser();
                    } else {    //6可连续投骰
                        addDiceEvent();
                        nextStep = true;
                    }
                }
                return;
            }
            planeAudio.playStepMusic();
            if (backStepFlag) {
                coordId--;
            } else {
                coordId = yuanCoord + i;
            }
            currentStep = yuanStep + i;
            if (coordId > 52 && currentStep < 50) {
                coordId -= 52;
            }
            if (currentStep > 50 && !backStepFlag) {
                switch (colorList[currentUser_blockchain]) {
                    case 'red':
                        if (yuanCoord < 61) {
                            coordId = yuanCoord + i + 10;
                        }
                        if (coordId > 66) {
                            backStepFlag = true;
                            coordId = 65;
                        }
                        break;
                    case 'blue':
                        if (yuanCoord < 71) {
                            coordId = yuanCoord + i + 59;
                        }
                        if (coordId > 76) {
                            backStepFlag = true;
                            coordId = 75;
                        }
                        break;
                    case 'yellow':
                        if (yuanCoord < 81) {
                            coordId = yuanCoord + i + 56;
                        }
                        if (coordId > 86) {
                            backStepFlag = true;
                            coordId = 85;
                        }
                        break;
                    case 'green':
                        if (yuanCoord < 91) {
                            coordId = yuanCoord + i + 53;
                        }
                        if (coordId > 96) {
                            backStepFlag = true;
                            coordId = 95;
                        }
                        break;
                }
            }
            coordValue = selectCoordValue(coordId);
            i++;
            $j(obj).animate({ 'top': coordValue.top, 'left': coordValue.left }, 300, moveCoord);
        }
    }
}


//选择下一位用户
function nextUser() {
    nextStep = false;
    $j("#sdn" + colorList[currentUser_blockchain]).text('等待');
    var computer = false;

    //状态转移 可以6
    currentUser_blockchain = (currentUser_blockchain + 1) % 4;
    
    //重置6的次数
    sixTime = 0;
    
    //取回userstate by 颜色
    var state = userState(colorList[currentUser_blockchain]);
    
    if (state == 'computer') {
        computer = true;
        $j('.shade').show();
    } else if (state == 'win' || state == 'close') {
        nextUser();
        return;
    } else {
        $j('.shade').hide();
    }
    $j("#sdn" + colorList[currentUser_blockchain]).text('请投骰');
    addDiceEvent();
    if (computer) {
        setTimeout(function () {
            $j("#dice").click();
        }, 1500);
    }
}

//根据coordId查询坐标数据
//@param coordId
//@returns {{id: *, top: number, left: number, coordColor: string, superCoord: null, r: null}}
function selectCoordValue(coordId) {
    var coord = {
        id: coordId,
        top: 0,
        left: 0,
        coordColor: '',
        superCoord: null,
        r: null,
        state: null
    };
    if (!coordId) {
        return null;
    }
    for (var j = 0; j < COORD.length; j++) {
        if (COORD[j].id == coordId) {
            coord.top = COORD[j].top + 'px';
            coord.left = COORD[j].left + 'px';
            coord.coordColor = COORD[j].color;
            coord.superCoord = COORD[j].super;
            coord.r = COORD[j].r;
            coord.state = COORD[j].state;
        }
    }
    return coord;
}


const Computer = {
    //选自己家的飞机
    //根据长度均衡获取0,0-1,0-2,0-3的随机整数
    obtainRandomNum: function (leng) {
        var num = Math.floor(Math.random() * 10);//均衡获取0-9的随机整数
        switch (leng) {
            case 1:
                return 0;
            case 2:
                if (num == 0 || num == 1) {
                    return num;
                } else {
                    return Computer.obtainRandomNum(leng);
                }
            case 3:
                if (num == 0 || num == 1 || num == 2) {
                    return num;
                } else {
                    return Computer.obtainRandomNum(leng);
                }
            case 4:
                if (num == 0 || num == 1 || num == 2 || num == 3) {
                    return num;
                } else {
                    return Computer.obtainRandomNum(leng);
                }
        }
    },

    performing: function () {
        setTimeout(function () {
            var planeList = new Array();
            $j('.plane').each(function () {//识别他自己的飞机
                if (colorList[currentUser_blockchain] == $j(this).attr('type') && $j(this).hasClass('pointer')) {
                    planeList.push($j(this));
                }
            });
            if (planeList && planeList.length > 0) {//随机挑选一个执行
                var randomNum = Computer.obtainRandomNum(planeList.length);
                $j(planeList[randomNum]).click();
                if (diceNum_local == 6) {
                    Computer.diceClick();
                }
            }
        }, 1500);
    },

    //如果骰子数是6就继续投一次
    diceClick: function () {
        var nextSt = setTimeout(function () {
            if (nextStep) {
                $j("#dice").click();
                clearTimeout(nextSt);
                return;
            } else {
                Computer.diceClick();
            }
        }, 500);
    },
};


const rule = {
    /**
     * 验证当前用户是否胜利
     * @returns {boolean}
     */
    victory: function () {
        var winNum = 0, winFlag = false;
        $j('.plane').each(function () {//判断单个飞机的状态是不是win
            if ($j(this).attr('type') == colorList[currentUser_blockchain] && $j(this).attr('state') == 'win') {
                winNum++;
            }
        });
        if (winNum == 4) {  // 4架马车(x)飞机
            winFlag = true;
        }
        return winFlag;
    },

    /*
     * 计算连续投6次数
     * @returns {boolean}
     */
    countSixTime: function () {
        if (diceNum == 6) {
            sixTime++;
        }
        if (sixTime == 3) {
            //将该用户所有在外的飞机回收
            planeAudio.playRolledThreeTimeSixMusic();
            backCurrentUserAllPlane();
            return true;
        } else {
            return false;
        }
    },

    attackPlane: function (coordValue, obj, superFlag) {
        var stopFlag = false;
        $j('.plane').each(function () {//遍历所有的飞机
            if (coordValue.id == $j(this).attr('coordId') && $j(obj).attr('type') != $j(this).attr('type') && $j(this).attr('state') == 'running') {//坐标相同&&颜色不同&&都是在飞
                rule.planeBack('attack', $j(this).attr('type'), $j(this));//下面的飞机被打回去了
                planeAudio.playAttackMusic();
                stopFlag = true;
            }
            if (superFlag) {//superFlag模式
                switch (colorList[currentUser_blockchain]) {
                    case 'red':
                        if (83 == parseInt($j(this).attr('coordId'))) {
                            rule.planeBack('attack', $j(this).attr('type'), $j(this));
                            stopFlag = true;
                        }
                        break;
                    case 'blue':
                        if (93 == parseInt($j(this).attr('coordId'))) {
                            rule.planeBack('attack', $j(this).attr('type'), $j(this));
                            stopFlag = true;
                        }
                        break;
                    case 'yellow':
                        if (63 == parseInt($j(this).attr('coordId'))) {
                            rule.planeBack('attack', $j(this).attr('type'), $j(this));
                            stopFlag = true;
                        }
                        break;
                    case 'green':
                        if (73 == parseInt($j(this).attr('coordId'))) {
                            rule.planeBack('attack', $j(this).attr('type'), $j(this));
                            stopFlag = true;
                        }
                        break;
                }
            }
        });
        return stopFlag;
    },

    /*
     * @param type  类型  被攻击打回   胜利
     * @param color 颜色
     * @param obj   该飞机
     */
    planeBack: function (type, color, obj) {
        var top, left;
        switch (color) {
            case 'red':
                for (var i = 0; i < initRedCoord.length; i++) {
                    if (initRedCoord[i].id == $j(obj).attr('num')) {
                        top = initRedCoord[i].top;
                        left = initRedCoord[i].left;
                    }
                }
                break;
            case 'blue':
                for (var i = 0; i < initBlueCoord.length; i++) {
                    if (initBlueCoord[i].id == $j(obj).attr('num')) {
                        top = initBlueCoord[i].top;
                        left = initBlueCoord[i].left;
                    }
                }
                break;
            case 'yellow':
                for (var i = 0; i < initYellowCoord.length; i++) {
                    if (initYellowCoord[i].id == $j(obj).attr('num')) {
                        top = initYellowCoord[i].top;
                        left = initYellowCoord[i].left;
                    }
                }
                break;
            case 'green':
                for (var i = 0; i < initGreenCoord.length; i++) {
                    if (initGreenCoord[i].id == $j(obj).attr('num')) {
                        top = initGreenCoord[i].top;
                        left = initGreenCoord[i].left;
                    }
                }
                break;
        }
        if (type == 'attack') { //被攻击打回
            $j(obj).animate({ 'top': top, 'left': left }).attr({ 'coordId': 0, 'step': 0, 'state': 'unready' });
        } else {  //胜利回归
            $j(obj).animate({ 'top': top, 'left': left }, function () {
                //变成胜利图案

            }).attr({ 'state': 'win' }).html('win');
        }
    },

    /*
     * 连投3次6，当前用户所有飞机打回
     */
    backCurrentUserAllPlane: function () {
        $j('.plane').each(function () {
            if (this.currentUser == $j(this).attr('type')) {
                this.planeBack('attack', this.currentUser, $j(this));
            }
        });
    },

    
}


//****************************************************** */
//****************************************************** */
//****************************************************** */
//****************************************************** */



window.App = App;


$j(function () {
    window.addEventListener("load", function () {
        if (window.ethereum) {
            // use MetaMask's provider
            App.web3 = new Web3(window.ethereum);
            window.ethereum.enable(); // get permission to access accounts
        } else {
            console.warn(
                "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
            );
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            App.web3 = new Web3(
                new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
            );
        }


        App.start();
        console.log(player_list_local);
    });

    //提示浏览器关闭事件
    window.onbeforeunload = function (event) {
        var n = event.screenX - window.screenLeft;
        var b = n > document.documentElement.scrollWidth - 20;
        if (b && event.clientY < 0 || event.altKey) {
            return "确定关闭吗";
            //event.returnValue = ""; //这里可以放置你想做的操作代码
        }
    };
    //控制F5刷新键
    // window.onkeydown = function (e) {
    //     if (e.which) {
    //         if (e.which == 116) {
    //             if (confirm('hanwen-确定刷新页面吗？刷新后页面数据将被清除！')) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         }
    //     } else if (event.keyCode) {
    //         if (event.keyCode == 116) {
    //             if (confirm('hanwen-确定刷新页面吗？刷新后页面数据将被清除！')) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         }
    //     }
    // };


    DICE = $j("#dice").slotMachine({
        active: 0,
        delay: 500
    });
    addDiceEvent();
    $j('#button').click(async function () {


    });

    $j('#begin').click(function () {
        console.log("begin");
        App.begin_blockchain();
        console.log(player_list_local);
        App.findFirstUser_blockChain();
        console.log(currentUser_blockchain);
        console.log(currentUser_blockchain);

        PlaneCoord.createPlane_blcokchain(player_list_local);
        console.log("添加飞机成功！");
        console.log(currentUser_blockchain);

        $j("#sdn" + colorList[currentUser_blockchain]).text('请投骰');

        $j('.option').hide();


    });
    planeOption.tabStyle('#redUser li');
    planeOption.tabStyle('#blueUser li');
    planeOption.tabStyle('#yellowUser li');
    planeOption.tabStyle('#greenUser li');
    planeOption.tabStyle('#qifei li');
});


