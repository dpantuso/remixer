import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Remove these lines if not needed
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.VITE_CLAUDE_API_KEY || '',
});

app.get("/test", (req, res) => {
    const { content, transformType } = req.body;
    res.json({ message: "Test successful" });
  });

const SYSTEM_PROMPT = `You are a professional social media manager specializing in Twitter/X. Your expertise is taking long-form content and transforming it into engaging tweet threads that capture attention while maintaining the original message's essence.

Your task is to create a thread of tweets from the provided content.

Guidelines for tweet creation:
- Generate 5-7 tweets that flow together as a thread
- Each tweet must be under 280 characters
- First tweet should hook readers and hint at value
- Last tweet should include a clear call-to-action
- Maintain the original content's voice and expertise level
- Focus on key insights, surprising facts, and valuable takeaways
- Write in a clear, conversational style
- No hashtags or emojis
- Number each tweet (1/n format)

Format the response as a numbered list, with one tweet per line.`;

app.post('/api/remix', async (req, res) => {
  const { content } = req.body;

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

    const messageContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    res.json({ result: messageContent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to transform content' });
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