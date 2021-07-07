import { InventionCard, initCards, shuffle } from './utils/deck-utils'

// TODO: What else is required?
export interface Player {
  turn: TurnFunc
}

export type TurnFunc = () => Promise<Turn>

export interface Turn {
  type: TurnType
  card?: InventionCard
}

export enum TurnType {
  ESPIONAGE = 1,
  INVENTION,
  RESEARCH,
  JOB
}

export class Engine {
  players: Player[]
  activeDeck: InventionCard[]
  usedDeck: InventionCard[]
  options: any

  // TODO: Define necessary options
  constructor (players: Player[], options: any) {
    // TODO: Use internal structure of players with all the necessary data populated, require from input only functions
    this.players = players
    this.options = options
    this.activeDeck = initCards()
    this.usedDeck = []
  }

  async start (): Promise<Player> {
    this.activeDeck = shuffle(this.activeDeck)
    this._distributeCards()
    let winner: Player | null = null
    do {
      await this._playRound()
      winner = this._findWinner()
    } while (winner == null)
    return winner
  }

  private _distributeCards (): void {
    // TODO: give first cards to players
  }

  private async _playRound (): Promise<void> {
    await Promise.all(this.players.map(async (player) => await player.turn()))
    // TODO: Go through player turns, process them phase by phase
  }

  /**
   * Process current spies
   * @private
   */
  private _processSpies (turns: Turn[]): void {
    // TODO: Implement me + implement spies storage
  }

  private _espionagePhase (): void {
    // TODO: Process turn for players who have chosen espionage
  }

  private _inventionPhase (): void {
    // TODO: Process turn for players who have chosen invention, process effects
  }

  private _researchPhase (): void {
    // TODO: Process turn for players who have chosen research
  }

  private _jobPhase (): void {
    // TODO: Process turn for players who have chosen job
  }

  private _findWinner (): Player | null {
    // TODO: Check every player's points, return winner if have any
    // TODO: multiple winners possibly?
    return null
  }
}
