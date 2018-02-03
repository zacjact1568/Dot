var ResultLayer = cc.Layer.extend({

    init: function () {
        this._super();

        var center = cc.visibleRect.center;

        var background = cc.Sprite.create(res.result_bg);
        background.attr({
            x: center.x,
            y: center.y
        });
        this.addChild(background);

        var score = getNumberLabel(this._score, false);
        score.attr({
            x: center.x,
            y: center.y + 40,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(score);

        // 重新开始按钮
        var self = this;
        var restartButton = cc.MenuItemImage.create(res.restart_btn, res.restart_btn_selected, function () {
            self.removeFromParent(true);
            self._callback.call(self._target);
        }, this._target);
        restartButton.attr({
            x: center.x,
            y: center.y - 80
        });
        var menu = cc.Menu.create(restartButton);
        menu.attr({
            x: 0,
            y: 0
        });
        this.addChild(menu);

        return true;
    },

    initWithScore: function (score, callback, target) {
        this._score = score;
        this._callback = callback;
        this._target = target;
        this.init();
    }
});

ResultLayer.create = function (score, callback, target) {
    var resultLayer = new ResultLayer();
    resultLayer.initWithScore(score, callback, target);
    return resultLayer;
};
