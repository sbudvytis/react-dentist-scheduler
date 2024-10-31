import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";
import useCalendar from "@/hooks/useCalendar";
import useAppointments from "@/hooks/useAppointment";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";
import useAuth from "@/hooks/useAuth";
import useLocalStorageSelectedScheduleId from "@/hooks/useLocalStorageSelectedScheduleId";
import useModal from "@/hooks/useModal";
import { Appointment, CalendarConfig } from "./types";
import Calendar from "./Calendar";
import EditAppointmentForm from "./Forms/Appointment/EditAppointmentForm";
import AddAppointmentForm from "./Forms/Appointment/AddAppointmentForm";
import SelectSpecialist from "./Forms/Calendar/SelectSpecialist";
import LoadingSpinner from "@/views/Spinner";
import "./calendarStyle.css";

const Dashboard = () => {
  const { schedules, schedulesLoading, schedulesError, selectScheduleById } =
    useCalendar();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const { selectedScheduleId, setSelectedScheduleId } = useSelectedSchedule();
  const { canViewAllSchedules, isDentist } = useAuth();
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    editAppointment,
  } = useAppointments(selectedScheduleId);

  useLocalStorageSelectedScheduleId(
    schedules,
    selectedScheduleId,
    setSelectedScheduleId
  );

  const {
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    setSelectInfo,
    handleAddAppointmentClose,
  } = useModal();

  // New loadingComplete state to manage when to show content
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Check if loading has finished
    if (!schedulesLoading && !appointmentsLoading) {
      setLoadingComplete(true);
    }
  }, [schedulesLoading, appointmentsLoading]);

  // Show loading spinner while schedules or appointments are loading
  if (!loadingComplete) {
    return <LoadingSpinner />;
  }

  // Show error message if there's an error
  if (schedulesError || (appointmentsError && selectedScheduleId != null)) {
    return <p>Error loading data</p>;
  }

  const handleSelectedScheduleById = (value: string | number) => {
    const scheduleId = parseInt(value.toString());
    if (scheduleId !== selectedScheduleId) {
      setSelectedScheduleId(scheduleId);
    }
  };

  // Check if there are schedules
  const hasSchedules = schedules.length > 0;

  return (
    <div>
      {hasSchedules ? (
        <>
          <div className="pb-6">
            <h1 className="text-xl text-left flex items-center gap-2 text-gray-800 font-semibold">
              Schedule
            </h1>
            <h2 className="text-sm text-gray-400">
              View schedule and appointments
            </h2>
          </div>
          {canViewAllSchedules && (
            <SelectSpecialist
              schedules={schedules}
              handleSelectedScheduleById={handleSelectedScheduleById}
              selectedScheduleId={selectedScheduleId}
            />
          )}

          {selectedScheduleId !== null && (
            <Calendar
              config={selectScheduleById(selectedScheduleId) as CalendarConfig}
              appointments={appointments as Appointment[]}
              editAppointment={editAppointment}
              setSelectedAppointment={setSelectedAppointment}
              setIsEditModalOpen={setIsEditModalOpen}
              setSelectedDateRange={setSelectedDateRange}
              setSelectInfo={setSelectInfo}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center text-center p-4">
          <img src="/no-data.svg" alt="No data" className="size-96 mb-4" />
          <p className="text-gray-800">
            {isDentist
              ? "You have not created your schedule yet."
              : "No schedules available."}
          </p>
        </div>
      )}

      {selectedAppointment && (
        <EditAppointmentForm
          scheduleId={selectedScheduleId}
          appointment={selectedAppointment}
          selectedDateRange={selectedDateRange}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editAppointment={editAppointment}
        />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={handleAddAppointmentClose}
        radius="lg"
        scrollBehavior="normal"
        placement="top-center"
        size="4xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-2xl">
            Create Appointment
          </ModalHeader>
          <ModalBody>
            <AddAppointmentForm
              scheduleId={selectedScheduleId}
              selectedDateRange={selectedDateRange}
              onClose={handleAddAppointmentClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
