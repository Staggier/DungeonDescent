import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import ObjectStateName from "../../enums/ObjectStateName.js";

export default class CoinSpinningState extends State {
    constructor(coin) {
        super();

        this.coin = coin;
        this.animation = new Animation([0, 1, 2, 3], 0.2);
    }

    enter() {
        this.coin.currentAnimation = this.animation;
        this.coin.sprites = this.spinningSprites;
    }
}