import { useState } from "react";
import { Listbox, ListboxItem, cn } from "@nextui-org/react";
import { AddNoteIcon } from "./Icons/AddNoteIcon";
import { EditDocumentIcon } from "./Icons/EditDocumentIcon";
import { DeleteDocumentIcon } from "./Icons/DeleteDocumentIcon";
import { AddAppointmentIcon } from "./Icons/AddAppointmentIcon";
import ModalComponent from "./Modal";
import AddAppointmentForm from "@/components/Dashboard/Forms/Appointment/AddAppointmentForm";
import AddCalendarForm from "@/components/Dashboard/Forms/Calendar/AddCalendarForm";
import RemoveSchedule from "@/components/Dashboard/Forms/Calendar/RemoveCalendar";
import ListboxItemsSkeleton from "./ListboxItemsSkeleton";
import useAuth from "@/hooks/useAuth";
import EditCalendarForm from "@/components/Dashboard/Forms/Calendar/EditCalendarForm";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";

interface ModalContentMap {
  [key: string]: React.ReactElement;
}

type Props = {
  hasSchedule: boolean;
  isLoading: boolean;
};

type ListboxItemProps = {
  key: string;
  description: string;
  icon: React.ReactElement;
  onClick?: () => void;
  label: string;
  className?: string;
  color?:
    | "danger"
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning";
};

const ListboxItems = ({ hasSchedule, isLoading }: Props) => {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { selectedScheduleId } = useSelectedSchedule();
  const { isDentist } = useAuth();

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const modalContent: ModalContentMap = {
    addAppointment: (
      <AddAppointmentForm
        scheduleId={selectedScheduleId}
        onClose={closeModal}
        selectedDateRange={{ start: new Date(), end: new Date() }}
      />
    ),
    createSchedule: <AddCalendarForm onClose={closeModal} />,
    editSchedule: (
      <EditCalendarForm onClose={closeModal} scheduleId={selectedScheduleId} />
    ),
    removeSchedule: <RemoveSchedule onClose={closeModal} />,
  };

  const listboxItems: ListboxItemProps[] = [];

  if (hasSchedule) {
    listboxItems.push({
      key: "add",
      description: "Create a new appointment",
      icon: <AddAppointmentIcon className={iconClasses} />,
      onClick: () => openModal("addAppointment"),
      label: "Create appointment",
    });

    if (isDentist) {
      listboxItems.push({
        key: "edit",
        description: "Edit current schedule",
        icon: <EditDocumentIcon className={iconClasses} />,
        onClick: () => openModal("editSchedule"),
        label: "Edit schedule",
      });

      listboxItems.push({
        key: "delete",
        description: "Permanently remove a schedule",
        icon: <DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />,
        onClick: () => openModal("removeSchedule"),
        className: "text-danger",
        color: "danger",
        label: "Remove schedule",
      });
    }
  } else if (isDentist) {
    listboxItems.push({
      key: "new",
      description: "Create a new schedule",
      icon: <AddNoteIcon className={iconClasses} />,
      onClick: () => openModal("createSchedule"),
      label: "Create schedule",
    });
  }

  if (isLoading) {
    return <ListboxItemsSkeleton />;
  }

  return (
    <>
      <Listbox variant="bordered" aria-label="Listbox menu with descriptions">
        {listboxItems.map((item) => (
          <ListboxItem
            key={item.key}
            description={item.description}
            startContent={item.icon}
            onClick={item.onClick}
            className={item.className}
            color={item.color}
          >
            {item.label}
          </ListboxItem>
        ))}
      </Listbox>

      {activeModal && (
        <ModalComponent
          isOpen={true}
          onClose={closeModal}
          content={modalContent[activeModal]}
        />
      )}
    </>
  );
};

export default ListboxItems;
