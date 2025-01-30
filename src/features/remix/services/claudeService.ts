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
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to transform content: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data || !Array.isArray(data.tweets)) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from server');
    }

    return data.tweets;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

// This keeps the type information while preventing it from being imported
export {} 