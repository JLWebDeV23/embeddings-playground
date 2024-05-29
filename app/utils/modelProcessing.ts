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
import { ModelsData } from "../page/ModelCompare/ModelCompare";
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

const chatCompletion = async (model: any) => {
  let content: string | null | Anthropic.TextBlock[] = null;
  let response: Response = null;

  switch (model.model) {
    case "OpenAI":
      const client = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      console.log(model.messages);
      response = await client.chat.completions.create({
        messages: model.messages,
        model: model.subModel,
      });
      // Extract the content from the response
      content = response.choices[0].message.content;
      break;

    // case "Mistral":
    //   const mistral = new MistralClient(model.apiKey);
    //   response = await mistral.chat({
    //     model: model.subModel,
    //     messages: model.messages,
    //   });
    //   // Extract the content from the response
    //   content = response.choices[0].message.content;
    //   break;

    case "LlaMA 3" || "Gemma" || "Mistral":
      const groq = new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROPQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      try {
        response = await groq.chat.completions.create({
          messages: model.messages,
          model: model.subModel,
        });
      } catch (error) {
        console.error("Error in Groq:", error);
      }

      content = response?.choices[0]?.message?.content || "";
      break;
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

  // output completion.choice[0]
  return response?.choices[0].message;
};

// select model and return response from the model
export const modelResponse = async (modelsData: ModelsData) => {
  const firstModelResponse = await chatCompletion(modelsData?.firstModel);
  const secondModelResponse = await chatCompletion(modelsData?.secondModel);
  // similairty score
  const similarityScore = await createCosineSimilarity(
    firstModelResponse?.content ?? null,
    secondModelResponse?.content ?? null
  );
  // add to modelsData
  modelsData?.firstModel?.messages?.push(firstModelResponse);
  modelsData?.secondModel?.messages?.push(secondModelResponse);
  modelsData?.score.push(similarityScore);

  return modelsData;
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
  // const roundedSimilarity = Number(similarityScore?.toFixed(7));
  return similarityScore;
};
