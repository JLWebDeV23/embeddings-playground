import { Model, ModelData } from "@/app/utils/interfaces";
import IonIcon from "@reacticons/ionicons";
import ModelSelector from "@/app/components/ModelSelector";
import useModelData from "@/app/hooks/useModelData";
import {
    ChatBubble,
    ScoreBubble,
} from "@/app/components/ModelAnswer/ChatBubble";
import { Divider } from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@/app/components/Card";

function ModelAnswerHeader({
    name,
    modelNumber,
    isLocked,
    isLast = false,
}: {
    name: string;
    isLocked: boolean;
    modelNumber: number;
    isLast?: boolean;
}) {
    const { handleModelsAction, isLoading, isLastLoading } = useModelData();

    const onSelectItem = (model: Model) => {
        handleModelsAction({ action: "add", model });
    };

    const onLockClick = () => {
        handleModelsAction({ action: "lock", index: modelNumber });
    };

    const onRemoveClick = () => {
        handleModelsAction({ action: "pop", index: modelNumber });
    };

    return (
        <div className="flex flex-row justify-between items-center w-full gap-x-3 gap-y-1 flex-wrap">
            <h2 className="font-semibold pl-1">{name}</h2>
            <div className="flex gap-2 h-fit flex-1 justify-end items-center min-h-8">
                {isLast && (
                    <ModelSelector
                        placeholder="Compare with a new model"
                        className="max-w-64 backdrop-blur-md"
                        aria-label="Add a new model"
                        size="sm"
                        onChange={(model) => onSelectItem(model)}
                        isDisabled={isLoading || isLastLoading}
                        startContent={
                            <IonIcon
                                className="pt-0.5"
                                name="add-circle-outline"
                            />
                        }
                    />
                )}
                {modelNumber !== 0 ? (
                    <button
                        className={`text-sm text-gray-500 p-1 rounded-md aspect-square ${
                            isLocked ? "bg-red-900" : ""
                        }`}
                        onClick={() => onLockClick()}
                    >
                        {isLocked ? (
                            <IonIcon name="lock-closed-outline" />
                        ) : (
                            <IonIcon name="lock-open-outline" />
                        )}
                    </button>
                ) : //   <div className="text-sm text-gray-500 p-1 rounded-md aspect-square"></div>
                null}
                <button
                    onClick={onRemoveClick}
                    className="text-sm text-gray-500 p-1 rounded-md aspect-square"
                >
                    <IonIcon name="trash-outline" />
                </button>
            </div>
        </div>
    );
}

export default function ModelAnswer({
    answer,
    modelNumber = 0,
    isLast,
}: {
    answer: ModelData;
    modelNumber?: number;
    isLast?: boolean;
}) {
    const { isLoading, isLastLoading } = useModelData();

    return (
        <>
            <Card
                isBlurred
                className="flex flex-col min-w-[28rem] flex-1 items-center"
            >
                <CardHeader className="w-full">
                    <ModelAnswerHeader
                        name={answer.subModel}
                        isLocked={answer.locked}
                        modelNumber={modelNumber}
                        isLast={isLast}
                    />
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex flex-col p-2 w-full gap-1">
                        {answer.messages.length < 1 && !isLoading ? (
                            <div className="min-h-10 flex h-full items-center">
                                <p className="opacity-50 w-full text-center">
                                    Type a message to start a conversation
                                </p>
                            </div>
                        ) : (
                            answer.messages.map((message, index) => (
                                <div className="flex flex-col p-2" key={index}>
                                    {message.content.length > 0 && (
                                        <>
                                            <ChatBubble
                                                isLoading={
                                                    isLoading ||
                                                    (isLast && isLastLoading)
                                                }
                                                role={message.role}
                                                text={message.content}
                                            />
                                            {message.score && (
                                                <ScoreBubble
                                                    score={message.score}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
