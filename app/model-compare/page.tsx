"use client";

import React from "react";

import ModelCompare from "../components/SystemMessageBox";
import UserInput from "../components/UserInput";
import ModelCompareInputFooter from "../components/UserInput/ModelCompareInputFooter";
import ModelAnswerGroup from "../components/ModelAnswer/ModelAnswerGroup";

import useModelData from "../hooks/useModelData";

export default function Page() {
    const { models, modelData, handleAddResponseClick } = useModelData();
    return (
        <>
            <div className="mb-0 gap-3 flex flex-col flex-1">
                <div className="px-5">
                    <ModelCompare />
                </div>
                {models.length > 0 ? (
                    <div className="pt-2">
                        {modelData.map((obj, index) => (
                            <ModelAnswerGroup
                                key={index}
                                groupNumber={index}
                                answers={obj}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center opacity-50 min-h-20 h-full rounded-md">
                        Select a model below to start
                    </div>
                )}
            </div>
            <div className="flex justify-center w-full sticky bottom-0 px-5 pt-5 bg-gradient-to-t from-background/90 to-transparent">
                <UserInput
                    handleSendMessage={handleAddResponseClick}
                    className="flex flex-col w-full max-w-screen-lg backdrop-blur-md rounded-b-none "
                >
                    <ModelCompareInputFooter />
                </UserInput>
            </div>
        </>
    );
}
