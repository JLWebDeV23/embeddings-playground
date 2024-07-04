"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

type NodeAttributes = {
    history: string[];
    token: string;
};

type NodeProps = NodeAttributes & React.PropsWithChildren<{}>;

const Node = ({ history, token, children }: NodeProps) => {
    const [childrenAttributes, setChildrenAttributes] = React.useState<
        NodeAttributes[]
    >([]);

    const handleClick = () => {
        alert(history.join("") + token);
        console.log(history);
        setChildrenAttributes((prev) => {
            return [
                ...prev,
                {
                    history: history,
                    token: token,
                },
            ];
        });
    };

    return (
        <div className="flex">
            <button onClick={handleClick}>{token}</button>
            {children}
            {childrenAttributes.map((childrenAttribute, index) => {
                return (
                    <Node
                        key={uuidv4()}
                        history={[...history, token]}
                        token={childrenAttribute.token}
                    ></Node>
                );
            })}
        </div>
    );
};

const Page = () => {
    const nodes = (
        <Node history={[]} token="A">
            <Node history={["A"]} token="&nbsp;good">
                <Node history={["A", "&nbsp;good"]} token="&nbsp;day"></Node>
            </Node>
        </Node>
    );

    return <div>{nodes}</div>;
};

export default Page;
