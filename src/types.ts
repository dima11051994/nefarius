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
  // Set current user's money
  setMoney: SetMoneyFunc
  // Take off the specified number of cards from user
  takeOffCards: TakeOffCardsFunc
  // Send spy to the specified field
  sendSpy: SendSpyFunc
  // Return spy from some field
  returnSpy: ReturnSpyFunc
}

export type TurnFunc = () => Promise<Turn>
export type GiveCardsFunc = (cards: InventionCard[]) => Promise<void>
export type SetMoneyFunc = (money: number) => Promise<void>
export type TakeOffCardsFunc = (count: number) => Promise<void>
export type SendSpyFunc = () => Promise<Action>
export type ReturnSpyFunc = () => Promise<Action>

/**
 * Object that defines user's turn in the round. It should
 */
export interface Turn {
  type: Action
  card?: InventionCard
}

export enum Action {
  ESPIONAGE = 1,
  INVENTION,
  RESEARCH,
  JOB
}

export interface Player {
  // Person who will be performing some actions
  user: User
  // Current amount of money
  money: number
  // Current number of points
  points: number
  // Current cards in hands
  cards: InventionCard[]
  // Current played invention cards
  inventions: InventionCard[]
  // Current number of non-played spies
  spies: number
  // Active spies, map Action -> count of spies
  activeSpies: Record<Action, number>
}
