declare global {
  interface ImportMetaEnv {
    readonly VITE_CLAUDE_API_KEY: string
    // Add other env variables here if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

interface ClaudeResponse {
  content: Array<{
    text: string
  }>
}

interface SystemPrompts {
  [key: string]: string
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

// Make sure this is a named export
export const transformContent = async (content: string, transformType: string): Promise<string> => {
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

  const data: ClaudeResponse = await response.json()
  return data.content[0].text
}

const getSystemPrompt = (transformType: string): string => {
  const prompts: SystemPrompts = {
    professional: 'Remix this content to be more professional and formal.',
    casual: 'Remix this content to be more casual and conversational.',
    funny: 'Remix this content to be humorous and entertaining.',
    poetic: 'Remix this content into a poetic form.',
    tweet: 'Remix this content into a concise tweet format.'
  }
  
  return prompts[transformType] || prompts.professional
}

// This keeps the type information while preventing it from being imported
export {} 