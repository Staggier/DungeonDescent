import EnemyType from "../../enums/EnemyType.js";
import BigDemon from "./BigDemon.js";
import BigOrc from "./BigOrc.js";
import BigZombie from "./BigZombie.js";
import SmallDemon from "./SmallDemon.js";
import SmallOrc from "./SmallOrc.js";
import SmallZombie from "./SmallZombie.js";

export default class EnemyFactory {
    static createInstance(type, dimensions, position) {
        switch (type) {
            case EnemyType.SmallOrc:
                return new SmallOrc(dimensions, position);
            case EnemyType.BigOrc:
                return new BigOrc(dimensions, position);
            case EnemyType.SmallZombie:
                return new SmallZombie(dimensions, position);
            case EnemyType.BigZombie:
                return new BigZombie(dimensions, position);
            case EnemyType.SmallDemon:
                return new SmallDemon(dimensions, position);
            case EnemyType.BigDemon:
                return new BigDemon(dimensions, position);        
        }
    }
}