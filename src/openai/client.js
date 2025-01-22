import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY.trim()
})

const openai = new OpenAIApi(configuration)

export async function getOpenAIResponse(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 1
    })

    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error fetching response from OpenAI API:', error)
    return null
  }
}
