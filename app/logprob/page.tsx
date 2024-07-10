"use client";
import { useState } from "react";
import { createChatCompletionLogProb } from "../utils/functions";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import LogprobTree from "./components/LogprobTree";

const Page = () => {
    const [value, setValue] = useState("");

    const handleSubmit = async () => {
        const messages = (await createChatCompletionLogProb(value)).logprobs
            ?.content;
        console.log(messages);

        setValue("");
    };

    return (
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
            <ScrollShadow orientation="horizontal">
                <LogprobTree />
            </ScrollShadow>
        </div>
    );
};

export default Page;
