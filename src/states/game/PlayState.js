import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/players/Player.js";
import { CANVAS_SCALE, context, stateMachine, timer } from "../../globals.js";
import Heart from "../../objects/Heart.js";
import Room from "../../objects/Room.js";
import Tile from "../../objects/Tile.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.player = params.player;
		this.dungeonFloor = params.dungeonFloor;
		this.backgroundTiles = params.backgroundTiles;
		
		this.heart = new Heart(new Vector(Heart.WIDTH, Heart.HEIGHT), new Vector(Tile.SIZE * 2 * CANVAS_SCALE + 105, Tile.SIZE * CANVAS_SCALE - 35));
	}

	update(dt) {
		timer.update(dt);
		this.dungeonFloor.update(dt);
	}

	render() {
		this.dungeonFloor.render();
		this.statsRender();
	}

	statsRender() {
		context.save();
		context.font = "35px WarPriest"
		context.fillText("Health:", Tile.SIZE * CANVAS_SCALE, Tile.SIZE * CANVAS_SCALE);
		context.fillText(`x ${this.player.health}`, Tile.SIZE * 2 * CANVAS_SCALE + 150, Tile.SIZE * CANVAS_SCALE);
		context.fillText(`Score: ${this.player.score}`, Tile.SIZE * CANVAS_SCALE, Tile.SIZE * 2 * CANVAS_SCALE);

		context.fillText(`Strength: ${this.player.strength}`, Tile.SIZE * CANVAS_SCALE, Tile.SIZE * 3 * CANVAS_SCALE);
		context.fillText(`Luck: ${this.player.luck}`, Tile.SIZE * CANVAS_SCALE, Tile.SIZE * 4 * CANVAS_SCALE);
		context.fillText(`Speed: ${this.player.speed / (Tile.SIZE * CANVAS_SCALE)}`, Tile.SIZE * CANVAS_SCALE, Tile.SIZE * 5 * CANVAS_SCALE);

		context.restore();

		this.heart.render();
	}
}
