import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/players/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { CANVAS_SCALE } from "../../../globals.js";

export default class PlayerAttackingState extends State {
    constructor(player) {
        super();

        this.player = player;
        this.animation = new Animation([0, 1, 4, 4, 4, 2, 3], 0.1, 1);
    }

    enter() {
        this.player.sprites = this.player.attackingSprites;
        this.player.currentAnimation = this.animation;
        this.player.isInvincible = true;
    }

    update(dt) {
        if (this.player.canMove) {

            if (this.player.currentAnimation.getCurrentFrame() == Player.ATTACK_FRAME) {
                if (this.player.faceDirection == Direction.Right) {
                    this.player.kickHitbox.set(this.player.position.x - 2, this.player.position.y + (Player.WIDTH * CANVAS_SCALE) + 10, Player.WIDTH * CANVAS_SCALE + 6, 17);
                }   
                else {
                    this.player.kickHitbox.set(this.player.position.x - 5, this.player.position.y + (Player.WIDTH * CANVAS_SCALE) + 10, Player.WIDTH * CANVAS_SCALE + 6, 17);
                }         
            }

            if (this.player.currentAnimation.isDone()) {
                this.player.kickHitbox.set(0, 0, 0, 0);
                this.player.currentAnimation.refresh();
                this.player.changeState(PlayerStateName.Idling);
            }
        }
    }

    exit() {
        this.player.isInvincible = false;
    }
}