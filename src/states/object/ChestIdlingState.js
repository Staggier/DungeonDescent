import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import ObjectStateName from "../../enums/ObjectStateName.js";

export default class ChestIdlingState extends State {
    constructor(chest) {
        super();

        this.chest = chest;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.chest.currentAnimation = this.animation;
        this.chest.sprites = this.chest.idlingSprites;
    }

    update(dt) {
        if (this.chest.wasConsumed) {
            this.chest.changeState(ObjectStateName.ChestOpening);
        }
    }
}