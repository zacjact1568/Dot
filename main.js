cc.game.onStart = function() {
    var sys = cc.sys;
    var view = cc.view;
    // 移除加载界面
    document.body.removeChild(document.getElementById('cocosLoading'));
    // 开启 Retina 显示
    view.enableRetina(sys.os === sys.OS_IOS || sys.os === sys.OS_OSX);
    //
    view.adjustViewPort(true);
    // 固定横屏
    view.setOrientation(cc.ORIENTATION_LANDSCAPE);
    // 设置设计的尺寸和屏幕适配策略
    view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);
    // 尺寸随浏览器窗口大小调节而变化
    view.resizeWithBrowserSize(true);
    // 启动预加载资源场景
    LoaderScene.run();
};
cc.game.run();
