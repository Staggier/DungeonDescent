import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class LeverIdlingState extends State {
    constructor(lever) {
        super();

        this.lever = lever;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.lever.currentAnimation = this.animation;
        this.lever.sprites = this.lever.idlingSprites;
        this.lever.isActivated = false;
        this.lever.bossRoom.isLocked = true;
    }
}