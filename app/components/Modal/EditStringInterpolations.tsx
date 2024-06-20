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

export function EditStringInterpoplations() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { interpolations } = useModelData();

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
};

function InterpolationPage({ interpolations, page }: InterpolationPageProps) {
    return (
        <div className="flex flex-col gap-3">
            {interpolations.list.map((_, index) => (
                <InterpolationInput
                    key={index}
                    index={index}
                    interpolations={interpolations}
                    page={page}
                />
            ))}
            <InterpolationInput
                index={interpolations.list.length}
                interpolations={interpolations}
                page={page}
            />
        </div>
    );
}

function InterpolationInput({
    index,
    interpolations,
    page,
}: {
    index: number;
    interpolations: StringInterpolations;
    page: number;
}) {
    function initVariable() {
        if (index < interpolations.list.length) {
            return interpolations.list[index].variable;
        }
        return "";
    }

    function initField() {
        if (index < interpolations.list.length) {
            return interpolations.list[index].field;
        }
        return "";
    }

    const { changeInterpolationVariable } = useModelData();
    const [variable, setVariable] = useState<string>(initVariable());
    const [field, setField] = useState<string>(initField());
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
                    if (variable.length > 0 && field.length > 0) {
                        changeInterpolationVariable({
                            index,
                            pageNumber: page,
                            variable,
                            field,
                        });
                        if (index >= interpolations.list.length) {
                            setVariable("");
                            setField("");
                        }
                        return;
                    }
                    console.error("Invalid input");
                }}
            >
                Save
            </Button>
            <Button>Delete</Button>
        </div>
    );
}
