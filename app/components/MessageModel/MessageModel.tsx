"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./MessageModel.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";
import SelectModel from "../SelectModel/SelectModel";
import TextBox from "../TextBox/TextBox";

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
  const [selectedModel, setSelectedModel] = useState("openai");
  const [inputValue, setInputValue] = useState<string>("");
  const [searchCollections, setSearchCollections] = useState<SearchResult[]>(
    []
  );
  const [chatResponse, setChatResponse] = useState<string>("");

  const handleModelChange = useCallback((newModel: string) => {
    console.log(newModel);
    setSelectedModel(newModel);
  }, []);

  const mistralChatCompletetion = async (prompt: string) => {
    const completion = await mistral.chat({
      model: "mistral-tiny",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.OpenAI.ChatCompletion.Choices[0].message.content;
  };

  const openaiChatCompletetion = async (prompt: string) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    return completion.OpenAI.ChatCompletion.Choices[0].message.content;
  };

  const getCollectionsList = async () => {
    const response = await client.getCollections();
    return response.collections;
  };

  const searchSimilarities = async (userPrompt: string) => {
    const collectionName = prompt(`Enter your collection to search
  - - -
  ${(await getCollectionsList())
    .map((collection) => collection.name)
    .join("\n")}
  - - -`);
    if (collectionName === null) {
      return;
    }

    // Emberd the user input
    const embedding = await createEmbedding(userPrompt);

    // Search for similar chunk that match the input
    const result = await client.search(collectionName!, {
      vector: embedding,
      limit: 5,
      score_threshold: 0.4,
    });

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
    if (selectedModel === "mistral") {
      modelResponse += await openaiChatCompletetion(query);
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
    searchSimilarities(inputValue);
    setInputValue("");
  };

  return (
    <section className="w-full">
      <TextBox
        placeholder="Message ChatGPT"
        nameBtn="Submit"
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <SelectModel onModelChange={handleModelChange} />
      <div className="modelResponse mt-5 ">
        <pre className="text-wrap">
          {selectedModel === "openai" ? "ChatGPT:" : "Mistral:"}
          <br className={styles.invisibleLine} />
          <div className={styles.responseBox}>{chatResponse}</div>
        </pre>
      </div>
    </section>
  );
};

export default MessageModel;
