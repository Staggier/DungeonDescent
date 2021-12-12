import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Timer from "../../lib/Timer.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import ChestIdlingState from "../states/object/ChestIdlingState.js";
import ChestOpeningState from "../states/object/ChestOpeningState.js";
import ChestRestingState from "../states/object/ChestRestingState.js";
import GameObject from "./GameObject.js";

export default class Chest extends GameObject {

    static WIDTH = 16;
    static HEIGHT = 16;
    static NUM_SPRITES = 3;

    constructor(dimensions, position, item) {
        super(dimensions, position);

        this.openingSprites = Chest.generateSprites();
        this.idlingSprites = [this.openingSprites[0]];
        this.restingSprites = [this.openingSprites[2]];

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.ChestIdling, new ChestIdlingState(this));
        this.stateMachine.add(ObjectStateName.ChestOpening, new ChestOpeningState(this));
        this.stateMachine.add(ObjectStateName.ChestResting, new ChestRestingState(this));
        this.stateMachine.change(ObjectStateName.ChestIdling);

        this.sprites = this.idlingSprites;

        this.timer = new Timer();
        this.item = item;
        this.item.isVisible = false;
    }

    update(dt) {
        super.update(dt);
        this.item.update(dt);
    }

    render() {
        super.render();
        this.item.render();
    }

    static generateSprites() {
        const sprites = []

        for (let i = 0; i < Chest.NUM_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                304 + (Chest.WIDTH * i),
                288,
                Chest.WIDTH,
                Chest.HEIGHT
            ));
        }

        return sprites;
    }

    revealItem() {
        this.item.isVisible = true;
        this.item.timer.tween(this.item.position, ["y"], [this.item.position.y - 25], 0.5, () => {
            this.changeState(ObjectStateName.ChestResting);
        });
    }
}