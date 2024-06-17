import ModelAnswer from ".";
import { ModelData, ModelsActionFunction } from "@/app/utils/interfaces";

export default function ModelAnswerGroup({
    answers,
    isLoading,
    onModelsAction,
}: {
    answers: ModelData[];
    isLoading: boolean;
    onModelsAction: ModelsActionFunction;
}) {
    return (
        <div className="flex flex-col gap-3">
            {answers.length > 0 && (
                <>
                    <h1 className="">Responses</h1>
                    <div className="flex flex-row gap-4 w-full overflow-x-auto">
                        {answers.map((answer, index) => (
                            <ModelAnswer
                                key={index}
                                modelNumber={index}
                                answer={answer}
                                onModelsAction={onModelsAction}
                                isLoading={isLoading}
                                isLast={index === answers.length - 1}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
