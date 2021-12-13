import Hitbox from "../../../lib/Hitbox.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import StateMachine from "../../../lib/StateMachine.js";
import Direction from "../../enums/Direction.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import { CANVAS_SCALE, context } from "../../globals.js";
import Tile from "../../objects/Tile.js";
import EnemyIdlingState from "../../states/entity/Enemy/EnemyIdlingState.js";
import EnemyWalkingState from "../../states/entity/Enemy/EnemyWalkingState.js";
import GameEntity from "../GameEntity.js";

export default class Enemy extends GameEntity {

    static NUM_IDLING_SPRITES = 4;
    static NUM_WALKING_SPRITES = 4;

    static LARGE_WIDTH = 32;
    static LARGE_HEIGHT = 36;

    static SMALL_WIDTH = 16;
    static SMALL_HEIGHT = 24;

    static SMALL_ENEMY_SCORE = 25;
    static LARGE_ENEMY_SCORE = 50;

    static SMALL_ENEMY_DAMAGE = 0.5;
    static LARGE_ENEMY_DAMAGE = 1.0;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.hitbox = new Hitbox(
            this.position.x, 
            this.position.y, 
            this.dimensions.x * CANVAS_SCALE, 
            this.dimensions.y * CANVAS_SCALE
        );

        this.speed = 3 * Tile.SIZE * CANVAS_SCALE;

        this.faceDirection = getRandomPositiveInteger(0, 1) == 0 ? Direction.Left : Direction.Right;

        this.stateMachine = new StateMachine();
        this.stateMachine.add(EnemyStateName.Idling, new EnemyIdlingState(this));
        this.stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this));

        this.stateMachine.change(EnemyStateName.Idling);
    }
}