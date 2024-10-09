import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  header: React.ReactNode;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  scrollBehavior?: "inside" | "outside" | "normal";
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  content,
  header,
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
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-2xl">
          {header}
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
