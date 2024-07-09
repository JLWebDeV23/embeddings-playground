"use client";
import { ApiKey } from "../utils/interfaces";
import { useLocalStorage } from "@uidotdev/usehooks";

export const useApiKeys = () => {
    const [apiKeys, setApiKeysState] = useLocalStorage<ApiKey[]>("API_KEYS", [
        {
            name: "OpenAI",
            apiKey: "",
            modelsNames: ["OpenAI"],
        },
        {
            name: "Groq (Llama | Mistral | Gemma)",
            apiKey: "",
            modelsNames: ["LlaMA 3", "Mistral", "Gemma"],
        },
        {
            name: "Claude",
            apiKey: "",
            modelsNames: ["Claude"],
        },
        {
            name: "QdrantDB",
            apiKey: "",
            modelsNames: ["QdrantDB"],
        },
    ]);

    const setApiKeys = (keys: ApiKey[]) => {
        setApiKeysState(keys);
    };

    const getApiKey = (name: string) => {
        const key = apiKeys.find((k) => k.name.toLowerCase().includes(name));
        return key ? key.apiKey : undefined;
    };

    const [QdrantDBURL, setQdrantDBURL] = useLocalStorage<string>(
        "QDRANT_DB_URL",
        "http://localhost:6333"
    );

    const updateQdrantDBURL = (url: string) => {
        setQdrantDBURL(url);
    };

    return {
        apiKeys,
        setApiKeys,
        getApiKey,
        QdrantDBURL,
        updateQdrantDBURL,
    };
};
