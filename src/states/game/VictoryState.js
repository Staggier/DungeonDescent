import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Direction from "../../enums/Direction.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, context, keys, stateMachine } from "../../globals.js";

export default class VictoryState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.backgroundTiles = params.backgroundTiles;
		this.player = params.player;
		this.player.changeState(PlayerStateName.Idling);
		this.player.position = new Vector(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 - 75);

		this.player.canMove = false;
		this.player.faceDirection = Direction.Right;

		this.score += Math.floor(this.player.health * 50);
	}

	update(dt) {
		this.player.canMove = false;
		this.player.update(dt);

		if (keys.Enter) {
			keys.Enter = false;
			stateMachine.change(GameStateName.EnterHighscore, { backgroundTiles : this.backgroundTiles, score: this.player.score });
		}
	}

	render() {
		this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
		this.renderMessages();
		this.renderPlayer();
	}

	renderPlayer() {
		context.save();
 
		context.translate(Math.floor(this.player.position.x), Math.floor(this.player.position.y));
		context.scale(CANVAS_SCALE * 4, CANVAS_SCALE * 4);

        this.player.sprites[this.player.currentAnimation.getCurrentFrame()].render(0, 0);
        context.restore();
	}

	renderMessages() {
		context.save();
		context.textAlign = "center";

		context.font = "65px WarPriest";
		context.fillText(`SCORE: ${this.player.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 200);

		context.font = "50px WarPriest";
		context.fillText("Congratulations! You win!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);

		context.font = "35px WarPriest";
		context.fillText("Press enter to continue...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.restore();
	}
}
