/**
 * 塔对象
 */
var Tower = cc.Node.extend({
    /**
     * 遮罩包裹的内容
     * @type cc.ClippingNode
     */
    clipNode: null,
    /**
     * 遮罩名称
     * @type string
     */
    lastMaskName: null,
    ctor: function () {
        this._super();

        this.clipNode = new cc.ClippingNode();
        this.addChild(this.clipNode);
        /**
         * @type flax.MovieClip
         */
        var tower = flax.createDisplay(res.background, "tower", {parent: this.clipNode});
        tower.autoPlayChildren = true;
        /**
         * @type flax.Label
         */
        var hitTF = tower["hit"];
        hitTF.setGap(-20);
        hitTF.scale = Const.COMMON_SCALE;


        //mask
        var mask = new cc.Sprite(res.background_tower_mask_png);
        mask.anchorX = mask.anchorY = 0;
        mask.scale = 2;
        mask.x = -355; //[355 - 140]
        mask.y = -10;
        this.clipNode.setAlphaThreshold(0);
        this.clipNode.setStencil(mask);

    },
    /**
     * 改变遮罩
     * @param {string}
     */
    changeMask: function (maskName) {
        if (this.lastMaskName = maskName)return;

        var mask = new cc.Sprite(maskName);
        this.clipNode.setStencil(mask);
    },
    /**
     * 受伤
     * @param val
     */
    hurt: function (val) {
        GameManager.instance.setTowerHp(GameManager.instance.towerHp - val);
        //TODO play shake
        var scale = cc.scaleBy(0.06, 0.975, 1.025);
        this.runAction(cc.sequence(
            scale, scale.clone().reverse()
        ));

        //TODO show hurt val text (x15)

        //TODO change mask


        //TODO change play move range
    }
});