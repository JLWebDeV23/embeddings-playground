import ModelSelector from "@/app/components/ModelSelector";
import useModelData from "@/app/hooks/useModelData";
import { Model } from "@/app/utils/interfaces";
import {
    Button,
    CardFooter,
    CardProps,
    Spacer,
    Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Card, CardBody } from "../Card";

export default function UserInput({
    className,
    placeholder = "User Message",
    systemMessage = "",
    ...rest
}: {
    placeholder?: string;
    isUserInputDisabled?: boolean;
    systemMessage?: string;
} & CardProps) {
    const [inputValue, setInputValue] = useState<string>("");

    const { models, handleModelsAction, isLastLoading, isLoading } =
        useModelData();

    const { handleAddResponseClick } = useModelData();

    const handleModelSelection = (model: Model) => {
        handleModelsAction({ action: "set_initial", model: model });
    };

    return (
        <Card isBlurred className={`flex ${className}`} {...rest}>
            <CardBody className="flex flex-row gap-3 items-end pb-1">
                {models.length > 0 ? (
                    <>
                        <Textarea
                            value={inputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddResponseClick(inputValue);
                                    setInputValue("");
                                }
                            }}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                            }}
                            maxRows={5}
                            minRows={1}
                            size="lg"
                            variant="underlined"
                            placeholder={placeholder}
                        ></Textarea>
                        <Button
                            onClick={() => {
                                handleAddResponseClick(inputValue);
                                setInputValue("");
                            }}
                            size="lg"
                            isLoading={isLoading || isLastLoading}
                            isDisabled={inputValue.length === 0}
                        >
                            Add
                        </Button>
                    </>
                ) : (
                    <ModelSelector
                        placeholder="Select the initial model"
                        aria-label="initial model"
                        selectedModels={models}
                        onChange={handleModelSelection}
                        className="w-full"
                        radius="sm"
                        size="lg"
                        variant="flat"
                    />
                )}
            </CardBody>
            {models.length > 0 ? (
                <CardFooter className="gap-3">
                    <ModelSelector
                        placeholder="Select the initial model"
                        aria-label="initial model"
                        selectedModels={models}
                        onChange={handleModelSelection}
                        className="w-full max-w-64"
                        size="sm"
                        variant="flat"
                    />
                </CardFooter>
            ) : (
                <Spacer />
            )}
        </Card>
    );
}
