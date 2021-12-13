import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, stateMachine } from "../../globals.js";
import HighscoreState from "./HighscoreState.js";

export default class EnterHighscoreState extends State {
    constructor() {
        super();
    }

    enter(params) {
        this.chars = [65, 65, 65]
        this.backgroundTiles = params.backgroundTiles;
        this.score = params.score;
        this.highlighted = 0;
    }

    update(dt) {
        
        if (keys.Enter) {
            keys.Enter = false;
			const name = String.fromCharCode(this.chars[0]) + String.fromCharCode(this.chars[1]) + String.fromCharCode(this.chars[2]);
			HighscoreState.addHighScore(name, this.score);
			stateMachine.change(GameStateName.HighscoreState, {backgroundTiles: this.backgroundTiles});
		}

        if (keys.a && this.highlighted > 0) {
			keys.a = false;
			this.highlighted = this.highlighted - 1;
		}
		else if (keys.d && this.highlighted < 2) {
			keys.d = false;
			this.highlighted = this.highlighted + 1;
		}

		if (keys.w) {
			keys.w = false;
			this.chars[this.highlighted] = this.chars[this.highlighted] + 1;
			if (this.chars[this.highlighted] > 90) {
				this.chars[this.highlighted] = 65;
			}
		}
		else if (keys.s) {
			keys.s = false;
			this.chars[this.highlighted] = this.chars[this.highlighted] - 1;
			if (this.chars[this.highlightedChar] < 65) {
				this.chars[this.highlightedChar] = 90;
			}
		}
    }

    render() {
        this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));

        context.save();
        context.textAlign = "center";
        context.font = "40px WarPriest";

        context.fillText(`Congratulations your score is: ${this.score}`, CANVAS_WIDTH / 2, 50);
        context.fillText("Please enter your name:", CANVAS_WIDTH / 2, 100);
        context.fillText("Please press Enter to continue...", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);

        context.fillStyle = this.highlighted == 0 ? "white" : "black";
		context.fillText(`${String.fromCharCode(this.chars[0])}`, CANVAS_WIDTH / 2 - 40, CANVAS_HEIGHT / 2);
		context.fillStyle = this.highlighted === 1 ? "white" : "black";
		context.fillText(`${String.fromCharCode(this.chars[1])}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.fillStyle = this.highlighted === 2 ? "white" : "black";
		context.fillText(`${String.fromCharCode(this.chars[2])}`, CANVAS_WIDTH / 2 + 40, CANVAS_HEIGHT / 2);

        context.restore();
    }

}