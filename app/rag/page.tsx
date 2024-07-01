"use client";
import React from "react";
import AddCollection from "../components/AddPrompt/AddCollection";
import MessageModel from "../components/MessageModel/MessageModel";
import styles from "./Main.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import MistralClient from "@mistralai/mistralai";
import Delete from "../components/DeleteCollection/Delete";
import InsertItem from "../components/InsertItem/InsertItem";
import LogProb from "../components/LogProb/LogProb";
import ModelCompare from "@/app/pages/ModelCompare/ModelCompare";

const Main = () => {
  return (
    //w-full h-full p-10 flex justify-between
    <main className={styles.main}>
      <h1 id={styles.h1}>Retrieval Augmented Generation</h1>

      <div className={styles.row}>
        <div className={styles.col}>
          <AddCollection />
          <InsertItem />
          <Delete />
        </div>
        <hr className={styles.verticalLine} />
        <MessageModel />
      </div>
      <hr className={styles.verticalLine} />
      <h1 id={styles.h1}>LogProb</h1>
      <LogProb />
      <hr className={styles.verticalLine} />
      <div className={styles.modelCompareLogo}>
        <h1 id={styles.h1}>Model Compare</h1>
      </div>
      <hr className={styles.verticalLine} />
      <ModelCompare />
    </main>
  );
};

export default Main;
