import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT, keys, stateMachine, sounds, TILE_SIZE, CANVAS_SCALE } from "../../../src/globals.js";
import Player from "../../entities/players/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerType from "../../enums/PlayerType.js";
import PlayerFactory from "../../entities/players/PlayerFactory.js";
import SoundName from "../../enums/SoundName.js";
import UserInterface from "../../services/UserInterface.js";
import Skull from "../../objects/Skull.js";
import Direction from "../../enums/Direction.js";

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

		this.skulls = [
			new Skull(new Vector(Skull.WIDTH, Skull.HEIGHT), new Vector(CANVAS_WIDTH / 2 - 125, CANVAS_HEIGHT / 2 + 25)),
			new Skull(new Vector(Skull.WIDTH, Skull.HEIGHT), new Vector(CANVAS_WIDTH / 2 - 165, CANVAS_HEIGHT / 2 + 25)),
			new Skull(new Vector(Skull.WIDTH, Skull.HEIGHT), new Vector(CANVAS_WIDTH / 2 + 70, CANVAS_HEIGHT / 2 + 25)),
			new Skull(new Vector(Skull.WIDTH, Skull.HEIGHT), new Vector(CANVAS_WIDTH / 2 + 110, CANVAS_HEIGHT / 2 + 25))
		];
		
		this.biggerSkulls = [
			new Skull(new Vector(Skull.WIDTH, Skull.HEIGHT), new Vector(CANVAS_WIDTH / 2 - 640, CANVAS_HEIGHT - (TILE_SIZE * 7))),
			new Skull(new Vector(Skull.WIDTH, Skull.HEIGHT), new Vector(CANVAS_WIDTH / 2 + 300, CANVAS_HEIGHT - (TILE_SIZE * 7)))
		]

		this.skulls[2].faceDirection = Direction.Left;
		this.skulls[3].faceDirection = Direction.Left;

		this.players.forEach(player => player.canMove = false);

		this.backgroundTiles = UserInterface.getBackgroundTiles();
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
				stateMachine.change(GameStateName.Instructions, { backgroundTiles: this.backgroundTiles, characters: this.players });
			}
			else {
				stateMachine.change(GameStateName.HighscoreState, { backgroundTiles: this.backgroundTiles });
			}
		}

		this.players.forEach(player => player.update(dt));
	}

	render() {
		this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
		this.menuSelectionRender();
		this.titlescreenRender();

		this.players.forEach(player => player.render());
		this.skulls.forEach(skull => skull.render());
		this.renderBiggerSkulls();
	}

	titlescreenRender() {
		context.save();
		context.textAlign = "center";
		context.font = '125px WarPriest';
		context.fillText("Dungeon Descent", CANVAS_WIDTH / 2, TILE_SIZE * 3);

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

	renderBiggerSkulls() {
		context.save();
		context.translate(this.biggerSkulls[0].position.x + (this.biggerSkulls[0].dimensions.x * CANVAS_SCALE * 7), this.biggerSkulls[0].position.y);
		context.scale(-CANVAS_SCALE * 7, CANVAS_SCALE * 7);
		this.biggerSkulls[0].sprites[this.biggerSkulls[0].currentAnimation.getCurrentFrame()].render(0, 0);
		context.restore();

		context.save();
		context.translate(this.biggerSkulls[1].position.x, this.biggerSkulls[1].position.y);
		context.scale(CANVAS_SCALE * 7, CANVAS_SCALE * 7);
		this.biggerSkulls[1].sprites[this.biggerSkulls[1].currentAnimation.getCurrentFrame()].render(0, 0);
		context.restore();
	}
}
