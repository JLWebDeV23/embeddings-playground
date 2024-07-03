"use client";
import UserInput from "../components/UserInput";
import SystemMessageBox from "../components/SystemMessageBox";
import ModelSelector from "../components/ModelSelector";
import useModelData from "../hooks/useModelData";
import { Model } from "../utils/interfaces";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
    Tabs,
    Tab,
    Textarea,
    Spacer,
    Input,
    ScrollShadow,
} from "@nextui-org/react";
import { useState } from "react";
import {
    collectionExists,
    createCollection,
    getCollectionsList,
    upsertPoints,
} from "../utils/collection";

function AddSourceTab({
    onAddSource,
}: {
    onAddSource: (name: string, source: string) => void;
}) {
    const [name, setName] = useState<string>("");
    const [source, setSource] = useState("");
    return (
        <>
            <Input
                placeholder="Name"
                value={name}
                onValueChange={(value) => setName(value)}
            />
            <Textarea
                placeholder="Enter the source"
                className="w-full"
                minRows={7}
                maxRows={7}
                value={source}
                onValueChange={(value) => setSource(value)}
            />
            <Button
                variant="flat"
                className="w-fit self-end"
                isDisabled={!name || !source}
                onPress={() => {
                    onAddSource(name, source);
                }}
            >
                Add
            </Button>
        </>
    );
}

function SourcesModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [collectionList, setCollectionList] = useState<string[]>([]);

    getCollectionsList().then((collections) => {
        setCollectionList(collections.map((collection) => collection.name));
    });

    return (
        <>
            <Button size="sm" onPress={onOpen} variant="flat">
                Sources
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Sources
                            </ModalHeader>
                            <ModalBody className="w-full">
                                <Tabs aria-label="Options" isVertical>
                                    <Tab
                                        title="Add a new source"
                                        key={0}
                                        className="flex flex-col w-full gap-4"
                                    >
                                        <AddSourceTab
                                            onAddSource={async (
                                                name: string,
                                                source: string
                                            ) => {
                                                const exist =
                                                    await collectionExists(
                                                        name
                                                    );

                                                if (exist) {
                                                    console.log(
                                                        "erase old data"
                                                    );
                                                }
                                                createCollection(name);
                                                upsertPoints(name, source);
                                                setCollectionList([
                                                    ...collectionList,
                                                    name,
                                                ]);
                                            }}
                                        />
                                    </Tab>
                                    {collectionList.map((collection, index) => (
                                        <Tab
                                            title={collection}
                                            key={index + 1}
                                            className="flex flex-col w-full gap-4"
                                        >
                                            <ScrollShadow className="h-40">
                                                {collection}
                                            </ScrollShadow>
                                            <Button
                                                className="w-fit self-end"
                                                color="primary"
                                                onPress={onClose}
                                            >
                                                Select
                                            </Button>
                                        </Tab>
                                    ))}
                                </Tabs>
                            </ModalBody>
                            <Spacer />
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

function RagInputFooter() {
    const { models, handleModelsAction } = useModelData();

    const handleModelSelection = (model: Model) => {
        handleModelsAction({ action: "set_initial", model: model });
    };
    return (
        <>
            <ModelSelector
                placeholder="Select a model"
                aria-label="initial model"
                selectedModels={models}
                onChange={handleModelSelection}
                className="w-full max-w-64"
                size="sm"
                variant="flat"
            />

            <SourcesModal />
        </>
    );
}

export default function Page() {
    return (
        <div className="gap-3 flex flex-col flex-1 justify-between">
            <div className="px-5 flex-1">
                <SystemMessageBox />
                <div className="flex justify-center items-center opacity-50 min-h-20 h-full rounded-md">
                    Select a model below to start
                </div>
            </div>
            <div className="flex justify-center w-full sticky bottom-0 px-5 pt-5 bg-gradient-to-t from-background/90 to-transparent">
                <UserInput
                    handleSendMessage={() => alert("to be implemented")}
                    className="flex flex-col w-full max-w-screen-lg backdrop-blur-md rounded-b-none"
                    modelSelectorPlaceholder="Select a model to start"
                >
                    <RagInputFooter />
                </UserInput>
            </div>
        </div>
    );
}
