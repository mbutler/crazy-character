import readline from 'readline'
import { spawnScenario } from './scenario/scenarioGenerator.js'
import { buildPrompt } from './scenario/promptBuilder.js'
import { getOpenAIResponse } from './openai/client.js'
import { generateDiceChallenge } from './scenario/diceChallenge.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * Runs the command-line scenario loop.
 * For each iteration:
 * 1. Generates a scenario using GPT.
 * 2. Uses the scenario's "task" field to generate a dice challenge.
 * 3. Obtains the dice challenge outcome ("success" or "failure").
 * 4. Uses the corresponding text from the scenario (scenarioResult.success or scenarioResult.failure)
 *    as the next input.
 */
export async function runCLI() {
  let input = "The beginning of the adventure." // Starting input

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
        // Fallback: simply reuse the existing input.
      } else {
        // 2. Generate the dice challenge based on the scenario's task.
        const diceChallenge = await generateDiceChallenge(scenarioResult.task)
        console.log("\n--- Dice Challenge (JSON) ---")
        console.log(JSON.stringify(diceChallenge, null, 2))

        // 3. Use the dice challenge outcome to select the next input.
        // If outcome is "success", then use scenarioResult.success; if "failure", use scenarioResult.failure.
        input = diceChallenge.outcome === "success" ? scenarioResult.success : scenarioResult.failure
      }
    } catch (error) {
      console.error("Error parsing scenario JSON response:", error)
      break
    }
  }

  rl.close()
}
