"use client";
import React, { cloneElement, useState } from "react";
import styles from "./AddCollection.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";

type AddCollectionProps = {
  client: QdrantClient;
  createEmbedding: (input: string | []) => Promise<number[]>;
};

type Point = {
  id: number;
  vector: number[];
  payload: { input: string };
};

const AddCollection: React.FC<AddCollectionProps> = ({
  client,
  createEmbedding,
}) => {
  const [inputValue, setInputValue] = useState("");

  const createCollection = async (collectionName: string) => {
    try {
      const result = await client.createCollection(collectionName, {
        vectors: { size: 1536, distance: "Cosine" },
      });
      // setCollections([...collections, result.collection]);
      // return result;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Create a list of chunks from the input
  const chunkPrompt = (input: string): string[] => {
    const chunks: string[] = [];
    let currentChunk = "";
    let word = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      currentChunk += char;
      if (char === " ") word++;
      if (word >= 2000) {
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Input field value:", inputValue);

    let collectionName = prompt("Enter a collection name:");
    const collectionExists: boolean = (await client.collectionExists(collectionName!))
      .exists;
    console.log(collectionName);
    //ask tom
    if (collectionExists) {
      let txt;
      if (
        confirm("Collection already exists! Do you want to add more points?")
      ) {
        // create points and add to the existing collection
        console.log("Chunks:", chunkPrompt(inputValue));
        //   // create embedding on each chuck push to embedding list
        let embeddings = await Promise.all(
          chunkPrompt(inputValue).map(async (chunk) => {
            return {
              vector: await createEmbedding(chunk),
              input: chunk,
            };
          })
        );
        console.log("Embeddings:", embeddings);
        // create point for each embedding and add to points in Qdrant
        const points: Point[] = [];
        embeddings.forEach((embedding, index) => {
          const point: Point = {
            id: index + 1,
            vector: embedding.vector,
            payload: { input: embedding.input },
          };
          points.push(point);
        });
        console.log("Points:", points);
        await addPoints(collectionName!, points);
        
        txt = "Points added You pressed OK!";
      } else {
        txt = "You pressed Cancel!";
        return
      }
    } else {
      collectionName = prompt("Enter a new collection name:");
        // Create a new collection
        createCollection(collectionName!);
        console.log("Chunks:", chunkPrompt(inputValue));
        // create embedding on each chuck push to embedding list
        let embeddings = await Promise.all(
          chunkPrompt(inputValue).map(async (chunk) => {
            return {
              vector: await createEmbedding(chunk),
              input: chunk,
            };
          })
        );
        console.log("Embeddings:", embeddings);
        // create point for each embedding and add to points in Qdrant
        const points: Point[] = [];
        embeddings.forEach((embedding, index) => {
          const point: Point = {
            id: index + 1,
            vector: embedding.vector,
            payload: { input: embedding.input },
          };
          points.push(point);
        });
        console.log("Points:", points);
        await addPoints(collectionName!, points);
    }
    // if (collectionName ) {
    //   createCollection(collectionName);
    //   // chuck the input with . ? ! or 10 characters
    //   console.log("Chunks:", chunkPrompt(inputValue));
    //   // create embedding on each chuck push to embedding list
    //   let embeddings = await Promise.all(
    //     chunkPrompt(inputValue).map(async (chunk) => {
    //       return {
    //         vector: await createEmbedding(chunk),
    //         input: chunk,
    //       };
    //     })
    //   );
    //   console.log("Embeddings:", embeddings);
    //   // create point for each embedding and add to points in Qdrant
    //   const points: Point[] = [];
    //   embeddings.forEach((embedding, index) => {
    //     const point: Point = {
    //       id: index + 1,
    //       vector: embedding.vector,
    //       payload: { input: embedding.input },
    //     };
    //     points.push(point);
    //   });
    //   console.log("Points:", points);
    //   await addPoints(collectionName, points);
    // }
    // } catch (error) {
    //   alert("Collection name already exists!");
    // }
    // setInputValue("");
  };

  return (
    <section className="w-full">
      <form action="" onSubmit={handleFormSubmit}>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.addCollectionTextarea}
            rows={7}
            placeholder="Prompt to store to collection"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="btn absolute right-0 top-2 h-2 translate-x-[-15%] p-4"
            type="submit"
          >
            Store
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddCollection;
