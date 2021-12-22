import State from "../../../../lib/State.js";
import Timer from "../../../../lib/Timer.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds, TILE_SIZE } from "../../../globals.js";
import Room from "../../../objects/Room.js";

export default class PlayerHurtingState extends State {
    constructor(player) {
        super();

        this.timer = new Timer();
        this.player = player;
    }

    enter(params) {        
        sounds.play(SoundName.HitPlayer);
        
        this.player.isInvincible = true;
        this.player.health -= params.damage;

        switch (params.enemy.direction) {
            case Direction.Up:
                this.timer.tween(this.player.position, ["y"], [this.player.position.y + -params.enemy.knockback], 0.2, () => {
                    this.player.isInvincible = false;
                    this.player.canMove = true;  
                    this.player.changeState(PlayerStateName.Idling);
                });
                break;
            case Direction.Down:
                this.timer.tween(this.player.position, ["y"], [this.player.position.y + params.enemy.knockback], 0.2, () => {
                    this.player.isInvincible = false;
                    this.player.canMove = true;  
                    this.player.changeState(PlayerStateName.Idling);
                });
                break;
            case Direction.Left:
                this.timer.tween(this.player.position, ["x"], [this.player.position.x + -params.enemy.knockback], 0.2, () => {
                    this.player.isInvincible = false;
                    this.player.canMove = true;  
                    this.player.changeState(PlayerStateName.Idling);
                });
                break;
            case Direction.Right:
                this.timer.tween(this.player.position, ["x"], [this.player.position.x + params.enemy.knockback], 0.2, () => {
                    this.player.isInvincible = false;
                    this.player.canMove = true;  
                    this.player.changeState(PlayerStateName.Idling);
                });
                break;
        }
    }

    update(dt) {
        this.timer.update(dt);

        // Horizontal boundary check.
        if (this.player.position.x <= Room.LEFT_EDGE - this.player.dimensions.x) {
            this.player.position.x = Room.LEFT_EDGE - this.player.dimensions.x;
        }
        else if (this.player.position.x >= Room.RIGHT_EDGE - TILE_SIZE) {
            this.player.position.x = Room.RIGHT_EDGE - TILE_SIZE;
        }

        // Vertical boundary check.
        if (this.player.position.y + this.player.dimensions.y <= Room.TOP_EDGE) {
            this.player.position.y = Room.TOP_EDGE - this.player.dimensions.y;
        }
        else if (this.player.position.y + this.player.dimensions.y >= Room.BOTTOM_EDGE) {
            this.player.position.y = Room.BOTTOM_EDGE - this.player.dimensions.y;
        }
    }
}