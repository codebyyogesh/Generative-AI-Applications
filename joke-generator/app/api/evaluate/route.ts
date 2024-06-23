import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import stream from 'stream';

const openai = new OpenAI({
  baseURL: `http://127.0.0.1:5000/v1`,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  
    const { joke } = await req.json();

    console.log("my joke: ", joke)
    // Simple heuristic-based evaluation
    const funnyKeywords = ['laugh', 'hilarious', 'funny', 'giggle', 'joke']
    const inappropriateKeywords = ['inappropriate', 'rude', 'explicit']
    const offensiveKeywords = ['offensive', 'insult', 'racist', 'sexist']

    const lowerJoke = joke.toLowerCase()
    const funny = funnyKeywords.some(keyword => lowerJoke.includes(keyword)) ? 'True' : 'False'
    const appropriate = inappropriateKeywords.every(keyword => !lowerJoke.includes(keyword)) ? 'True' : 'False'
    const offensive = offensiveKeywords.some(keyword => lowerJoke.includes(keyword)) ? 'True' : 'False'
    return { funny, appropriate, offensive }
 }

