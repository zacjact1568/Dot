/**
 * 预加载资源的场景，加载完成后转到 GameScene
 */
var LoaderScene = cc.Scene.extend({

    // new 时自动调用
    ctor: function () {
        this._super();
    },

    // 需手动调用
    init: function () {
        // 背景层
        var backgroundLayer = cc.LayerColor.create(cc.color(240, 240, 240));
        this.addChild(backgroundLayer, 0);

        // 异步加载 icon 图片资源
        var center = cc.visibleRect.center;
        cc.loader.loadImg(res.icon, {isCrossOrigin : false}, function(err, img) {
            if (err) {
                cc.log('Failed to load image');
                return;
            }
            var logoTexture2d = new cc.Texture2D();
            logoTexture2d.initWithElement(img);
            logoTexture2d.handleLoadedTexture();
            var logo = cc.Sprite.create(logoTexture2d);
            logo.attr({
                x: center.x,
                y: center.y,
                scale: cc.contentScaleFactor()
            });
            backgroundLayer.addChild(logo, 1);
        });

        //进度
        var progress = this._progress = cc.LabelTTF.create('0%', 'Arial', 20);
        progress.attr({
            x: center.x,
            y: center.y,
            color: cc.color(255, 255, 255)
        });
        backgroundLayer.addChild(progress, 2);

        return true;
    },

    // 添加到场景时调用
    onEnter: function () {
        this._super();
        var self = this;
        // 延时 0.3 秒执行加载
        this.scheduleOnce(function () {
            cc.loader.load(resources,
                function (result, count, loadedCount) {
                    var percent = (loadedCount / count * 100) | 0;
                    percent = Math.min(percent, 100);
                    self._progress.setString(percent + '%');
                }, function () {
                    GameScene.run();
                });
        }, 0.3);
    },

    // 从场景移除时调用
    onExit: function () {
        this._super();
    }
});

LoaderScene.run = function () {
    var loaderScene = new LoaderScene();
    loaderScene.init();
    cc.director.runScene(loaderScene);
};
