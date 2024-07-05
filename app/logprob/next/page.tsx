"use client";
import { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";

type NodeAttributes = {
    content: string;
    id: string;
    parent?: NodeAttributes;
    children: NodeAttributes[];
    askForSibling: (id: string) => void;
};

const recursiveFind = (
    id: string,
    node: NodeAttributes
): NodeAttributes | null => {
    if (node.id === id) {
        return node;
    }
    for (const child of node.children) {
        const result = recursiveFind(id, child);
        if (result) {
            return result;
        }
    }
    return null;
};

function Node({
    parent,
    children,
    content,
    askForSibling,
    id,
}: NodeAttributes) {
    const handleAskForSibling = useMemo(() => {
        return () => {
            console.log(`asking for sibling of ${parent?.id || id}`);
            askForSibling(parent?.id || id);
        };
    }, [parent?.id, id, askForSibling]);
    return useMemo(
        () => (
            <div className="flex">
                <button onClick={handleAskForSibling}>{content}</button>
                <div className="flex flex-col">
                    {children.map((child) => (
                        <Node
                            id={child.id}
                            key={child.id}
                            parent={child}
                            content={child.content}
                            askForSibling={askForSibling}
                        >
                            {child.children}
                        </Node>
                    ))}
                </div>
            </div>
        ),
        [content, children, askForSibling, handleAskForSibling]
    );
}

export default function Page() {
    const [data, setData] = useImmer<NodeAttributes>({
        content: "",
        id: uuidv4(),
        children: [
            {
                id: uuidv4(),
                content: "parent",
                children: [],
                askForSibling: () => {},
            },
        ],
        askForSibling: () => {},
    });

    const handleAskForSibling = useCallback(
        (parentId?: string) => {
            setData((draft) => {
                const newChild = {
                    id: uuidv4(),
                    content: "child",
                    children: [],
                    askForSibling: () => {},
                };
                if (parentId) {
                    const parentDraft = recursiveFind(parentId, draft);
                    if (parentDraft) {
                        parentDraft.children.push(newChild);
                    } else {
                        console.log("parent not found", draft.children);
                        draft.children.push(newChild);
                    }
                } else {
                    draft.children.push(newChild);
                }
            });
        },
        [setData]
    );

    return useMemo(() => {
        return data.children.map((node) => {
            return (
                <Node
                    key={node.id}
                    id={node.id}
                    content={node.content}
                    parent={node}
                    askForSibling={handleAskForSibling}
                >
                    {node.children}
                </Node>
            );
        });
    }, [data.children, handleAskForSibling]);
}
