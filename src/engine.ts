import { initCards, shuffle } from './utils/deck-utils'
import { Action, EffectDelimiter, EffectObject, InventionCard, Player, PlayerPublic, Turn, User } from './types'
import EventEmitter from 'events'

export class Engine extends EventEmitter {
  players: Player[]
  activeDeck: InventionCard[]
  usedDeck: InventionCard[]
  options: any

  // TODO: Define necessary options
  constructor(users: User[], options: any) {
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

  async start(): Promise<User> {
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

  getCurrentStandings(): PlayerPublic[] {
    return this.players.map((player) => ({
      money: player.money,
      points: player.points,
      inventions: player.inventions,
      activeSpies: player.activeSpies
    }))
  }

  private async _distributeCards(): Promise<void> {
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

  private async _playRound(): Promise<void> {
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
  private async _processSpies(turns: Turn[]): Promise<void> {
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

  private async _espionagePhase(userTurns: Turn[]): Promise<void> {
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

  private async _inventionPhase(userTurns: Turn[]): Promise<void> {
    // TODO: Process turn for players who have chosen invention, process effects
  }

  private async _researchPhase(userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.RESEARCH) {
        return
      }
      let card = this.activeDeck.pop()
      if (card !== undefined) {
        this.players[index].cards.push(card)
        await this.players[index].user.giveCards([card])
      } else {
        this.activeDeck = this.usedDeck
        this.usedDeck = []
        this.activeDeck = shuffle(this.activeDeck)
        card = this.activeDeck.pop()
        if (card !== undefined) {
          this.players[index].cards.push(card)
          await this.players[index].user.giveCards([card])
        } else {
          this.emit('emptyDeck')
        }
      }
      this.players[index].money += 2
      await this.players[index].user.setMoney(this.players[index].money)
      this.emit('research', index)
    }))
  }

  private async _jobPhase(userTurns: Turn[]): Promise<void> {
    await Promise.all(userTurns.map(async (turn, index) => {
      if (userTurns[index].action !== Action.JOB) {
        return
      }
      this.players[index].money += 4
      await this.players[index].user.setMoney(this.players[index].money)
      this.emit('job', index)
    }))
  }

  private _recalculatePoints(): void {
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

  private _findWinner(): User | null {
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

  private async canPlaceSpy(action: Action, money: number) {
    const response = action
    switch (response) {
      case Action.JOB:
        return money > 0
      case Action.INVENTION:
        return money > 1
      default :
        return true
    }
  }
}
