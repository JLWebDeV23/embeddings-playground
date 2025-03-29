import { TreeNodeInterface } from './interfaces';
import OpenAI from 'openai';

export class TreeNode implements TreeNodeInterface {
  id: number;
  name: string;
  children?: TreeNodeInterface[] | undefined;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.children = [];
  }

  addChild(node: TreeNodeInterface) {
    this.children!.push(node);
  }
}

export class Sentence extends TreeNode {
  id: number = 0;
  split: string;
  parent: OpenAI.ChatCompletion.Choice | null;
  children: [];
  completionContent: OpenAI.ChatCompletion.Choice | null;

  constructor(
    id: number,
    split: string,
    children: [],
    parent: OpenAI.ChatCompletion.Choice | null,
    completionContent: OpenAI.ChatCompletion.Choice | null
  ) {
    super(id, split);
    this.children = children;
    this.split = split;
    this.completionContent = completionContent;
    this.parent = parent;
  }
}
