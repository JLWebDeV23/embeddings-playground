import React, { useState } from 'react';
import InputBox from '@/app/components/InputBox/InputBox';
import { Select, SelectItem } from "@nextui-org/react";
import models from "@/public/assets/data/ModelData.json";


export default function ModelCompare() {
    const [sysMessage, setSysMessage] = useState<string>("");

    /*     console.log(models.map((model) => model.submodel)) */

    const submitSysMessage = () => {
        console.log(sysMessage);
    }

    return (
        <div className="flex flex-col bg-card p-3 rounded-md">
            <h1 className="font-bold text-xl">Model Compare</h1>
            <div className="flex gap-3 pt-3 items-end">
                <InputBox
                    inputText={"System Message"}
                    isButtonVisabled
                    value={sysMessage}
                    handleInput={(e) => setSysMessage(e.target.value)}
                    onSubmit={submitSysMessage}
                />
                <button
                    className="btn btn-lg"
                    onClick={() => alert("not implemented")}
                >
                    GO
                </button>
            </div>
            <div className="divider"></div>
            <div className="flex gap-3 flex-wrap">
                <Select
                    placeholder="Select an animal"
                    className="max-w-xs"
                >
                    {models.map((model, findex) =>
                        <SelectItem key={findex}>
                            {model.model}
                        </SelectItem>
                    )}
                </Select>
                {models.map((model, index) => (
                    <button
                        key={index}
                        className="btn btn-sm"
                        onClick={() => alert("not implemented")}
                    >
                        {model.model}
                    </button>
                ))
                }
                <button
                    className="btn btn-sm btn-disabled"
                    onClick={() => alert("not implemented")}
                >
                    LlaMA 3: llama3-8b-8192
                </button>
                <button
                    className="btn btn-sm btn-disabled"
                    onClick={() => alert("not implemented")}
                >
                    LlaMA 3: llama3-8b-8192
                </button>
                <button
                    className="btn btn-sm"
                    onClick={() => alert("not implemented")}
                >
                    Add a new model
                </button>
            </div>
        </div>
    )
}