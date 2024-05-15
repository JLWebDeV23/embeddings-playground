import { TreeNodeInterface } from "./interfaces";

export class TreeNode implements TreeNodeInterface {
  parent: TreeNodeInterface | null;
  children: TreeNodeInterface[];

  constructor(parent: TreeNodeInterface | null) {
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
  parent: WordItem | null;
  children: [];
  split: [];
  completionContent: [];

  constructor(
    children: [],
    parent: WordItem["parent"] | null,
    split: [],
    completion: [],
    completionContent: []
  ) {
    super(parent);
    this.children = children;
    this.split = split;
    this.completionContent = completionContent;
    this.parent = null;
  }
}
