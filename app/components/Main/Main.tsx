"use client";
import React from "react";
import AddCollection from "../AddPrompt/AddCollection";
import MessageModel from "../MessageModel/MessageModel";
import styles from "./Main.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import MistralClient from '@mistralai/mistralai';
import Delete from "../DeleteCollection/Delete";
import InsertItem from "../InsertItem/InsertItem";

const Main = () => {
  const client = new QdrantClient({
    url: "http://localhost:6333",
  });

  const mistral = new MistralClient(
    "my_api_key",
  );

  const openai = new OpenAI({
    apiKey: "sk-proj-tXhN6GB3ajD2iSQ1ivdxT3BlbkFJSiWSp1nXwuUXhG0p1XGD",
    dangerouslyAllowBrowser: true,
  });

  const createEmbedding = async (input: string | []) => {
    const embedding = (
      await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input,
      })
    ).data[0].embedding;

    return embedding;
  };

  return (
    <main className="w-full h-full p-10 flex justify-between ">
      <div className={styles.row}>
        <AddCollection client={client} createEmbedding={createEmbedding} />
        <InsertItem />
        <Delete client={client} />
      </div>
      <hr className={styles.verticalLine} />
      <div className={styles.row}>
        <MessageModel client={client} createEmbedding={createEmbedding} openai={openai} mistral={mistral}/>
      </div>
    </main>
  );
};

export default Main;
