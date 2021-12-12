import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import { keys } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";

export default class PlayerWalkingState extends State {
    constructor(player) {
        super();

        this.player = player;
        this.animation = new Animation([0, 1, 2, 3], 0.2);
    }

    enter() {
        this.player.sprites = this.player.walkingSprites;
        this.player.currentAnimation = this.animation;
    }

    update(dt) {
        if (this.player.canMove) {
            this.handleMovement(dt);
            this.checkForAttack();
        }
    }

    handleMovement(dt) {
        let b1 = true;
        let b2 = true;

        if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;
		}
        else if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;

		}
        else {
            b1 = false;
        }

		if (keys.a) {
            this.player.faceDirection = Direction.Left;
			this.player.direction = Direction.Right;
			this.player.position.x -= this.player.speed * dt;

		}
		else if (keys.d) {
            this.player.faceDirection = Direction.Right;
			this.player.direction = Direction.Left;
			this.player.position.x += this.player.speed * dt;

		}
		else {
            b2 = false;
		}

        if (!b1 && !b2) {
            this.player.changeState(PlayerStateName.Idling);
        }
    }

    checkForAttack() {
        if (keys.Enter || keys.Attack) {
            this.player.changeState(PlayerStateName.Attacking);
        }
    }
}