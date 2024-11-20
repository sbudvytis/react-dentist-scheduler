import { useState } from "react";
import { Button, cn, Spinner } from "@nextui-org/react";
import ModalComponent from "./Modal";
import AddAppointmentForm from "@/components/Dashboard/Forms/Appointment/AddAppointmentForm";
import AddCalendarForm from "@/components/Dashboard/Forms/Calendar/AddCalendarForm";
import RemoveSchedule from "@/components/Dashboard/Forms/Calendar/RemoveCalendar";
import DisablePeriodForm from "@/components/Dashboard/Forms/Calendar/DisablePeriodForm";
import useAuth from "@/hooks/useAuth";
import EditCalendarForm from "@/components/Dashboard/Forms/Calendar/EditCalendarForm";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";
import {
  IoTodayOutline,
  IoTrashBinOutline,
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoCalendarNumberOutline,
  IoMedicalOutline,
} from "react-icons/io5";

interface Props {
  hasSchedule: boolean;
  isLoading: boolean;
  closeMenu: () => void;
}

interface ModalContentMap {
  [key: string]: React.ReactElement;
}

const ListboxItems = ({ hasSchedule, isLoading, closeMenu }: Props) => {
  const iconClasses = "text-lg pointer-events-none flex-shrink-0";

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { selectedScheduleId } = useSelectedSchedule();
  const { isDentist, clinicInfo } = useAuth();

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
    disableDays: (
      <DisablePeriodForm scheduleId={selectedScheduleId} onClose={closeModal} />
    ),
    createSchedule: <AddCalendarForm onClose={closeModal} />,
    editSchedule: (
      <EditCalendarForm onClose={closeModal} scheduleId={selectedScheduleId} />
    ),
    removeSchedule: <RemoveSchedule onClose={closeModal} />,
  };

  const modalHeader: { [key: string]: string } = {
    addAppointment: "Create Appointment",
    disableDays: "Report Holiday or Day Off",
    createSchedule: "Create Schedule",
    editSchedule: "Edit Schedule",
    removeSchedule: "Remove Schedule",
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-32">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-80px)] font-medium">
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col text-sm text-gray-600 space-y-1">
          <div className="flex flex-col justify-center min-h-20 max-h-24 border-1 rounded-2xl bg-white mb-4 p-3 space-y-1 font-normal">
            {clinicInfo ? (
              <div className="flex items-center space-x-2">
                <IoMedicalOutline size={22} className="flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="font-bold">{clinicInfo.name}</div>
                  <div>{clinicInfo.address}</div>
                  <div>{clinicInfo.contactNumber}</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <Spinner color="default" />
              </div>
            )}
          </div>

          {hasSchedule && (
            <>
              <div className="mt-auto pb-2">
                <button
                  onClick={() => {
                    openModal("addAppointment");
                    closeMenu();
                  }}
                  className="flex items-center space-x-4 w-full hover:text-gray-950 focus:outline-none bg-white border-1 rounded-xl p-2"
                >
                  <IoTodayOutline className={iconClasses} />
                  <span>Create appointment</span>
                </button>
              </div>
              {isDentist && (
                <>
                  <button
                    onClick={() => {
                      openModal("disableDays");
                      closeMenu();
                    }}
                    className="flex items-center space-x-4 hover:text-indigo-500 focus:outline-none hover:bg-indigo-50 rounded-xl p-2"
                  >
                    <IoCalendarNumberOutline className={iconClasses} />
                    <span>Report day off</span>
                  </button>
                  <button
                    onClick={() => {
                      openModal("editSchedule");
                      closeMenu();
                    }}
                    className="flex items-center space-x-4 hover:text-indigo-500 focus:outline-none hover:bg-indigo-50 rounded-xl p-2"
                  >
                    <IoCalendarClearOutline className={iconClasses} />
                    <span>Edit schedule</span>
                  </button>
                </>
              )}
            </>
          )}

          {!hasSchedule && isDentist && (
            <button
              onClick={() => {
                openModal("createSchedule");
                closeMenu();
              }}
              className="flex items-center space-x-4 hover:text-indigo-500 focus:outline-none hover:bg-indigo-50 rounded-xl p-2"
            >
              <IoCalendarOutline className={iconClasses} />
              <span>Create schedule</span>
            </button>
          )}
        </div>
      </div>

      {hasSchedule && isDentist && (
        <div className="mt-auto px-2 py-20 md:py-6">
          <Button
            onClick={() => {
              openModal("removeSchedule");
              closeMenu();
            }}
            color="danger"
            variant="flat"
            radius="md"
            className={cn(
              "flex items-center space-x-2 text-sm focus:outline-none w-full font-medium"
            )}
          >
            <IoTrashBinOutline className={iconClasses} />
            <span>Remove schedule</span>
          </Button>
        </div>
      )}

      {activeModal && (
        <ModalComponent
          isOpen={true}
          onClose={closeModal}
          header={modalHeader[activeModal]}
          content={modalContent[activeModal]}
          scrollBehavior="normal"
          size="4xl"
        />
      )}
    </div>
  );
};

export default ListboxItems;
