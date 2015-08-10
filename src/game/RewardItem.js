var RewardType = {
    Stone: 1,
    ring: 2,
    gem: 3
}

var RewardRES = ["stone", "ring", "gem"];
var RewardPrice = [1,2,3];

/**
 * hurt tower will has reward...
 */
var RewardItem = cc.Sprite.extend({
    /**
     * 类型
     * @type string
     */
    type: null,
    /**
     * 速度
     */
    speed: null,
    /**
     * 重力加速度
     */
    g: -250,
    /**
     * 是否是下落状态
     */
    isDowning: true,
    /**
     * 是否需要旋转
     */
    isRolling: false,
    ctor: function (type) {
        this._super();

        this.reuse(type);
    },
    reuse: function (type) {
        if (this.type != type) {
            this.setSpriteFrame(type);
        }
        this.x = Const.REWARD_INIT_X;
        this.y = Const.REWARD_INIT_Y;

        this.speed = cc.p(randomInt(-100, -1), randomInt(0, 50));
        this.isDowning = true;
        this.isRolling = false;
    },
    update: function (dt) {
        if (!this.isDowning)return;

        this.speed.y += this.g * dt;

        this.x = this.speed.x * dt;
        this.y = this.speed.y * dt;

        if (this.y <= Const.FLOOR_Y) {
            this.y = Const.FLOOR_Y;
            this.isRolling = true;

            cc.pMultIn(this.speed, 0.33);
            if (cc.pLengthSQ(this.speed) < 4) {
                this.isDowning = false;
                this.isRolling = false;
                this.runAction(cc.sequence(
                    cc.delayTime(5),
                    cc.fadeOut(2),
                    cc.callFunc(this.removeMySelf, this)
                ));
            }
        }

    },

    removeMySelf: function () {
        this.stopAllActions();
        this.removeFromParent(false);
        cc.pool.putInPool(this);
    },

    /**
     * 检查和玩家的碰撞
     * @param x 玩家的x
     * @param w 玩家的宽度
     * @return boolean 是否发生碰撞
     */
    checkCollisionWithPlayer: function (x, w) {
        return Math.abs(this.x - x) < (this.width + w) * 0.5;
    }
});