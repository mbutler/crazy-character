const readline = require('readline')
const { OpenAI } = require('openai')
const _ = require('lodash')
const firstnames = require('./firstname-list.json')
const lastnames = require('./surname-list.json')
const attributes = require('./attributes-list.json')
const spells = require('./spell-list.json')
const skills = require('./skill-list.json')
const missions = require('./missions-list.json')
const stories = require('./story-list.json')
const conditions = require('./conditions-list.json')
const armor = require('./armor-list.json')
const locations = require('./location-list.json')
const weapons = require('./weapon-list.json')
const mutate = require('./mutate')
const martialarts = require('./martialarts-list.json')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY.trim()
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Function to interact with OpenAI API
async function getOpenAIResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 1
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error fetching response from OpenAI API:', error)
    return null
  }
}

// Function to create epic weapons
function epicWeapon() {
  return _.sample(weapons) + ' of ' + _.sample(skills)
}

// Function to create quests
function quest() {
  return {
    story: _.sample(stories),
    locations: _.sample(locations),
    mission: _.sample(missions)
  }
}

// Define the sources
const sources = [
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

// Function to spawn a scenario
function spawnScenario() {
  const howManySources = _.sample([2, 3])
  const chosen = _.sampleSize(sources, howManySources)

  const scenarioSeeds = chosen.map(src => ({
    from: src.name,
    value: src.pick()
  }))

  return scenarioSeeds
}

// Function to build the prompt
function buildPrompt(input, data) {
  return `
You are creating short, transactional RPG tasks that incorporate disparate elements into a cohesive scenario. 
For each set of data provided:

1. Use the provided "input" as a starting parameter. Integrate it meaningfully with the new data, ensuring a seamless and creative connection.
2. Blend every element from the new data meaningfully. Ensure no item is omitted or underutilized.
3. Structure:
   - Include "description" to provide a concise and relevant setup for the task.
   - Clearly state "task" as the actionable challenge for the player.
   - Provide a clear "success" outcome for accomplishing the task.
   - Provide a clear "failure" outcome for not accomplishing the task.
4. Keep it concise and focused—no excess narrative or repetition of the input. Focus on creating short, actionable scenarios.
5. Maintain creative and abductive reasoning, finding hidden or surprising connections between the "input" and the new data.
6. Output the task in JSON format with the following fields:
   - "description"
   - "task"
   - "success"
   - "failure"

Input: "${input}"
Data: ${JSON.stringify(data)}
  `
}

// Prompt user to choose success or failure
function askUserForNextInput(result) {
  return new Promise((resolve) => {
    rl.question(
      "Choose the next input (type 'success' or 'failure'): ",
      (answer) => {
        if (answer.toLowerCase() === "success" && result.success) {
          resolve(result.success)
        } else if (answer.toLowerCase() === "failure" && result.failure) {
          resolve(result.failure)
        } else {
          console.log("Invalid choice or missing field. Defaulting to success.")
          resolve(result.success || result.failure)
        }
      }
    )
  })
}

// Main function to chain scenarios
async function main() {
  let input = "The beginning of the adventure." // Starting input

  for (let i = 0; i < 5; i++) { // Adjust the loop count as needed
    const newScenario = spawnScenario()
    const prompt = buildPrompt(input, newScenario)
    const response = await getOpenAIResponse(prompt)

    if (!response) {
      console.error('Failed to generate a response. Ending the process.')
      break
    }

    try {
      const result = JSON.parse(response)
      console.log('Generated Scenario:', result)

      // Ask user for the next input
      input = await askUserForNextInput(result)
    } catch (error) {
      console.error('Error parsing JSON response:', error)
      break
    }
  }

  rl.close() // Close the readline interface
}

main()
