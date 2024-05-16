import OpenAI from "openai";

export interface TreeNodeInterface {
  parent: OpenAI.ChatCompletion.Choice | null;
  children: TreeNodeInterface[];
}
