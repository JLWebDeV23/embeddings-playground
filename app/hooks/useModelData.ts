import { useContext } from "react";
import { Context } from "@/app/providers/ModelDataProvider";

export default function useModelData() {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useModelData must be used within a ModelDataProvider")
    }

    return context;
}