import { useContext } from "react";
import { Context } from "@/app/providers/ModalInfoProvider";

export default function useModelData() {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useModalInfo must be used within a ModalInfoProvider");
    }

    return context;
}
