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
import IonIcon from "@reacticons/ionicons";

export default function UserInput({
    className,
    placeholder = "User Message",
    modelSelectorPlaceholder = "Select the initial model",
    systemMessage = "",
    multipleModels = true,
    children,
    ...rest
}: {
    placeholder?: string;
    modelSelectorPlaceholder?: string;
    isUserInputDisabled?: boolean;
    systemMessage?: string;
    multipleModels?: boolean;
} & CardProps) {
    const [inputValue, setInputValue] = useState<string>("");

    const { models, handleModelsAction, isLastLoading, isLoading } =
        useModelData();

    const { handleAddResponseClick } = useModelData();

    const handleModelSelection = (model: Model) => {
        handleModelsAction({ action: "set_initial", model: model });
    };

    return (
        <Card isBlurred className={`flex ${className} `} {...rest}>
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
                            variant="flat"
                            size="md"
                            isLoading={isLoading || isLastLoading}
                            isDisabled={inputValue.length === 0}
                        >
                            <IonIcon
                                name="send"
                                className="text-lg"
                                aria-label="send"
                            />
                        </Button>
                    </>
                ) : (
                    <ModelSelector
                        placeholder={modelSelectorPlaceholder}
                        aria-label="initial model"
                        selectedModels={models}
                        onChange={handleModelSelection}
                        className="w-full"
                        radius="sm"
                        size="lg"
                        variant="flat"
                        multipleModels={multipleModels}
                    />
                )}
            </CardBody>
            {models.length > 0 ? (
                <CardFooter className="gap-3">{children}</CardFooter>
            ) : (
                <Spacer />
            )}
        </Card>
    );
}
