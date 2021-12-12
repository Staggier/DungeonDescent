import State from "../../../lib/State.js";
import { context } from "../../globals.js";
import Room from "../../objects/Room.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(params) {
		this.player = params.player;
		this.room = params.room;
	}

	update(dt) {  
		this.room.update(dt);
	}

	render() {
		this.room.render();
		//this.player.render();
	}
}
