"use client";

import React from "react";

import ModelCompare from "../ModelCompare";
import UserInput from "../UserInput";
import ModelAnswerGroup from "../ModelAnswer/ModelAnswerGroup";

import useModelData from "../../hooks/useModelData";

export default function Version_2_0() {
    const { models, modelData } = useModelData();
    return (
        <>
            <div className="mb-0 gap-5 flex flex-col flex-1">
                <div className="px-5">
                    <ModelCompare />
                </div>
                {models.length > 0 ? (
                    modelData.map((obj, index) => (
                        <ModelAnswerGroup key={index} answers={obj} />
                    ))
                ) : (
                    <div className="flex justify-center items-center opacity-50 min-h-20 h-full rounded-md">
                        Select a model to start
                    </div>
                )}
            </div>
            <div className="sticky bottom-0 p-5 gap-3 flex flex-col  backdrop-blur-md">
                <UserInput
                    className="pt-4 w-full"
                    isUserInputDisabled={models.length === 0}
                />
            </div>
        </>
    );
}
