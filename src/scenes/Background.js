var BackgroundLayer = cc.Layer.extend({
    /**
     * @type cc.Sprite
     */
    sky: null,
    /**
     * @type cc.Sprite
     */
    back: null,
    /**
     * @type cc.Sprite
     */
    floor: null,
    /**
     * @type cc.Sprite
     */
    sun: null,

    oneDayTime: 30000,

    isNigth: false,

    ctor: function () {
        this._super();

        var anim = flax.assetsManager.createDisplay(res.background, "gamebg", {parent: this});
        this.sky = anim["sky"];
        this.back = anim["back"];
        this.floor = anim["floor"];
        this.sun = anim["sun"];

        this.sky.scaleX = Const.WIN_W / this.sky.width;
        this.sky.scaleY = Const.WIN_H / this.sky.height;
        this.sky.setBlendFunc(cc.SRC_COLOR,cc.ONE_MINUS_DST_COLOR);
        this.back.setBlendFunc(cc.SRC_COLOR,cc.ONE_MINUS_DST_COLOR);

        var windcar = this.back["windcar"];
        windcar.play();




        //init date
        this.oneDayTime = Date.now();
        this.scheduleUpdate();
    },

    update: function (dt) {
        this.back.x = this.floor.x / 3;
        this.sky.color.r = limit(this.sky.color.r,0,255);
        this.sky.color.g = limit(this.sky.color.g,0,255);
        this.sky.color.b = limit(this.sky.color.b,0,255);
        this.back.color.r = limit(this.sky.color.r,0,255);
        this.back.color.g = limit(this.sky.color.g,0,255);
        this.back.color.b = limit(this.sky.color.b,0,255);
        if (Date.now() - this.oneDayTime >= 30000) {
            this.oneDayTime = Date.now();
            if (this.isNigth) {
                GameManager.instance.setDay(GameManager.instance.day + 1);
                this.isNigth = false;
                this.sky.runAction(cc.tintBy(1.5,155,155,155));
                this.back.runAction(cc.tintBy(1.5,155,155,155));
            }else {
                this.isNigth = true;
                this.sky.runAction(cc.tintBy(1.5,-155,-155,-155));
                this.back.runAction(cc.tintBy(1.5,-155,-155,-155));
            }
            this.sun.runAction(cc.sequence(
                cc.moveBy(1, 0, -500),
                cc.callFunc(this.changeSun,this)
            ));
        }
    },

    changeSun: function () {
        if (this.isNigth) {
            this.sun.gotoAndStop(1);
        }else {
            this.sun.gotoAndStop(0);
        }
        this.sun.runAction(cc.moveBy(1, 0, 500));
    }
});