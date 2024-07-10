"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { Node as NodeAttributes } from "../state/tree/treeSlice";
import { addSibling } from "../state/tree/treeSlice";

const Node = (node: NodeAttributes) => {
    const dispatch = useDispatch();
    const handleClick = () => {
        console.log(node.token.token, node.id);
        dispatch(addSibling({ id: node.id }));
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
