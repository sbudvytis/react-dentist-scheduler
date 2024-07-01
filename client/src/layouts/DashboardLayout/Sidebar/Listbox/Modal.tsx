import { Modal, ModalContent, ModalBody } from "@nextui-org/react";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentModal;
