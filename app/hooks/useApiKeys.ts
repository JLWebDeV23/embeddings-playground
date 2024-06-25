import { useEffect, useState } from "react";
import { ApiKeyProps } from "../utils/interfaces";

export const useApiKeys = () => {
    /* Get the apiKeys from the storage */
    function getKeyFromStorage(name: string) {
        const API_KEYS = sessionStorage.getItem("API_KEYS");
        if (API_KEYS) {
            const keys = JSON.parse(API_KEYS);
            const key = keys.find((k: ApiKeyProps) => k.name === name);
            if (key) {
                return key.apiKey;
            }
        }
        return "";
    }

    const [apiKeys, setApiKeysState] = useState<ApiKeyProps[]>(() => [
        {
            name: "NEXT_PUBLIC_OPENAI_API_KEY",
            apiKey: getKeyFromStorage("NEXT_PUBLIC_OPENAI_API_KEY"),
        },
        {
            name: "NEXT_PUBLIC_LLAMA_API_KEY",
            apiKey: getKeyFromStorage("NEXT_PUBLIC_LLAMA_API_KEY"),
        },
        {
            name: "CLAUDE_API_KEY",
            apiKey: getKeyFromStorage("CLAUDE_API_KEY"),
        },
        {
            name: "QDRANT_API_KEY",
            apiKey: getKeyFromStorage("QDRANT_API_KEY"),
        },
        {
            name: "MISTRAL_API_KEY",
            apiKey: getKeyFromStorage("MISTRAL_API_KEY"),
        },
        {
            name: "NEXT_PUBLIC_GROPQ_API_KEY",
            apiKey: getKeyFromStorage("NEXT_PUBLIC_GROPQ_API_KEY"),
        },
    ]);

    /* Sync the apiKeys state changes with the storage */
    useEffect(() => {
        sessionStorage.setItem("API_KEYS", JSON.stringify(apiKeys));
    }, [apiKeys]);

    const setApiKeys = (
        keys: Array<{
            name: string;
            apiKey: string;
        }>
    ) => {
        setApiKeysState(keys);
    };

    return {
        apiKeys,
        setApiKeys,
    };
};
