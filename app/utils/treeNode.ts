import { TreeNodeInterface } from "./interfaces";
import OpenAI from "openai";

export class TreeNode implements TreeNodeInterface {
  parent: OpenAI.ChatCompletion.Choice | null;
  children: TreeNodeInterface[];

  constructor(parent: OpenAI.ChatCompletion.Choice | null) {
    this.parent = parent;
    this.children = [];
  }

  addChild(child: TreeNodeInterface) {
    this.children.push(child);
  }

  removeChild(child: TreeNodeInterface) {
    this.children = this.children.filter((c) => c !== child);
  }
}

export class WordItem extends TreeNode {
  parent: OpenAI.ChatCompletion.Choice | null;
  children: [];
  split: string;
  completionContent: OpenAI.ChatCompletion.Choice | null;

  constructor(
    children: [],
    parent: OpenAI.ChatCompletion.Choice | null,
    split: string,
    completionContent: OpenAI.ChatCompletion.Choice | null
  ) {
    super(parent);
    this.children = children;
    this.split = split;
    this.completionContent = completionContent;
    this.parent = parent;
  }
}
