var hex2Dec = function (hex) {
    return parseInt(hex, 16);
};

// 将十六进制颜色字符串转换为 cc.Color 对象，十六进制颜色字符串必须以 # 开头，且包含 RGBA
var parseColor = function (colorHex) {
    return cc.color(
        hex2Dec(colorHex.slice(1, 3)),
        hex2Dec(colorHex.slice(3, 5)),
        hex2Dec(colorHex.slice(5, 7)),
        hex2Dec(colorHex.slice(7, 9))
    );
};

var random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getNumberLabel = function (num, dark) {
    // LabelAtlas 的 anchor 为 (0, 0)
    return cc.LabelAtlas.create(num.toString(), (arguments.length === 1 || dark) ? res.number_dark : res.number_light, 45, 60, '0');
};
