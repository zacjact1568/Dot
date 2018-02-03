var StartLayer = cc.Layer.extend({

    init: function () {
        this._super();

        var center = cc.visibleRect.center;

        // 背景（包括标题与说明）
        var background = cc.Sprite.create(res.start_bg);
        background.attr({
            x: center.x,
            y: center.y
        });
        this.addChild(background);

        // 开始按钮
        var self = this;
        // 后两个参数，callback 指定回调函数，target 指定谁来调用这个回调函数，若不指定，调用者为框架内部的某个对象
        var startButton = cc.MenuItemImage.create(res.start_btn, res.start_btn_selected, function () {
            // 不能使用 this，因为 this 指调用它的对象，而不是 StartLayer
            self.removeFromParent(true);
            self._callback.call(self._target);
        }, this._target);
        startButton.attr({
            x: center.x,
            y: center.y - 80
        });
        var menu = cc.Menu.create(startButton);
        // 位置设为原点，即让 menu 中的 item 决定自己的位置
        menu.attr({
            x: 0,
            y: 0
        });
        this.addChild(menu);

        return true;
    },

    initWithCallback: function (callback, target) {
        this._callback = callback;
        this._target = target;
        this.init();
    }
});

StartLayer.create = function (callback, target) {
    var startLayer = new StartLayer();
    startLayer.initWithCallback(callback, target);
    return startLayer;
};
