const _ = require("lodash")
const firstnames = require("./firstname-list.json")
const lastnames = require("./surname-list.json")
const attributes = require("./attributes-list.json")
const spells = require("./spell-list.json")
const skills = require("./skill-list.json")
const missions = require("./missions-list.json")
const stories = require("./story-list.json")
const conditions = require("./conditions-list.json")
const armor = require("./armor-list.json")
const locations = require("./location-list.json")
const weapons = require("./weapon-list.json")
const mutate = require("./mutate")
const martialarts = require("./martialarts-list.json")

function epicWeapon() {
    let weapon = ""
    weapon += _.sample(weapons) + " of " + _.sample(skills)
    return weapon
}

function quest() {
    let quest = {}
    quest.story = _.sample(stories)
    quest.locations = _.sample(locations)
    quest.mission = _.sample(missions)
    return quest
}

function spawn() {
    let attributeList = _.sampleSize(attributes, 6)
    let agent = {}
    agent.name = `${_.sample(firstnames)} ${_.sample(lastnames)}`
    agent.spirit_animal = mutate.create()    
    agent.attributes = _.map(attributeList, (attribute) => {return {name: attribute, value: _.random(1, 100)}})
    agent.weapons = _.sampleSize(weapons, 1)
    agent.armor = _.sampleSize(armor, 1)
    agent.skills = _.sampleSize(skills, 1)
    agent.spells = _.sampleSize(spells, 1)
    agent.martialarts = _.sampleSize(martialarts, 1)
    agent.epicWeapon = epicWeapon()
    agent.quest = quest()
    return agent
}





console.log(`
${JSON.stringify(spawn(), null, 4)}
`)
