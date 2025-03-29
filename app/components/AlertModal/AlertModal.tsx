import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
type AlertModalProps = {
  showAlert: boolean;
  onClose: () => void;
};
const AlertModal: React.FC<AlertModalProps> = ({ showAlert, onClose }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-opacity-90 backdrop-blur-sm z-40"></div>
      )}
      <Modal isOpen={showAlert} onOpenChange={onClose}>
        <ModalContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <>
            <ModalHeader className="flex flex-col gap-1">Error</ModalHeader>
            <ModalBody>
              <p className="text-rose-600">
                Please select the model to generate your response!
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AlertModal;
