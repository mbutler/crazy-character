import _ from 'lodash'
import firstnames from '../data/firstname-list.json'
import lastnames from '../data/surname-list.json'
import attributes from '../data/attributes-list.json'
import spells from '../data/spell-list.json'
import skills from '../data/skill-list.json'
import missions from '../data/missions-list.json'
import stories from '../data/story-list.json'
import conditions from '../data/conditions-list.json'
import armor from '../data/armor-list.json'
import locations from '../data/location-list.json'
import weapons from '../data/weapon-list.json'
import martialarts from '../data/martialarts-list.json'
import * as mutate from '../mutate/mutate.js'

// Helper functions (e.g., generating epic weapons or quests)
function epicWeapon() {
  return _.sample(weapons) + ' of ' + _.sample(skills)
}

function quest() {
  return {
    story: _.sample(stories),
    locations: _.sample(locations),
    mission: _.sample(missions)
  }
}

// Each source is an object with a `name` and `pick` function
export const sources = [
  { name: 'spirit_animal', pick: () => mutate.create() },
  { name: 'attributes', pick: () => _.sample(attributes) },
  { name: 'spells', pick: () => _.sample(spells) },
  { name: 'skills', pick: () => _.sample(skills) },
  { name: 'conditions', pick: () => _.sample(conditions) },
  { name: 'armor', pick: () => _.sample(armor) },
  { name: 'locations', pick: () => _.sample(locations) },
  { name: 'weapons', pick: () => _.sample(weapons) },
  { name: 'martialarts', pick: () => _.sample(martialarts) },
  { name: 'epicWeapon', pick: epicWeapon },
  { name: 'quest', pick: quest },
  { name: 'name', pick: () => `${_.sample(firstnames)} ${_.sample(lastnames)}` }
]
