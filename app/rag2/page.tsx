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
    scrollPoints,
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
        <div className="flex flex-col gap-4 w-full h-80">
            <Input
                placeholder="Name"
                value={name}
                onValueChange={(value) => setName(value)}
            />
            <Textarea
                placeholder="Enter the source"
                className="w-full "
                minRows={9}
                maxRows={9}
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
        </div>
    );
}

function SourcesTab({
    collection,
    isLoading,
    onClose,
    handleDeleteCollection,
    handleSelectCollection,
}: {
    collection: string;
    isLoading: boolean;
    onClose: () => void;
    handleDeleteCollection: (collection: string) => void;
    handleSelectCollection: (collection: string) => void;
}) {
    const [collectionContent, setCollectionContent] = useState<string>("");

    const fetchCollectionContent = async (name: string) => {
        type ScrollPoints = {
            payload: string;
        };
        try {
            const content = (await scrollPoints(name)) as ScrollPoints[];
            setCollectionContent(
                content.map((item) => item.payload).join("\n")
            );
        } catch (e) {
            console.log(e);
        }
    };

    fetchCollectionContent(collection);

    return (
        <div className="flex flex-col gap-4 w-full h-80">
            <ScrollShadow className="h-full">{collectionContent}</ScrollShadow>
            <div className="flex self-end gap-3">
                <Button
                    className="w-fit"
                    color="danger"
                    variant="light"
                    isLoading={isLoading}
                    onPress={() => handleDeleteCollection(collection)}
                >
                    Delete
                </Button>
                <Button
                    className="w-fit"
                    color="primary"
                    onPress={() => {
                        handleSelectCollection(collection);
                        onClose();
                    }}
                >
                    Select
                </Button>
            </div>
        </div>
    );
}

function SourcesModal({
    handleSelectCollection,
    selectedCollection,
}: {
    handleSelectCollection: (collection: string) => void;
    selectedCollection: string;
}) {
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

    const isSmallScreen = window.innerWidth < 640;

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
                Sources{" "}
                {selectedCollection && `("${selectedCollection}" selected)`}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Sources</ModalHeader>
                            <ModalBody className="w-full">
                                <Tabs
                                    aria-label="Options"
                                    isVertical={!isSmallScreen}
                                    className="w-full sm:w-fit h-full flex flex-col gap-4"
                                >
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
                                            <SourcesTab
                                                collection={collection}
                                                handleDeleteCollection={
                                                    handleDeleteCollection
                                                }
                                                handleSelectCollection={
                                                    handleSelectCollection
                                                }
                                                isLoading={isLoading}
                                                onClose={onClose}
                                            />
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

function RagInputFooter({
    selectedCollection,
    handleSelectCollection,
}: {
    selectedCollection: string;
    handleSelectCollection: (collection: string) => void;
}) {
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

            <SourcesModal
                selectedCollection={selectedCollection}
                handleSelectCollection={handleSelectCollection}
            />
        </>
    );
}

export default function Page() {
    const [selectedCollection, setSelectedCollection] = useState<string>("");
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
                    <RagInputFooter
                        handleSelectCollection={(collection) =>
                            setSelectedCollection(collection)
                        }
                        selectedCollection={selectedCollection}
                    />
                </UserInput>
            </div>
        </div>
    );
}