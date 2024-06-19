import ModelAnswer from ".";
import { ModelData } from "@/app/utils/interfaces";

export default function ModelAnswerGroup({
    answers,
}: {
    answers: ModelData[];
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
                                isLast={index === answers.length - 1}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
