import { PropsWithChildren, createContext, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import Markdown from 'react-markdown';

export const Context = createContext<{
  openModalInfo: (args: { title: string; message: string }) => void;
} | null>(null);

export default function ModalInfoProvider({ children }: PropsWithChildren) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({
    title: '',
    message: '',
  });

  const openModalInfo = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => {
    setModalMessage({ title, message });
    onOpen();
  };

  const formatMessage = (message: string) => {
    // urls to markdown links
    return message.replace(/https?:\/\/[^\s]+/g, (url) => `[${url}](${url})`);
  };

  return (
    <Context.Provider value={{ openModalInfo }}>
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {modalMessage.title}
                </ModalHeader>
                <ModalBody>
                  <Markdown className="markdown">
                    {formatMessage(modalMessage.message)}
                  </Markdown>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        {children}
      </>
    </Context.Provider>
  );
}
