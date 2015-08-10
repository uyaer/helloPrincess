var Stone = cc.Sprite.extend({
    speedX: 0,
    speedY: 0,
    g: -1600,
    /**
     * @type flax.FlaxSprite
     */
    anim: null,
    ctor: function () {
        this._super();

        var type = randomInt(0, 10000) % 3 + 1;
        var anim = flax.createDisplay(res.background, "stone_mc_" + type, {parent: this}, true);
        this.anim = anim;

        this.speedY = randomInt(-10, 900);
        this.speedX = randomInt(-500, 0);
        this.rotation = randomInt(0, 180);

        this.scheduleUpdate();
    },

    update: function (dt) {
        this.speedY += this.g * dt;

        this.x += this.speedX * dt;
        this.y += this.speedY * dt;

        if (this.y <= Const.FLOOR_Y) {
            var pool = flax.ObjectPool.get(this.anim.assetsFile, this.anim.clsName, this.anim.__pool__id__);
            pool.recycle(this.anim);
            this.anim.removeFromParent();
            this.removeFromParent();
        }
    }


});