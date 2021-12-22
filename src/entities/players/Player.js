import StateMachine from "../../../lib/StateMachine.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { CANVAS_SCALE } from "../../globals.js";
import PlayerAttackingState from "../../states/entity/Player/PlayerAttackingState.js";
import PlayerIdlingState from "../../states/entity/Player/PlayerIdlingState.js";
import PlayerWalkingState from "../../states/entity/Player/PlayerWalkingState.js";
import GameEntity from "../GameEntity.js";
import Hitbox from "../../../lib/Hitbox.js";
import Direction from "../../enums/Direction.js";
import PlayerHurtingState from "../../states/entity/Player/PlayerHurtingState.js";

export default class Player extends GameEntity {

    static ATTACK_FRAME = 4;

    static DAMAGE = 0.5;

    static NUM_IDLING_SPRITES = 4;
    static NUM_WALKING_SPRITES = 4;
    static NUM_HITTING_SPRITES = 5;

    static WIDTH = 16;
    static HEIGHT = 28;

    static LEFT_FACING_X_OFFSET = 7;
    static HITBOX_POSITION_X_OFFSET = 7;
    static HITBOX_POSITION_Y_OFFSET = 40;
    static HITBOX_WIDTH_OFFSET = 8;
    static HITBOX_HEIGHT_OFFSET = 45;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.hitbox = new Hitbox(
            this.position.x + Player.HITBOX_POSITION_X_OFFSET,
            this.position.y + Player.HITBOX_POSITION_Y_OFFSET,
            Player.WIDTH * CANVAS_SCALE - Player.HITBOX_WIDTH_OFFSET,
            Player.HEIGHT * CANVAS_SCALE - Player.HITBOX_HEIGHT_OFFSET
        );

        this.kickHitbox = new Hitbox(0, 0, 0, 0, "blue");

        this.stateMachine = new StateMachine();
        this.stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));
        this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
        this.stateMachine.add(PlayerStateName.Attacking, new PlayerAttackingState(this));
        this.stateMachine.add(PlayerStateName.Hurting, new PlayerHurtingState(this));

        this.changeState(PlayerStateName.Idling);

        this.score = 0;
    }

    update(dt) {
        super.update(dt);

        if (this.faceDirection == Direction.Left)
            this.hitbox.set(
                this.position.x + Player.HITBOX_POSITION_X_OFFSET - Player.LEFT_FACING_X_OFFSET,
                this.position.y + Player.HITBOX_POSITION_Y_OFFSET,
                Player.WIDTH * CANVAS_SCALE - Player.HITBOX_WIDTH_OFFSET,
                Player.HEIGHT * CANVAS_SCALE - Player.HITBOX_HEIGHT_OFFSET
            );
        else {
            this.hitbox.set(
                this.position.x + Player.HITBOX_POSITION_X_OFFSET,
                this.position.y + Player.HITBOX_POSITION_Y_OFFSET,
                Player.WIDTH * CANVAS_SCALE - Player.HITBOX_WIDTH_OFFSET,
                Player.HEIGHT * CANVAS_SCALE - Player.HITBOX_HEIGHT_OFFSET
            );
        }
    }
}