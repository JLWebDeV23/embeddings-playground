"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import {
    addAISibling,
    getTokenHistory,
    Node as NodeAttributes,
} from "../state/tree/treeSlice";

const Node = (node: NodeAttributes) => {
    const tree = useSelector((state: RootState) => state.treeReducer);
    const dispatch = useDispatch<AppDispatch>();
    const handleClick = () => {
        dispatch(
            addAISibling({
                id: node.id,
                token: node.token,
                tokenHistory: getTokenHistory(tree, node.id),
            })
        );
    };
    return (
        <div className="flex h-full">
            <button className="whitespace-pre h-full" onClick={handleClick}>
                {node.token.token}
            </button>
            <div className="flex flex-col justify-center">
                {node.children.map((child) => (
                    <Node key={child.id} {...child} />
                ))}
            </div>
        </div>
    );
};

export default function LogprobTree() {
    const tree = useSelector((state: RootState) => state.treeReducer);
    return <Node {...tree} />;
}
