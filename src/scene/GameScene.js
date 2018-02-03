var GameScene = cc.Scene.extend({

    onEnter:function() {
        this._super();
        this.addChild(GameLayer.create());
    }
});

GameScene.run = function () {
    cc.director.runScene(new GameScene());
};
