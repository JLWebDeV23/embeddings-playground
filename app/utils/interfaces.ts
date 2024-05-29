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
