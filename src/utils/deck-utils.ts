import * as _ from 'lodash'
import { EffectObject, EffectTarget, InventionCard } from '../types'

export function initCards (): InventionCard[] {
  // TODO: Fill all cards here
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
          object: EffectObject.MONEY,
          positive: true,
          count: 2
        },
        {
          target: EffectTarget.SELF,
          object: EffectObject.MONEY,
          positive: true,
          count: 2
        }
      ]
    }
  ]
}

export function shuffle (deck: any[]): any[] {
  return _.shuffle(deck)
}
