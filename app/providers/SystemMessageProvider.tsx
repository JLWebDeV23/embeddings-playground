import { PropsWithChildren, createContext, useState } from "react";

const Context = createContext<{
    systemMessage: string;
} | null>(null);

export default function SystemMessageProvider({ children }: PropsWithChildren) {
    const [systemMessage, setSystemMessage] = useState<string>("");

    return (
        <Context.Provider value={{ systemMessage }}>
            {children}
        </Context.Provider>
    );
}
