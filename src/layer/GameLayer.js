var GameLayer = cc.Layer.extend({

    // Dot 数量
    _dotCount: 10,
    // 最小等待时间（s）
    _minWaitTime: 1,
    // 最大等待时间（s）
    _maxWaitTime: 2,
    // 最小持续时间（s）
    _minDurationTime: 1,
    // 最大持续时间（s）
    _maxDurationTime: 2,
    // 最大生成间隔时间（s）
    _maxIntervalTime: 2,
    // 最大初始不透明度（0-255）
    _maxInitialOpacity: 200,
    // 围绕圈的最小初始尺度倍数（1 位小数）
    _minInitialRoundScale: 1.5,
    // 围绕圈的最大初始尺度倍数（1 位小数）
    _maxInitialRoundScale: 2,
    // Dot 坐标限制
    _dotRestrict: 50,
    // 触摸半径
    _touchRadius: 50,
    // 分数 label 到边缘的距离
    _scoreMargin: 60,


    init: function () {
        this._super();

        this._winSize = cc.director.getWinSize();

        // 背景层
        var backgroundLayer = cc.LayerColor.create(parseColor(color.light));
        this.addChild(backgroundLayer, 0);

        // 分数 label
        var score = this._scoreLabel = getNumberLabel(0);
        score.attr({
            x: this._scoreMargin,
            y: this._winSize.height - this._scoreMargin,
            anchorY: 1,
            // 隐藏
            visible: false
        });
        this.addChild(score, 1);

        return true;
    },

    onEnter: function () {
        this._super();
        // 显示开始界面
        this._showStart();
        // 产生 dots
        this._generateDots();
    },

    // 每一帧调用（≈16ms），dt 为间隔的时间（s）
    update: function (dt) {
        // 在每一帧，只要 dot 未绘制完，且超过将要显示的 dot 的出现时间，就绘制此 dot，然后将 dot 序号后移
        while (this._dotIndex < this._dotCount && this._elapsedTime >= this._dot.appearingTime) {
            // 绘制 dot
            this._showDot();
            // 将 dot 序号后移 1 位，通过新序号取新 dot
            this._dot = this._dots[++this._dotIndex];
        }

        // 记录流逝的时间
        this._elapsedTime += dt;

        if (this._elapsedTime > this._totalTime + 1) {
            // 当前时间已大于总时间 + 1，结束游戏（相当于延迟 1 秒结束游戏）
            this._endGame();
        }
    },

    _showStart: function () {
        this.addChild(StartLayer.create(this._startGame, this));
    },

    _startGame: function () {
        // 初始化已流逝的时间
        this._elapsedTime = 0;
        // 初始化 dot 序号
        this._dotIndex = 0;
        // 初始化当前 dot
        this._dot = this._dots[this._dotIndex];
        // 可触摸的 dot 数组
        this._touchableDots = [];
        // 初始化得分
        this._score = 0;
        // 显示分数 label
        this._scoreLabel.attr({
            string: this._score,
            visible: true
        });
        // 启用触摸监听
        this._enableTouch();
        // 启动调度器
        this.scheduleUpdate();
    },

    _endGame: function () {
        // 停止调度器
        this.unscheduleUpdate();
        // 禁用触摸监听
        this._disableTouch();
        // 隐藏分数 label
        this._scoreLabel.visible = false;
        // 显示结果界面
        this._showResult();
    },

    _enableTouch: function () {
        var self = this;
        this._touchesListener = cc.EventListener.create({
            // 支持多点触控
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                self._touchesBegan(touches, event);
            }
        });
        cc.eventManager.addListener(this._touchesListener, this);
    },

    _disableTouch: function () {
        cc.eventManager.removeListener(this._touchesListener);
    },

    _touchesBegan: function (touches, event) {
        for (var i = 0; i < touches.length; i++) {
            for (var j = 0; j < this._touchableDots.length; j++) {
                var dot = this._touchableDots[j];
                if (cc.pDistance(touches[i].getLocation(), dot.getPosition()) <= this._touchRadius) {
                    // 正确触摸
                    // 从可触摸 dot 数组中删除此 dot
                    this._touchableDots.splice(j, 1);
                    // 此时 dot 还有动作，将它们停止，dotRound 此时已经没有动作了
                    dot.stopAllActions();
                    // 移除 dot 和 dotRound
                    this._removeDot(dot);
                    // 得分 +1
                    this._score++;
                    // 更新分数显示
                    this._onDotTouched();

                    break;
                }
            }
        }
    },

    _showResult: function () {
        this.addChild(ResultLayer.create(this._score, this._startGame, this));
    },

    // 产生 dot 序列
    _generateDots: function () {
        this._dots = [];
        var time = 0;
        for (var i = 0; i < this._dotCount; i++) {
            this._dots.push({
                // 横坐标
                positionX: random(this._dotRestrict, this._winSize.width - this._dotRestrict),
                // 纵坐标
                positionY: random(this._dotRestrict, this._winSize.height - this._dotRestrict),
                // 出现时间
                appearingTime: random(time * 10, (time + this._maxIntervalTime) * 10) / 10,
                // 可触摸状态前的等待时间
                waitTime: random(this._minWaitTime * 10, this._maxWaitTime * 10) / 10,
                // 可触摸状态的持续时间
                durationTime: random(this._minDurationTime * 10, this._maxDurationTime * 10) / 10,
                // 初始不透明度
                initialOpacity: random(0, this._maxInitialOpacity),
                // 围绕圈的初始尺度倍数
                initialRoundScale: random(this._minInitialRoundScale * 10, this._maxInitialRoundScale * 10) / 10
            });
            time = this._dots[i].appearingTime;
        }
        // 计算总时间
        var lastDot = this._dots[this._dotCount - 1];
        this._totalTime = time + lastDot.waitTime + lastDot.durationTime;
    },

    _showDot: function () {
        var dotRound = cc.Sprite.create(res.dot_round);
        dotRound.attr({
            x: this._dot.positionX,
            y: this._dot.positionY,
            scale: this._dot.initialRoundScale,
            opacity: this._dot.initialOpacity
        });
        this.addChild(dotRound, this._dots.length - this._dotIndex);

        dotRound.runAction(cc.spawn(
            cc.fadeIn(this._dot.waitTime),
            cc.scaleTo(this._dot.waitTime, 1)
        ));

        var dot = cc.Sprite.create(res.dot);
        dot.attr({
            x: this._dot.positionX,
            y: this._dot.positionY,
            opacity: this._dot.initialOpacity,
            // 将 dotRound 存放在 dot 中，方便后续取用
            userObject: dotRound
        });
        this.addChild(dot, this._dots.length - this._dotIndex);

        dot.runAction(cc.sequence(
            cc.fadeIn(this._dot.waitTime),
            cc.callFunc(this._onDotTouchable, this),
            cc.delayTime(this._dot.durationTime),
            cc.callFunc(this._onTimeout, this)
        ));
    },

    _onDotTouchable: function (dot) {
        // 将 dot 加入可触摸的 dot 数组
        this._touchableDots.push(dot);
    },

    _onDotTouched: function () {
        this._scoreLabel.string = this._score;
    },

    _onTimeout: function (dot) {
        // 从可触摸的 dot 数组中删除此 dot
        for (var i = 0; i < this._touchableDots.length; i++) {
            if (this._touchableDots[i] === dot) {
                this._touchableDots.splice(i, 1);
            }
        }
        // 移除此 dot
        this._removeDot(dot);
    },

    _removeDot: function (dot) {
        dot.removeFromParent(true);
        // 取出 dotRound
        dot.userObject.removeFromParent(true);
    }
});

GameLayer.create = function () {
    var gameLayer = new GameLayer();
    gameLayer.init();
    return gameLayer;
};
