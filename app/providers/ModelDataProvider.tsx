import {
    Message,
    Model,
    ModelData,
    StringInterpolations,
} from "@/app/utils/interfaces";
import {
    go,
    insertUserPrompt,
    createNewModelData,
} from "@/app/utils/modelProcessing";
import { PropsWithChildren, createContext, useState } from "react";
import useSystemMessage from "@/app/hooks/useSystemMessage";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

type handleGoClickFunction = (args: { newSystemMessage: string }) => void;

type handleAddResponseClickFunction = (value: string) => void;

type ModelsActionsFunction = ({
    action,
    index,
    model,
}: {
    action: "set_initial" | "reset" | "add" | "pop" | "lock";
    index?: number;
    model?: Model;
}) => void;

type changeInterpolationVariablesFunction = ({
    index,
    pageNumber,
    variable,
    field,
}: {
    index?: number;
    pageNumber?: number | undefined;
    variable?: string;
    field?: string;
}) => void;

export const Context = createContext<{
    isLoading: boolean;
    isLastLoading: boolean;
    models: Model[];
    modelData: ModelData[][];
    interpolations: StringInterpolations[];
    changeInterpolationVariables: changeInterpolationVariablesFunction;
    deleteInterpolationPage: (index: number) => void;
    deleteInterpolationVariable: (index: number) => void;
    handleGoClick: handleGoClickFunction;
    handleAddResponseClick: handleAddResponseClickFunction;
    handleModelsAction: ModelsActionsFunction;
    openModal: (args: { title: string; message: string }) => void;
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

    const { systemMessage } = useSystemMessage();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalMessage, setModalMessage] = useState({
        title: "",
        message: "",
    });

    const openModal = ({
        title,
        message,
    }: {
        title: string;
        message: string;
    }) => {
        setModalMessage({ title, message });
        onOpen();
    };

    /* 
        function to handle model actions in the ModelAnswerGroup component 
        @param action: "set_initial" | "reset" | "add" | "pop" | "lock" - action to perform on the models array
        @param index: number - index of the model in the models array
        @param model: Model - model to add to the models array
    */
    const handleModelsAction: ModelsActionsFunction = ({
        action,
        index = models.length - 1,
        model,
    }) => {
        switch (action) {
            case "set_initial":
                // Set the model as the only model in the models array
                if (!model) throw new Error("Model is required");
                setModels([model]);
                setApiModelData([[]]);
                break;
            case "reset":
                // Reset the models array
                setModels([]);
                setApiModelData([[]]);
                break;
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
                    systemMessage: systemMessage,
                    stringInterpolations: interpolations,
                }).then((response) => {
                    setApiModelData(() => response);
                    setIsLastLoading(false);
                });

                break;
            case "pop":
                // Remove the model at index from the models array

                if (index === 0) {
                    setModels([]);
                    setApiModelData([[]]);
                    break;
                }

                setModels(() => [
                    ...models.slice(0, index),
                    ...models.slice(index + 1),
                ]);
                // Remove the model at index from the apiModelData matrix
                setApiModelData((prev) => {
                    const newModelData = [...prev];
                    newModelData.forEach((interpolationAnswer) => {
                        interpolationAnswer.splice(index, 1);
                    });
                    return newModelData;
                });
                break;
            case "lock":
                // Toggle the lock status of the model at index
                setApiModelData(() => {
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

    /* Function used to update the InterpolationVariables array
     * @param index: The index of the variable in the list
     * @param pageNumber: The page number (optional if we just want to update the variable name)
     * @param variable: The variable name (optional)
     * @param field: The field name (optional)
     */
    const changeInterpolationVariables: changeInterpolationVariablesFunction =
        ({ index, pageNumber, variable, field }) => {
            setInterpolations((prev) => {
                /* If a user wants to add a new page, we duplicate the last one */
                if (pageNumber && pageNumber === prev.length) {
                    return [...prev, prev[prev.length - 1]];
                }
                /* The user wants to either add or update a value in the interpolations array */
                return prev.map((page, i) => {
                    /* The user wants to add a new variable / field set */
                    if (index === page.list.length && variable && field) {
                        return {
                            ...page,
                            list: [
                                ...page.list,
                                {
                                    key: page.list.length,
                                    variable: variable,
                                    field: field,
                                },
                            ],
                        };
                    }
                    /* The user wants to edit a variable or a field
                     * We only update the field if the page number matches the index but we update the variable name in every page
                     */
                    const list = page.list.map((prev, j) => {
                        if (j === index) {
                            return {
                                ...prev,
                                variable: variable || prev.variable,
                                field:
                                    field && pageNumber === i
                                        ? field
                                        : prev.field,
                            };
                        }
                        return prev;
                    });

                    return {
                        ...page,
                        list: list,
                    };
                });
            });
        };

    const deleteInterpolationPage = (index: number) => {
        setInterpolations((prev) => {
            if (prev.length === 1) {
                return prev;
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const deleteInterpolationVariable = (index: number) => {
        setInterpolations((prev) => {
            return prev.map((page) => {
                return {
                    ...page,
                    list: page.list.filter((_, i) => i !== index),
                };
            });
        });
    };

    /* Answers from the api */
    const [apiModelData, setApiModelData] = useState<ModelData[][]>([[]]);

    /* States to knwow when we load data */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastLoading, setIsLastLoading] = useState<boolean>(false);

    const modelData: ModelData[][] = resolveModelData(
        models,
        apiModelData,
        interpolations.length
    );

    /* function to handle a click on the go button (in ModelCompare) */
    const handleGoClick: handleGoClickFunction = ({ newSystemMessage }) => {
        if (models.length === 0) {
            console.error("No models selected");
            openModal({
                title: "Error",
                message: "Please select a model",
            });
            return;
        }
        setIsLoading(true);
        go({
            modelData: modelData,
            systemMessage: newSystemMessage,
            stringInterpolations: interpolations,
        })
            .then((response) => {
                console.log(response);
                setApiModelData(response);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                openModal({
                    title: "Error",
                    message: "The system has encountered an error",
                });
                setIsLoading(false);
            });
    };

    /* function to handle a click on the add button (in UserInput) */
    const handleAddResponseClick = (value: string) => {
        if (models.length === 0) {
            console.error("No models selected");
            return;
        }

        setIsLoading(true);
        insertUserPrompt({
            modelData: modelData,
            userPrompt: value,
            systemMessage: systemMessage,
            stringInterpolations: interpolations,
        })
            .then((response) => {
                console.log(response);
                if (response) {
                    setApiModelData(response);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                openModal({
                    title: "Error",
                    message: "The system has encountered an error",
                });
                setIsLoading(false);
            });
    };

    return (
        <Context.Provider
            value={{
                models,
                modelData,
                interpolations,
                changeInterpolationVariables,
                deleteInterpolationPage,
                deleteInterpolationVariable,
                handleGoClick,
                handleAddResponseClick,
                handleModelsAction,
                isLoading,
                isLastLoading /* whatever related to modelData */,
                openModal,
            }}
        >
            <>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    {modalMessage.title}
                                </ModalHeader>
                                <ModalBody>{modalMessage.message}</ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {children}
            </>
        </Context.Provider>
    );
}
