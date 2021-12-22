import { getCollisionDirection } from "../../lib/CollisionHelpers.js";
import Hitbox from "../../lib/Hitbox.js";
import Direction from "../enums/Direction.js";
import { CANVAS_SCALE, context } from "../globals.js";

export default class GameObject {
    constructor(dimensions, position) {
        this.dimensions = dimensions;
        this.position = position;

        this.hitbox = new Hitbox(
            this.position.x,
            this.position.y,
            this.dimensions.x * CANVAS_SCALE,
            this.dimensions.y * CANVAS_SCALE, 
        );

        this.stateMachine = null;
        this.currentAnimation = null;
        this.sprites = null;
        
        this.isVisible = true;
        this.isSolid = true;
        this.isConsumable = false;
        this.isCollidable = false;
        this.wasConsumed = false;
        this.wasCollided = false;        
        this.cleanUp = false;

        this.renderPriority = 1;
    }

    update(dt) {
        this.stateMachine.update(dt);
        this.currentAnimation.update(dt);
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
    
    isColliding(collider) {
        return this.hitbox.didCollide(collider.hitbox);
    }

    /**
     * Prevents entities from overlapping when colliding.
     */
	onCollision(collider) {
		if (this.isSolid) {
			const collisionDirection = this.getEntityCollisionDirection(collider.hitbox);

			switch (collisionDirection) {
				case Direction.Up:
					collider.position.y = this.hitbox.position.y - Math.abs(collider.position.y - collider.hitbox.position.y) - collider.hitbox.dimensions.y;
					break;
				case Direction.Down:
					collider.position.y = this.hitbox.position.y + this.hitbox.dimensions.y - Math.abs(collider.position.y - collider.hitbox.position.y);
					break;
				case Direction.Left:
					collider.position.x = this.hitbox.position.x - Math.abs(collider.position.x - collider.hitbox.position.x) - collider.hitbox.dimensions.x;
					break;
				case Direction.Right:
					collider.position.x = this.hitbox.position.x + this.hitbox.dimensions.x - Math.abs(collider.position.x - collider.hitbox.position.x);
					break;
			}
		}

		if (this.wasCollided) {
			return;
		}

		this.wasCollided = true;
	}

	getEntityCollisionDirection(hitbox) {
		return getCollisionDirection(
			this.hitbox.position.x,
			this.hitbox.position.y,
			this.hitbox.dimensions.x,
			this.hitbox.dimensions.y,
			hitbox.position.x,
			hitbox.position.y,
			hitbox.dimensions.x,
			hitbox.dimensions.y,
		);
	}
}