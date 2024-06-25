import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Button,
    Input,
} from "@nextui-org/react";
import { useState } from "react";
import { addApiKey, getApiKey, getApiKeys } from "@/app/utils/functions";

export default function SetupApiKeyModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const SavedApiKeys = getApiKeys();

    const [apiKeys, setApiKeys] = useState([
        {
            name: "NEXT_PUBLIC_OPENAI_API_KEY",
            value: getApiKey("NEXT_PUBLIC_OPENAI_API_KEY") || "",
        },
        {
            name: "NEXT_PUBLIC_LLAMA_API_KEY",
            value: getApiKey("NEXT_PUBLIC_LLAMA_API_KEY") || "",
        },
        {
            name: "CLAUDE_API_KEY",
            value: getApiKey("CLAUDE_API_KEY") || "",
        },
        {
            name: "QDRANT_API_KEY",
            value: getApiKey("QDRANT_API_KEY") || "",
        },
        {
            name: "MISTRAL_API_KEY",
            value: getApiKey("MISTRAL_API_KEY") || "",
        },
        {
            name: "NEXT_PUBLIC_GROPQ_API_KEY",
            value: getApiKey("NEXT_PUBLIC_GROPQ_API_KEY") || "",
        },
    ]);

    const needToSave = apiKeys.some((key) => {
        const savedKey = SavedApiKeys.find((k) => k.name === key.name);
        if (savedKey) {
            return savedKey.apiKey !== key.value;
        }
        if (!savedKey && key.value !== "") {
            return true;
        }
        return false;
    });

    function saveApiKeys(onClose: () => void) {
        apiKeys.forEach((key) => {
            addApiKey({ name: key.name, apiKey: key.value });
        });
        onClose();
    }

    return (
        <>
            <Button onPress={onOpen}>Setup API Keys</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Setup API Keys
                            </ModalHeader>
                            <ModalBody>
                                {apiKeys.map((key, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Input
                                            label={key.name}
                                            value={key.value}
                                            onChange={(e) => {
                                                setApiKeys((prev) => {
                                                    const newApiKeys = [
                                                        ...prev,
                                                    ];
                                                    newApiKeys[index].value =
                                                        e.target.value;
                                                    return newApiKeys;
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    isDisabled={!needToSave}
                                    onPress={() => saveApiKeys(onClose)}
                                >
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
