import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";

export default class PlayerAttackingState extends State {
    constructor(player) {
        super();

        this.player = player;
        this.animation = new Animation([0, 1, 4, 4, 4, 2, 3], 0.2, 1);
    }

    enter() {
        this.player.sprites = this.player.attackingSprites;
        this.player.currentAnimation = this.animation;
    }

    update(dt) {
        if (this.player.canMove) {
            if (keys.Enter || keys.Space) {
                this.handleAttack(dt);
            }

            if (this.player.currentAnimation.isDone()) {
                this.player.currentAnimation.refresh();
                this.player.changeState(PlayerStateName.Idling);
            }
        }
    }

    handleAttack(dt) {
        //add hitbox functionality
    }
}