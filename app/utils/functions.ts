import dotenv from "dotenv";
dotenv.config();
import { Groq } from "groq-sdk";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import MistralClient from "@mistralai/mistralai";
import Anthropic from "@anthropic-ai/sdk";
import {
  ModelData,
  StringInterpolation,
  StringInterpolations,
} from "./interfaces";

// utils/functions.ts
export const client = new QdrantClient({
  url: "http://localhost:6333",
});

export const openai = new OpenAI({
  apiKey: String(process.env.NEXT_PUBLIC_OPENAI_API_KEY),
  dangerouslyAllowBrowser: true,
});

export const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

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
  let completion;
  try {
    completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: newInput }],
      model: "gpt-3.5-turbo",
      logprobs: true,
      top_logprobs: 2,
      temperature: 0.0,
      // stream: true,
    });
  } catch (error) {
    console.error("Error Message:", error);
  }
  return completion!.choices[0];
};

export const createTest = async (
  input: string
): Promise<OpenAI.ChatCompletion.Choice> => {
  const newInput: string = `summarise the meaning of the question. 
  The user question is: ${input}`;

  const systemMessage = `when user says hi or hello, respond with any information about healthy foods, diets, and suggestions for healthy lifestyle and receipes, limit output to 3 sentences.

  ---
  User Query: 
  ---
  ${input}
  `;
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: newInput },
    ],
    model: "gpt-3.5-turbo",
    logprobs: true,
    top_logprobs: 2,
    temperature: 0.0,
    // stream: true,
  });

  return completion.choices[0];
};

export const createTest1 = async (
  input: string
): Promise<OpenAI.ChatCompletion.Choice> => {
  const newInput: string = `summarise the meaning of the question. 
  The user question is: ${input}`;

  const systemMessage = `when user says hi or hello, respond with any information about healthy foods, diets, and suggestions for healthy lifestyle and receipes, limit output to 3 sentences.

  ---
  User Query: 
  ---
  ${input}
  `;
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROPQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: newInput },
    ],
    model: "llama3-8b-8192",
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

export const createStringInterpolation = (str: string, data: any): string => {
  let newString = str;
  data.forEach((interpolation: any) => {
    const regex = new RegExp(`\\{{${interpolation.variable}\\}}`, "g");
    newString = newString.replace(regex, interpolation.field);
  });
  return newString;
};

export const upsertStringInterpolations = (
  systemMessage: string,
  modelData: ModelData[][],
  stringInterpolations: StringInterpolations[]
): ModelData[][] => {
  console.log("modelData", modelData);
  const baseModelData = modelData[0][0];
  let updatedModelData: ModelData[][] = [];

  if (baseModelData.messages.length === 0) {
    updatedModelData = stringInterpolations.map((stringInterpolation) => {
      const newSystemMessage = createStringInterpolation(
        systemMessage,
        stringInterpolation.list
      );
      return [
        {
          model: baseModelData.model,
          subModel: baseModelData.subModel,
          messages: [
            {
              role: "system",
              content: newSystemMessage,
            },
          ],
          locked: baseModelData.locked,
        },
      ];
    });
  } else {
    updatedModelData = modelData.map((colData, colDataIndex) => {
      const updatedColData = [...colData];
      const stringInterpolation = stringInterpolations[colDataIndex];
      if (stringInterpolation) {
        const newSystemMessage = createStringInterpolation(
          systemMessage,
          stringInterpolation.list
        );

        if (
          !updatedColData[0].messages.find(
            (message) => message.role === "system"
          )
        ) {
          updatedColData[0].messages.unshift({
            role: "system",
            content: newSystemMessage,
          });
        } else {
          updatedColData[0].messages = updatedColData[0].messages.map(
            (message) =>
              message.role === "system"
                ? { role: "system", content: newSystemMessage }
                : message
          );
        }
      }
      return updatedColData;
    });
  }
  return updatedModelData;
};

type ApiKeyProps = {
  name: string;
  apiKey: string;
};
export const addApiKey = (props: ApiKeyProps) => {

  const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
  const newApiKeys = [...API_KEYS, props];

  try {
    sessionStorage.setItem("API_KEYS", JSON.stringify(newApiKeys));
  } catch (error) {
    console.error("Add API Key Error:", error);
  }
};

export const removeApiKey = (props: ApiKeyProps) => {
  const { name } = props;
  try {
    const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
    const newApiKeys = API_KEYS.filter((key: ApiKeyProps) => key.name !== name);
    sessionStorage.setItem("API_KEYS", JSON.stringify(newApiKeys));
  } catch (error) {
    console.error("Remove API Key Error:", error);
  }
};

export const getApiKeys = (): ApiKeyProps[] => {
  const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
  return API_KEYS.map((key: ApiKeyProps) => {
    return {
      name: key.name,
      apiKey: key.apiKey,
    };
  });
};

export const getApiKey = (name: string): string | undefined => {
  const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
  const key = API_KEYS.find((key: ApiKeyProps) => key.name === name);
  return key ? key.apiKey : undefined;
}
