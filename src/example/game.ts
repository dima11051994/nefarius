import { ConsoleClient } from './clients/console'
import { Engine } from '../engine'

const player: ConsoleClient = new ConsoleClient()
const engine: Engine = new Engine([player], {})
engine.start()
  .then(console.log)
  .catch(console.error)
