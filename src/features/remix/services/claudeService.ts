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
  tweets: string[];
}

const API_URL = 'http://localhost:3005/api/remix';

// Make sure this is a named export
export const transformContent = async (content: string): Promise<string[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`Failed to transform content: ${response.status} ${response.statusText}`);
    }

    const data: ClaudeResponse = await response.json();
    return data.tweets;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

// This keeps the type information while preventing it from being imported
export {} 