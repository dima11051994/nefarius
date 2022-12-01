import { initCards, shuffle } from './utils/deck-utils'
import {
  Action,
  EffectDelimiter,
  EffectObject,
  EffectTarget,
  InventionCard,
  InventionEffect,
  Law,
  LawPhase,
  PlayerStats,
  Turn,
  User
} from './types'
import EventEmitter from 'events'
import Player from './player'

interface GameSettings {
  initialCoins: number
  initialCards: number
  researchCards: number
  researchCoins: number
  jobCoins: number
  winnerPoints: number
}

export class Engine extends EventEmitter {
  #players: Player[]
  #activeLaws: Law[]
  #activeDeck: InventionCard[]
  #usedDeck: InventionCard[]
  #options: GameSettings
  // Turns that players selected in a previous round
  #previousTurns: Turn[]

  // TODO: Define necessary options
  constructor (users: User[]) {
    super()
    this.#players = users.map((user) => new Player(user))
    this.#options = {
      initialCoins: 10,
      initialCards: 3,
      researchCards: 1,
      researchCoins: 2,
      jobCoins: 4,
      winnerPoints: 20
    }
    this.#activeDeck = initCards()
    this.#usedDeck = []
    this.#activeLaws = []
    this.#previousTurns = []
  }

  async start (): Promise<User> {
    this.#activeDeck = shuffle(this.#activeDeck)
    this.#activeLaws = shuffle(this.#initLaws()).slice(0, 2)
    // Play laws that affect core game settings
    await this.#playLawActions(LawPhase.BEFORE_START)
    await this.#distributeCards()
    const initialCoins = this.#options.initialCoins
    await Promise.all(this.#players.map(async (player) => await player.addCoins(initialCoins)))
    let winner: User | null = null
    do {
      this.emit('standings', this.getCurrentStandings())
      await this.#playRound()
      winner = this.#findWinner()
    } while (winner == null)
    return winner
  }

  getCurrentStandings (): PlayerStats[] {
    return this.#players.map((player) => player.getStats())
  }

  /**
   *
   * @private
   */
  async #distributeCards (): Promise<void> {
    // Give initial invention cards to every player
    const initialCards: InventionCard[] = []
    for (let i = 0; i < this.#options.initialCards * this.#players.length; i++) {
      // Go through every player and give one card at a time
      const card = this.#activeDeck.pop()
      if (card !== undefined) {
        initialCards.push(card)
      }
    }
    // Distribute these cards to users
    await Promise.all(this.#players.map(
      async (player, index) => await player.addCards(
        // Give every {ind} card to player {ind}
        ...initialCards.filter((value, cardIndex) => (cardIndex - index) % this.#players.length === 0)
      )
    ))
  }

  async #playRound (): Promise<void> {
    await this.#playLawActions(LawPhase.BEFORE_TURN)
    const userTurns: Turn[] = await Promise.all(this.#players.map(async (player) => await player.turn()))
    await this.#playLawActions(LawPhase.ON_ACTION_SELECT, userTurns)
    this.emit('turn', userTurns)
    await this.#processSpies(userTurns)
    await this.#espionagePhase(userTurns)
    await this.#inventionPhase(userTurns)
    await this.#playLawActions(LawPhase.AFTER_INVENTION, userTurns)
    await this.#researchPhase(userTurns)
    await this.#playLawActions(LawPhase.AFTER_RESEARCH, userTurns)
    await this.#jobPhase(userTurns)
    // Play law actions that affect end of a turn
    await this.#playLawActions(LawPhase.AFTER_TURN, userTurns)
    this.#previousTurns = userTurns
  }

  /**
   * Play law actions for the specific phase
   * @param phase
   * @param turns
   * @private
   */
  async #playLawActions (phase: LawPhase, turns?: Turn[]): Promise<void> {
    const actions: Array<(turns?: Turn[]) => Promise<void>> = []
    for (const law of this.#activeLaws) {
      actions.push(...(
        law.effects
          .filter((effect) => effect.phase === phase)
          .map((effect) => effect.action)
      ))
    }
    for (const action of actions) {
      await action(turns)
    }
  }

  /**
   * Process current spies
   * @private
   */
  async #processSpies (turns: Turn[]): Promise<void> {
    await Promise.all(this.#players.map(async (player, index) => {
      const leftPlayerAction = turns[index === 0 ? turns.length - 1 : index - 1].action
      const rightPlayerAction = turns[index === turns.length - 1 ? 0 : index + 1].action
      // Earn 1 coin per each spy sitting on the action of player's neighbours
      const coinsEarned = await player.processSpies(leftPlayerAction, rightPlayerAction)
      this.emit('spy.earn', index, coinsEarned)
    }))
  }

  /**
   * Process espionage action for all who played it
   * @param userTurns {Array<Turn>} List of user turns
   * @private
   */
  async #espionagePhase (userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map((turn, index) => {
      if (userTurns[index].action !== Action.ESPIONAGE) {
        return
      }
      return this.#players[index].placeSpy()
        .then((action) => {
          if (action === undefined) {
            this.emit('spies.over', index)
          }
          this.emit('espionage', index)
        })
    }))
  }

  async #inventionPhase (userTurns: Turn[]): Promise<void> {
    const inventions = await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.INVENTION || turn.card === undefined) {
        return
      }
      return await this.#players[index].invent(turn.card)
    }))
    for (let i = 0; i < this.#players.length; i++) {
      const effects = (inventions[i]?.effects ?? []).filter((effect) => effect.target === EffectTarget.SELF)
      // iterate through other's played cards, add effects with target `others`
      let j = i + 1
      do {
        effects.push(...((inventions[j]?.effects ?? []).filter((effect) => effect.target === EffectTarget.OTHERS)))
        j++
        // Start from the beginning as it is a circle of players
        if (j >= this.#players.length) {
          j = 0
        }
      } while (j !== i)
      for (const effect of effects) {
        await this.#playEffect(this.#players[i], effect)
      }
    }
  }

  async #researchPhase (userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.RESEARCH) {
        return
      }
      await this.#giveCardsToPlayer(this.#players[index], this.#options.researchCards)
      await this.#players[index].addCoins(this.#options.researchCoins)
      this.emit('research', index)
    }))
  }

  async #jobPhase (userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.JOB) {
        return
      }
      await this.#players[index].addCoins(this.#options.jobCoins)
      this.emit('job', index)
    }))
  }

  #findWinner (): User | null {
    const winnerCandidates = this.#players
      .filter((player) => player.points >= this.#options.winnerPoints)
      .sort((a, b) => {
        if (a.points > b.points) {
          return -1
        }
        if (a.points < b.points) {
          return 1
        }
        // TODO: are we checking this?
        if (a.inventions.length > b.inventions.length) {
          return -1
        }
        if (a.inventions.length < b.inventions.length) {
          return 1
        }
        return 0
      })
    if (winnerCandidates.length > 0) {
      return winnerCandidates[0].user
    }
    return null
  }

  /**
   * Give to user the specified number of cards from the deck.
   * If deck becomes empty, get used cards deck, shuffle and continue
   * @param player {Player} Player instance
   * @param count {Number} How many cards to give
   * @private
   */
  async #giveCardsToPlayer (player: Player, count: number): Promise<void> {
    const cards: InventionCard[] = []
    for (let i = 0; i < count; i++) {
      let card = this.#activeDeck.pop()
      if (card !== undefined) {
        cards.push(card)
      } else {
        this.#activeDeck = shuffle(this.#usedDeck)
        this.#usedDeck = []
        card = this.#activeDeck.pop()
        if (card !== undefined) {
          cards.push(card)
        } else {
          this.emit('emptyDeck')
          break
        }
      }
    }
    await player.addCards(...cards)
  }

  async #playEffect (player: Player, effect: InventionEffect): Promise<void> {
    const delimiter = this.#calculateEffectDelimiter(effect.delimiter, player)
    const count = delimiter * effect.count
    switch (effect.object) {
      case EffectObject.COIN:
        await this.#playCoinEffect(effect.positive, count, player)
        break
      case EffectObject.CARD:
        await this.#playCardEffect(effect.positive, count, player)
        break
      case EffectObject.SPY:
        await this.#playSpyEffect(effect.positive, count, player)
        break
    }
  }

  // TODO: Move to utils after creating Player class declaration to avoid circular dependencies
  /**
   * Calculate invention effect delimiter value. Return 1 if effect doesn't have a delimiter
   * @param delimiter
   * @param player
   * @private
   */
  #calculateEffectDelimiter (delimiter: EffectDelimiter | undefined, player: Player): number {
    switch (delimiter) {
      case EffectDelimiter.SPY:
        return 5 - player.spies
      case EffectDelimiter.CARD:
        return player.cards
      case EffectDelimiter.INVENTION:
        return player.inventions.length
      // Default case is when there is no delimiter
      default:
        return 1
    }
  }

  /**
   * Play invention effect for coins. Add or take {count} coins.
   * @param positive {boolean} Add coins if true, take otherwise
   * @param count {number}
   * @param player {Player}
   * @private
   */
  async #playCoinEffect (positive: boolean, count: number, player: Player): Promise<void> {
    return await (positive ? player.addCoins(count) : player.takeCoins(count))
  }

  /**
   * Play invention effect for cards. Add or take {count} cards.
   * @param positive {boolean} Add coins if true, take otherwise
   * @param count {number}
   * @param player {Player}
   * @private
   */
  async #playCardEffect (positive: boolean, count: number, player: Player): Promise<void> {
    if (positive) {
      await this.#giveCardsToPlayer(player, count)
    } else {
      const takenOffCards = await player.takeCards(count)
      this.#usedDeck.push(...takenOffCards)
    }
  }

  async #playSpyEffect (positive: boolean, count: number, player: Player): Promise<void> {
    for (let i = 0; i < count; i++) {
      const field = await (positive ? player.placeSpy(true) : player.returnSpy())
      // Can't place or return spy, do nothing further
      if (field === undefined) {
        break
      }
    }
  }

  #initLaws (): Law[] {
    return [
      {
        id: 'ALIEN_CONTACTS',
        effects: [
          {
            phase: LawPhase.AFTER_TURN,
            action: async (turns?: Turn[]): Promise<void> => {
              // If turns were not specified, do nothing - but it is an error case
              if (turns === undefined) {
                return
              }
              for (let i = 0; i < turns.length; i++) {
                // For every player who played invention, throw away all invention cards and give new
                if (turns[i]?.action === Action.INVENTION) {
                  const count = this.#players[i].cards
                  await this.#players[i].takeCards(count)
                  await this.#giveCardsToPlayer(this.#players[i], count)
                }
              }
            }
          }
        ]
      },
      {
        id: 'FIRE_WATER_WHITE_MOUSE',
        effects: [
          {
            phase: LawPhase.BEFORE_START,
            // Job action gives your 6 coins instead of 4
            action: async (): Promise<void> => {
              this.#options.jobCoins = 6
              return await Promise.resolve()
            }
          }
        ]
      },
      {
        id: 'TWO_CARROTS_METHOD',
        effects: [
          {
            phase: LawPhase.AFTER_RESEARCH,
            action: async (turns?: Turn[]): Promise<void> => {
              // If turns were not specified, do nothing - but it is an error case
              if (turns === undefined) {
                return
              }
              for (let i = 0; i < turns.length; i++) {
                // For every player who played research, give this player one more card but then take one
                if (turns[i]?.action === Action.RESEARCH) {
                  await this.#giveCardsToPlayer(this.#players[i], 1)
                  await this.#players[i].takeCards(1)
                }
              }
            }
          }
        ]
      },
      {
        id: 'BORING_ERA',
        effects: [
          {
            phase: LawPhase.ON_ACTION_SELECT,
            action: async (turns?: Turn[]): Promise<void> => {
              // If turns were not specified, do nothing - but it is an error case
              if (turns === undefined) {
                return
              }
              // If it is the first round, do nothing
              if (this.#previousTurns.length === 0) {
                return
              }
              // Force user to choose action not equal to a previous turn
              await Promise.all(turns.map(async (turn, index) => {
                let currentTurn = turn
                while (currentTurn.action === this.#previousTurns[index].action) {
                  currentTurn = await this.#players[index].turn()
                }
                // Modify turn as law may not allow some actions
                turns[index] = currentTurn
              }))
            }
          }
        ]
      },
      {
        id: 'SCIENTIFIC_RACE',
        effects: [
          {
            phase: LawPhase.AFTER_INVENTION,
            action: async (turns?: Turn[]) => {
              // If turns were not specified, do nothing - but it is an error case
              if (turns === undefined) {
                return
              }
              for (let i = 0; i < turns.length; i++) {
                /*
                For every player who played invention, check if that invention gave user more points than any other
                previously played. If so, give user 2 coins
                */
                const turn = turns[i]
                if (turn?.card !== undefined && turn.action === Action.INVENTION) {
                  const pointsGave = this.#players[i].calculateInventionPoints(turn.card)
                  let isBiggest = true
                  for (const invention of this.#players[i].inventions) {
                    if (invention.id !== turn.card.id && this.#players[i].calculateInventionPoints(invention) >= pointsGave) {
                      isBiggest = false
                      break
                    }
                  }
                  if (isBiggest) {
                    await this.#players[i].addCoins(2)
                  }
                }
              }
            }
          }
        ]
      },
      {
        id: 'PAY_OFFS',
        effects: [
          {
            phase: LawPhase.BEFORE_TURN,
            action: async () => {
              for (const player of this.#players) {
                // At the beginning of the round, if player has more than 5 coins, take coins to leave player with number divided by 5
                if (player.coins > 5) {
                  await player.takeCoins(player.coins % 5)
                }
              }
            }
          }
        ]
      }
    ]
  }
}
