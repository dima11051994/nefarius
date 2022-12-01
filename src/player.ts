import { Action, EffectDelimiter, EffectObject, InventionCard, PlayerStats, Turn, User } from './types'
import { spyCost } from './utils/game-utils'

// TODO: Add player.d.ts to declare player class
export default class Player {
  // Current player's coins count
  #coins: number = 0
  get coins (): number {
    return this.#coins
  }

  #cards: InventionCard[] = []
  get cards (): number {
    return this.#cards.length
  }

  #inventions: InventionCard[] = []
  get inventions (): InventionCard[] {
    return this.#inventions
  }

  #spies: number = 5
  get spies (): number {
    return this.#spies
  }

  #activeSpies: Record<Action, number> = {
    [Action.ESPIONAGE]: 0,
    [Action.INVENTION]: 0,
    [Action.RESEARCH]: 0,
    [Action.JOB]: 0
  }

  get activeSpies (): Record<Action, number> {
    return this.#activeSpies
  }

  get points (): number {
    return this.#inventions.reduce((sum, invention) => sum + this.calculateInventionPoints(invention), 0)
  }

  calculateInventionPoints (invention: InventionCard): number {
    return invention.points +
      invention.effects
        .filter((effect) => effect.object === EffectObject.POINT)
        .reduce((sum, effect) => {
          let points = effect.count
          switch (effect.delimiter) {
            case EffectDelimiter.CARD:
              points *= this.#cards.length
              break
            case EffectDelimiter.INVENTION:
              points *= this.#inventions.length
              break
            case EffectDelimiter.SPY:
              // Max spies count minus current available
              points *= 5 - this.#spies
              break
          }
          return effect.positive ? sum + points : sum - points
        }, 0)
  }

  constructor (public user: User) {
  }

  /**
   * Add coins to player.
   * Notify user by setting current number of coins after performing this operation.
   * @param coins {number} Number of coins to add
   */
  async addCoins (coins: number): Promise<void> {
    // Do nothing when nothing is added
    if (coins < 1) {
      return
    }
    this.#coins += coins
    await this.user.setCoins(this.#coins)
  }

  /**
   * Take coins from player. If player doesn't have enough coins to take, just take all coins.
   * Notify user by setting current number of coins after performing this operation.
   * @param coins {number} Number of coins to take
   */
  async takeCoins (coins: number): Promise<void> {
    // Do nothing when nothing is taken
    if (coins < 1) {
      return
    }
    this.#coins = this.#coins >= coins ? this.#coins - coins : 0
    await this.user.setCoins(this.#coins)
  }

  /**
   * Add one or more cards to the player's deck. Notify user about the cards received
   * @param cards
   */
  async addCards (...cards: InventionCard[]): Promise<void> {
    this.#cards.push(...cards)
    await this.user.giveCards(cards)
  }

  /**
   * Take {count} from player's deck. Take all cards if count is more than player has.
   * Otherwise, let user choose which cards should be removed.
   * @param count {number} Number of cards to take
   */
  async takeCards (count: number): Promise<InventionCard[]> {
    // Player has no cards in deck, do nothing
    if (this.#cards.length === 0) {
      return []
    }
    let takenCardIds: string[] = []
    let takenCards: InventionCard[] = []
    do {
      takenCardIds = await this.user.takeOffCards(count)
      // We can be sure that undefined values aren't possible as we are filtering them out
      takenCards = takenCardIds
        .map((id) => this.#cards.find((card) => card.id === id))
        .filter((card) => card) as InventionCard[]
    } while (takenCards.length !== takenCardIds.length)
    this.#cards = this.#cards.filter((card) => takenCardIds.findIndex((id) => id === card.id) === -1)
    return takenCards
  }

  /**
   * Return public player statistics visible to other players
   */
  getStats (): PlayerStats {
    return {
      coins: this.#coins,
      inventions: this.#inventions,
      points: this.points,
      activeSpies: this.#activeSpies
    }
  }

  /**
   * Ask user for the next turn
   */
  async turn (): Promise<Turn> {
    return await this.user.turn()
  }

  async processSpies (left: Action, right: Action): Promise<number> {
    const earned = this.#activeSpies[left] + this.#activeSpies[right]
    if (earned > 0) {
      await this.addCoins(earned)
    }
    return earned
  }

  /**
   * Place spy to some field. Ask user for an action field where spy should be placed.
   * @param free {boolean} Specifies whether placement is free or costs some money. Usually, it is free due to invention effect.
   */
  async placeSpy (free: boolean = false): Promise<Action | undefined> {
    // No spies left, do nothing
    if (this.#spies === 0) {
      return
    }
    let field: Action
    do {
      field = await this.user.placeSpy()
      // TODO: Notify user that previous spy is returned
    } while (!this.#canPlaceSpy(field, free))
    this.#spies--
    this.#activeSpies[field]++
    if (!free) {
      await this.takeCoins(spyCost(field))
    }
    return field
  }

  /**
   * Check if it is allowed to place a spy. Allowed if free or enough coins
   * @param field
   * @param free
   * @private
   */
  #canPlaceSpy (field: Action, free: boolean): boolean {
    return free || this.#coins >= spyCost(field)
  }

  async returnSpy (): Promise<Action | undefined> {
    // No active spies, do nothing
    if (this.#spies === 5) {
      return
    }
    let field: Action
    do {
      field = await this.user.returnSpy()
    } while (this.#activeSpies[field] === 0)
    this.#activeSpies[field]--
    this.#spies++
  }

  /**
   * Invent a card that user selected. If card isn't present in the list of cards or can't be played, do nothing.
   * @param card {InventionCard} card to play
   * @returns Promise<InventionCard|undefined> played card or nothing if card wasn't played
   */
  async invent (card: InventionCard): Promise<InventionCard | undefined> {
    const cardIndex = this.#cards.findIndex((inventionCard) => inventionCard.id === card.id)
    // There is no such card, return
    if (cardIndex < 0) {
      return
    }
    // Can't buy card, do nothing just return card to user
    if (this.#coins < card.price) {
      await this.user.giveCards([card])
      return
    }
    this.#cards.splice(cardIndex, 1)
    this.#inventions.push(card)
    await this.takeCoins(card.price)
    return card
  }
}
