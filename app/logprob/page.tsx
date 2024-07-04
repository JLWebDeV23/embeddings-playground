"use client";
import React from "react";
import { v4 as uuidv4 } from "uuid";
type NodeProps = {
  history: string[];
  token: string;
  children?: NodeProps[];
};

type NodeElement = {
  history: string[];
  token: string;
  children: NodeElement[];
};

const Node = ({ history, token, children }: NodeProps): NodeElement => {
  const [childrenTokens, setChildrenTokens] = React.useState<NodeProps[]>([]);

  const handleClick = () => {
    alert(history.join("") + token);
    setChildrenTokens((prev) => {
      return [
        ...prev,
        <Node
          key={uuidv4()}
          history={history.concat(token)}
          token="A good day"
        ></Node>,
      ];
    });
  };

  return (
    <div>
      <div>{token}</div>
      <button onClick={handleClick}>Click</button>
      {children &&
        children.map((child, index) => (
          <Node history={history.concat(token)} token={child.token} key={index}>
            {child.children || []}
          </Node>
        ))}
    </div>
  );
};

const Page = () => {
  const nodes = <Node history={[]} token="A good day"></Node>;

  return <div>{nodes}</div>;
};

export default Page;
