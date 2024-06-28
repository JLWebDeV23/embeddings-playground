import { QdrantClient } from "@qdrant/js-client-rest";
import { Point } from "./interfaces";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const client = new QdrantClient({
  url: "http://localhost:6333",
  apiKey: process.env.NEXT_PUBLIC_QDRANT_API_KEY,
});

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

export const createCollection = async (collectionName: string) => {
  try {
    const result = await client.createCollection(collectionName, {
      vectors: { size: 1536, distance: "Cosine" },
    });
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

const addPoints = async (collectionName: string, points: Point[]) => {
  try {
    await client.upsert(collectionName, { points });
  } catch (error) {
    console.error("Error creating points:", error);
  }
};

// newAddPoints()
export const upsertPoints = async (
  collectionName: string,
  userInput: string
) => {
  let embeddings = await Promise.all(
    chunkPrompt(userInput).map(async (chunk) => {
      return {
        vector: createEmbedding(chunk),
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

export const getCollectionsList = async () => {
  const collections = await client.getCollections();
  return collections.collections;
};

export const collectionExists = async (
  collectionName: string
): Promise<boolean> => {
  return (await client.collectionExists(collectionName)).exists;
};

export const deleteCollection = async (
  collectionName: string
): Promise<boolean> => {
  return await client.deleteCollection(collectionName);
};

export const searchSimilarities = async (userPrompt: string) => {
  const collectionName = prompt(`Enter your collection to search
- - -
${(await getCollectionsList()).map((collection) => collection.name).join("\n")}
- - -`);

  if (collectionName === null) {
    return;
  }
  // Emberd the user input
  const embedding = await createEmbedding(userPrompt);
  let result: any;
  // Search for similar chunk that match the input
  try {
    result = await client.search(collectionName, {
      vector: embedding,
      limit: 5,
      score_threshold: 0.4,
    });
  } catch (error) {
    console.error("Error searching for similarities:", error);
  }
  console.log(result);
  // Stringify the retrieved chunk
  const retrievedChunk = result
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
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API,
  });
  const completion = await openai.chat.completions.create({
    messages: [{ role: "assistant", content: "You are a helpful assistant." }],
    model: "gpt-4o",
  });
  modelResponse += completion;

  console.log(modelResponse);
  return modelResponse;
};
