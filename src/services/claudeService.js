const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

export async function transformContent(content, transformType) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY

  if (!apiKey) {
    throw new Error('Claude API key not found')
  }

  const systemPrompt = getSystemPrompt(transformType)
  
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: content
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error('Failed to transform content')
  }

  const data = await response.json()
  return data.content[0].text
}

function getSystemPrompt(transformType) {
  const prompts = {
    professional: 'Remix this content to be more professional and formal.',
    casual: 'Remix this content to be more casual and conversational.',
    funny: 'Remix this content to be humorous and entertaining.',
    poetic: 'Remix this content into a poetic form.',
    tweet: 'Remix this content into a concise tweet format.'
  }
  
  return prompts[transformType] || prompts.professional
} 