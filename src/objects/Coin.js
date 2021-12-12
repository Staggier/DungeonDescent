import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import CoinSpinningState from "../states/object/CoinSpinningState.js";
import GameObject from "./GameObject.js";

export default class Coin extends GameObject {
    static WIDTH = 8;
    static HEIGHT = 8;
    static NUM_SPRITES = 4;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.CoinSpinning, new CoinSpinningState(this));
        this.stateMachine.change(ObjectStateName.CoinSpinning);

        this.spinningSprites = Coin.generateSprites();
        this.sprites = this.spinningSprites;
    }

    update(dt) {
        super.update(dt);

        if (this.wasConsumed) {
            this.cleanUp = true;
        }
    }

    static generateSprites() {
        const sprites = [];

        for (let i = 0; i < Coin.NUM_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                289 + (Coin.WIDTH * i),
                272,
                Coin.WIDTH,
                Coin.HEIGHT
            ));
        }

        return sprites;
    }
}