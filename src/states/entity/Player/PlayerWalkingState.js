import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import { keys, TILE_SIZE } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import Room from "../../../objects/Room.js";

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

    /**
     * Player movement based on room constraints.
     * @param {Number} dt 
     */
    handleMovement(dt) {
        let b1 = true;
        let b2 = true;

        // Checks for vertical movement.
        if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;

            if (this.player.position.y + this.player.dimensions.y <= Room.TOP_EDGE) {
				this.player.position.y = Room.TOP_EDGE - this.player.dimensions.y;
			}
		}
        else if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;

            if (this.player.position.y + this.player.dimensions.y >= Room.BOTTOM_EDGE) {
				this.player.position.y = Room.BOTTOM_EDGE - this.player.dimensions.y;
			}
		}
        else {
            b1 = false;
        }

        // Checks for horizontal movement.
		if (keys.a) {
            this.player.faceDirection = Direction.Left;
			this.player.direction = Direction.Right;
			this.player.position.x -= this.player.speed * dt;

            if (this.player.position.x <= Room.LEFT_EDGE - this.player.dimensions.x) {
				this.player.position.x = Room.LEFT_EDGE - this.player.dimensions.x;
			}

		}
		else if (keys.d) {
            this.player.faceDirection = Direction.Right;
			this.player.direction = Direction.Left;
			this.player.position.x += this.player.speed * dt;

            if (this.player.position.x >= Room.RIGHT_EDGE - TILE_SIZE) {
				this.player.position.x = Room.RIGHT_EDGE - TILE_SIZE;
			}
		}
		else {
            b2 = false;
		}

        // Change to idling state if there's no horizontal or vertical movement.
        if (!b1 && !b2) {
            this.player.changeState(PlayerStateName.Idling);
        }
    }

    checkForAttack() {
        if (keys.Enter) {
            this.player.changeState(PlayerStateName.Attacking);
        }
    }
}