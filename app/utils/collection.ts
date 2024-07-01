import { QdrantClient } from "@qdrant/js-client-rest";
import { Point } from "./interfaces";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

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
  // Embed the user input
  const embedding = await createEmbedding(userPrompt);
  let results;
  // Search for similar chunk that match the input
  try {
    results = await client.search(collectionName, {
      vector: embedding,
      limit: 5,
      score_threshold: 0.4,
    });
  } catch (error) {
    console.error("Error searching for similarities:", error);
  }
  // Stringify the retrieved chunk
  const retrievedChunk = results!
    .map(
      (result) =>
        `-> ${JSON.stringify(
          (result.payload?.input as string)
            .replace(/"/g, "")
            .replace(/\n/g, " ")
        )}`
    )
    .join("\n");
  console.log(retrievedChunk);
  // Query to be sent to the model
  const query = `Context information is below.
-----------------------
${retrievedChunk}
-----------------------
Use your prior knowledge to best describe the context of the query.
Query: ${userPrompt}
Answer: 
  `;
  // Message
  //Given the context information and not prior knowledge, answer the query

  // const query: string = `${retrievedChunk} \n\n---\n\nYour Message: ${userPrompt}`;

  // Get the response from the model
  let modelResponse: string = query;
  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Given the context information and not prior knowledge, answer the query of user prompt.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "gpt-4o",
    });
    const chatResponse = completion.choices[0].message.content;
    console.log(chatResponse);
    modelResponse += chatResponse;

    console.log(modelResponse);
  } catch (err) {
    console.error("Error in OpenAI Chat Completions:", err);
  }
  return modelResponse;
};
