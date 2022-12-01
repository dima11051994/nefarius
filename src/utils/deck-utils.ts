import * as _ from 'lodash'
import {
  EffectDelimiter,
  EffectObject,
  EffectTarget,
  InventionCard
} from '../types'

export function initCards (): InventionCard[] {
  return [
    {
      id: 'BRAIN_JUICE',
      points: 2,
      price: 4,
      effects: [
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
          positive: true,
          count: 2
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
        }
      ]
    },
    {
      id: 'MYELOPHONE',
      points: 3,
      price: 6,
      effects: [
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: true,
          count: 2
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.SPY,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.CARD
        }
      ]
    },
    {
      id: 'EXCITING_GAME',
      points: 1,
      price: 0,
      effects: [
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
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
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.SPY
        }
      ]
    },
    {
      id: 'BEASTMAN',
      points: 4,
      price: 7,
      effects: [
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
          positive: false,
          count: 2
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
        }
      ]
    },
    {
      id: 'SUNEXTINGUISHER',
      points: 3,
      price: 10,
      effects: [
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
          positive: false,
          count: 2
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
          positive: false,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
        }
      ]
    },
    {
      id: 'UNIVERSAL_SOLVENT',
      points: 4,
      price: 14,
      effects: [
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.SPY,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.SPY,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.POINT,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
        }
      ]
    },
    {
      id: 'MOON_BASE',
      points: 5,
      price: 13,
      effects: [
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
          positive: true,
          count: 3,
          delimiter: EffectDelimiter.CARD
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: false,
          count: 1,
          delimiter: EffectDelimiter.CARD
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
          positive: false,
          count: 3
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: true,
          count: 2
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.SPY,
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
          target: EffectTarget.SELF,
          object: EffectObject.COIN,
          positive: true,
          count: 1,
          delimiter: EffectDelimiter.INVENTION
        }
      ]
    },
    {
      id: 'OZHIVITEL',
      points: 7,
      price: 19,
      effects: [
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: true,
          count: 1
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.CARD,
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
          target: EffectTarget.OTHERS,
          object: EffectObject.CARD,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.COIN,
          positive: false,
          count: 1
        },
        {
          target: EffectTarget.OTHERS,
          object: EffectObject.SPY,
          positive: false,
          count: 1
        }
      ]
    }
  ]
}

export function shuffle (deck: any[]): any[] {
  return _.shuffle(deck)
}
