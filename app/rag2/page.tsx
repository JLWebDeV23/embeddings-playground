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
    deleteCollection,
    getCollectionsList,
    upsertPoints,
} from "../utils/collection";
import useModalInfo from "../hooks/useModalInfo";

function AddSourceTab({
    onAddCollection,
    isLoading = false,
}: {
    onAddCollection: (name: string, source: string) => void;
    isLoading?: boolean;
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
                isLoading={isLoading}
                onPress={() => {
                    onAddCollection(name, source);
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
    const [isLoading, setIsLoading] = useState(false);

    const { openModalInfo } = useModalInfo();

    const handleAddSource = async (name: string, source: string) => {
        setIsLoading(true);
        const exist = await collectionExists(name);
        if (exist) {
            setIsLoading(false);
            openModalInfo({
                title: "Error",
                message: "Collection already exists",
            });
            return;
        }
        try {
            await createCollection(name);
        } catch (e) {
            setIsLoading(false);
            openModalInfo({
                title: "Error",
                message: "Failed to create collection",
            });
            return;
        }
        await upsertPoints(name, source);
        await getCollectionsList().then((collections) => {
            setCollectionList(collections.map((collection) => collection.name));
        });
        setIsLoading(false);
    };

    const handleDeleteCollection = async (name: string) => {
        setIsLoading(true);
        try {
            await deleteCollection(name);
        } catch (e) {
            openModalInfo({
                title: "Error",
                message: "Failed to delete collection",
            });
            setIsLoading(false);
            return;
        }
        await getCollectionsList().then((collections) => {
            setCollectionList(collections.map((collection) => collection.name));
        });
        setIsLoading(false);
    };

    return (
        <>
            <Button
                size="sm"
                onPress={() => {
                    onOpen();
                    getCollectionsList().then((collections) => {
                        setCollectionList(
                            collections.map((collection) => collection.name)
                        );
                    });
                }}
                variant="flat"
            >
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
                                            isLoading={isLoading}
                                            onAddCollection={handleAddSource}
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
                                            <div className="flex self-end gap-3">
                                                <Button
                                                    className="w-fit"
                                                    color="danger"
                                                    variant="light"
                                                    isLoading={isLoading}
                                                    onPress={() =>
                                                        handleDeleteCollection(
                                                            collection
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    className="w-fit"
                                                    color="primary"
                                                    onPress={onClose}
                                                >
                                                    Select
                                                </Button>
                                            </div>
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
