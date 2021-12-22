import State from "../../../../lib/State.js";
import Timer from "../../../../lib/Timer.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { CANVAS_SCALE, sounds } from "../../../globals.js";
import Room from "../../../objects/Room.js";

export default class EnemyHurtingState extends State {
    constructor(enemy) {
        super();

        this.timer = new Timer();
        this.enemy = enemy;
    }

    enter(params) {     
        sounds.play(SoundName.HitEnemy);

        this.enemy.isInvincible = true;
        this.enemy.canMove = false;
        this.enemy.health -= params.damage;
        
        this.timer.tween(this.enemy.position, ["x"], [this.enemy.position.x + (params.direction * params.knockback)], 0.2, () => {
            this.enemy.isInvincible = false;
            this.enemy.canMove = true;  
            this.enemy.changeState(EnemyStateName.Idling);
        }); 

    }

    update(dt) {
        this.timer.update(dt);

        // Horizontal boundary check.
        if (this.enemy.position.x <= Room.LEFT_EDGE) {
            this.enemy.position.x = Room.LEFT_EDGE;
        }
        else if (this.enemy.position.x + (this.enemy.dimensions.x * CANVAS_SCALE) >= Room.RIGHT_EDGE) {
            this.enemy.position.x = Room.RIGHT_EDGE - (this.enemy.dimensions.x * CANVAS_SCALE);
        }

        // Vertical boundary check.
        if (this.enemy.position.y <= Room.TOP_EDGE - this.enemy.dimensions.y / 2 ) {
            this.enemy.position.y = Room.TOP_EDGE - this.enemy.dimensions.y / 2;
        }
        else if (this.enemy.position.y + this.enemy.dimensions.y >= Room.BOTTOM_EDGE) {
            this.enemy.position.y = Room.BOTTOM_EDGE - this.enemy.dimensions.y;
        }
    }
}