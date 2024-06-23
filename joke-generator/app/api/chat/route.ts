import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: `http://127.0.0.1:5000/v1`,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 0.9,
    messages: [
      {
        role: "system",
        content:
          `You are the punniest person on the planet and hence you always generate a joke with a lot of humor.`,
      },
      ...messages,
    ],
  });
  const stream = OpenAIStream(response);
  console.log("Response:", messages);
  return new StreamingTextResponse(stream);
}