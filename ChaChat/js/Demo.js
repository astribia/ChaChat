/**
 * Created by alecz on 2016/5/17.
 */
LInit(1000 / 60, "legend", 800, 600, main);
var backLayer, cLayer, chooseLayer;
var talkField;
var socket;
var loadData = new Array(
    {name: "btn_up", path: "img/btn_up.jpg"},
    {name: "btn_down", path: "img/btn_down.jpg"},
    {name: "btn_over", path: "img/btn_over.jpg"},
    {name: "role1", path: "img/role1.png"},
    {name: "role2", path: "img/role2.png"},
    {name: "role3", path: "img/role3.png"},
    {name: "role4", path: "img/role4.png"},
    {name: "role5", path: "img/role5.png"},
    {name: "role6", path: "img/role6.png"},
    {name: "bg", path: "img/bg.jpg"}
);//存放图片数据
var imglist = {};
var btns = new Array();
var players = new Array();
function main() {
    addChild(new FPS());
    LGlobal.align = LStageAlign.BOTTOM_MIDDLE;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    LSystem.screen(LStage.FULL_SCREEN);
    //LGlobal.setDebug(true);
    backLayer = new LSprite();
    addChild(backLayer);
    loadDatas();
    // gameInit();

    //


}
function initLayer() {

    backLayer.graphics.drawRect(1, '#000000', [0, 0, 800, 600]);
    //init box2d
    LGlobal.box2d = new LBox2d();
    //add a contient
    cLayer = new LSprite();
    cLayer.x = LGlobal.width * .5;
    cLayer.y = 600;

    backLayer.addChildAt(cLayer, 2);
    cLayer.addBodyPolygon(800, 10, 0, 5, 0.5, 0.1);

    //add dynamic
    /* cLayer = new LSprite();
     cLayer.x = 300;
     cLayer.y = 100;
     backLayer.addChildAt(cLayer, 3);
     cLayer.addBodyPolygon(30, 40, 1, 1, 0.5, 0.2);
     cLayer.setBodyMouseJoint(true);*/
}
function beginContact(contact) {
    /* if (contact.GetFixtureA().GetBody().GetUserData().name == "bird" &&
     contact.GetFixtureB().GetBody().GetUserData().name == "bird") {
     //trace("bird and bird");
     }*/
    // trace("A : " + contact.GetFixtureA().GetBody().GetUserData());
    // trace("B : " + contact.GetFixtureB().GetBody().GetUserData());
};
function onKeyDown(event) {
    var dir;
    if (event.keyCode == 37) {//left
        dir = LEFT;
    }
    if (event.keyCode == 38) {//up
        dir = UP;
    }
    if (event.keyCode == 39) {//right
        dir = RIGHT;
    }
    if (event.keyCode == 40) {//down
        dir = DOWN;
    }
    // alert(event.keyCode);
    if (event.keyCode == 13) {//enter
        // alert();
        addtalkLayer();
    }
    if (dir >= 0 && dir < 4) {
        socket.emit('message', {
            type: 'move',
            action: {
                'id': player.id,
                'direct': dir
            }

        });
    }
}
function addtalkLayer() {
    // alert();
    talkField.focus();
    if (talkField.text != '') {
        // player.talk(talkField.text);
        // clearTimeout(timeoutFunction);
        // timeoutFunction = setTimeout("player.talk('')", 8000);
        socket.emit('message', {
            type: 'talk',
            action: {
                'id': player.id,
                'talk': talkField.text
            }

        });
    }
    talkField.text = '';
    talkField.updateInput();
}
function timeFrame() {
    players.forEach(function (player) {
        player.playBody.SetAngle(0);
        //console.log(player.playBody.GetPosition());
        if (player.playBody.GetPosition().x < -1) {
            player.playBody.SetPosition(new LGlobal.box2d.b2Vec2(50, 0));
        }
        else if (player.playBody.GetPosition().x > 30) {
            player.playBody.SetPosition(new LGlobal.box2d.b2Vec2(10, 0));
        }
        else if (player.playBody.GetPosition().y < -1) {
            player.playBody.SetPosition(new LGlobal.box2d.b2Vec2(10, 0))
            var force = 0;
            var vec = new LGlobal.box2d.b2Vec2(0, -force);
            player.playBody.ApplyForce(vec, player.playBody.GetWorldCenter());
        }
        else if (player.playBody.GetPosition().y > 30) {
            player.playBody.SetPosition(new LGlobal.box2d.b2Vec2(10, 0));
        }
    });

    // self.playBody.SetAngle(0);
    //self.playBody.rotateCenter=false;
    //player.playBody.SetAwake(true);

    socket.emit('message', {
        type: "status",
        data: player.generateJson()
    });
}
function btnClick(event) {
    crole = btns.indexOf(event.target.parent) + 1;
    // console.log(event.target.parent);
    //  alert(btns.indexOf(event.target.parent));
   // alert(nameField.text);
    removeChild(chooseLayer);
    initLayer();
    initScene();
    //addEvent();
}
function initSocket() {
//This is all that needs
    socket = io('http://127.0.0.1:3000');
    socket.on('greeting-from-server', function (message) {
        //alert(message.greeting);
        message.data.forEach(function (p) {
            //alert(p.id);
            var initPlayer = new Player('', '');
            initPlayer.decodeJson(p);
            players.push(initPlayer);
            backLayer.addChild(initPlayer);
            console.log(players);
        });
        socket.emit('greeting-from-client', {
            greeting: 'Hello Server'
        });
    });
    player = new Player(crole, nameField.text);
    socket.emit('message', {
        type: "add",
        data: player.generateJson()
    });
    socket.on('message', function (msg) {
        //console.log(msg);
        if (msg.type == "add") {
            if (msg.data.id == player.id) {
                players.push(player);
                player.playBody.SetPosition(new LGlobal.box2d.b2Vec2(msg.data.x, msg.data.y));
                backLayer.addChild(player);
            } else {
                var p = new Player(msg.data.role, msg.data.name);
                p.id = msg.data.id;
                p.playBody.SetPosition(new LGlobal.box2d.b2Vec2(msg.data.x, msg.data.y));
                players.push(p);
                backLayer.addChild(p);
            }
            console.log(players.length);
        } else if (msg.type == "move") {
            //  console.log(msg.action.id);
            players.forEach(function (e) {
                if (e.id == msg.action.id) {
                    //  console.log(e);
                    e.setDirect(msg.action.direct);
                    return;
                }
            });
        } else if (msg.type == "status") {
            players.forEach(function (p1) {
                msg.data.forEach(function (p2) {
                    if (p1.id == p2.id) {
                        //console.log(e);
                        if (Math.abs((p1.playBody.GetPosition().x - p2.x)) > 1 || Math.abs((p1.playBody.GetPosition().y - p2.y)) > 2) {
                            p1.playBody.SetPosition(new LGlobal.box2d.b2Vec2(p2.x, p2.y));
                        }
                        return;
                    }
                });

            });
        } else if (msg.type == "remove") {
            players.forEach(function (p1) {
                if (p1.id == msg.data) {
                    players.remove(p1);
                    backLayer.removeChild(p1);
                }
            });
        } else if (msg.type == "talk") {
            players.forEach(function (p1) {
                if (p1.id == msg.action.id) {
                    p1.talk(msg.action.talk);
                    talkTimeout = setTimeout('clearTalk(' + p1.id + ')', 8000);
                }
            });
        }
    });
}
function clearTalk(id) {
    //alert(id);
    players.forEach(function (p1) {
        if (p1.id == id) {
            p1.talk('');
        }
    });
    window.clearTimeout(talkTimeout);
}
function initScene() {

    //
    LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_DOWN, onKeyDown);
    backLayer.addEventListener(LEvent.ENTER_FRAME, timeFrame);
    LGlobal.box2d.setEvent(LEvent.BEGIN_CONTACT, beginContact);

    talkLayer = new LSprite();
    talkField = new LTextField();
    talkField.setType(LTextFieldType.INPUT);
    talkField.x = 5;
    talkField.y = LGlobal.height - 20;
    talkLayer.addChild(talkField);
    backLayer.addChild(talkLayer);
    initSocket();

}
function loadDatas() {
    //实例化进度条
    loadingLayer = new LoadingSample2();
    addChild(loadingLayer);
    LLoadManage.load(loadData, function (progress) {
        loadingLayer.setProgress(progress);
    }, function (result) {
        imglist = result;
        // console.log(imglist);
        removeChild(loadingLayer);
        loadingLayer = null;
        gameInit();
    });
}
function gameInit() {
    chooseLayer = new LSprite();
    // btnLayer = new LSprite();
    chooseLayer.graphics.drawRect(1, "#ccc", [0, 0, LGlobal.width, LGlobal.height], true, "#333");
    var gameTitle = new LTextField();
    gameTitle.text = " ";
    gameTitle.color = "#fff";
    gameTitle.size = 50;
    gameTitle.weight = "bold";
    gameTitle.x = LGlobal.width / 2 - gameTitle.width + 50;
    gameTitle.y = 80;

    chooseLayer.addChild(gameTitle);
    var choiceText = new LTextField();
    choiceText.text = "请选择人物模板";
    choiceText.color = "#fff";
    choiceText.size = 30;
    choiceText.x = LGlobal.width / 5;
    choiceText.y = 130;
    chooseLayer.addChild(choiceText);

    var nameText = new LTextField();
    nameText.text = "姓名 ： ";
    nameText.color = "#fff";
    nameText.size = 30;
    nameText.x = LGlobal.width / 5;
    nameText.y = 170;
    chooseLayer.addChild(nameText);

    nameField = new LTextField();
    nameField.setType(LTextFieldType.INPUT);
    nameField.color = "#fff";
    nameField.x = LGlobal.width / 3;
    nameField.y = 180;
    chooseLayer.addChild(nameField);

    var roles = {};
    for (var i = 1; i < 6; i++) {
        var r = new LBitmap(new LBitmapData(imglist["role" + i], 0, 0, 32, 32));
        r.x = LGlobal.width / 8 + i * 100;
        r.y = 300;
        chooseLayer.addChild(r);
        var btn = new LButton(new LBitmap(new LBitmapData(imglist["btn_up"])),
            new LBitmap(new LBitmapData(imglist["btn_over"])),
            new LBitmap(new LBitmapData(imglist["btn_down"])));
        btn.x = r.x - 15;
        btn.y = r.y + 50;
        btn.addEventListener(LMouseEvent.MOUSE_UP, btnClick);
        btns.push(btn);
        chooseLayer.addChild(btn);
    }
    addChild(chooseLayer);

    //sceneInit();
    // addEvent();

}
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
