import State from "../../../lib/State.js";
import { context } from "../../globals.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.player = params.player;
		this.backgroundTiles = params.backgroundTiles;
	}

	update(dt) {  
		this.player.update(dt);
	}

	render() {
		this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
		this.player.render();
	}
}
