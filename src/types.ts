import Player from './player'

export interface InventionCard {
  id: string
  points: number
  effects: InventionEffect[]
  price: number
}

export interface Law {
  id: string
  effects: [
    {
      phase: LawPhase
      action: (turns?: Turn[], player?: Player) => Promise<void>
    }
  ]
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
  // Notify that spy isn't placed to a specific field
  cancelPlaceSpy: CancelSendSpyFunc
  // Send statistics
  statistics: SendStatisticsFunc
}

export type TurnFunc = () => Promise<Turn>
export type GiveCardsFunc = (cards: InventionCard[]) => Promise<void>
export type SetCoinsFunc = (coins: number) => Promise<void>
export type TakeOffCardsFunc = (count: number) => Promise<string[]>
export type SendSpyFunc = () => Promise<Action>
export type CancelSendSpyFunc = (action: Action) => Promise<void>
export type SendStatisticsFunc = (statistics: PlayerStats) => Promise<void>
export type ReturnSpyFunc = () => Promise<Action>

/**
 * Object that defines user's turn in the round. It should
 */
export interface Turn {
  action: Action
  card?: InventionCard
  // Metadata may be filled by the engine in its own purpose
  metadata?: {
    modifiedCard?: InventionCard
  }
}

export enum Action {
  ESPIONAGE = 1,
  INVENTION,
  RESEARCH,
  JOB
}

export enum LawPhase {
  BEFORE_START,
  BEFORE_TURN,
  ON_SPY_PROCESSION,
  ON_ACTION_SELECT,
  AFTER_PLACING_SPY,
  ON_INVENTION,
  AFTER_INVENTION,
  ON_RESEARCH,
  AFTER_RESEARCH,
  AFTER_TURN
}

export interface PlayerStats {
  coins: number
  points: number
  inventions: InventionCard[]
  activeSpies: Record<Action, number>
}
