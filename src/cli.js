import readline from 'readline'
import { spawnScenario } from './scenario/scenarioGenerator.js'
import { buildPrompt } from './scenario/promptBuilder.js'
import { getOpenAIResponse } from './openai/client.js'
import { generateDiceChallenge } from './scenario/diceChallenge.js'
import { promises as fs } from 'fs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * Appends a markdown-formatted string to the adventure file.
 * @param {string} md - The markdown content to append.
 */
async function appendToAdventure(md) {
  try {
    await fs.appendFile('adventure.md', md)
  } catch (error) {
    console.error('Error writing to file:', error)
  }
}

/**
 * Renders the scenario and dice challenge content in markdown.
 * @param {object} scenarioResult - The generated scenario JSON.
 * @param {object} diceChallenge - The generated dice challenge JSON.
 * @param {number} index - The current iteration index.
 * @returns {string} A markdown string.
 */
function renderMarkdown(scenarioResult, diceChallenge, index) {
  // Ensure dice challenge text is a string. If it's an object, stringify it.
  const diceText =
    typeof diceChallenge.challenge === 'string'
      ? diceChallenge.challenge
      : JSON.stringify(diceChallenge.challenge, null, 2)

  const chapterHeader = `\n\n## Scene ${index + 1}\n\n`
  const scenarioSection = `### Scenario\n\n**Description:**\n\n${scenarioResult.description}\n\n**Task:**\n\n${scenarioResult.task}\n\n`
  const diceSection = `### Dice Challenge\n\n${diceText}\n\n`
  const outcomeText =
    diceChallenge.outcome === 'success'
      ? scenarioResult.success
      : scenarioResult.failure
  const outcomeSection = `### Outcome\n\n${outcomeText}\n\n---\n`
  
  return chapterHeader + scenarioSection + diceSection + outcomeSection
}

/**
 * Runs the command-line scenario loop.
 * For each iteration:
 * 1. Generates a scenario using GPT.
 * 2. Uses the scenario's "task" field to generate a dice challenge.
 * 3. Obtains the dice challenge outcome ("success" or "failure").
 * 4. Uses the corresponding text from the scenario (scenarioResult.success or scenarioResult.failure)
 *    as the next input.
 * 5. Appends a nicely rendered markdown section of the output to a file.
 */
export async function runCLI() {
  let input = "The beginning of the adventure." // Starting input

  // Clear the file at the start (optional)
  await fs.writeFile('adventure.md', '# Crazy Character Adventure\n')

  for (let i = 0; i < 5; i++) {
    // 1. Generate a scenario using the current input and random scenario data.
    const scenarioData = spawnScenario()
    const prompt = buildPrompt(input, scenarioData)
    const response = await getOpenAIResponse(prompt)

    if (!response) {
      console.error("Failed to generate a scenario response. Ending process.")
      break
    }

    try {
      const scenarioResult = JSON.parse(response)
      console.log("\nGenerated Scenario:")
      console.log(JSON.stringify(scenarioResult, null, 2))

      // Verify that the scenario includes the necessary fields.
      if (!scenarioResult.task || !scenarioResult.success || !scenarioResult.failure) {
        console.warn('Scenario is missing a required field. Using previous input as fallback.')
      } else {
        // 2. Generate the dice challenge based on the scenario's task.
        const diceChallenge = await generateDiceChallenge(scenarioResult.task)
        console.log("\n--- Dice Challenge (JSON) ---")
        console.log(JSON.stringify(diceChallenge, null, 2))

        // 3. Use the dice challenge outcome to select the next input.
        input = diceChallenge.outcome === "success" ? scenarioResult.success : scenarioResult.failure

        // 4. Render the meaningful parts in markdown and write to file.
        const mdContent = renderMarkdown(scenarioResult, diceChallenge, i)
        await appendToAdventure(mdContent)
      }
    } catch (error) {
      console.error("Error parsing scenario JSON response:", error)
      break
    }
  }

  rl.close()
}

runCLI()
