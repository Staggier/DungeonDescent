import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import {
	context,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	keys,
	stateMachine,
	CANVAS_SCALE,
	sounds
} from "../../../src/globals.js";
import Player from "../../entities/players/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerType from "../../enums/PlayerType.js";
import Tile from "../../objects/Tile.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import PlayerFactory from "../../entities/players/PlayerFactory.js";
import EnemyFactory from "../../entities/enemies/EnemyFactory.js";
import EnemyType from "../../enums/EnemyType.js";
import Enemy from "../../entities/enemies/Enemy.js";
import Chest from "../../objects/Chest.js";
import Coin from "../../objects/Coin.js";
import Lever from "../../objects/Lever.js";
import Potion from "../../objects/Potion.js";
import PotionColor from "../../enums/PotionColor.js";
import SoundName from "../../enums/SoundName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
	}

	enter() {

		sounds.get(SoundName.Music).play();

		this.menuOptions = {
			start: 'Start',
			highscores: 'Highscores'
		}

		this.highlighted = this.menuOptions.start;

		this.players = [
			PlayerFactory.createInstance(PlayerType.Lizard, new Vector(Player.WIDTH, Player.HEIGHT), new Vector(CANVAS_WIDTH / 2 - (Player.WIDTH * 6), 200)),
			PlayerFactory.createInstance(PlayerType.Wizard, new Vector(Player.WIDTH, Player.HEIGHT), new Vector(CANVAS_WIDTH / 2 - Player.WIDTH, 200)),
			PlayerFactory.createInstance(PlayerType.Knight, new Vector(Player.WIDTH, Player.HEIGHT), new Vector(CANVAS_WIDTH / 2 + (Player.WIDTH * 4), 200)),
		];

		this.enemies = [
			EnemyFactory.createInstance(EnemyType.SmallDemon, new Vector(Enemy.SMALL_WIDTH, Enemy.SMALL_HEIGHT), new Vector(CANVAS_WIDTH / 2 - 200, CANVAS_HEIGHT / 2)),
			EnemyFactory.createInstance(EnemyType.BigDemon, new Vector(Enemy.LARGE_WIDTH, Enemy.LARGE_HEIGHT), new Vector(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2)),
			EnemyFactory.createInstance(EnemyType.SmallOrc, new Vector(Enemy.SMALL_WIDTH, Enemy.SMALL_HEIGHT), new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)),
			EnemyFactory.createInstance(EnemyType.BigOrc, new Vector(Enemy.LARGE_WIDTH, Enemy.LARGE_HEIGHT), new Vector(CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2)),
			EnemyFactory.createInstance(EnemyType.SmallZombie, new Vector(Enemy.SMALL_WIDTH, Enemy.SMALL_HEIGHT), new Vector(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2)),
			EnemyFactory.createInstance(EnemyType.BigZombie, new Vector(Enemy.LARGE_WIDTH, Enemy.LARGE_HEIGHT), new Vector(CANVAS_WIDTH / 2 + 300, CANVAS_HEIGHT / 2)),
		];

		this.players.forEach(player => player.canMove = false);

		this.backgroundTiles = this.getBackgroundTiles();
	}

	update(dt) {
		if (keys.w || keys.s) {
			keys.w = false;
			keys.s = false;

			this.highlighted = this.highlighted == this.menuOptions.start ? this.menuOptions.highscores : this.menuOptions.start;
		}
		else if (keys.Enter) {
			keys.Enter = false;

			if (this.highlighted == this.menuOptions.start) {
				stateMachine.change(GameStateName.CharacterSelect, { backgroundTiles: this.backgroundTiles, characters: this.players });
			}
			else {
				stateMachine.change(GameStateName.HighscoreState, { backgroundTiles: this.backgroundTiles });
			}
		}

		this.players.forEach(player => player.update(dt));
		this.enemies.forEach(enemy => enemy.update(dt));
	}

	render() {
		this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
		this.menuSelectionRender();
		this.titlescreenRender();

		this.players.forEach(player => player.render());
		this.enemies.forEach(enemy => enemy.render());
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

		let tileSize = Tile.SIZE * CANVAS_SCALE;

		let sprites = Tile.generateFloorSprites();

		for (let i = 0; i < CANVAS_HEIGHT / tileSize; i++) {
			tiles.push([]);
			for (let j = 0; j < CANVAS_WIDTH / tileSize; j++) {
				tiles[i].push(new Tile(
					new Vector(j * tileSize, i * tileSize),
					new Vector(Tile.SIZE, Tile.SIZE),
					sprites[getRandomPositiveInteger(0, Tile.NUM_FLOOR_SPRITES - 1)]
				));
			}
		}

		return tiles;
	}
}
