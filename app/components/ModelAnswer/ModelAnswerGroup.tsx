import ModelAnswer from ".";
import { Answer } from "@/app/utils/types";

export default function ModelAnswerGroup({ answers }: { answers: Answer[] }) {

    return (
        <div className="flex flex-col gap-3">
            <h1 className="">Responses</h1>
            <div className="flex flex-row gap-4 w-full overflow-x-auto">
                {answers.map((answer, index) => (
                    <ModelAnswer key={index} answer={answer} />
                ))}
            </div>
        </div>
    )

}