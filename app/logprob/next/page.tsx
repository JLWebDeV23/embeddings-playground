"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import {
    addAISibling,
    getTokenHistory,
    Node as NodeAttributes,
} from "../state/tree/treeSlice";

const Node = (node: NodeAttributes) => {
    const dispatch = useDispatch<AppDispatch>();
    const handleClick = () => {
        dispatch(
            addAISibling({
                id: node.id,
                token: node.token,
                tokenHistory: getTokenHistory(node),
            })
        );
    };
    return (
        <div className="flex">
            <button className="whitespace-pre" onClick={handleClick}>
                {node.token.token}
            </button>
            <div className="flex flex-col">
                {node.children.map((child) => (
                    <Node key={child.id} {...child} />
                ))}
            </div>
        </div>
    );
};

export default function Page() {
    const tree = useSelector((state: RootState) => state.treeReducer);
    return <Node {...tree} />;
}
