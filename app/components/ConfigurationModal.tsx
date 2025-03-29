import { useApiKeys } from '@/app/hooks/useApiKeys';
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
} from '@nextui-org/react';
import IonIcon from '@reacticons/ionicons';
import { ChangeEventHandler, useState } from 'react';
import { setupQdrant } from '../utils/collection';

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
        type={isVisible ? 'text' : 'password'}
        onChange={onChange}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      />
    </>
  );
};

export default function ConfigurationModal(props: ButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { apiKeys, setApiKeys, QdrantDBURL, updateQdrantDBURL } = useApiKeys();
  const [localApiKeys, setLocalApiKeys] = useState([...apiKeys]);
  const [localQdrantDBURL, setLocalQdrantDBURL] = useState<string>(QdrantDBURL);

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
  const needToSave =
    QdrantDBURL !== localQdrantDBURL ||
    localApiKeys.some((key) => {
      const savedKey = apiKeys.find((k) => k.name === key.name);
      if (savedKey) {
        return savedKey.apiKey !== key.apiKey;
      }
      if (!savedKey && key.apiKey !== '') {
        return true;
      }
      return false;
    });

  /* function to save the api keys on storage */
  function saveApiKeys(onClose: () => void) {
    setApiKeys(localApiKeys);
    updateQdrantDBURL(localQdrantDBURL);
    setupQdrant(
      localQdrantDBURL,
      localApiKeys.find((k) => k.name === 'QdrantDB')?.apiKey || ''
    );
    onClose();
  }

  return (
    <>
      <Button onPress={onOpen} {...props}>
        Settings
        <IonIcon name="settings-outline" />{' '}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody>
                <>
                  <h1 className="font-light">Setup API Keys</h1>
                  {localApiKeys.map((key, index) => (
                    <div key={index} className="flex gap-3">
                      <KeyInput
                        name={key.name}
                        apiKey={key.apiKey}
                        onChange={(e) => handleChange(e.target.value, index)}
                      />
                    </div>
                  ))}
                  <h1 className="font-light">QdranDB URL</h1>
                  <Input
                    label="QdranDB URL"
                    value={localQdrantDBURL}
                    onValueChange={(value) => {
                      setLocalQdrantDBURL(value);
                    }}
                  />
                </>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
