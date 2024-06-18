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

export function EditStringInterpoplations({
    interpolations,
    setInterpolations,
}: {
    interpolations: StringInterpolations[];
    setInterpolations: (interpolations: StringInterpolations[]) => void;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const changeInterpolationVariable = ({
        index,
        pageNumber,
        variable,
        field,
    }: {
        index: number;
        pageNumber?: number | undefined;
        variable?: string;
        field?: string;
    }) => {
        return setInterpolations(
            interpolations.map((page, i) => {
                if (i === pageNumber || pageNumber === undefined) {
                    return {
                        ...page,
                        list: page.list.map((interpolation, j) => {
                            if (j === index) {
                                return {
                                    ...interpolation,
                                    variable:
                                        variable || interpolation.variable,
                                    field: field || interpolation.field,
                                };
                            }
                            return interpolation;
                        }),
                    };
                }
                return page;
            })
        );
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
                                    {interpolations.map(
                                        (interpolations, page) => (
                                            <Tab
                                                key={page}
                                                title={`Page ${page + 1}`}
                                            >
                                                {InterpolationPage(
                                                    interpolations,
                                                    page,
                                                    changeInterpolationVariable
                                                )}
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

function InterpolationPage(
    interpolations: StringInterpolations,
    page: number,
    changeInterpolationVariable: ({
        index,
        pageNumber,
        variable,
        field,
    }: {
        index: number;
        pageNumber?: number | undefined;
        variable?: string;
        field?: string;
    }) => void
) {
    return (
        <div className="flex flex-col gap-3">
            {interpolations.list.map((interpolation, index) => (
                <div className="flex gap-3" key={index}>
                    <Input
                        type="text"
                        label={`Variable ${index + 1}`}
                        placeholder="name"
                        value={interpolations.list[index].variable}
                        onValueChange={(value) =>
                            changeInterpolationVariable({
                                index: index,
                                variable: value,
                            })
                        }
                    />
                    <Input
                        type="text"
                        label={`Field ${index + 1}`}
                        placeholder="Joey"
                        value={interpolations.list[index].field}
                        onValueChange={(value) =>
                            changeInterpolationVariable({
                                pageNumber: page,
                                index: index,
                                field: value,
                            })
                        }
                    />
                </div>
            ))}
        </div>
    );
}
