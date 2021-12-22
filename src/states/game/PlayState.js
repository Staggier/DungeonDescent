import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { CANVAS_SCALE, context, TILE_SIZE, timer } from "../../globals.js";
import Heart from "../../objects/Heart.js";
import Tile from "../../objects/Tile.js";
import UserInterface from "../../services/UserInterface.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.player = params.player;
		this.dungeon = params.dungeon;
		this.backgroundTiles = params.backgroundTiles;
		this.statsBorderTiles = UserInterface.getStatsBorderTiles();
		
		this.heart = new Heart(new Vector(Heart.WIDTH, Heart.HEIGHT), new Vector(Tile.SIZE * 2 * CANVAS_SCALE + 105, TILE_SIZE * 6 - 35));
	}

	update(dt) {
		timer.update(dt);
		this.dungeon.update(dt);
	}

	render() {
		this.statsRender();
		this.statsBorderTiles.forEach(tile => tile.render());
		this.dungeon.render();
		this.heart.render();
	}

	statsRender() {
		context.save();
		context.fillRect(TILE_SIZE - 15, TILE_SIZE, TILE_SIZE * 5 + 55, TILE_SIZE * 11);

		context.fillStyle = "white";
		context.font = "35px WarPriest";

		context.fillText(`Floor #${this.dungeon.floor.floorNumber}`, TILE_SIZE, TILE_SIZE * 2);
		
		context.fillText(`Score: ${this.player.score}`, TILE_SIZE, TILE_SIZE * 4.5);
		context.fillText("Health:", TILE_SIZE, TILE_SIZE * 6);

		context.fillText(`Strength: ${this.player.strength}`, TILE_SIZE, TILE_SIZE * 7.5);
		context.fillText(`Luck: ${this.player.luck}`, TILE_SIZE, TILE_SIZE * 9);
		context.fillText(`Speed: ${this.player.speed / TILE_SIZE}`, TILE_SIZE, TILE_SIZE * 10.5);

		context.font = "25px WarPriest";
		context.fillText(`x ${this.player.health}`, TILE_SIZE * 2 + 150, TILE_SIZE * 6 - 3);

		context.restore();
	}
}
