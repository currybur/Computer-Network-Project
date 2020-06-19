var PlaneOption = function () {
    this.backgroundMusic = true;    //背景音乐开关
    this.gameMusic = true;  //游戏音效开关

    this.tabStyle = function (obj) {
        $j(obj).each(function () {
            $j(this).click(function () {
                $j(this).addClass('bth');
                $j(this).siblings().removeClass('bth');
            });
        });
    };

};
var planeOption = new PlaneOption();