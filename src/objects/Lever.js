import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import LeverActivatingState from "../states/object/LeverActivatingState.js";
import LeverAwaitingState from "../states/object/LeverAwaitingState.js";
import GameObject from "./GameObject.js";

export default class Lever extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
    static NUM_SPRITES = 2;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.LeverAwaiting, new LeverAwaitingState(this));
        this.stateMachine.add(ObjectStateName.LeverActivating, new LeverActivatingState(this));
        this.stateMachine.change(ObjectStateName.LeverAwaiting);

        let sprites = Lever.generateSprites();
        this.awaitingSprites = [sprites[0]];
        this.activatingSprites = [sprites[1]];
        this.sprites = this.awaitingSprites;
    }

    static generateSprites() {
        const sprites = [];

        for (let i = 0; i < Lever.NUM_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                80 + (Lever.WIDTH * i),
                192,
                Lever.WIDTH,
                Lever.HEIGHT
            ))
        }

        return sprites;
    }
}