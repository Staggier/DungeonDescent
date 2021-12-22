import Vector from "../../lib/Vector.js";
import FloorNumber from "../enums/FloorNumber.js";
import Floor from "./Floor.js";
import Room from "./Room.js";

export default class Dungeon {
    constructor(player) {
        this.player = player;
        this.player.position = new Vector(760, Room.HEIGHT / 2 - 65);
        this.floor = Floor.getFloor(FloorNumber.First, player);
    }

    update(dt) {
        this.floor.update(dt);

        // Change floors when colling with the ladder in the boss room.
        if (this.floor.currentRoom == this.floor.bossRoom && this.floor.ladder != null && this.floor.bossRoom.isCleared && this.floor.ladder.isColliding(this.player)) {
            this.changeFloor();
        }
    }

    render() {
        this.floor.render();
    }

    changeFloor() {
        this.player.position = new Vector(760, Room.HEIGHT / 2 - 65);
        this.floor = Floor.getFloor(this.floor.floorNumber + 1, this.player);
    }
}