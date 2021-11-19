import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";

export default class PlayerIdlingState extends State {
    constructor(player) {
        super();

        this.player = player;
        this.animation = new Animation([0, 1, 2, 3], 0.2);
    }

    enter() {
        this.player.sprites = this.player.idlingSprites;
        this.player.currentAnimation = this.animation;
    }

    update(dt) {
        // check for movement
    }
}