"use client";
import { useState } from "react";
import { createChatCompletionLogProb } from "../utils/functions";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import Node, { NodeAttributes } from "./components/Node";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./state/store";

const Page = () => {
    const [value, setValue] = useState("");
    const [base, setBase] = useState<NodeAttributes[]>([]);

    const nodes = (
        <Node
            history={[]}
            token={{ token: "", logprob: 0, bytes: [], top_logprobs: [] }}
            pendingChildrenAttributes={base}
        ></Node>
    );

    const handleSubmit = async () => {
        const messages = (await createChatCompletionLogProb(value)).logprobs
            ?.content;
        console.log(messages);
        if (messages)
            setBase(
                messages.map((message) => ({
                    token: message,
                    history: [],
                }))
            );
        setValue("");
    };

    return (
        <ReduxProvider store={store}>
            <div className="p-5 flex flex-col gap-3">
                <div className="w-full flex flex-col gap-2">
                    <Textarea
                        className="w-full flex-1"
                        label="Enter a prompt"
                        placeholder="Who are you?"
                        value={value}
                        onValueChange={setValue}
                        //Todo: Enter not workig yet
                        onKeyDown={(key) => {
                            if (key.key === "Enter" && !key.shiftKey) {
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        onPress={handleSubmit}
                        isDisabled={!value}
                        variant="flat"
                    >
                        Submit
                    </Button>
                </div>
                <ScrollShadow orientation="horizontal">{nodes}</ScrollShadow>
            </div>
        </ReduxProvider>
    );
};

export default Page;
