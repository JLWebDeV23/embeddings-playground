import React, { useState } from 'react';
import InputBox from '@/app/components/InputBox/InputBox';

export default function ModelCompare() {
    const [sysMessage, setSysMessage] = useState<string>("");

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