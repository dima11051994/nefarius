import { initCards, shuffle } from './utils/deck-utils'
import { Action, InventionCard, Player, Turn, User } from './types'

export class Engine {
  players: Player[]
  activeDeck: InventionCard[]
  usedDeck: InventionCard[]
  options: any

  // TODO: Define necessary options
  constructor (users: User[], options: any) {
    // TODO: Use internal structure of players with all the necessary data populated, require from input only functions
    this.players = []
    for (const user of users) {
      this.players.push({
        user: user,
        money: 10,
        points: 0,
        cards: [],
        inventions: [],
        spies: 5,
        activeSpies: {
          [Action.ESPIONAGE]: 0,
          [Action.INVENTION]: 0,
          [Action.RESEARCH]: 0,
          [Action.JOB]: 0
        }
      })
    }
    this.options = options
    this.activeDeck = initCards()
    this.usedDeck = []
  }

  async start (): Promise<User> {
    this.activeDeck = shuffle(this.activeDeck)
    this._distributeCards()
    let winner: User | null = null
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
    await Promise.all(this.players.map(async (player) => await player.user.turn()))
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

  private _findWinner (): User | null {
    // TODO: Check every player's points, return winner if have any
    // TODO: multiple winners possibly?
    return null
  }
}
