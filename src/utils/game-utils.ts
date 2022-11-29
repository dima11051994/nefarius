import { Action } from '../types'

/**
 * Return number of coins to pay to place spy to a specific action field
 * @param action {Action} field where spy is going to be placed
 */
export function spyCost (action: Action): number {
  switch (action) {
    case Action.ESPIONAGE:
    case Action.RESEARCH:
      return 0
    case Action.JOB:
      return 1
    case Action.INVENTION:
      return 2
  }
}
