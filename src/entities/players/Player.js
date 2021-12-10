import Sprite from "../../../lib/Sprite.js";
import StateMachine from "../../../lib/StateMachine.js";
import ImageName from "../../enums/ImageName.js";
import PlayerType from "../../enums/PlayerType.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { images } from "../../globals.js";
import PlayerAttackingState from "../../states/entity/Player/PlayerAttackingState.js";
import PlayerIdlingState from "../../states/entity/Player/PlayerIdlingState.js";
import PlayerWalkingState from "../../states/entity/Player/PlayerWalkingState.js";
import GameEntity from "../GameEntity.js";

export default class Player extends GameEntity {

    static NUM_IDLING_SPRITES = 4;
    static NUM_WALKING_SPRITES = 4;
    static NUM_HITTING_SPRITES = 5;

    static WIDTH = 16;
    static HEIGHT = 28;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));
        this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
        this.stateMachine.add(PlayerStateName.Attacking, new PlayerAttackingState(this));

        this.changeState(PlayerStateName.Idling);
    }
}