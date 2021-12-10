import StateMachine from "../../../lib/StateMachine.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
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

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(EnemyStateName.Idling, new EnemyIdlingState(this));
        this.stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this));

        this.stateMachine.change(EnemyStateName.Idling);
    }
}