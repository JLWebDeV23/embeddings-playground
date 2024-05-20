import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import MistralClient from "@mistralai/mistralai";
// utils/functions.ts
export const client = new QdrantClient({
  url: "http://localhost:6333",
});

export const openai = new OpenAI({
  apiKey: "sk-proj-tXhN6GB3ajD2iSQ1ivdxT3BlbkFJSiWSp1nXwuUXhG0p1XGD",
  dangerouslyAllowBrowser: true,
});

export const createEmbedding = async (input: string | []) => {
  const embedding = (
    await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input,
    })
  ).data[0].embedding;

  return embedding;
};

export const createChatCompletion = async (
  input: string
): Promise<OpenAI.ChatCompletion.Choice> => {
  const newInput: string = `System Message: Just complete the sentence and the output must only be the chat completion from given input but not showing the input: ${input}`;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: newInput }],
    model: "gpt-3.5-turbo",
    logprobs: true,
    top_logprobs: 2,
    temperature: 0.0,
    // stream: true,
  });
  return completion.choices[0];
};

export const createChatCompletionLogProb = async (
  input: string
): Promise<OpenAI.ChatCompletion.Choice> => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: input }],
    model: "gpt-3.5-turbo",
    logprobs: true,
    top_logprobs: 2,
    temperature: 0.0,
  });
  return completion.choices[0];
};
