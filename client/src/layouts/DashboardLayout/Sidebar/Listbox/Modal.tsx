import { Modal, ModalContent, ModalBody } from "@nextui-org/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} radius="sm" size="xs">
      <ModalContent>
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
