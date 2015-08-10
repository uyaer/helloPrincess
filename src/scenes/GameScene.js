var GameScene = cc.Scene.extend({
    /**
     * @type cc.Sprite
     */
    floor: null,
    /**
     * @type Player
     */
    player: null,
    playerMoveDir: -1,
    playerOldX: 0,
    /**
     * @type Tower
     */
    tower: null,
    /**
     * 处于视窗的百分比
     */
    playerOffWinPercent: 0.5,
    /**
     * 角色最大可以到右边到距离,超过距离会使用攻击技能
     */
    playerMaxPosX: 0,
    /**
     * 攻击状态是否一直按住的
     */
    isAttackTouch: false,
    ctor: function () {
        this._super();

        Const.WIN_W = cc.winSize.width;
        Const.WIN_H = cc.winSize.height;

        this.playerMaxPosX = Const.PLAYER_MAX_X;

        var bg = new BackgroundLayer();
        this.addChild(bg);
        this.floor = bg.floor;

        this.initPlayer();
        this.initTower();

        var that = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                /**
                 * @type cc.Touch
                 */
                touch = touch;
                var movex = limit(touch.getLocationX() - that.floor.x, 10, Const.FLOOR_W - 10);
                if (movex - that.player.x > 0) {
                    that.player.scaleX = Math.abs(that.player.scaleX);
                } else {
                    that.player.scaleX = -Math.abs(that.player.scaleX);
                }
                //maybe it is attack
                if (movex >= that.playerMaxPosX && that.player.x >= that.playerMaxPosX - 3) {
                    that.player.checkCanAttack();
                    that.isAttackTouch = true;
                } else { //move
                    movex = limit(movex, 10, that.playerMaxPosX);
                    var time = Math.abs(that.player.x - movex) / GameManager.instance.moveSpeed;
                    that.player.stopAllActions();
                    that.player.runAction(
                        cc.sequence(
                            cc.moveTo(time, movex, that.player.y),
                            cc.callFunc(function () {
                                if (that.player.state != PlayerState.STAY
                                    && that.player.state != PlayerState.ATTACK) {
                                    that.player.changeState(PlayerState.STAY);
                                }
                            }, this)
                        ));
                    that.player.changeState(PlayerState.MOVE);
                }
                return true;
            },
            onTouchEnded: function () {
                that.isAttackTouch = false;
            }
        }, this.floor);

        this.scheduleUpdate();
    },

    update: function (dt) {
        if (this.isAttackTouch) {
            this.player.checkCanAttack();
        }

        this.playerMoveDir = this.player.x - this.playerOldX;
        this.playerOldX = this.player.x;

        if (this.playerOldX < 0 && this.playerOffWinPercent > 0.45) { //dir left
            this.playerOffWinPercent -= 0.01;
        }
        if (this.playerOldX > 1 && this.playerOffWinPercent < 0.55) { //dir right
            this.playerOffWinPercent += 0.01;
        }
        var offset = Const.WIN_W * this.playerOffWinPercent;
        var offsetx = offset - this.player.x;
        offsetx = limit(offsetx, Const.WIN_W - Const.FLOOR_W, 0);
        this.floor.x = offsetx;


    },

    onEnter: function () {
        this._super();
        cc.eventManager.addCustomListener(GameEvent.EVENT_PLAYER_ATTACK, this.onPlayerAttack.bind(this));
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeCustomListeners(GameEvent.EVENT_PLAYER_ATTACK);
    },

    onPlayerAttack: function (e) {
        //TODO tower hurt
        this.tower.hurt(this.player)
        // TODO stone play 例子效果？？？
        this.playStoneAnim();
        //TODO reward down
    },

    playStoneAnim: function () {
        for (var i = 0; i < 4; i++) {
            var stone = new Stone();
            stone.x = this.player.x + 70;
            stone.y = Const.FLOOR_Y + 70;
            this.floor.addChild(stone);
        }
    },

    /**
     * 创建player
     */
    initPlayer: function () {
        if (this.player) {
            this.player.removeFromParent();
            this.player = new Player();
            this.player.x = this.playerOldX;
        } else {
            this.player = new Player();
            this.player.x = Const.PLAYER_INIT_X;
        }
        this.player.y = Const.FLOOR_Y;
        this.floor.addChild(this.player, 1);
        this.playerOldX = this.player.x;
    },
    /**
     * 初始化tower
     */
    initTower: function () {
        //TODO 读取Tower血量
        this.tower = new Tower();
        this.tower.x = Const.TOWER_INIT_X;
        this.tower.y = Const.TOWER_INIT_Y;
        this.floor.addChild(this.tower);

    }
});