import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import { keys } from "../../../globals.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import Direction from "../../../enums/Direction.js";

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
        if (this.player.canMove) {
            this.checkForMovement();
            this.checkForAttack();
        }
    }

    checkForMovement() {
        if (keys.w) {
            this.player.direction = Direction.Up;
            this.player.changeState(PlayerStateName.Walking);
        }
        else if (keys.s) {
            this.player.direction = Direction.Down;
            this.player.changeState(PlayerStateName.Walking);
        }
        if (keys.a) {
            this.player.faceDirection = Direction.Left;
            this.player.direction = Direction.Left;
            this.player.changeState(PlayerStateName.Walking);
        }
        else if (keys.d) {
            this.player.faceDirection = Direction.Right;
            this.player.direction = Direction.Right;
            this.player.changeState(PlayerStateName.Walking);
        }
    }

    checkForAttack() {
        if (keys.Enter || keys.Attack) {
            this.player.changeState(PlayerStateName.Attacking);
        }
    }
}