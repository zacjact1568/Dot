/**
 * Created by zack on 2017/6/1.
 */

var LoaderScene = cc.Scene.extend({

    _elevation : {
        first : 0,
        second : 10
    },

    init : function() {

        var self = this;

        //背景层
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        self.addChild(bgLayer, self._elevation.first);

        //加载logo（临时）
        var progressOffset = 0;
        cc.loader.loadImg(cc._loaderImage, {isCrossOrigin : false}, function(err, img) {
            if (err) {
                cc.log("Failed to load image");
                return;
            }
            progressOffset = -img.height / 2 - 10;
            self._initImage(img, cc.visibleRect.center, self._elevation.second);
        });

        //进度
        var progress = self._progress = new cc.LabelTTF("Loading... 0%", "Arial", 14);
        progress.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, progressOffset)));
        progress.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(progress, self._elevation.second);

        return true;
    },

    onEnter : function() {
        this._super();
        var self = this;
        self.schedule(self._startLoading, 0.3);
    },

    onExit : function() {
        this._super();
        var self = this;
        self._progress.setString("Loading... 0%");
    },

    initWithResources:function(resources, callback, target) {
        var self = this;
        self.init();
        if (cc.isString(resources)) {
            resources = [resources];
        }
        self._resources = resources || [];
        self._callback = callback;
        self._target = target;
    },

    _initImage : function(img, pos, zOrder) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var image = self._logo = new cc.Sprite(texture2d);
        image.setScale(cc.contentScaleFactor());
        image.setPosition(pos);
        self._bgLayer.addChild(image, zOrder);
    },

    _startLoading : function() {
        var self = this;
        self.unschedule(self._startLoading);
        cc.loader.load(self._resources,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._progress.setString("Loading... " + percent + "%");
            }, function () {
                self._callback.call(self._target);
            });
    }
});

LoaderScene.preload = function(resources, callback, target) {
    var loaderScene = new LoaderScene();
    loaderScene.initWithResources(resources, callback, target);
    cc.director.runScene(loaderScene);
};
