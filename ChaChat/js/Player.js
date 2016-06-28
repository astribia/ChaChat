/**
 * Created by alecz on 2016/5/20.
 */
var UP = 3;
var DOWN = 0;
var LEFT = 1;
var RIGHT = 2;
var STEP = 0.5;
var COL = 3;
var ROW = 4;

function Player(role, username) {
    base(this, LSprite, []);
    var self = this;
    self.username = username==''?"游客" + Math.round((Math.random() * 100000000)):username;//"游客" + Math.round((Math.random() * 100000000));// document.getElementById("userName")
    self.id = Math.round((Math.random() * 10000000000));
    self.roleHeight = 32;
    self.roleWidth = 32;
    self.orient = DOWN;
    self.direct = DOWN;
    self.role = role;
    self.roleData = new LBitmapData(imglist["role" + self.role], 96, 0, 69, 128);
    self.roleImg = new LBitmap(self.roleData);
    self.list = LGlobal.divideCoordinate(96, 128, ROW, COL);
    self.talkText = "";
    self.x = 32 + Math.round(Math.random() * LGlobal.width * .8);
    self.y = LGlobal.height - 150;
    self.addChild(self.roleImg);
    self.setName(self.username);
    self.talk(self.talkText);
    self.addBodyPolygon(self.roleWidth - 2, self.roleHeight, 1, 1, 0.4, 0.2);
    self.playBody = self.box2dBody;
    self.anime = new LAnimation(self, self.roleData, self.list);

};
Player.prototype.setRole = function (role) {
    var self = this;
    self.role = role;
    self.roleData = new LBitmapData(imglist["role" + self.role], 96, 0, 69, 128);
    self.roleImg = new LBitmap(self.roleData);
    self.anime = new LAnimation(self, self.roleData, self.list);
};

Player.prototype.setName = function (username) {
    var self = this;
    self.username = username;
    if (self.nameField != null)
        self.removeChild(self.nameField);
    self.nameField = new LTextField();
    self.nameField.weight = "bolder";
    self.nameField.text = self.username;
    self.nameField.x = -self.username.length * 2;
    self.nameField.y = -20;
    self.addChild(self.nameField);
};
Player.prototype.talk = function (talkText) {
    var self = this;
    self.talkText = talkText;
    if (self.talkField != null)
        self.removeChild(self.talkField);
    self.talkField = new LTextField();
    self.talkText = self.talkText.length > 35 ? self.talkText.substr(0, 35) : self.talkText;
    self.talkField.text = self.talkText;
    self.talkField.x = -self.talkText.length * 6;
    self.talkField.y = -45;
    self.addChild(self.talkField);
    //setTimeout("self.talk('')", 5000);
};
/**
 * 循环事件
 Player.prototype.onframe = function () {
    var self = this;
};
 */

/**
 * move **/
Player.prototype.onMove = function () {
    //alert("move");
    var self = this;
    //alert(self.RIGHT);
    switch (self.direct) {
        case UP:
            // self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(ctrlBox.box2dBody.GetPosition().x-1,ctrlBox.box2dBody.GetPosition().y-STEP));
            var force = 250;
            var vec = new LGlobal.box2d.b2Vec2(0, -force);
            self.playBody.ApplyForce(vec, self.playBody.GetWorldCenter());
            break;
        case LEFT:
            console.log(LEFT);
            //self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(self.playBody.GetPosition().x - STEP, self.playBody.GetPosition().y));
            var force = 16;
            var vec = new LGlobal.box2d.b2Vec2(-force, 0);
            self.playBody.ApplyForce(vec, self.playBody.GetWorldCenter());
            break;
        case RIGHT:
           // self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(self.playBody.GetPosition().x + STEP, self.playBody.GetPosition().y));
            var force = 16;
            var vec = new LGlobal.box2d.b2Vec2(force, 0);
            self.playBody.ApplyForce(vec, self.playBody.GetWorldCenter());
            break;
        case DOWN:
            // self.y += STEP;
            break;
    }
  /*  if (self.playBody.GetPosition().x < -28) {
        self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(50, 0));
    }
    else if (self.playBody.GetPosition().x > LGlobal.width + 4) {
        self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(-30, self.playBody.GetPosition().y));
    }
    else if (self.y < -28) {
        self.y = LGlobal.height - 4;
    }
    else if (self.playBody.GetPosition().y > LGlobal.height) {
        self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(-30, self.playBody.GetPosition().y));
    }*/
    // self.playBody.SetAngle(0);
    //self.playBody.rotateCenter=false;
    //self.playBody.SetAwake(true);
    //console.log(self.x + "," + self.y);
    self.anime.setAction(self.direct);
    self.anime.onframe();
    //  alert(charaLayer.x);
};
Player.prototype.setOrein = function (orient) {

    var self = this;
    self.orient = orient;
    // alert(dir);

    //设定人物方向
    // self.anime.setAction(orient);
    // self.direction = orient;
    //�?始移�?    // self.onmove();

};
Player.prototype.setDirect = function (dir) {

    var self = this;
    self.direct = dir;
    //设定人物方向
    // self.anime.setAction(orient);
    // self.direction = orient;
    //start move
    self.onMove();

};
Player.prototype.generateJson = function () {
    var self = this;
    var json = {
        "id": self.id,
        "name": self.username,
        "role": self.role,
        "x": self.playBody.GetPosition().x,
        "y": self.playBody.GetPosition().y,
        "direct": self.direct,
        "talk": self.talkText
    };
    return json;
};
Player.prototype.decodeJson = function (json) {
    var self = this;
    var obj = json;
    //self.x = obj.x;
    //self.y = obj.y;
    self.id = obj.id;
    self.playBody.SetPosition(new LGlobal.box2d.b2Vec2(obj.x, obj.y));
    self.setRole(obj.role);
    self.setName(obj.name);
    self.talk(obj.talk);
    self.setDirect(obj.direct);
};