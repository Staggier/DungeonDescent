import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import {
	context,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	keys,
	stateMachine,
	CANVAS_SCALE
} from "../../../src/globals.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerType from "../../enums/PlayerSpriteType.js";
import Tile from "../../objects/Tile.js";
import { getRandomPositiveInteger, getRandomPositiveNumber } from "../../../lib/RandomNumberHelpers.js";

export default class TitleScreenState extends State {
	constructor() {
		super();

		this.enter();
	}

	enter() {
		this.menuOptions = {
			start: 'Start',
			highscores: 'Highscores'
		}

		this.highlighted = this.menuOptions.start;
		this.entities = [
			new Player(new Vector(Player.WIDTH, Player.HEIGHT), new Vector(CANVAS_WIDTH / 2 - (Player.WIDTH * 6), 200), PlayerType.Lizard),
			new Player(new Vector(Player.WIDTH, Player.HEIGHT), new Vector(CANVAS_WIDTH / 2 - Player.WIDTH, 200) , PlayerType.Wizard),
			new Player(new Vector(Player.WIDTH, Player.HEIGHT), new Vector(CANVAS_WIDTH / 2 + (Player.WIDTH * 4), 200), PlayerType.Knight),
		];

		this.backgroundTiles = this.getBackgroundTiles();
	}

	update(dt) {
		if (keys.w || keys.s) {
			this.highlighted = this.highlighted == this.menuOptions.start ? this.menuOptions.highscores : this.menuOptions.start;
			keys.w = false;
			keys.s = false;
		}
		else if (keys.Enter) {
			if (this.highlighted == this.menuOptions.start) {
				stateMachine.change(GameStateName.CharacterSelect, {backgroundTiles: this.backgroundTiles, characters: this.entities});
			}
		}

		this.entities.forEach(entity => entity.update(dt));
	}

	render() {
		this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
		this.menuSelectionRender();
		this.titlescreenRender();
		this.entities.forEach(entity => entity.render());
	}

	titlescreenRender() {
		context.save();
		context.textAlign = "center";
		context.font = '125px WarPriest';
		context.fillText("Dungeon Descent", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50);

		context.restore();
	}
	
	menuSelectionRender() {
		context.save();
		context.textAlign = "center";
		context.font = "50px WarPriest";
		context.fillStyle = this.highlighted === this.menuOptions.start ? "white" : "black";
		context.fillText(`${this.menuOptions.start}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 250);
		context.fillStyle = this.highlighted === this.menuOptions.highscores ? "white" : "black";
		context.textAlign = "center";
		context.fillText(`${this.menuOptions.highscores}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200);
		context.restore();
	}
	
	getBackgroundTiles() {
		const tiles = [];

		let sprites = Tile.generateWallSprites();

		for (let i = 0; i < CANVAS_HEIGHT / Tile.SIZE; i++) {
			tiles.push([]);
			for (let j = 0; j < CANVAS_WIDTH / Tile.SIZE; j++) {
				tiles[i].push(new Tile(
					new Vector(j * Tile.SIZE * CANVAS_SCALE * 2, i * Tile.SIZE * CANVAS_SCALE * 2),
					new Vector(Tile.SIZE, Tile.SIZE),
					sprites[getRandomPositiveInteger(0, 2)]
				));
			}
		}

		return tiles;
	}
}
