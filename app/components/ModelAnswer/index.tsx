import { Model, ModelData, ModelsActionFunction } from "@/app/utils/interfaces";
import IonIcon from "@reacticons/ionicons";
import ModelSelector from "@/app/components/ModelSelector";
import ReactMarkdown from "react-markdown";

function ChatBubble({ text, role }: { text: string; role: string }) {
    return (
        <>
            {/* <p className={` text-xs px-2 py-1 ${role === "user" ? "self-end" : ""}`}>{role}</p> */}
            <div
                className={`flex justify-start p-2 rounded-md ${
                    role === "user" ? "self-end bg-surface/50" : ""
                }`}
            >
                <div className="text-sm text-gray-500">
                    <ReactMarkdown>{text}</ReactMarkdown>
                </div>
            </div>
        </>
    );
}

function ModelAnswerHeader({
    name,
    modelNumber,
    isLocked,
    isLast = false,
    onModelsAction,
}: {
    name: string;
    isLocked: boolean;
    modelNumber: number;
    isLast?: boolean;
    onModelsAction: ModelsActionFunction;
}) {
    const onSelectItem = (model: Model) => {
        onModelsAction({ action: "add", model });
    };

    const onLockClick = () => {
        onModelsAction({ action: "lock", index: modelNumber });
    };

    const onRemoveClick = () => {
        onModelsAction({ action: "pop", index: modelNumber });
    };

    return (
        <div className="flex flex-row justify-between items-center w-full p-2 border-b-2  gap-3 border-b-surface">
            <h2 className="font-semibold pl-1">{name}</h2>
            <div className="flex gap-2 h-full flex-1 justify-end min-h-8">
                {isLast && (
                    <ModelSelector
                        placeholder="Compare with a new model"
                        aria-label="Add a new model"
                        size="sm"
                        onChange={(model) => onSelectItem(model)}
                        startContent={
                            <IonIcon
                                className="pt-0.5"
                                name="add-circle-outline"
                            />
                        }
                    />
                )}
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
    isLoading,
    modelNumber,
    isLast,
    onModelsAction,
}: {
    answer: ModelData;
    isLoading: boolean;
    modelNumber: number;
    isLast?: boolean;
    onModelsAction: ModelsActionFunction;
}) {
    return (
        <div
            className={`flex flex-col rounded-md min-w-96 w-full items-center  ${
                isLoading ? "skeleton" : "bg-card"
            }`}
        >
            <ModelAnswerHeader
                name={answer.subModel}
                isLocked={answer.locked}
                modelNumber={modelNumber}
                onModelsAction={onModelsAction}
                isLast={isLast}
            />
            {/* max-w-[800px] */}
            <div className="flex flex-col p-2 w-full gap-5">
                {answer.messages.length < 1 && !isLoading ? (
                    <div className="min-h-10 flex h-full items-center">
                        <p className="opacity-50 w-full text-center">
                            Type a message to start a conversation
                        </p>
                    </div>
                ) : (
                    answer.messages.map((message, index) => (
                        <ChatBubble
                            key={index}
                            role={message.role}
                            text={message.content}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
