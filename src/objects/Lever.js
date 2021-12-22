import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import LeverIdlingState from "../states/object/LeverIdlingState.js";
import LeverRestingState from "../states/object/LeverRestingState.js";
import GameObject from "./GameObject.js";
import Tile from "./Tile.js";

export default class Lever extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;
    static NUM_SPRITES = 2;

    constructor(dimensions, position, bossRoom) {
        super(dimensions, position);

        this.bossRoom = bossRoom;

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.LeverIdling, new LeverIdlingState(this));
        this.stateMachine.add(ObjectStateName.LeverResting, new LeverRestingState(this));
        this.stateMachine.change(ObjectStateName.LeverIdling);

        let sprites = Lever.generateSprites();

        this.idlingSprites = [sprites[0]];
        this.restingSprites = [sprites[1]];
        this.sprites = this.idlingSprites;

        // Determine's if the Boss room is unlocked.
        this.isActivated = false;
    }

    static generateSprites() {
        const sprites = [];

        for (let i = 0; i < Lever.NUM_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                80 + (Lever.WIDTH * i),
                192,
                Tile.SIZE,
                Tile.SIZE
            ))
        }

        return sprites;
    }
}