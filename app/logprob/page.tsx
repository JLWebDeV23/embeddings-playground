"use client";
import React from "react";

type NodeProps = {
  history: string[];
  token: string;
  children?: NodeProps[];
};
const Node = ({ history, token, children }: NodeProps) => {

    const [childrenTokens, setChildrenTokens] = React.useState<NodeProps[]>([]);

    const handleClick = () => {
        alert(history.join("") + token);
        setChildrenTokens((prev, index) => {
            return [...prev, <Node key={index} history={history.concat(token)} token="A good day"></Node>];
        })
    }

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
