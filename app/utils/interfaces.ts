import OpenAI from "openai";

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
