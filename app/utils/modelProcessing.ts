import { modelSDK } from "./interfaces";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import MistralClient, { ChatCompletionResponse } from "@mistralai/mistralai";
import Anthropic from "@anthropic-ai/sdk";
import { ChatCompletion } from "openai/resources/index.mjs";
import similarity from "compute-cosine-similarity";
import { Chat } from "openai/resources/beta/index.mjs";
// import LlamaAI from "llamaai";

type Model = {
  model: string;
  subModel: string;
  apiKey: string;
  messages: any[];
};

type Response =
  | ChatCompletionResponse
  | OpenAI.ChatCompletion
  | OpenAI.Chat.Completions.ChatCompletion
  // | Anthropic.Message
  | null;

// select model and return response from the model
export const modelResponse = async (model: Model) => {
  let content: string | null | Anthropic.TextBlock[] = null;
  let response: Response = null;
  switch (model.model) {
    case "openai":
      const client = new OpenAI({
        apiKey: model.apiKey,
        dangerouslyAllowBrowser: true,
      });
      response = await client.chat.completions.create({
        messages: model.messages,
        model: model.subModel,
      });
      // Extract the content from the response
      content = response.choices[0].message.content;
      break;

    case "mistral":
      const mistral = new MistralClient(model.apiKey);
      response = await mistral.chat({
        model: model.subModel,
        messages: model.messages,
      });
      // Extract the content from the response
      content = response.choices[0].message.content;
      break;

    case "llama":
      const newClient = new OpenAI({
        apiKey: model.apiKey,
        dangerouslyAllowBrowser: true,
        baseURL: "https://api.llamaai.com",
      });
      response = await newClient.chat.completions.create({
        messages: model.messages,
        model: model.subModel,
      });
      // Extract the content from the response
      content = response.choices[0].message.content;
      break;

    // case "Claude":
    //   const anthropic = new Anthropic({ apiKey: model.apiKey });
    //   response = await anthropic.messages.create({
    //     max_tokens: 1024,
    //     messages: model.messages,
    //     model: model.subModel,
    //   });
    //   // Extract the content from the response
    //   content = response.content;
    //   break;
  }

  return content;
};

export const createEmbedding = async (input: string | []) => {
  const embedding = (
    await new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    }).embeddings.create({
      model: "text-embedding-3-small",
      input: input,
    })
  ).data[0].embedding;

  return embedding;
};

// compare cosine similarity between two model response
const createCosineSimilarity: (
  response1: any[],
  response2: any[]
) => number | null = (response1: any[], response2: any[]) => {
  const cosineSimilarity: NodeRequire = require("compute-cosine-similarity");

  createEmbedding(response1.message.content);
  return similarity(embedding1, embedding2);
};
