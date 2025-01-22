import _ from 'lodash'
import { sources } from './sources.js'

/**
 * Randomly spawns a scenario by picking 2 or 3 sources.
 * @returns {Array<{from: string, value: any}>}
 */
export function spawnScenario() {
  const howManySources = _.sample([2, 3])
  const chosen = _.sampleSize(sources, howManySources)

  return chosen.map(src => ({
    from: src.name,
    value: src.pick()
  }))
}
