import { Model, ModelData } from "@/app/utils/interfaces";
import IonIcon from "@reacticons/ionicons";
import ModelSelector from "@/app/components/ModelSelector";
import Markdown from "react-markdown";
import useModelData from "@/app/hooks/useModelData";
import { Chip } from "@nextui-org/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function ChatBubble({ text, role }: { text: string; role: string }) {
    return (
        <>
            {/* <p className={` text-xs px-2 py-1 ${role === "user" ? "self-end" : ""}`}>{role}</p> */}
            <div
                className={`flex justify-start p-2 rounded-md w-full ${
                    role === "user" ? "self-end bg-surface/50" : ""
                }`}
            >
                <div className="markdown text-sm text-gray-500 w-full">
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[
                            rehypeSlug,
                            rehypeCodeTitles,
                            [
                                rehypePrism,
                                {
                                    ignoreMissing: true,
                                },
                            ],
                            [
                                rehypeAutolinkHeadings,
                                {
                                    properties: {
                                        className: ["anchor"],
                                    },
                                },
                            ],
                        ]}
                    >
                        {text}
                    </Markdown>
                </div>
            </div>
        </>
    );
}

function ScoreBubble({ score }: { score: number }) {
    function getScoreColor(score: number) {
        if (score < 0.3) {
            return "danger";
        } else if (score < 0.7) {
            return "warning";
        } else {
            return "success";
        }
    }

    return (
        <Chip
            variant="dot"
            size="sm"
            color={getScoreColor(score)}
            className="ml-3"
        >
            {score}
        </Chip>
    );
}

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
        <div className="flex flex-row justify-between items-center w-full p-2 border-b-2  gap-3 border-b-surface">
            <h2 className="font-semibold pl-1">{name}</h2>
            <div className="flex gap-2 h-full flex-1 justify-end min-h-8">
                {isLast && (
                    <ModelSelector
                        placeholder="Compare with a new model"
                        className="max-w-64"
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
    modelNumber,
    isLast,
}: {
    answer: ModelData;
    modelNumber: number;
    isLast?: boolean;
}) {
    const { isLoading, isLastLoading } = useModelData();

    console.log(answer);
    return (
        <div
            className={`flex flex-col rounded-md min-w-96 w-full items-center  ${
                isLoading || (isLastLoading && isLast) ? "skeleton" : "bg-card"
            }`}
        >
            <ModelAnswerHeader
                name={answer.subModel}
                isLocked={answer.locked}
                modelNumber={modelNumber}
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
                        <div className="flex flex-col" key={index}>
                            <ChatBubble
                                role={message.role}
                                text={message.content}
                            />
                            {message.score && (
                                <ScoreBubble score={message.score} />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
