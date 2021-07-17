import { initCards, shuffle } from './utils/deck-utils'
import {
  Action,
  EffectDelimiter,
  EffectObject,
  EffectTarget,
  InventionCard,
  Player,
  PlayerPublic,
  Turn,
  User
} from './types'
import EventEmitter from 'events'

export class Engine extends EventEmitter {
  players: Player[]
  activeDeck: InventionCard[]
  usedDeck: InventionCard[]
  options: any

  // TODO: Define necessary options
  constructor (users: User[], options: any) {
    super()
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
    await this._distributeCards()
    await Promise.all(this.players.map(async (player) => await player.user.setMoney(player.money)))
    let winner: User | null = null
    do {
      this.emit('standings', this.getCurrentStandings())
      await this._playRound()
      this._recalculatePoints()
      winner = this._findWinner()
    } while (winner == null)
    return winner
  }

  getCurrentStandings (): PlayerPublic[] {
    return this.players.map((player) => ({
      money: player.money,
      points: player.points,
      inventions: player.inventions,
      activeSpies: player.activeSpies
    }))
  }

  private async _distributeCards (): Promise<void> {
    // Give 4 initial invention cards to every player
    for (let i = 0; i < 4; i++) {
      // Go through every user and give one card at a time
      for (const player of this.players) {
        const card = this.activeDeck.pop()
        if (card !== undefined) {
          player.cards.push(card)
        }
      }
    }
    // Distribute these cards to users
    await Promise.all(this.players.map(async (player) => await player.user.giveCards(player.cards)))
  }

  private async _playRound (): Promise<void> {
    const userTurns: Turn[] = await Promise.all(this.players.map(async (player) => await player.user.turn()))
    this.emit('turn', userTurns)
    await this._processSpies(userTurns)
    await this._espionagePhase(userTurns)
    await this._inventionPhase(userTurns)
    await this._researchPhase(userTurns)
    await this._jobPhase(userTurns)
  }

  /**
   * Process current spies
   * @private
   */
  private async _processSpies (turns: Turn[]): Promise<void> {
    await Promise.all(this.players.map(async (player, index) => {
      const leftPlayerAction = turns[index === 0 ? turns.length - 1 : index - 1].action
      const rightPlayerAction = turns[index === turns.length - 1 ? 0 : index + 1].action
      // Earn 1 coin per each spy sitting on the action of player's neighbours
      const moneyEarned = player.activeSpies[leftPlayerAction] + player.activeSpies[rightPlayerAction]
      if (moneyEarned > 0) {
        player.money += moneyEarned
        await player.user.setMoney(player.money)
        this.emit('spy.earn', index, moneyEarned)
      }
    }))
  }

  private async _espionagePhase (userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.ESPIONAGE) {
        return
      }
      if (this.players[index].spies !== 0) {
        let response
        do {
          response = await this.players[index].user.sendSpy()
        }
        while (!await this.canPlaceSpy(response, this.players[index].money))
        switch (response) {
          case Action.ESPIONAGE :
            this.players[index].activeSpies[response] += 1
            this.players[index].spies -= 1
            break
          case Action.INVENTION:
            this.players[index].activeSpies[response] += 1
            this.players[index].spies -= 1
            this.players[index].money -= 2
            await this.players[index].user.setMoney(this.players[index].money)
            break
          case Action.RESEARCH:
            this.players[index].activeSpies[response] += 1
            this.players[index].spies -= 1
            break
          default:
            this.players[index].activeSpies[response] += 1
            this.players[index].spies -= 1
            this.players[index].money -= 1
            await this.players[index].user.setMoney(this.players[index].money)
            break
        }
      } else {
        this.emit('spies.over')
      }
      this.emit('espionage', index)
    }))
  }

  private async _inventionPhase (userTurns: Turn[]): Promise<void> {
    const cards: InventionCard[] = []
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.INVENTION) {
        return
      }
      if (turn.card !== undefined) {
        if (this.players[index].money >= turn.card.price) {
          this.players[index].money -= turn.card.price
          cards[index] = turn.card
        }
      }
      if (cards.length !== 0) {
        for (let i = 0; cards.length > 0; i++) {
          if (cards[i] !== undefined) {
            await this.effectsActionSelf(cards[i], i)
          }
        }
        for (let i = 0; cards.length > 0; i++) {
          if (cards[i] !== undefined) {
            await this.effectsActionOthers(cards[i], i)
          }
        }
        this.players[index].inventions.push(turn.card!)
      }
    }))
  }

  private async _researchPhase (userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.RESEARCH) {
        return
      }
      await this.issueOfCards(index, 1)
      this.players[index].money += 2
      await this.players[index].user.setMoney(this.players[index].money)
      this.emit('research', index)
    }))
  }

  private async _jobPhase (userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.JOB) {
        return
      }
      this.players[index].money += 4
      await this.players[index].user.setMoney(this.players[index].money)
      this.emit('job', index)
    }))
  }

  private _recalculatePoints (): void {
    for (const player of this.players) {
      player.points = 0
      for (const invention of player.inventions) {
        player.points += invention.points
        const pointEffects = invention.effects.filter((effect) => effect.object === EffectObject.POINT)
        for (const effect of pointEffects) {
          let points = effect.count
          switch (effect.delimiter) {
            case EffectDelimiter.CARD:
              points *= player.cards.length
              break
            case EffectDelimiter.INVENTION:
              points *= player.inventions.length
              break
            case EffectDelimiter.SPY:
              // Max spies count minus current available
              points *= 5 - player.spies
              break
          }
          player.points += points
        }
      }
    }
  }

  private _findWinner (): User | null {
    const winnerCandidates = this.players
      .filter((player) => player.points >= 10)
      .sort((a, b) => {
        if (a.points > b.points) {
          return -1
        }
        if (a.points < b.points) {
          return 1
        }
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

  private async canPlaceSpy (action: Action, money: number) {
    switch (action) {
      case Action.JOB:
        return money > 0
      case Action.INVENTION:
        return money > 1
      default :
        return true
    }
  }

  private async issueOfCards (index: number, quantity: number) {
    const cards: InventionCard[] = []
    for (let i = 0; i < quantity; i++) {
      let card = this.activeDeck.pop()
      if (card !== undefined) {
        cards.push(card)
      } else {
        this.activeDeck = this.usedDeck
        this.usedDeck = []
        this.activeDeck = shuffle(this.activeDeck)
        card = this.activeDeck.pop()
        if (card !== undefined) {
          cards.push(card)
        } else {
          this.emit('emptyDeck')
        }
      }
    }
    this.players[index].cards.push(...cards)
    await this.players[index].user.giveCards(cards)
  }

  private async effectsActionSelf (card: InventionCard, index: number) {
    for (let i = 0; card.effects.length > 0; i++) {
      if (card.effects[i].target === EffectTarget.SELF) {
        if (card.effects[i].delimiter !== undefined) {
          const delimiter = await this.effectDelimiterAction(card.effects[i].delimiter!, index)
          const count = delimiter! + card.effects[i].count
          switch (card.effects[i].object) {
            case EffectObject.MONEY:
              this.effectObjectMoney(card.effects[i].positive, count, index)
            case EffectObject.CARD:
              this.effectObjectCard(card.effects[i].positive, count, index)
            default:
              this.effectObjectSpy(card.effects[i].positive, count, index)
          }
        } else {
          switch (card.effects[i].object) {
            case EffectObject.MONEY:
              this.effectObjectMoney(card.effects[i].positive, card.effects[i].count, index)
            case EffectObject.CARD:
              this.effectObjectCard(card.effects[i].positive, card.effects[i].count, index)
            default:
              this.effectObjectSpy(card.effects[i].positive, card.effects[i].count, index)
          }
        }
      } else { return }
    }
  }

  private async effectsActionOthers (card: InventionCard, index: number) {
    for (let i = 0; card.effects.length > 0; i++) {
      if (card.effects[i].target === EffectTarget.OTHERS) {
        for (let a = 0; this.players.length > 0; i++) {
          if (index == a) {
            return
          }
          if (card.effects[i].delimiter !== undefined) {
            const delimiter = await this.effectDelimiterAction(card.effects[i].delimiter!, a)
            const count = delimiter! + card.effects[i].count
            switch (card.effects[i].object) {
              case EffectObject.MONEY:
                this.effectObjectMoney(card.effects[i].positive, count, a)
              case EffectObject.CARD:
                this.effectObjectCard(card.effects[i].positive, count, a)
              default:
                this.effectObjectSpy(card.effects[i].positive, count, a)
            }
          } else {
            switch (card.effects[i].object) {
              case EffectObject.MONEY:
                this.effectObjectMoney(card.effects[i].positive, card.effects[i].count, a)
              case EffectObject.CARD:
                this.effectObjectCard(card.effects[i].positive, card.effects[i].count, a)
              default:
                this.effectObjectSpy(card.effects[i].positive, card.effects[i].count, a)
            }
          }
        }
      } else { return }
    }
  }

  private async effectDelimiterAction (effect: EffectDelimiter, index: number) {
    if (effect == EffectDelimiter.SPY) {
      return 5 - this.players[index].spies
    } else if (effect == EffectDelimiter.CARD) {
      return this.players[index].cards.length
    } else if (effect == EffectDelimiter.INVENTION) {
      return this.players[index].inventions.length
    }
  }

  private async effectObjectMoney (positive: boolean, count: number, index: number) {
    if (positive) {
      this.players[index].money += count
    } else {
      this.players[index].money -= count
    }
  }

  private async effectObjectCard (positive: boolean, count: number, index: number) {
    if (positive) {
      await this.issueOfCards(index, count)
    } else {
      await this.players[index].user.takeOffCards(count)
    }
  }

  private async effectObjectSpy (positive: boolean, count: number, index: number) {
    if (positive) {
      for (let i = 0; count; i++) {
        if (this.players[index].spies !== 0) {
          const response = await this.players[index].user.sendSpy()
          this.players[index].activeSpies[response] += 1
          this.players[index].spies -= 1
        } else this.emit('spies over')
      }
    } else {
      for (let i = 0; count; i++) {
        if (this.players[index].spies !== 5) {
          const returspy = await this.players[index].user.returnSpy()
          this.players[index].activeSpies[returspy] -= 1
          this.players[index].spies += 1
        } else {
          this.emit('all spies')
        }
      }
    }
  }
}
