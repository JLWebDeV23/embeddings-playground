"use client";
import { useState } from "react";
import { createChatCompletionLogProb } from "../utils/functions";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import LogprobTree from "./components/LogprobTree";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";
import { setInitialTree } from "./state/tree/treeSlice";
import useModalInfo from "../hooks/useModalInfo";

const Page = () => {
    const [value, setValue] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { openModalInfo } = useModalInfo();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        const messages = (await createChatCompletionLogProb(value)).logprobs
            ?.content;
        console.log(messages);
        setIsLoading(false);

        if (!messages) {
            console.error("No response");
            openModalInfo({
                title: "No response",
                message: "Please try again",
            });
            return;
        }
        dispatch(setInitialTree(messages));
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
                <Button
                    onPress={handleSubmit}
                    isDisabled={!value}
                    variant="flat"
                    isLoading={isLoading}
                >
                    Submit
                </Button>
            </div>
            <ScrollShadow
                orientation="horizontal"
                className="items-center flex py-10"
            >
                <LogprobTree />
            </ScrollShadow>
        </div>
    );
};

export default Page;
