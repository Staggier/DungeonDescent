import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, stateMachine } from "../../globals.js";

export default class HighscoreState extends State {
    static MAX_HIGH_SCORES = 10;

    constructor() {
        super();
    }

    enter(params) {
        this.backgroundTiles = params.backgroundTiles;
        this.highscores = HighscoreState.getHighscores();
        this.newScore = params.score;
    }

    update(dt) {
        if (keys.Escape) {
            stateMachine.change(GameStateName.TitleScreen, { backgroundTiles: this.backgroundTiles});
        }
    }

    render() {
        this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));

        context.save();
        context.textAlign = "center";

        context.fillStyle = "white";
        context.font = "40px WarPriest";
        
        context.fillText("Highscores:", CANVAS_WIDTH / 2, 50);

        for (let i = 0; i < HighscoreState.MAX_HIGH_SCORES; i++) {
           context.fillText(`${i + 1}. ${this.highscores[i].name}: ${this.highscores[i].highscore}`, CANVAS_WIDTH / 2, 100 + (40 * i));
        }

        context.font = "35px WarPriest";
        context.fillText("Press Escape to go back to the Main Menu!", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);

        context.restore();
    }

    static getHighscores() {
        const highscores = JSON.parse(localStorage.getItem("highscores")) ?? [];

        if (highscores.length == 0) {
            for (let i = HighscoreState.MAX_HIGH_SCORES; i > 0; i--) {
                highscores.push({name: "AAA", highscore: i * 100});
            }

		    localStorage.setItem('highscores', JSON.stringify(highscores));
        }

        return highscores;
    }

    static addHighScore(name, highscore) {
		var highscores = HighscoreState.getHighscores();

		highscores.push({ name: name, highscore: highscore });
		highscores = highscores.sort((a, b) => b.highscore - a.highscore);
		highscores = highscores.slice(0, HighscoreState.MAX_HIGH_SCORES);

		localStorage.setItem('highscores', JSON.stringify(highscores));
	}
}