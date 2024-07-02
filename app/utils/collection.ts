import { QdrantClient } from "@qdrant/js-client-rest";
import { Point } from "./interfaces";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { ApiKey } from "./interfaces";
import Groq from "groq-sdk";
import { handleError } from "./modelProcessing";
const client = new QdrantClient({
  url: "http://localhost:6333",
  apiKey: process.env.NEXT_PUBLIC_QDRANT_API_KEY,
});

/**
 * Asynchronously generates an embedding for the given input using OpenAI's API. It logs the input and the resulting embedding.
 * Note: It uses an environment variable for the API key and allows browser execution, which poses a security risk for key exposure.
 * @param input - A string or an array of strings to generate embeddings for.
 * @returns A promise that resolves to the embedding as an array of numbers.
 */
export const createEmbedding = async (input: string | []) => {
  let embedding: number[] = [];
  console.log(input);
  try {
    embedding = (
      await new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      }).embeddings.create({
        model: "text-embedding-3-small",
        input: input,
      })
    ).data[0].embedding;
  } catch (error) {
    console.error("Error in Create OpenAI Embeddings:", error);
  }
  console.log(embedding);
  return embedding;
};

export const scrollPoints = async (collectionName: string) => {
  try {
    const points = await client.scroll(collectionName);
    console.log("hi");
    console.log(points);
    return points;
  } catch (error) {
    console.error("Error scrolling points:", error);
    return error;
  }
};

/**
 * _UI_ function to create a new collection with the specified name.
 * Asynchronously creates a new collection with the specified name using a client's `createCollection` method.
 * The collection is configured to use vectors of size 1536 and the Cosine distance metric for comparisons.
 * In case of an error during the collection creation process, the error is logged to the console.
 *
 * @param collectionName - The name of the collection to be created.
 */
export const createCollection = async (collectionName: string) => {
  try {
    const result = await client.createCollection(collectionName, {
      vectors: { size: 1536, distance: "Cosine" },
    });
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

/**
 * Privately and Asynchronously adds or updates points in a specified collection.
 * This function attempts to upsert (insert or update) an array of points into the given collection.
 * In case of an error during the upsert operation, it logs the error message to the console.
 *
 * @param collectionName - The name of the collection to which points will be added or updated.
 * @param points - An array of points to be upserted into the collection.
 */
const addPoints = async (collectionName: string, points: Point[]) => {
  try {
    await client.upsert(collectionName, { points });
  } catch (error) {
    console.error("Error creating points:", error);
  }
};

/**
 * _UI_ function to upsert points into a specified collection.
 * Asynchronously processes user input to generate embeddings and upserts them as points into a specified collection.
 * The function first breaks down the user input into chunks, generates embeddings for each chunk, and then constructs
 * points with unique IDs and the generated embeddings. These points are then upserted into the specified collection.
 *
 * @param collectionName - The name of the collection where points will be upserted.
 * @param userInput - The user input string to be processed into embeddings.
 */
export const upsertPoints = async (
  collectionName: string,
  userInput: string
) => {
  let embeddings = await Promise.all(
    chunkPrompt(userInput).map(async (chunk) => {
      return {
        vector: await createEmbedding(chunk),
        input: chunk,
      };
    })
  );
  console.log("Embeddings:", embeddings);
  // create point for each embedding and add to points in Qdrant
  const points: Point[] = [];
  embeddings.forEach((embedding) => {
    const point: Point = {
      id: uuidv4(),
      vector: JSON.parse(JSON.stringify(embedding.vector)),
      payload: { input: embedding.input },
    };
    points.push(point);
  });
  console.log("Points:", points);
  await addPoints(collectionName!, points);
};

/**
 * Splits the input string into chunks of 500 words each.
 * @param input - The input string to be split into chunks.
 * @returns An array of strings representing the chunks of the input.
 */
const chunkPrompt = (input: string): string[] => {
  const chunks: string[] = [];
  let currentChunk = "";
  let word = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    currentChunk += char;
    if (char === " ") word++;
    if (word >= 500) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
      word = 0;
    }
  }
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
};

/**
 * _UI_ function to retrieve a list of collections from the Qdrant client.
 * Asynchronously retrieves a list of collections from the Qdrant client.
 * @returns A promise that resolves to an array of collection objects.
 */
export const getCollectionsList = async () => {
  const collections = await client.getCollections();
  return collections.collections;
};

/**
 * _UI_ function to check if a collection with the specified name exists.
 * Asynchronously checks if a collection with the specified name exists.
 * @param collectionName - The name of the collection to check for existence.
 * @returns A promise Boolean that resolves to a boolean value indicating whether the collection exists.
 */
export const collectionExists = async (
  collectionName: string
): Promise<boolean> => {
  return (await client.collectionExists(collectionName)).exists;
};

/**
 * _UI_ function to delete a collection with the specified name.
 * Asynchronously deletes a collection with the specified name.
 * @param collectionName - The name of the collection to be deleted.
 * @returns A promise that resolves to a boolean value indicating whether the collection was successfully deleted.
 */
export const deleteCollection = async (
  collectionName: string
): Promise<boolean> => {
  return await client.deleteCollection(collectionName);
};

/**
 * _UI_ function to search for Top 5 similarities in a collection based on a user prompt.
 * Asynchronously searches for similar chunks in a collection based on a user prompt.
 * The function first generates an embedding for the user prompt and then searches for similar chunks in the specified collection.
 * The search results are then displayed to the user.
 *
 * @param userPrompt - The user prompt for which to search for similarities in the collection.
 */
export const searchSimilarities = async (userPrompt: string) => {
  const collectionName = prompt(`Enter your collection to search
- - -
${(await getCollectionsList()).map((collection) => collection.name).join("\n")}
- - -`);

  if (collectionName === null) {
    return;
  }

  let results;
  // Search for similar chunk that match the input
  try {
    results = await client.search(collectionName, {
      vector: await createEmbedding(userPrompt),
      limit: 5,
      score_threshold: 0.3,
    });
  } catch (error) {
    console.error("Error searching for similarities in Qdrant:", error);
  }

  const retrievedChunk = results!
    .map(
      (result) =>
        `** ${JSON.stringify(
          (result.payload?.input as string)
            .replace(/"/g, "")
            .replace(/\n/g, " ")
        )}`
    )
    .join("\n");
  return retrievedChunk;
};

export const rag = async (
  model: data,
  userPrompt: string,
  systemMessage: string,
  retrievedChunk: string,
  setChatResponse: (text: string) => void
) => {
  // Query to be sent to the model
  const chatSystemMessage = `Context information is below.
-----------------------
${retrievedChunk}
-----------------------
Given the context information and not prior knowledge, answer the query of user prompt.
Additional requirement of system message: ${systemMessage}

  `;
  // create a newMessage
  const newMessage: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: chatSystemMessage,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  // try {
  //   const openai = new OpenAI({
  //     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  //     dangerouslyAllowBrowser: true,
  //   });
  //   const stream = await openai.chat.completions.create({
  //     messages: newMessage,
  //     model: "gpt-4o",
  //     stream: true,
  //   });

  //   let text = "";
  //   for await (const chunck of stream) {
  //     console.log(chunck.choices[0]?.delta.content);
  //     text += chunck.choices[0]?.delta.content || "";
  //     setChatResponse(text);
  //   }
  // } catch (err) {
  //   console.error("Error in OpenAI Chat Completions:", err);
  // }

  selectModel(model, newMessage, setChatResponse);
};

type data = {
  model: string;
  subModel: string;
  apiKey: ApiKey[];
};

const selectModel = async (
  model: data,
  messages: any[],
  setChatResponse: any
) => {
  let stream: any;

  if (model.model === "OpenAI") {
    const apiKey = model.apiKey.find((key) => key.name === "OpenAI");
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    const openai = new OpenAI({
      apiKey: apiKey.apiKey,
      dangerouslyAllowBrowser: true,
    });
    try {
      stream = await openai.chat.completions.create({
        messages: messages,
        model: model.subModel,
        stream: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw handleError(model.model, model.subModel, error);
      }
    }
  } else {
    const apiKey = model.apiKey.find(
      (key) => key.name === "Groq (Llama | Mistral | Gemma)"
    );
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    const groq = new Groq({
      apiKey: apiKey.apiKey,
      dangerouslyAllowBrowser: true,
    });
    try {
      stream = await groq.chat.completions.create({
        messages: messages,
        model: model.subModel,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw handleError(model.model, model.subModel, error);
      }
    }
  }

  let text = "";
  for await (const chunck of stream) {
    console.log(chunck.choices[0]?.delta.content);
    text += chunck.choices[0]?.delta.content || "";
    setChatResponse(text);
  }
};
