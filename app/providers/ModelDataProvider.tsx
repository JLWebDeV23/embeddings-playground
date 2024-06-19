import {
    Message,
    Model,
    ModelData,
    StringInterpolation,
    StringInterpolations,
} from "@/app/utils/interfaces";
import {
    go,
    insertUserPrompt,
    createNewModelData,
} from "@/app/utils/modelProcessing";
import { PropsWithChildren, createContext, useState } from "react";

type handleGoClickFunction = (args: {
    newSystemMessage: string;
    interpolations: StringInterpolation[];
}) => void;

type ModelsActionsFunction = ({
    action,
    index,
    model,
}: {
    action: "add" | "pop" | "lock";
    index?: number;
    model?: Model;
}) => void;

export const Context = createContext<{
    isLoading: boolean;
    isLastLoading: boolean;
    models: Model[];
    modelData: ModelData[][];
    interpolations: StringInterpolations[];
    handleGoClick: handleGoClickFunction;
    handleAddResponseClick: (value: string) => void;
    handleModelsAction: ModelsActionsFunction;
} | null>(null);

/* 
    Function to build the modelData array from the api response but synchronised with the models array
*/
const resolveModelData = (
    models: Model[],
    modelData: ModelData[][],
    numberOfInterpolations = 1
) => {
    return Array.from({ length: numberOfInterpolations }, (_, index) => {
        return models.map((model, modelIndex) => {
            return (
                modelData[index]?.[modelIndex] ||
                newModelData(model, modelIndex === 0)
            );
        });
    });
};

const newModelData = (model: Model, locked = false) => {
    return {
        model: model.model,
        subModel: model.subModel,
        messages: [] as Message[],
        locked: locked,
    };
};

export default function ModelDataProvider({ children }: PropsWithChildren) {
    const [models, setModels] = useState<Model[]>([]);

    /* Array of string interpolations */
    const [interpolations, setInterpolations] = useState<
        StringInterpolations[]
    >([
        {
            list: [
                {
                    key: 0,
                    variable: "name",
                    field: "Joey",
                },
            ],
        },
    ]);

    /* Answers from the api */
    const [apiModelData, setapiModelData] = useState<ModelData[][]>([[]]);

    /* States to knwow when we load data */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastLoading, setIsLastLoading] = useState<boolean>(false);

    const modelData: ModelData[][] = resolveModelData(models, apiModelData);

    /* function to handle a click on the go button (in ModelCompare) */
    const handleGoClick: handleGoClickFunction = ({
        newSystemMessage,
        interpolations,
    }) => {
        //setSystemMessage(newSystemMessage);

        if (models.length === 0) {
            console.error("No models selected");
            return;
        }
        setIsLoading(true);
        go({
            modelData: modelData,
            systemMessage: newSystemMessage,
            stringInterpolations: [{ list: interpolations }],
        }).then((response) => {
            setapiModelData(response);
            setIsLoading(false);
        });
    };

    /* function to handle a click on the add button (in UserInput) */
    const handleAddResponseClick = (value: string) => {
        if (models.length === 0) {
            console.error("No models selected");
            return;
        }

        // setSystemMessage(systemMessage)
        setIsLoading(true);
        insertUserPrompt({
            modelData: modelData,
            userPrompt: value,
            /*  systemMessage: systemMessage, */
            systemMessage: "",
            stringInterpolations: interpolations,
        }).then((response) => {
            if (response) {
                setapiModelData(response);
            }
            setIsLoading(false);
        });
    };

    /* 
        function to handle model actions in the ModelAnswerGroup component 
        @param action: "add" | "pop" | "lock" - action to perform on the models array
        @param index: number - index of the model in the models array
        @param model: Model - model to add to the models array
    */
    const handleModelsAction: ModelsActionsFunction = ({
        action,
        index = models.length - 1,
        model,
    }) => {
        switch (action) {
            case "add":
                // Add the model to the end of the models array
                if (!model) throw new Error("Model is required");
                setModels([...models, model]);
                setIsLastLoading(true);
                createNewModelData({
                    modelData: modelData,
                    newModelData: {
                        model: model.model,
                        subModel: model.subModel,
                        messages: [],
                        locked: false,
                    },
                    systemMessage: "",
                    stringInterpolations: [{ list: [] }],
                }).then((response) => {
                    setapiModelData(() => response);
                    setIsLastLoading(false);
                });

                break;
            case "pop":
                // Remove the model at index from the models array

                if (index === 0) {
                    setModels([]);
                    setapiModelData([[]]);
                    break;
                }

                setModels(() => [
                    ...models.slice(0, index),
                    ...models.slice(index + 1),
                ]);
                // Remove the model at index from the apiModelData matrix
                setapiModelData((prev) => {
                    const newModelData = [...prev];
                    newModelData.forEach((interpolationAnswer) => {
                        interpolationAnswer.splice(index, 1);
                    });
                    return newModelData;
                });
                break;
            case "lock":
                // Toggle the lock status of the model at index
                setapiModelData(() => {
                    const newModelData = modelData.map((interpolationAnswer) =>
                        interpolationAnswer.map((modelData, i) => {
                            if (i === index) {
                                return {
                                    ...modelData,
                                    locked: !modelData.locked,
                                };
                            }
                            return modelData;
                        })
                    );
                    return newModelData;
                });
                break;
            default:
                break;
        }
    };

    return (
        <Context.Provider
            value={{
                models,
                modelData,
                interpolations,
                handleGoClick,
                handleAddResponseClick,
                handleModelsAction,
                isLoading,
                isLastLoading /* whatever related to modelData */,
            }}
        >
            {children}
        </Context.Provider>
    );
}
