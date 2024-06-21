"use client";
import React from "react";

import ModelCompare from "../components/ModelCompare";
import UserInput from "../components/UserInput";
import ModelAnswerGroup from "../components/ModelAnswer/ModelAnswerGroup";

import useModelData from "../hooks/useModelData";

const Version_2_0 = () => {
    const { models, modelData } = useModelData();
    return (
        <>
            <div className="m-5 mb-0 gap-5 flex flex-col flex-1 ">
                <ModelCompare />
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
};

export default Version_2_0;
