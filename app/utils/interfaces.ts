import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import MistralClient from "@mistralai/mistralai";
import Anthropic from "@anthropic-ai/sdk";
// import LlamaAI from "llamaai";

export interface TreeNodeInterface {
    id: number;
    name: string;
    // parent: OpenAI.ChatCompletion.Choice | null;
    children?: TreeNodeInterface[];
}

export interface LogProbTreeNode {
    token: string | null;
    id: number;
    logProbs: OpenAI.Chat.Completions.ChatCompletion.Choice;
    children: LogProbTreeNode[] | null;
}

export interface modelSDK {
    openai: OpenAI;
    qdrant: QdrantClient;
    mistral: MistralClient;
    anthropic: Anthropic;
    // llamaai: LlamaAI;
}

// Define the shape of the card data
export interface CardData {
    x: string;
    y: string;
}

export interface Message {
    role: string;
    content: string;
    score?: number;
}

export interface ModelData {
    model: string;
    subModel: string;
    messages: Message[];
    locked: boolean;
}

export interface Model {
    model: string;
    subModel: string;
}

export interface ApiKey {
    key: string;
    name: string;
    apiKey: string;
}
[];

export interface StringInterpolation {
    key: number;
    variable: string;
    field: string;
}

export interface StringInterpolations {
    list: StringInterpolation[];
}

export interface ApiKeyProps {
    name: string;
    apiKey: string;
}
