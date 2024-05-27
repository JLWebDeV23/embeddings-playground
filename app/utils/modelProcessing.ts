import { modelSDK } from "./interfaces";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import MistralClient, { ChatCompletionResponse } from "@mistralai/mistralai";
import { Groq } from "groq-sdk";
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

// const Groq: NodeRequire = require("groq-sdk");

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
      const groq = new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROPQ_API_KEY,
      });

      groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: "Explain the importance of fast language models",
          },
        ],
        model: "llama3-8b-8192",
      });

      // const newClient = new OpenAI({
      //   apiKey: process.env.NEXT_PUBLIC_LLAMA_API_KEY,
      //   dangerouslyAllowBrowser: true,
      //   baseURL: "https://api.llamaai.com",
      // });
      // response = await newClient.chat.completions.create({
      //   messages: model.messages,
      //   model: model.subModel,
      // });
      // // Extract the content from the response
      // content = response.choices[0].message.content;
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
  const embedding: number[] = (
    await new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    }).embeddings.create({
      model: "text-embedding-3-small",
      input: input,
    })
  ).data[0].embedding;

  return embedding;
};

// compare cosine similarity between two model response
// TODO: function takes input for now, will need to look into taking as []
export const createCosineSimilarity: (
  response1: string | null,
  response2: string | null
) => Promise<number | null> = async (
  response1: string | null,
  response2: string | null
) => {
  // Embeddings
  const embedding1: number[] = await createEmbedding(response1!);
  const embedding2: number[] = await createEmbedding(response2!);

  const cosineSimilarity: NodeRequire = require("compute-cosine-similarity");

  const similarityScore = similarity(embedding1, embedding2);
  return similarityScore;
};