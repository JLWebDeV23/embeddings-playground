import dotenv from 'dotenv';
dotenv.config();
import { Groq } from 'groq-sdk';
import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';
import { ModelData, StringInterpolations } from './interfaces';

// utils/functions.ts
export const client = new QdrantClient({
  url: 'http://localhost:6333',
});

export const openai = new OpenAI({
  apiKey: String(process.env.NEXT_PUBLIC_OPENAI_API_KEY),
  dangerouslyAllowBrowser: true,
});

export const createChatCompletion = async (
  input: string
): Promise<OpenAI.ChatCompletion.Choice> => {
  const newInput: string = `System Message: Just complete the sentence and the output must only be the chat completion from given input but not showing the input: ${input}`;
  let completion;
  try {
    completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: newInput }],
      model: 'gpt-3.5-turbo',
      logprobs: true,
      top_logprobs: 2,
      temperature: 0.0,
      // stream: true,
    });
  } catch (error) {
    console.error('Error Message:', error);
  }
  return completion!.choices[0];
};

export const createChatCompletionLogProb = async (
  input: string
): Promise<OpenAI.ChatCompletion.Choice> => {
  console.log(input);
  const systemMessage = `
    Generate a chat completion for the following user input: 
    you should summarise the your understanding of the user input and provide a response that is relevant to the user input in a complete sentence, limited by the max_tokens given, 

    ___

    User Input: ${input}
    `;
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-3.5-turbo',
    logprobs: true,
    top_logprobs: 3,
    max_tokens: 50,
  });
  return completion.choices[0];
};

export const createStringInterpolation = (str: string, data: any[]): string => {
  let newString = str;
  data.forEach((interpolation: any) => {
    // Replace placeholders in the form of {{variable}}
    const placeholderRegex = new RegExp(
      `\\{{${interpolation.variable}\\}}`,
      'g'
    );
    newString = newString.replace(placeholderRegex, interpolation.field);

    // Replace direct string matches of the variable, including cases where they are adjacent to punctuation
    const variableRegex = new RegExp(
      `\\b${interpolation.variable}\\b|(?<=\\W)${interpolation.variable}(?=\\W)`,
      'g'
    );
    newString = newString.replace(variableRegex, interpolation.field);
  });
  return newString;
};

export const upsertStringInterpolations = (
  systemMessage: string,
  modelData: ModelData[][],
  stringInterpolations: StringInterpolations[]
): ModelData[][] => {
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
              role: 'system',
              content: newSystemMessage,
            },
          ],
          locked: baseModelData.locked,
          apiKey: baseModelData.apiKey,
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
            (message) => message.role === 'system'
          )
        ) {
          updatedColData[0].messages.unshift({
            role: 'system',
            content: newSystemMessage,
          });
        } else {
          updatedColData[0].messages = updatedColData[0].messages.map(
            (message) =>
              message.role === 'system'
                ? { role: 'system', content: newSystemMessage }
                : message
          );
        }
      }
      return updatedColData;
    });
  }
  return updatedModelData;
};
