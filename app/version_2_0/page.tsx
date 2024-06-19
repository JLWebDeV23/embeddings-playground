"use client";
import React, { useState } from "react";
import { Model, StringInterpolations } from "@/app/utils/interfaces";

import ModelCompare from "../components/ModelCompare";
import UserInput from "../components/UserInput";
import ModelAnswerGroup from "../components/ModelAnswer/ModelAnswerGroup";

import useModelData from "../hooks/useModelData";

const Version_2_0 = () => {
    /* Array of selected models */

    const { models, modelData } = useModelData();

    function handleSetInterpolations(value: StringInterpolations[]) {
        /* setInterpolations((prev) => {
            prev
        }); */
    }

    console.log(modelData);
    return (
        <>
            <div className="m-5 gap-3 flex flex-col flex-1 ">
                <ModelCompare />
                {models.length > 0 ? (
                    modelData.map((obj, index) => (
                        <ModelAnswerGroup key={index} answers={obj} />
                    ))
                ) : (
                    <div className="flex justify-center items-center opacity-50 min-h-20">
                        Select a model to start
                    </div>
                )}
            </div>
            <div className="sticky bottom-0 p-5 gap-3 flex flex-col  backdrop-blur-md">
                <UserInput className="pt-4 w-full" />
            </div>
        </>
    );
};

export default Version_2_0;
