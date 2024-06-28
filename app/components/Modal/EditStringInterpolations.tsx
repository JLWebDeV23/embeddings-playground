import useModelData from "@/app/hooks/useModelData";
import { StringInterpolations } from "@/app/utils/interfaces";
import {
    Button,
    ButtonProps,
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

export function EditStringInterpoplations(props: ButtonProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPage, setSelectedPage] = useState<string>("0");

    const { interpolations, changeInterpolationVariables, modelData } =
        useModelData();

    return (
        <>
            <Button className="w-full sm:w-fit" onPress={onOpen} {...props}>
                Set Interpolations variables
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Edit string interpolation variables
                            </ModalHeader>
                            <ModalBody>
                                <Tabs
                                    aria-label="Interpolations"
                                    selectedKey={selectedPage}
                                    disabledKeys={[
                                        modelData.length > 0 &&
                                        modelData[0].length > 0 &&
                                        !(modelData[0][0].messages.length < 2)
                                            ? interpolations.length.toString()
                                            : "",
                                    ]}
                                    onSelectionChange={(key) => {
                                        setSelectedPage(key.toString());
                                        if (
                                            key ===
                                            interpolations.length.toString()
                                        ) {
                                            changeInterpolationVariables({
                                                pageNumber:
                                                    interpolations.length,
                                            });
                                        }
                                    }}
                                >
                                    {interpolations?.map(
                                        (interpolation, page) => (
                                            <Tab
                                                key={page}
                                                title={`Page ${page + 1}`}
                                            >
                                                <InterpolationPage
                                                    onDeletePage={() => {
                                                        setSelectedPage(
                                                            page - 1 > 0
                                                                ? (
                                                                      page - 1
                                                                  ).toString()
                                                                : "0"
                                                        );
                                                    }}
                                                    interpolations={
                                                        interpolation
                                                    }
                                                    page={page}
                                                />
                                            </Tab>
                                        )
                                    )}

                                    <Tab
                                        title="New Page"
                                        key={interpolations.length}
                                    ></Tab>
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
    onDeletePage: (page: number) => void;
};

function InterpolationPage({
    interpolations,
    page,
    onDeletePage,
}: InterpolationPageProps) {
    const { deleteInterpolationPage, modelData } = useModelData();

    return (
        <div className="flex flex-col gap-3">
            {page > 0 && (
                <Button
                    variant="flat"
                    color="danger"
                    className="w-fit self-end -mt-16 mb-3 "
                    isDisabled={
                        modelData.length > 0 &&
                        modelData[0].length > 0 &&
                        !(modelData[0][0].messages.length < 2)
                    }
                    onClick={() => {
                        onDeletePage(page);
                        deleteInterpolationPage(page);
                    }}
                >
                    Delete Page
                </Button>
            )}
            {interpolations.list.map((_, index) => (
                <InterpolationInput
                    key={index}
                    index={index}
                    interpolations={interpolations}
                    page={page}
                />
            ))}
            <div className="divider"></div>
            <p>New Entry</p>
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

    const { changeInterpolationVariables, deleteInterpolationVariable } =
        useModelData();
    const [variable, setVariable] = useState<string>(initVariable());
    const [field, setField] = useState<string>(initField());

    function saveVariable() {
        if (
            index < interpolations.list.length &&
            variable.length > 0 &&
            variable !== interpolations.list[index].variable
        ) {
            changeInterpolationVariables({
                index,
                variable,
            });
        }
    }

    function saveField() {
        if (
            index < interpolations.list.length &&
            field.length > 0 &&
            field !== interpolations.list[index].field
        ) {
            changeInterpolationVariables({
                index,
                pageNumber: page,
                field,
            });
        }
    }

    function addInterpolation() {
        changeInterpolationVariables({
            index,
            pageNumber: page,
            variable,
            field,
        });
        setVariable("");
        setField("");
    }

    return (
        <>
            <div className="flex gap-3 items-center" key={index}>
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
                    onBlur={saveVariable}
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
                    onBlur={saveField}
                />

                {
                    // Remove button
                    index < interpolations.list.length && (
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                                deleteInterpolationVariable(index);
                            }}
                        >
                            Remove
                        </Button>
                    )
                }
                {
                    // Add button
                    index === interpolations.list.length && (
                        <Button
                            color="primary"
                            variant={
                                field === "" || variable === ""
                                    ? "light"
                                    : "flat"
                            }
                            onPress={addInterpolation}
                        >
                            Add
                        </Button>
                    )
                }
            </div>
            {(field !== "" || variable !== "") &&
                index === interpolations.list.length && (
                    <p className="text-warning/70 text-xs -mb-7">
                        New Entry not saved
                    </p>
                )}
        </>
    );
}
