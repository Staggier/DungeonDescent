import Hitbox from "../../lib/Hitbox.js";
import Timer from "../../lib/Timer.js";
import { CANVAS_SCALE, context } from "../globals.js";

export default class GameObject {
    constructor(dimensions, position) {
        this.dimensions = dimensions;
        this.position = position;

        this.hitbox = new Hitbox(
            this.position.x,
            this.position.y,
            this.dimensions.x * CANVAS_SCALE,
            this.dimensions.y * CANVAS_SCALE  
        );

        this.timer = new Timer();
        this.stateMachine = null;
        this.currentAnimation = null;
        this.sprites = null;
        
        this.isVisible = true;
        this.isSolid = true;
        this.isConsumable = false;
        this.wasConsumed = false;
        this.wasCollided = false;        
        this.cleanUp = false;

        this.renderPriority = 1;
    }

    update(dt) {
        this.stateMachine.update(dt);
        this.currentAnimation.update(dt);
        this.timer.update(dt);
    }

    render() {
        if (this.cleanUp || !this.isVisible) {
            return;
        }

        this.renderObject();
        this.stateMachine.render();
    }

    renderObject() {
        context.save();

        context.translate(Math.floor(this.position.x), Math.floor(this.position.y));
        context.scale(CANVAS_SCALE, CANVAS_SCALE);

        this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0);
        context.restore();
    }

    changeState(stateName, params) {
        this.stateMachine.change(stateName, params);
    }
}