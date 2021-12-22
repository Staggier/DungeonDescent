import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, context, keys, sounds, stateMachine } from "../../globals.js";

export default class GameOverState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.backgroundTiles = params.backgroundTiles;
		this.bossDeath = params.bossDeath;
		this.enemy = params.enemy;
		this.player = params.player;
		this.enemy.position = this.bossDeath ? new Vector(CANVAS_WIDTH / 2 - 115, CANVAS_HEIGHT / 2 - 275) : new Vector(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 - 150);
		this.enemy.canMove = false;
		sounds.stop(SoundName.Music);
	}

	update(dt) {
		this.enemy.canMove = false;
		this.enemy.update(dt);

		if (keys.Escape) {
			keys.Escape = false;
			stateMachine.change(GameStateName.TitleScreen, {backgroundTiles: this.backgroundTiles});
		}
	}

	render() {
		this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));

		context.save();
		context.textAlign = "center";
		context.font = "40px WarPriest";

		context.fillText("Game Over!", CANVAS_WIDTH / 2, 100);
		context.fillText("Press Escape to go back to the Main Menu!", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);

		context.restore();

		this.renderEnemy();

	}

	renderEnemy() {
		context.save();
		context.translate(Math.floor(this.enemy.position.x), Math.floor(this.enemy.position.y));
		context.scale(CANVAS_SCALE * 4, CANVAS_SCALE * 4);

        this.enemy.sprites[this.enemy.currentAnimation.getCurrentFrame()].render(0, 0);
        context.restore();
	}
}
