import { useApiKeys } from "@/app/hooks/useApiKeys";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Button,
    Input,
    ButtonProps,
} from "@nextui-org/react";
import { ChangeEventHandler, useState } from "react";

const KeyInput = ({
    name,
    apiKey,
    onChange,
}: {
    name: string;
    apiKey: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <>
            <Input
                label={name}
                value={apiKey}
                type={isVisible ? "text" : "password"}
                onChange={onChange}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
            />
        </>
    );
};

export default function SetupApiKeyModal(props: ButtonProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { apiKeys, setApiKeys } = useApiKeys();
    const [localApiKeys, setLocalApiKeys] = useState([...apiKeys]);

    /* function to update the local api state with the last userinput */
    const handleChange = (value: string, index: number) => {
        setLocalApiKeys((prev) => {
            return prev.map((key, i) => {
                if (i === index) {
                    return { ...key, apiKey: value };
                }
                return key;
            });
        });
    };

    /* function to tell if there is a difference between the local apikeys state and the storage */
    const needToSave = localApiKeys.some((key) => {
        const savedKey = apiKeys.find((k) => k.name === key.name);
        if (savedKey) {
            return savedKey.apiKey !== key.apiKey;
        }
        if (!savedKey && key.apiKey !== "") {
            return true;
        }
        return false;
    });

    /* function to save the api keys on storage */
    function saveApiKeys(onClose: () => void) {
        setApiKeys(localApiKeys);
        onClose();
    }

    return (
        <>
            <Button onPress={onOpen} {...props}>
                Setup API Keys
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Setup API Keys
                            </ModalHeader>
                            <ModalBody>
                                {localApiKeys.map((key, index) => (
                                    <div key={index} className="flex gap-3">
                                        <KeyInput
                                            name={key.name}
                                            apiKey={key.apiKey}
                                            onChange={(e) =>
                                                handleChange(
                                                    e.target.value,
                                                    index
                                                )
                                            }
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
