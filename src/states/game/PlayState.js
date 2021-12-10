import State from "../../../lib/State.js";
import { context } from "../../globals.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.player = params.player;
	}

	update(dt) {
		this.player.update(dt);
	}

	render() {
		this.player.render();
	}
}
