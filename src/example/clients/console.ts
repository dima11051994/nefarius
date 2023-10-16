import readline, { Interface } from 'readline'
import {
  Action,
  CancelSendSpyFunc,
  EffectDelimiter,
  EffectObject,
  EffectTarget,
  InventionCard,
  InventionEffect, PlayerStats,
  SendStatisticsFunc,
  Turn,
  User
} from '../../types'

type WaitingFunction = (answer: string) => void

export class ConsoleClient implements User {
  readlineInterface: Interface
  money: number = 0
  points: number = 0
  cards: InventionCard[] = []
  inventions: InventionCard[] = []
  spies: number = 5
  activeSpies: Record<Action, number> = {
    [Action.ESPIONAGE]: 0,
    [Action.INVENTION]: 0,
    [Action.RESEARCH]: 0,
    [Action.JOB]: 0
  }

  waitingFunction: WaitingFunction | null = null
  validAnswers: string[] | null = null

  constructor () {
    this.readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout })
    this.readlineInterface.on('line', this.handleLine.bind(this))
  }

  cancelPlaceSpy (action: Action): Promise<void> {
    return Promise.resolve()
  }

  statistics (statistics: PlayerStats): Promise<void> {
    return Promise.resolve()
  }

  handleLine (line: string): void {
    if (this.waitingFunction === null || this.validAnswers === null) {
      return
    }
    if (!this.validAnswers.includes(line)) {
      console.log(`Unrecognized answer: ${line}. Supported answers: ${this.validAnswers.join(', ')}`)
    }
    this.waitingFunction(line)
  }

  async waitForAnswer (validAnswers: string[]): Promise<string> {
    // Wait for another operation to complete
    while (this.waitingFunction !== null) {
      await this.sleep(1000)
    }
    return await new Promise((resolve) => {
      this.waitingFunction = (answer: string) => {
        this.waitingFunction = null
        this.validAnswers = null
        resolve(answer)
      }
      this.validAnswers = validAnswers
    })
  }

  async sleep (ms: number): Promise<void> {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(), ms)
    })
  }

  async giveCards (cards: InventionCard[]): Promise<void> {
    console.log('Received cards: ')
    for (const card of cards) {
      console.log(this.getCardMessage(card))
      this.cards.push(card)
    }
    return await Promise.resolve()
  }

  async returnSpy (): Promise<Action> {
    console.log('Select action from where to remove your spy:')
    const response = await this.waitForAnswer(['1', '2', '3', '4', 'ESPIONAGE', 'INVENTION', 'RESEARCH', 'JOB',
      'E', 'I', 'R', 'J'])
    switch (response) {
      case '1':
      case 'ESPIONAGE':
      case 'E':
        return Action.ESPIONAGE
      case '2':
      case 'INVENTION':
      case 'I':
        return Action.INVENTION
      case '3':
      case 'RESEARCH':
      case 'R':
        return Action.RESEARCH
      case '4':
      case 'JOB':
      case 'J':
      default:
        return Action.JOB
    }
  }

  async placeSpy (): Promise<Action> {
    console.log('Select action for your spy:')
    const response = await this.waitForAnswer(['1', '2', '3', '4', 'ESPIONAGE', 'INVENTION', 'RESEARCH', 'JOB',
      'E', 'I', 'R', 'J'])
    switch (response) {
      case '1':
      case 'ESPIONAGE':
      case 'E':
        return Action.ESPIONAGE
      case '2':
      case 'INVENTION':
      case 'I':
        return Action.INVENTION
      case '3':
      case 'RESEARCH':
      case 'R':
        return Action.RESEARCH
      case '4':
      case 'JOB':
      case 'J':
      default:
        return Action.JOB
    }
  }

  async setCoins (money: number): Promise<void> {
    console.log(`Now you have ${money} coin${money === 1 ? '' : 's'}`)
    this.money = money
    return await Promise.resolve()
  }

  async takeOffCards (count: number): Promise<string[]> {
    console.log(`You need to take off ${count} card${count === 1 ? '' : 's'}`)
    if (this.cards.length <= count) {
      console.log('All your cards will be taken off')
      const result = this.cards.map((card) => card.id)
      this.cards = []
      return result
    }
    console.log('Your cards: ')
    for (const card of this.cards) {
      console.log(this.getCardMessage(card))
    }
    let removedCardIndexes: number[] = []
    const validIndexes = []
    for (let i = 0; i < this.cards.length; i++) {
      validIndexes.push((i + 1).toString())
    }
    for (let i = 0; i < Math.min(count, this.cards.length); i++) {
      console.log('Enter an index of card to remove: ')
      const index = parseInt(await this.waitForAnswer(validIndexes))
      if (removedCardIndexes.includes(index)) {
        console.log('Card is already chosen, choose another one: ')
        i--
      }
    }
    const response = []
    removedCardIndexes = removedCardIndexes.sort((a, b) => {
      if (a > b) {
        return -1
      }
      if (a < b) {
        return 1
      }
      return 0
    })
    for (const index of removedCardIndexes) {
      response.push(this.cards[index - 1].id)
      this.cards.splice(index - 1, 1)
    }

    return Promise.resolve(response)
  }

  async turn (): Promise<Turn> {
    console.log('Select action that you will perform:')
    let action: Action
    const response = await this.waitForAnswer(['1', '2', '3', '4', 'ESPIONAGE', 'INVENTION', 'RESEARCH', 'JOB',
      'E', 'I', 'R', 'J'])
    switch (response) {
      case '1':
      case 'ESPIONAGE':
      case 'E':
        action = Action.ESPIONAGE
        break
      case '2':
      case 'INVENTION':
      case 'I':
        action = Action.INVENTION
        break
      case '3':
      case 'RESEARCH':
      case 'R':
        action = Action.RESEARCH
        break
      case '4':
      case 'JOB':
      case 'J':
      default:
        action = Action.JOB
        break
    }
    const result: Turn = {
      action
    }
    if (action === Action.INVENTION) {
      console.log('Your cards: ')
      for (const card of this.cards) {
        console.log(this.getCardMessage(card))
      }
      const validIndexes = []
      for (let i = 0; i < this.cards.length; i++) {
        validIndexes.push((i + 1).toString())
      }
      console.log('Enter an index of card to invent: ')
      const index = parseInt(await this.waitForAnswer(validIndexes))
      result.card = this.cards.splice(index - 1, 1)[0]
    }
    return result
  }

  getCardMessage (card: InventionCard): string {
    let result = `{ id: ${card.id}, points: ${card.points}, price: ${card.price}`
    if (card.effects.length > 0) {
      result += `, effects: [${card.effects.map(this.getEffectMessage).join(', ')}]`
    }
    return result
  }

  getEffectMessage (effect: InventionEffect): string {
    let result = '{ '
    result += effect.target === EffectTarget.SELF ? 'self' : 'others'
    result += effect.positive ? ' + ' : ' - '
    result += effect.count.toString()
    switch (effect.object) {
      case EffectObject.CARD:
        result += ' card' + (effect.count === 1 ? '' : 's')
        break
      case EffectObject.COIN:
        result += ' coin' + (effect.count === 1 ? '' : 's')
        break
      case EffectObject.SPY:
        result += effect.count === 1 ? ' spy' : ' spies'
        break
      case EffectObject.POINT:
        result += ' point' + (effect.count === 1 ? '' : 's')
        break
    }
    if (effect.delimiter !== undefined) {
      result += ' / '
      switch (effect.delimiter) {
        case EffectDelimiter.CARD:
          result += 'card'
          break
        case EffectDelimiter.SPY:
          result += 'spy'
          break
        case EffectDelimiter.INVENTION:
          result += 'invention'
          break
      }
    }
    result += ' }'
    return result
  }
}
