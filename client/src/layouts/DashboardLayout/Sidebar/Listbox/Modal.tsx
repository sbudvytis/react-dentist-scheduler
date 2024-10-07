import { Modal, ModalContent, ModalBody } from "@nextui-org/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  scrollBehavior?: "inside" | "outside" | "normal";
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  content,
  size,
  scrollBehavior,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      radius="sm"
      size={size}
      scrollBehavior={scrollBehavior}
    >
      <ModalContent>
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
