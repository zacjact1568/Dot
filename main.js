/**
 * Created by zack on 2017/6/1.
 */

cc.game.onStart = function() {
    var sys = cc.sys;
    var view = cc.view;
    //移除加载界面
    document.body.removeChild(document.getElementById("cocosLoading"));
    //开启Retina显示
    view.enableRetina(sys.os === sys.OS_IOS);
    //
    view.adjustViewPort(true);
    //固定横屏
    view.setOrientation(cc.ORIENTATION_LANDSCAPE);
    //设置设计的尺寸和屏幕适配策略
    view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
    //尺寸随浏览器窗口大小调节而变化
    view.resizeWithBrowserSize(true);
    //预加载资源
    LoaderScene.preload(resources, function() {
        //加载资源完成后执行
        cc.director.runScene(new GameScene());
    }, this);
};
cc.game.run();
