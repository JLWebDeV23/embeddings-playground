import React, { useState } from "react";
import InputBox from "../InputBox/InputBox";
import useModelData from "@/app/hooks/useModelData";
import { Card, CardBody } from "../Card";
import { CardProps } from "@nextui-org/react";

export default function UserInput({
    isUserInputDisabled = false,
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
    const showAlert = false;

    const { handleAddResponseClick } = useModelData();

    const isButtonDisabled = inputValue.length === 0;

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
                    <Button
                        size="sm"
                        onPress={() => {
                            handleModelsAction({ action: "reset" });
                        }}
                        className="hover:bg-danger"
                        variant="flat"
                    >
                        Reset
                    </Button>
                </CardFooter>
            ) : (
                <Spacer />
            )}
        </Card>
    );
}
