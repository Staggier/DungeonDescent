import Direction from "../enums/Direction.js";
import { context, CANVAS_SCALE } from "../globals.js";

export default class GameEntity {
    constructor(dimensions, position) {
        this.dimensions = dimensions;
        this.position = position;
        this.hitbox = null;
        this.sprites = null;
        this.currentAnimation = null;
        this.stateMachine = null;
        this.faceDirection = Direction.Right;
        this.direction = Direction.Right;
        this.isDead = false;
        this.cleanUp = false;
        this.isInvincible = false;
        this.canMove = true;
        this.renderPriority = 2;
    }

    update(dt) {
        this.stateMachine.update(dt);
        this.currentAnimation.update(dt);
    }

    render() {
        if (this.isDead || this.cleanUp) {
            return;
        }

        this.stateMachine.render();
        this.renderEntity();
    }

    renderEntity() {
        context.save();
 
        if (this.faceDirection == Direction.Left) {
            context.translate(Math.floor(this.position.x + (this.dimensions.x * CANVAS_SCALE)), Math.floor(this.position.y));
            context.scale(-CANVAS_SCALE, CANVAS_SCALE);
        }
        else {
            context.translate(Math.floor(this.position.x), Math.floor(this.position.y));
            context.scale(CANVAS_SCALE, CANVAS_SCALE);
        }

        this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0);
        context.restore();
    }
    
    changeState(state, params) {
        this.stateMachine.change(state, params);
    }
}