"use client";
import React, { useState, useEffect } from "react";
import styles from "./MessageModel.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";
import SelectModel from "../SelectModel/SelectModel";

type MessageModelProps = {
  client: QdrantClient;
  createEmbedding: (input: string | []) => Promise<number[]>;
  openai: any;
  mistral: any;
};

type SearchResult = {
  id: string | number;
  version: number;
  score: number;
  payload?: Record<string, unknown> | null;
  vector?: number[] | Record<string, unknown> | null;
  shard_key?: string | number | Record<string, unknown> | null;
  // Add any other properties that might be in the search result
};

const MessageModel: React.FC<MessageModelProps> = ({
  client,
  createEmbedding,
  openai,
  mistral,
}) => {
  const [selectedModel, setSelectedModel] = useState("");
  const [inputValue, setInputValue] = useState<string>("");
  const [searchCollections, setSearchCollections] = useState<SearchResult[]>(
    []
  );
  const [chatResponse, setChatResponse] = useState<string>("");

  const handleModelChange = (newModel: string) => {
    // console.log(newModel);
    setSelectedModel(newModel);
  };

  const mistralChatCompletetion = async (prompt: string) => {
    const completion = await mistral.chat({
      model: "mistral-tiny",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  };

  const openaiChatCompletetion = async (prompt: string) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  };

  const searchSimilarities = async (userPrompt: string) => {
    const collectionName = "test";
    const embedding = await createEmbedding(userPrompt);
    const result = await client.search(collectionName, {
      vector: embedding,
      limit: 5,
      // vector similiarity search
      score_threshold: 0.4,
    });
    console.log(result);
    const searchResultToString = result
      .map(
        (result) =>
          `-> ${JSON.stringify(result.payload?.input).replace(/"/g, "")}`
      )
      .join("\n");
    const query: string = `${searchResultToString} \n\n---\n\nYour Message: ${userPrompt}`;
    let modelResponse: string = query + "\n\n";
    if (selectedModel === "mistral") {
      modelResponse += await mistralChatCompletetion(query);
    } else if (selectedModel === "openai") {
      modelResponse += await openaiChatCompletetion(query);
    }
    setChatResponse(modelResponse);
    console.log(modelResponse);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputValue);
    searchSimilarities(inputValue);
    setInputValue("");
  };

  return (
    <section className="w-full">
      <form action="" onSubmit={handleFormSubmit}>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.messageModelTextarea}
            rows={7}
            placeholder="Message ChatGPT"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="btn absolute right-0 top-2 h-2 translate-x-[-8%] "
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      <SelectModel onModelChange={handleModelChange} />
      <div className="modelResponse mt-5 ">
        <pre className="text-wrap">
          {selectedModel === "openai" ? "ChatGPT:" : "Mistral:"}
          <br className={styles.invisibleLine} />
          {chatResponse}
        </pre>
      </div>
    </section>
  );
};

export default MessageModel;
