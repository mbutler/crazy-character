/**
 * Builds the prompt to be sent to OpenAI.
 * @param {string} input - The current input or story state.
 * @param {Array} data - The scenario data (objects with 'from' and 'value').
 * @returns {string} The formatted prompt for ChatGPT.
 */
export function buildPrompt(input, data) {
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
