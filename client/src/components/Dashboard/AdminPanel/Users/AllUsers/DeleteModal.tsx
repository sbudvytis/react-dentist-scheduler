import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  errorMessage: string | null;
  firstName: string;
  lastName: string;
};

const DeleteUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  errorMessage,
  firstName,
  lastName,
}: DeleteUserModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="normal"
      placement="top-center"
      radius="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-2xl">
          Confirmation
        </ModalHeader>
        <ModalBody>
          <div>
            Are you sure you want to remove{" "}
            <span className="font-semibold">
              {firstName} {lastName}
            </span>{" "}
            from the system?
          </div>
          {errorMessage && (
            <div className="bg-[#ffe7ef] text-[#f31261] p-4 rounded-2xl text-sm text-center">
              {errorMessage}
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-center gap-2 lg:justify-end">
          <Button
            color="default"
            variant="solid"
            radius="lg"
            onClick={onClose}
            className="border-none bg-black hover:bg-indigo-600 text-white h-9"
          >
            Cancel
          </Button>
          <Button
            color="danger"
            variant="flat"
            radius="lg"
            onClick={onConfirm}
            className="h-9"
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteUserModal;
