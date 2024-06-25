import { useState } from "react";
import { ApiKeyProps } from "../utils/interfaces";

export const addApiKeyToStorage = (props: ApiKeyProps) => {
    const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");

    if (props.apiKey === "") {
        // delete the key if it is empty
        removeApiKeyFromStorage(props);
        return;
    }

    const newApiKeys = [...API_KEYS, props];

    try {
        sessionStorage.setItem("API_KEYS", JSON.stringify(newApiKeys));
    } catch (error) {
        console.error("Add API Key Error:", error);
    }
};

export const removeApiKeyFromStorage = (props: ApiKeyProps) => {
    const { name } = props;
    console.log("name", name);
    try {
        const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
        const newApiKeys = API_KEYS.filter(
            (key: ApiKeyProps) => key.name !== name
        );
        console.log("newApiKeys", newApiKeys);
        sessionStorage.setItem("API_KEYS", JSON.stringify(newApiKeys));
    } catch (error) {
        console.error("Remove API Key Error:", error);
    }
};

export const getApiKeysFromStorage = (): ApiKeyProps[] => {
    const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
    return API_KEYS.map((key: ApiKeyProps) => {
        return {
            name: key.name,
            apiKey: key.apiKey,
        };
    });
};

export const getApiKeyFromStorage = (name: string): string | undefined => {
    const API_KEYS = JSON.parse(sessionStorage.getItem("API_KEYS") || "[]");
    const key = API_KEYS.find((key: ApiKeyProps) => key.name === name);
    return key ? key.apiKey : undefined;
};

export const useApiKeys = () => {
    const [apiKeys, setApiKeysState] = useState<ApiKeyProps[]>([
        {
            name: "NEXT_PUBLIC_OPENAI_API_KEY",
            apiKey: getApiKeyFromStorage("NEXT_PUBLIC_OPENAI_API_KEY") || "",
        },
        {
            name: "NEXT_PUBLIC_LLAMA_API_KEY",
            apiKey: getApiKeyFromStorage("NEXT_PUBLIC_LLAMA_API_KEY") || "",
        },
        {
            name: "CLAUDE_API_KEY",
            apiKey: getApiKeyFromStorage("CLAUDE_API_KEY") || "",
        },
        {
            name: "QDRANT_API_KEY",
            apiKey: getApiKeyFromStorage("QDRANT_API_KEY") || "",
        },
        {
            name: "MISTRAL_API_KEY",
            apiKey: getApiKeyFromStorage("MISTRAL_API_KEY") || "",
        },
        {
            name: "NEXT_PUBLIC_GROPQ_API_KEY",
            apiKey: getApiKeyFromStorage("NEXT_PUBLIC_GROPQ_API_KEY") || "",
        },
    ]);

    const setApiKeys = (
        keys: Array<{
            name: string;
            apiKey: string;
        }>
    ) => {
        setApiKeysState(keys);
    };

    const addApiKey = (props: ApiKeyProps) => {
        addApiKeyToStorage(props);
        setApiKeysState(getApiKeysFromStorage());
    };

    const removeApiKey = (props: ApiKeyProps) => {
        removeApiKeyFromStorage(props);
        setApiKeysState(getApiKeysFromStorage());
    };

    return {
        apiKeys,
        addApiKey,
        removeApiKey,
        setApiKeys,
    };
};
