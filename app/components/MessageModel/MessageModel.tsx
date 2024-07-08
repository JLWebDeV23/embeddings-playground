"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./MessageModel.module.css";
import { QdrantClient } from "@qdrant/js-client-rest";
import SelectModel from "../SelectModel/SelectModel";
import TextBox from "../TextBox/TextBox";
import {
    getCollectionsList,
    searchSimilarities,
    rag,
    scrollPoints,
    searchSimilarities_legacy,
} from "@/app/utils/collection";
import { button } from "@nextui-org/react";

type MessageModelProps = {};

type SearchResult = {
    id: string | number;
    version: number;
    score: number;
    payload?: Record<string, unknown> | null;
    vector?: number[] | Record<string, unknown> | null;
    shard_key?: string | number | Record<string, unknown> | null;
    // Add any other properties that might be in the search result
};

const MessageModel: React.FC<MessageModelProps> = ({}) => {
    const [selectedModel, setSelectedModel] = useState("openai");
    const [inputValue, setInputValue] = useState<string>("");
    const [searchCollections, setSearchCollections] = useState<SearchResult[]>(
        []
    );
    const [chatResponse, setChatResponse] = useState<string>();

    const handleModelChange = useCallback((newModel: string) => {
        console.log(newModel);
        setSelectedModel(newModel);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // use result to display similarities
        const result = await searchSimilarities_legacy(inputValue);
        const model = {
            model: "openai",
            subModel: "gpt-3.5-turbo",
            apiKeys: [],
        };
        // and call rag to and it will set the streamResponse to your component
        // await rag(model, inputValue, "", result!, setChatResponse);
        //

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
