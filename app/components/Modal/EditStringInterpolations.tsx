import useModelData from "@/app/hooks/useModelData";
import { StringInterpolations } from "@/app/utils/interfaces";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useState } from "react";

type changeInterpolationVariableFunction = ({
    index,
    pageNumber,
    variable,
    field,
}: {
    index: number;
    pageNumber?: number | undefined;
    variable?: string;
    field?: string;
}) => void;

export function EditStringInterpoplations() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { interpolations } = useModelData();

    /* Function used to update the InterpolationVariables array
     * @param index: The index of the variable in the list
     * @param pageNumber: The page number (optional if we just want to update the variable name)
     * @param variable: The variable name (optional)
     * @param field: The field name (optional)
     */
    const changeInterpolationVariable: changeInterpolationVariableFunction = ({
        index,
        pageNumber,
        variable,
        field,
    }) => {
        /* If a user wants to add a new page, we duplicate the last one */
        if (pageNumber && pageNumber === interpolations.length) {
            return;
        }
        /* The user wants to either add or update a value in the interpolations array */
        return interpolations.map((page, i) => {
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
             * We only update the variable or the field if the page number matches the index but we update the variable name in every page
             */
            const list = page.list.map((interpolations, j) => {
                if (j === index) {
                    return {
                        ...interpolations,
                        variable: variable || interpolations.variable,
                        field:
                            field && pageNumber === i
                                ? field
                                : interpolations.field,
                    };
                }
                return interpolations;
            });

            return {
                ...page,
                list: list,
            };
        });
    };
    return (
        <>
            <Button className="w-full sm:w-fit" onPress={onOpen}>
                Set Interpolations variables
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Edit string interpolation variables
                            </ModalHeader>
                            <ModalBody>
                                <Tabs aria-label="Interpolations">
                                    {interpolations?.map(
                                        (interpolation, page) => (
                                            <Tab
                                                key={page}
                                                title={`Page ${page + 1}`}
                                            >
                                                <InterpolationPage
                                                    changeInterpolationVariable={
                                                        changeInterpolationVariable
                                                    }
                                                    interpolations={
                                                        interpolation
                                                    }
                                                    page={page}
                                                />
                                            </Tab>
                                        )
                                    )}
                                </Tabs>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Done
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

type InterpolationPageProps = {
    interpolations: StringInterpolations;
    page: number;
    changeInterpolationVariable: changeInterpolationVariableFunction;
};

function InterpolationPage({
    interpolations,
    page,
    changeInterpolationVariable,
}: InterpolationPageProps) {
    return (
        <div className="flex flex-col gap-3">
            {interpolations.list.map((_, index) =>
                InterpolationInput({
                    index,
                    interpolations,
                    changeInterpolationVariable,
                    page,
                })
            )}
            <InterpolationInput
                index={interpolations.list.length}
                interpolations={interpolations}
                changeInterpolationVariable={changeInterpolationVariable}
                page={page}
            />
        </div>
    );
}

function InterpolationInput({
    index,
    interpolations,
    changeInterpolationVariable,
    page,
}: {
    index: number;
    interpolations: StringInterpolations;
    changeInterpolationVariable: changeInterpolationVariableFunction;
    page: number;
}) {
    const [variable, setVariable] = useState<string>("1234");
    /* () => {
    if (index < interpolations.list.length) {
        return interpolations.list[index].field;
    }
    return "";
}; */
    /* 
() => {
    if (index < interpolations.list.length) {
        return interpolations.list[index].variable;
    }
    return "";
}; */
    const [field, setField] = useState<string>("5678");
    return (
        <div className="flex gap-3" key={index}>
            <Input
                type="text"
                label={`Variable ${index + 1}`}
                placeholder={
                    index < interpolations.list.length
                        ? interpolations.list[index].variable
                        : "name"
                }
                value={variable}
                onValueChange={setVariable}
            />
            <Input
                type="text"
                label={`Field ${index + 1}`}
                placeholder={
                    index < interpolations.list.length
                        ? interpolations.list[index].field
                        : "John Doe"
                }
                value={field}
                onValueChange={setField}
            />
            <Button
                onClick={() => {
                    console.log(variable, field);
                    if (variable.length > 0 && field.length > 0) {
                        changeInterpolationVariable({
                            index,
                            pageNumber: page,
                            variable,
                            field,
                        });
                        return;
                    }
                    console.log("Invalid input");
                }}
            >
                Save
            </Button>
        </div>
    );
}
