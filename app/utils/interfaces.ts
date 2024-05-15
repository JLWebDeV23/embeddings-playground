export interface TreeNodeInterface {
  parent: TreeNodeInterface | null;
  children: TreeNodeInterface[];
}
