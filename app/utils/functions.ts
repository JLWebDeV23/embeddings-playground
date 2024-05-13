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
