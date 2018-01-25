/**
 * Created by zack on 2017/6/2.
 */

var GameScene = cc.Scene.extend({

    onEnter:function() {
        this._super();
        var size = cc.director.getWinSize();
        var sprite = new cc.Sprite(res.hello_world);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        var label = new cc.LabelTTF("Dot", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);
    }
});