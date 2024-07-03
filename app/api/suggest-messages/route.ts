
import { generateText } from 'ai';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
// Create an OpenAI API client
const client = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "compatible",
});

export async function POST(req: Request) {
  try{
  const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: prompt,
    maxTokens: 20,
    maxToolRoundtrips: 3,
    maxRetries: 2
  });
 
  // Respond with the stream
  return NextResponse.json({
    data: response
  }, 
{status: 200});
}catch(err: any){
     return NextResponse.json({
      message: err.message
     }, 
    {status: err.status})
}
}