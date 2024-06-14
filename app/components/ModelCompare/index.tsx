import React, { useState } from 'react';
import InputBox from '@/app/components/InputBox/InputBox';
import { Button, Select, SelectItem, SelectSection } from "@nextui-org/react";
import models from "@/public/assets/data/ModelData.json";
import { IonIcon } from '@ionic/react';
import { type ModelData, type StringInterpolation } from '@/app/utils/interfaces';


interface ModelCompareProps {
    handleGoClick: ({ newSystemMessage, interpolations, models }: {
        newSystemMessage: string,
        interpolations: StringInterpolation[],
        models: ModelData[]

    }) => void
}

export default function ModelCompare({
    handleGoClick
}: ModelCompareProps) {
    const [systemMessage, setSystemMessage] = useState<string>("");
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModels([...selectedModels, e.target.value]);
    }

    const submitSysMessage = () => {
        console.log(systemMessage);
    }

    return (
        <div className="flex flex-col bg-card p-3 rounded-md">
            <h1 className="font-bold text-xl">Model Compare</h1>
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
            <div className="divider"></div>
            <div className="flex gap-3 flex-wrap">
                {
                    selectedModels.map((model, index) => (
                        <Button
                            key={index}
                            endContent={<IonIcon name='close-outline' />}
                            onClick={() => alert("not implemented")}
                        >
                            {model}
                        </Button>
                    ))
                }
                <Select
                    placeholder="Add a new model"
                    className="max-w-64"
                    onChange={handleChange}
                    selectedKeys={[]}
                    aria-label="Select a model"
                >
                    {models.map((model, findex) =>
                        <SelectSection title={model.model} key={model.model}>
                            {model.submodel.map((submodel, sindex) =>
                                <SelectItem key={submodel.model} value={sindex}>{submodel.model}</SelectItem>
                            )}
                        </SelectSection>
                    )}
                </Select>
            </div>
        </div >
    )
}