import { getOpenAIResponse } from '../openai/client.js'

/**
 * Generates a dice challenge as JSON based on a given task.
 * The GPT prompt instructs the model to output a JSON object with two keys:
 *  - "challenge": the full text of the dice challenge
 *  - "outcome": either "success" or "failure"
 *
 * @param {string} taskText - The scenario's task text.
 * @returns {Promise<{challenge: string, outcome: string}>}
 */
export async function generateDiceChallenge(taskText) {
  const diceChallengePrompt = `
Prompt: Quick Dice Challenge Creator

Create a quick dice challenge in 1-3 rolls using polyhedral dice. The challenge is based on a unique, imaginative, and often absurd task provided by the "task": "${taskText}".

Rules:
- The challenge must be resolved in 3 distinct rolls or fewer.
- Include the following in your output:
  • Title: A short, evocative title summarizing the task.
  • Dice Needed: List which polyhedral dice are required.
  • The Challenge: A short description of the situation and the rules for each roll.
  • Outcome: A narrative of what happens based on the number of successes.
- Each roll must have success and failure conditions tied to narrative outcomes, and players must succeed at 2 out of 3 rolls to win.
- The tone should be clever, creative, and engaging—lean into the absurdity or drama.
- Simulate the dice challenge outcome by assuming 3 rolls with a 50/50 chance per roll. A total of 2 or more successes results in an overall outcome of "success", otherwise "failure".

Output the result in the following strict JSON format without any additional text:

{
  "challenge": "<full text of the dice challenge>",
  "outcome": "<success or failure>"
}

Ensure that the outcome is exactly either "success" or "failure".
  `
  const response = await getOpenAIResponse(diceChallengePrompt)
  try {
    const parsed = JSON.parse(response)
    return parsed
  } catch (error) {
    console.error("Error parsing dice challenge response:", error)
    // Fallback: simulate a random outcome if parsing fails
    return {
      challenge: "Dice challenge could not be generated. Using fallback simulation.",
      outcome: Math.random() < 0.5 ? "success" : "failure"
    }
  }
}
