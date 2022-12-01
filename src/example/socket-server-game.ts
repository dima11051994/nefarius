import * as net from 'net'
import { Engine } from '../engine'
import { Action, InventionCard, PlayerStats, Turn, User } from '../types'
import _ from 'lodash'

export enum PlayerStatus {
  REGISTERED,
  STARTED,
  ERROR
}

export enum Method {
  GIVE_CARDS,
  TAKE_OFF_CARDS,
  RETURN_SPY,
  SEND_SPY,
  CANCEL_SEND_SPY,
  SET_COINS,
  TURN,
  STATS
}

export interface SocketMessage {
  method: Method
  action?: Action
  cards?: InventionCard[]
  cardIds?: string[]
  turn?: Turn
  count?: number
  stats?: PlayerStats
}

export class SocketPlayer implements User {
  socket: net.Socket
  waitingFunction: ((answer: SocketMessage) => void) | null = null
  pendingCommand: Method | null = null

  constructor (socket: net.Socket) {
    this.socket = socket
    socket.on('data', (data) => this._socketDataHandler(data))
  }

  async cancelPlaceSpy (field: Action): Promise<void> {
    return await Promise.resolve()
  }

  async statistics (stats: PlayerStats): Promise<void> {
    return await Promise.resolve()
  }

  buffer: string = ''

  _socketDataHandler (chunk: Buffer): void {
    const data: string = this.buffer + chunk.toString()
    const messages = data.split('\r')
    if (messages.length === 1) {
      this.buffer = data
    } else {
      this.buffer = messages.pop() ?? ''
      if (this.pendingCommand === null) {
        return
      }
      for (const messageStr of messages) {
        const message: SocketMessage = JSON.parse(messageStr)
        if (message.method === this.pendingCommand && this.waitingFunction !== null) {
          this.waitingFunction(message)
        }
      }
    }
  }

  async waitForAnswer (method: Method): Promise<SocketMessage> {
    // Wait for another operation to complete
    while (this.waitingFunction !== null) {
      await sleep(1000)
    }
    return await new Promise((resolve) => {
      this.waitingFunction = (answer: SocketMessage) => {
        this.waitingFunction = null
        this.pendingCommand = null
        resolve(answer)
      }
      this.pendingCommand = method
    })
  }

  async giveCards (cards: InventionCard[]): Promise<void> {
    await this.socket.write(JSON.stringify({ method: Method.GIVE_CARDS, cards: cards }) + '\r')
    await this.waitForAnswer(Method.GIVE_CARDS)
  }

  async returnSpy (): Promise<Action> {
    await this.socket.write(JSON.stringify({ method: Method.RETURN_SPY }) + '\r')
    let answer
    do {
      answer = await this.waitForAnswer(Method.RETURN_SPY)
    } while (answer.action === undefined)
    return answer.action
  }

  async placeSpy (): Promise<Action> {
    await this.socket.write(JSON.stringify({ method: Method.SEND_SPY }) + '\r')
    let answer
    do {
      answer = await this.waitForAnswer(Method.SEND_SPY)
    } while (answer.action === undefined)
    return answer.action
  }

  async setCoins (money: number): Promise<void> {
    await this.socket.write(JSON.stringify({ method: Method.SET_COINS, count: money }) + '\r')
    await this.waitForAnswer(Method.SET_COINS)
  }

  async takeOffCards (count: number): Promise<string[]> {
    await this.socket.write(JSON.stringify({ method: Method.TAKE_OFF_CARDS, count: count }) + '\r')
    let answer
    do {
      answer = await this.waitForAnswer(Method.TAKE_OFF_CARDS)
    } while (answer.cardIds === undefined)
    return answer.cardIds
  }

  async turn (): Promise<Turn> {
    await this.socket.write(JSON.stringify({ method: Method.TURN }) + '\r')
    let answer
    do {
      answer = await this.waitForAnswer(Method.TURN)
    } while (answer.turn === undefined)
    return answer.turn
  }
}

const PORT = 11051
const EXPECTED_PLAYERS = 2

const players: SocketPlayer[] = []
let engine: Engine

export async function main (): Promise<number> {
  const server = net.createServer((socket) => {
    console.log('Connected new client')
    if (players.length >= EXPECTED_PLAYERS) {
      socket.write(JSON.stringify({ status: PlayerStatus.ERROR, message: 'This game is full' }) + '\r')
      socket.end()
    } else {
      players.push(new SocketPlayer(socket))
      socket.write(JSON.stringify({ status: PlayerStatus.REGISTERED, index: players.length - 1 }) + '\r')
    }
  })
  server.listen(PORT)
  while (players.length < EXPECTED_PLAYERS) {
    await sleep(1000)
  }
  for (const player of players) {
    player.socket.write(JSON.stringify({ status: PlayerStatus.STARTED }) + '\r')
  }
  engine = new Engine(players)
  const winner = await engine.start()
  return _.findIndex(players, winner)
}

async function sleep (ms: number): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}
