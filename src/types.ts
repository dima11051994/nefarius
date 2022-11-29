export interface InventionCard {
  id: string
  points: number
  effects: InventionEffect[]
  price: number
}

export enum EffectTarget {
  SELF = 'SELF',
  OTHERS = 'OTHERS'
}

export enum EffectObject {
  COIN = 'COIN',
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
  target: EffectTarget
  positive: boolean
  object: EffectObject
  delimiter?: EffectDelimiter
  count: number
}

// TODO: What else is required?
export interface User {
  // Wait for a user to make a turn
  turn: TurnFunc
  // Give card(s) to a user
  giveCards: GiveCardsFunc
  // Set current user's coins
  setCoins: SetCoinsFunc
  // Take off the specified number of cards from user
  takeOffCards: TakeOffCardsFunc
  // Send spy to the specified field
  placeSpy: SendSpyFunc
  // Return spy from some field
  returnSpy: ReturnSpyFunc
}

export type TurnFunc = () => Promise<Turn>
export type GiveCardsFunc = (cards: InventionCard[]) => Promise<void>
export type SetCoinsFunc = (coins: number) => Promise<void>
export type TakeOffCardsFunc = (count: number) => Promise<string[]>
export type SendSpyFunc = () => Promise<Action>
export type ReturnSpyFunc = () => Promise<Action>

/**
 * Object that defines user's turn in the round. It should
 */
export interface Turn {
  action: Action
  card?: InventionCard
}

export enum Action {
  ESPIONAGE = 1,
  INVENTION,
  RESEARCH,
  JOB
}

export interface PlayerStats {
  coins: number
  points: number
  inventions: InventionCard[]
  activeSpies: Record<Action, number>
}
