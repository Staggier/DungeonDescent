import Animation from "../../../../lib/Animation.js";
import { didSucceedPercentChance, getRandomPositiveInteger, pickRandomElement } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Timer from "../../../../lib/Timer.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { CANVAS_SCALE, timer } from "../../../globals.js";
import Room from "../../../objects/Room.js";
import Tile from "../../../objects/Tile.js";

export default class EnemyWalkingState extends State {

    static IDLE_CHANCE = 0.6;
	static MOVE_DURATION_MIN = 1;
	static MOVE_DURATION_MAX = 4;

    constructor(enemy) {
        super();

        this.timer = new Timer();
        this.enemy = enemy;
        this.animation = new Animation([0, 1, 2, 3], 0.2);
    }

    enter() {
        this.enemy.sprites = this.enemy.walkingSprites;
        this.enemy.currentAnimation = this.animation;
        this.enemy.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);

        this.reset();
		this.startTimer();
	}

	update(dt) {
        this.timer.update(dt);
		this.move(dt);
	}

	startTimer() {
		this.timer = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	decideMovement() {
		if (didSucceedPercentChance(EnemyWalkingState.IDLE_CHANCE)) {
			this.enemy.changeState(EnemyStateName.Idling);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	reset() {
		this.enemy.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
		this.moveDuration = getRandomPositiveInteger(EnemyWalkingState.MOVE_DURATION_MIN, EnemyWalkingState.MOVE_DURATION_MAX);
	}

	move(dt) {
        if(!this.enemy.canMove) {
            return;
        }

		if (this.enemy.direction == Direction.Down) {
			this.enemy.position.y += this.enemy.speed * dt;

			if (this.enemy.position.y + this.enemy.dimensions.y > Room.BOTTOM_EDGE) {
				this.enemy.position.y = Room.BOTTOM_EDGE - this.enemy.dimensions.y;
				this.reset();
			}
		}
		else if (this.enemy.direction == Direction.Right) {
            this.enemy.faceDirection = Direction.Right;
			this.enemy.position.x += this.enemy.speed * dt;

			if (this.enemy.position.x + this.enemy.dimensions.x > Room.RIGHT_EDGE) {
				this.enemy.position.x = Room.RIGHT_EDGE - this.enemy.dimensions.x;
				this.reset();
			}
		}
		else if (this.enemy.direction == Direction.Up) {
			this.enemy.position.y -= this.enemy.speed * dt;

			if (this.enemy.position.y < Room.TOP_EDGE - this.enemy.dimensions.y / 2) {
				this.enemy.position.y = Room.TOP_EDGE - this.enemy.dimensions.y / 2;
				this.reset();
			}
		}
		else if (this.enemy.direction == Direction.Left) {
            this.enemy.faceDirection = Direction.Left;
			this.enemy.position.x -= this.enemy.speed * dt;

			if (this.enemy.position.x < Room.LEFT_EDGE) {
				this.enemy.position.x = Room.LEFT_EDGE;
				this.reset();
			}
		}
	}
}