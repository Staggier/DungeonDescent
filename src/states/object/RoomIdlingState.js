import State from "../../../lib/State.js";
import ObjectStateName from "../../enums/ObjectStateName.js";

export default class RoomIdlingState extends State {
    constructor(player, floor) {
        super();

        this.player = player;
        this.floor = floor;
    }

    enter() {
        this.room = this.floor.currentRoom;
    }

    update(dt) {
        this.room.doors.forEach(door => {
            if (!door.isClosed && door.hitbox.didCollide(this.player.hitbox)) {
                this.floor.stateMachine.change(ObjectStateName.RoomChanging, { direction: door.faceDirection });
            }
        })
    }
}