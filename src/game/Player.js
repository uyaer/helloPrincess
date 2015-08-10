var PlayerState = {
    STAY: 1,
    MOVE: 2,
    ATTACK: 3
};

var Player = cc.Node.extend({
    /**
     * @type flax.MovieClip
     */
    body: null,
    /**
     * @type flax.MovieClip
     */
    weapon: null,
    /**
     * 状态
     */
    state: PlayerState.STAY,
    /**
     * 攻击力
     */
    attack: 1,
    /**
     * 最大攻击力
     */
    attackMax: 1,
    /**
     * 速度
     */
    speed: 1,
    /**
     * 攻击频率
     */
    attackDelay: 0,
    /**
     * 上一次攻击时间
     */
    _lastAttackTime: 0,
    ctor: function () {
        this._super();

        this.body = flax.createDisplay(res.body, "Body_1_mc", {parent: this});
        this.weapon = flax.createDisplay(res.weapon, "weapon_1_mc", {parent: this, x: 3});

        this.body.anchorX = 0.5;
        this.weapon.anchorX = 0.5;
        this.body.anchorY = 0;
        this.weapon.anchorY = 0;

        this.weapon.setFPS(120);
        this.weapon.onAnimationOver.add(this._onWeaponOver,this);

        this.initPlayerProperty();
    },
    /**
     * 根据装备信息初始化攻击和速度信息
     */
    initPlayerProperty: function () {
        this.attack = 1;
        this.attackMax = 1; //TODO init max attack
        this.speed = 1; //TODO init speed
        this.attackDelay = 300; //TODO attack speed
        this._lastAttackTime = 0;
    },

    _onWeaponOver:function(){
        if(this.state == PlayerState.ATTACK){
            this.changeState(PlayerState.STAY);
        }
    },

    /**
     * 改变状态
     * @param state {number|PlayerState}
     */
    changeState: function (state) {
        if (this.state == state) return;

        this.state = state;
        if (this.state == PlayerState.STAY) {
            this.body.stop();
            this.weapon.gotoAndStop(0);
        } else if (this.state == PlayerState.MOVE) {
            this.body.play();
        } else if (this.state == PlayerState.ATTACK) {
            this.weapon.play();
        }
    },

    checkCanAttack: function () {
        if (Date.now() - this._lastAttackTime >= this.attackDelay) {
            this._lastAttackTime = Date.now();
            this.attackTarget();
        }
    },

    attackTarget: function () {
        this.changeState(PlayerState.ATTACK);

        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_PLAYER_ATTACK, this.attack);
        if (this.attack < this.attackMax) {
            this.attack++;
        }
    }
});

