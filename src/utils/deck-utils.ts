import * as _ from 'lodash'

export interface InventionCard {
  points: Number
  name: String
  effects: InventionEffect[]
}

export enum InventionTarget {
  SELF = 'SELF',
  TARGET = 'TARGET'
}

export enum EffectObject {
  MONEY = 'MONEY',
  CARD = 'CARD',
  SPY = 'SPY',
  POINT = 'POINT'
}

export enum EffectDelimiter {
  SPY = 'SPY',
  CARD = 'CARD',
  INVENTION = 'INVENTION'
}

export interface InventionEffect {
  target: InventionTarget
  positive: boolean
  object: EffectObject
  delimiter: EffectDelimiter
}

export function initCards (): InventionCard[] {
  // TODO: Fill all cards here
  return []
}

export function shuffle (deck: any[]): any[] {
  return _.shuffle(deck)
}
