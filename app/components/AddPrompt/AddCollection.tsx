"use client";
import React, { cloneElement, useState } from "react";
import styles from "./AddCollection.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";
import TextBox from "../TextBox/TextBox";
import {
  createCollection,
  getCollectionsList,
  upsertPoints,
  collectionExists,
} from "../../utils/collection";

type AddCollectionProps = {
};

const AddCollection: React.FC<AddCollectionProps> = () => {
  const [inputValue, setInputValue] = useState("");

  // const createCollection = async (collectionName: string) => {
  //   try {
  //     const result = await client.createCollection(collectionName, {
  //       vectors: { size: 1536, distance: "Cosine" },
  //     });
  //   } catch (error) {
  //     console.error("Error creating collection:", error);
  //   }
  // };

  // const addPoints = async (collectionName: string, points: Point[]) => {
  //   try {
  //     await client.upsert(collectionName, { points });
  //   } catch (error) {
  //     console.error("Error creating points:", error);
  //   }
  // };

  // const newAddPoints = async (collectionName: string) => {
  //   let embeddings = await Promise.all(
  //     chunkPrompt(inputValue).map(async (chunk) => {
  //       return {
  //         vector: createEmbedding(chunk),
  //         input: chunk,
  //       };
  //     })
  //   );
  //   console.log("Embeddings:", embeddings);
  //   // create point for each embedding and add to points in Qdrant
  //   const points: Point[] = [];
  //   embeddings.forEach((embedding, index) => {
  //     const point: Point = {
  //       id: uuidv4(),
  //       vector: embedding.vector,
  //       payload: { input: embedding.input },
  //     };
  //     points.push(point);
  //   });
  //   console.log("Points:", points);
  //   await addPoints(collectionName!, points);
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Create a list of chunks from the input
  // const chunkPrompt = (input: string): string[] => {
  //   const chunks: string[] = [];
  //   let currentChunk = "";
  //   let word = 0;
  //   for (let i = 0; i < input.length; i++) {
  //     const char = input[i];
  //     currentChunk += char;
  //     if (char === " ") word++;
  //     if (word >= 500) {
  //       chunks.push(currentChunk.trim());
  //       currentChunk = "";
  //       word = 0;
  //     }
  //   }
  //   if (currentChunk.trim().length > 0) {
  //     chunks.push(currentChunk.trim());
  //   }
  //   return chunks;
  // };

  //   const getCollectionsList = async () => {
  //     const collections = await client.getCollections();
  //     return collections.collections;
  //   };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let collectionName = prompt(`Enter a collection name:
- - -
${(await getCollectionsList()).map((collection) => collection.name).join("\n")}
- - -
    `);
    const collection = await collectionExists(collectionName!);
    console.log("Collection exists:", collectionExists);
    if (collectionName === null) {
      return;
      // check if the collection exists,
      // if exist, add points to the existing collection
    } else if (collection) {
      if (
        confirm(
          `"${collectionName}" already exists! Do you want to add more points existing "${collectionName}"?`
        )
      ) {
        // create points and add to the existing collection
        console.log(inputValue);
        upsertPoints(collectionName!, inputValue);
        alert(`Points added to the ${collectionName}`);
      } else {
        // create a new collection and add points
        collectionName = prompt("Enter a 'new' collection name:");
        createCollection(collectionName!);
        upsertPoints(collectionName!, inputValue);
        alert(`Points added to the new collection: ${collectionName}`);
      }
    } else {
      createCollection(collectionName!);
      upsertPoints(collectionName!, inputValue);
      alert(`Points added to the collection: ${collectionName}`);
    }
    setInputValue("");
  };

  return (
    <section className="w-full">
      <TextBox
        placeholder="Prompt to store to collsection"
        nameBtn="Add"
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
    </section>
  );
};

export default AddCollection;
