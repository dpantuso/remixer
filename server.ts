import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';


// Remove these lines if not needed
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3005;

// Add logging to check if API key is present
const apiKey = process.env.VITE_CLAUDE_API_KEY;
if (!apiKey) {
  console.error('ERROR: Claude API key is missing!');
} else {
  console.log('Claude API key is present (starts with):', apiKey.substring(0, 4) + '...');
}

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.VITE_CLAUDE_API_KEY || '',
});

const SYSTEM_PROMPT = `You are a professional social media manager specializing in Twitter/X. Your expertise is taking content and transforming it into multiple, completely independent tweets.

Your task is to create 8 different standalone tweets that could be posted independently at different times.

Guidelines for tweet creation:
- Create 8 COMPLETELY SEPARATE tweets that are NOT related to each other
- CRITICAL: Each tweet MUST be under 280 characters - do not generate any tweets longer than this limit
- Each tweet must be a complete thought that works entirely on its own
- Each tweet should take a different approach to the content:
  * Ask an engaging question
  * Share a surprising fact
  * Offer a tip or advice
  * Present a thought-provoking statement
  * Share a key insight
  * Pose a hypothetical
  * Challenge a common assumption
  * Provide a useful takeaway
- Write in a clear, conversational style
- No hashtags or emojis
- No references to other tweets or threading
- Each tweet should make sense to someone who hasn't seen any of the other tweets
- Never exceed 280 characters - if you can't fit the idea in 280 characters, choose a different approach

Format your response with each independent tweet separated by three pipes (|||). Each tweet should be completely standalone with no connection to the others.

Remember: Quality over quantity. If you can't create a meaningful tweet within the 280-character limit, provide fewer tweets rather than exceeding the limit.`;

app.post('/api/remix', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'No content provided' });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    });

    if (!message.content || !message.content[0] || message.content[0].type !== 'text') {
      console.error('Invalid message structure:', message);
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    const messageContent = message.content[0].type === 'text' 
      ? message.content[0].text.split('|||')
        .map(tweet => tweet.trim())
        .filter(tweet => tweet.length > 0)
      : [];

    if (!messageContent.length) {
      return res.status(500).json({ error: 'No valid tweets generated' });
    }

    res.json({ tweets: messageContent });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Failed to transform content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Add this at the very top
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
}); 