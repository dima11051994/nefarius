"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = exports.initCards = void 0;
const _ = __importStar(require("lodash"));
const types_1 = require("../types");
function initCards() {
    return [
        {
            id: 'BRAIN_JUICE',
            points: 2,
            price: 4,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 2
                }
            ]
        },
        {
            id: 'TESLA_SHOCKER',
            points: 1,
            price: 0,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'FLYING_CAR',
            points: 3,
            price: 4,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 2
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 2
                }
            ]
        },
        {
            id: 'VIRUS',
            points: 2,
            price: 5,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'TELEPORT',
            points: 3,
            price: 5,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'TWIN_ROBOTS',
            points: 3,
            price: 12,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                }
            ]
        },
        {
            id: 'MYELOPHONE',
            points: 3,
            price: 6,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 2
                }
            ]
        },
        {
            id: 'NANOROBOTS',
            points: 3,
            price: 5,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 2
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 2
                }
            ]
        },
        {
            id: 'CRYOCAMERA',
            points: 3,
            price: 4,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'SENTIENT_AI',
            points: 3,
            price: 10,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.CARD
                }
            ]
        },
        {
            id: 'EXCITING_GAME',
            points: 1,
            price: 0,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 4
                }
            ]
        },
        {
            id: 'ROBOCAT',
            points: 1,
            price: 0,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 2
                }
            ]
        },
        {
            id: 'CAT_SANDWICH_SHAFT',
            points: 2,
            price: 0,
            effects: []
        },
        {
            id: 'HYPNORAY',
            points: 1,
            price: 1,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'SYNCHROPHASOTRON',
            points: 2,
            price: 2,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'ROBOT_HELPER',
            points: 2,
            price: 6,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                }
            ]
        },
        {
            id: 'MASKING_DEVICE',
            points: 3,
            price: 4,
            effects: []
        },
        {
            id: 'APHRODISIAC',
            points: 2,
            price: 7,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 8
                }
            ]
        },
        {
            id: 'TIME_PROBE',
            points: 3,
            price: 7,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.SPY
                }
            ]
        },
        {
            id: 'BEASTMAN',
            points: 4,
            price: 7,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'BINDWEED_MUTANT',
            points: 4,
            price: 8,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 2
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 2
                }
            ]
        },
        {
            id: 'X-RAY_GLASSES',
            points: 3,
            price: 7,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                }
            ]
        },
        {
            id: 'SUNEXTINGUISHER',
            points: 3,
            price: 10,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'GMO_VIRUS',
            points: 4,
            price: 8,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'GENMANIPULATOR',
            points: 4,
            price: 8,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'ROY_PIDRIL',
            points: 4,
            price: 8,
            effects: []
        },
        {
            id: 'INFECTED_LOCUST',
            points: 4,
            price: 8,
            effects: []
        },
        {
            id: 'ANTIGRAVITY_SUIT',
            points: 3,
            price: 9,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 4
                }
            ]
        },
        {
            id: 'TOXIC_FLOWERS',
            points: 3,
            price: 9,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 2
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 4
                }
            ]
        },
        {
            id: 'FROZEN_RAY',
            points: 4,
            price: 10,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 3
                }
            ]
        },
        {
            id: 'NOZZLEGUN',
            points: 4,
            price: 10,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'CLONING_DEVICE',
            points: 5,
            price: 10,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'EXCHANGER_BRAINS',
            points: 4,
            price: 9,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                }
            ]
        },
        {
            id: 'UNIVERSAL_SOLVENT',
            points: 4,
            price: 14,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'AGING_RAY',
            points: 4,
            price: 11,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'TIME_MACHINE',
            points: 4,
            price: 11,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'FRANKIE',
            points: 5,
            price: 11,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'INVISIBLE_RAY',
            points: 3,
            price: 7,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 2
                }
            ]
        },
        {
            id: 'PANACEA',
            points: 3,
            price: 11,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'PARALYZING_RAY',
            points: 4,
            price: 12,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'SEISMIC_GENERATOR',
            points: 5,
            price: 12,
            effects: []
        },
        {
            id: 'WEATHER_CONTROL',
            points: 5,
            price: 12,
            effects: []
        },
        {
            id: 'ISE_MELTER',
            points: 5,
            price: 12,
            effects: []
        },
        {
            id: 'SECRET_SHELTER',
            points: 0,
            price: 12,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.POINT,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                }
            ]
        },
        {
            id: 'MOON_BASE',
            points: 5,
            price: 13,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 3,
                    delimiter: types_1.EffectDelimiter.CARD
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.CARD
                }
            ]
        },
        {
            id: 'GENERATOR_TSUNAMI',
            points: 5,
            price: 12,
            effects: []
        },
        {
            id: 'VOLCANO_ACTIVATOR',
            points: 5,
            price: 12,
            effects: []
        },
        {
            id: 'MIND_CONTROL_SATELLITE',
            points: 3,
            price: 8,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'BLINDING_RAY',
            points: 5,
            price: 13,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 3
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 3
                }
            ]
        },
        {
            id: 'ACTIVATOR_HEIGHT',
            points: 4,
            price: 9,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 2
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 2
                }
            ]
        },
        {
            id: 'REDUCING_RAY',
            points: 5,
            price: 13,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'HYPERTUNNEL',
            points: 6,
            price: 14,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        },
        {
            id: 'SNOW_MACHINE',
            points: 6,
            price: 16,
            effects: []
        },
        {
            id: 'ASTEROID_IN_ORBIT',
            points: 6,
            price: 16,
            effects: []
        },
        {
            id: 'DEATH_RAY',
            points: 6,
            price: 16,
            effects: []
        },
        {
            id: 'KRAKEN',
            points: 6,
            price: 16,
            effects: []
        },
        {
            id: 'OZONE_EXTERMINATOR',
            points: 6,
            price: 16,
            effects: []
        },
        {
            id: 'PYANI',
            points: 5,
            price: 15,
            effects: [
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 1,
                    delimiter: types_1.EffectDelimiter.INVENTION
                }
            ]
        },
        {
            id: 'OZHIVITEL',
            points: 7,
            price: 19,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: true,
                    count: 2
                }
            ]
        },
        {
            id: 'ANDROID',
            points: 7,
            price: 19,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'SPACE_ELEVATOR',
            points: 8,
            price: 24,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.SELF,
                    object: types_1.EffectObject.CARD,
                    positive: true,
                    count: 1
                }
            ]
        },
        {
            id: 'DOOMSDAY_MACHINE',
            points: 8,
            price: 22,
            effects: [
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.CARD,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.COIN,
                    positive: false,
                    count: 1
                },
                {
                    target: types_1.EffectTarget.OTHERS,
                    object: types_1.EffectObject.SPY,
                    positive: false,
                    count: 1
                }
            ]
        }
    ];
}
exports.initCards = initCards;
function shuffle(deck) {
    return _.shuffle(deck);
}
exports.shuffle = shuffle;
//# sourceMappingURL=deck-utils.js.map