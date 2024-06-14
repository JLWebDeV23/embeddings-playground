import ModelAnswer from ".";
import { ModelData } from "@/app/utils/interfaces";

export default function ModelAnswerGroup({ answers, isLoading }: { answers: ModelData[], isLoading: boolean }) {
    console.log(answers);
    return (
        <div className="flex flex-col gap-3">
            <h1 className="">Responses</h1>
            <div className="flex flex-row gap-4 w-full overflow-x-auto">
                {answers.map((answer, index) => (
                    <ModelAnswer key={index} answer={answer} isLoading={isLoading} />
                ))}
            </div>
        </div>
    )

}