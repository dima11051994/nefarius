import { ConsoleClient } from './console'
import * as net from 'net'
import { Method, SocketMessage } from '../socket-server-game'

const HOST = 'localhost'
const PORT = 11051

const consoleClient = new ConsoleClient()

const socket = new net.Socket()

socket.on('error', (err) => console.error(err))
socket.on('close', () => console.error('closed'))
socket.on('connect', () => console.log('connected'))
socket.on('data', (data) => {
  socketDataHandler(data).catch(console.error)
})

socket.connect({
  host: HOST,
  port: PORT
})

let buffer: string = ''

async function socketDataHandler (chunk: Buffer): Promise<void> {
  console.log(`Received chunk: ${chunk.toString()}`)
  const data: string = buffer + chunk.toString()
  const messages = data.split('\r')
  if (messages.length === 1) {
    buffer = data
  } else {
    buffer = messages.pop() ?? ''
    for (const messageStr of messages) {
      const message: SocketMessage = JSON.parse(messageStr)
      await messageHandler(message)
    }
  }
}

async function messageHandler (message: SocketMessage): Promise<void> {
  let answer
  switch (message.method) {
    case Method.GIVE_CARDS:
      await consoleClient.giveCards(message.cards ?? [])
      await socket.write(JSON.stringify({ method: Method.GIVE_CARDS }) + '\r')
      break
    case Method.SET_MONEY:
      await consoleClient.setMoney(message.count ?? 0)
      await socket.write(JSON.stringify({ method: Method.SET_MONEY }) + '\r')
      break
    case Method.RETURN_SPY:
      answer = await consoleClient.returnSpy()
      await socket.write(JSON.stringify({ method: Method.RETURN_SPY, action: answer }) + '\r')
      break
    case Method.SEND_SPY:
      answer = await consoleClient.sendSpy()
      await socket.write(JSON.stringify({ method: Method.SEND_SPY, action: answer }) + '\r')
      break
    case Method.TAKE_OFF_CARDS:
      answer = await consoleClient.takeOffCards(message.count ?? 0)
      await socket.write(JSON.stringify({ method: Method.TAKE_OFF_CARDS, cards: answer }) + '\r')
      break
    case Method.TURN:
      answer = await consoleClient.turn()
      await socket.write(JSON.stringify({ method: Method.TURN, turn: answer }) + '\r')
      break
  }
}
