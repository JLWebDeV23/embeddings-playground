import React, { useState } from 'react';
import InputBox from '@/app/components/InputBox/InputBox';
import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import models from "@/public/assets/data/ModelData.json";
import { type Model, type StringInterpolation } from '@/app/utils/interfaces';


interface ModelCompareProps {
    handleGoClick: ({ newSystemMessage, interpolations, models }: {
        newSystemMessage: string,
        interpolations: StringInterpolation[],
        models: Model[]

    }) => void
}

export default function ModelCompare({
    handleGoClick
}: ModelCompareProps) {
    const [systemMessage, setSystemMessage] = useState<string>("");
    const [selectedModels, setSelectedModels] = useState<Model[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const model: Model = JSON.parse(e.target.value);
        setSelectedModels([...selectedModels, model]);
    }

    const submitSysMessage = () => {
        setSystemMessage(systemMessage);
    }

    return (
        <div className="flex flex-col bg-card p-3 rounded-md">
            <h1 className="font-bold text-xl">Model Compare</h1>
            <div className="divider"></div>
            <div className="flex gap-3 flex-wrap">
                <Select
                    placeholder="Select the initial model"
                    className="max-w-64"
                    onChange={handleChange}
                    label="Initial model"

                >
                    {models.map((model, findex) =>
                        <SelectSection title={model.model} key={model.model}>
                            {model.submodel.map((submodel, sindex) =>
                                <SelectItem key={JSON.stringify({
                                    model: model.model,
                                    subModel: submodel.model
                                })} value={sindex}>{submodel.model}</SelectItem>
                            )}
                        </SelectSection>
                    )}
                </Select>
            </div>
            <div className="flex gap-3 pt-3 items-end">
                <InputBox
                    inputText={"System Message"}
                    isButtonVisabled
                    value={systemMessage}
                    handleInput={(e) => setSystemMessage(e.target.value)}
                    onSubmit={submitSysMessage}
                />
                <button
                    className="btn btn-lg"
                    onClick={() => handleGoClick({ newSystemMessage: systemMessage, interpolations: [], models: selectedModels })}
                >
                    GO
                </button>
            </div>

        </div >
    )
}