import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import { Appointment } from "@/components/Dashboard/types";

const useAppointments = (scheduleId: number | null) => {
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    isError: appointmentsError,
    refetch,
  } = useQuery(["appointments", scheduleId], () =>
    scheduleId ? trpc.appointment.find.query({ scheduleId }) : []
  );

  const addAppointmentMutation = useMutation(
    (appointmentData: Appointment) =>
      trpc.appointment.create.mutate({ ...appointmentData, scheduleId }),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error adding appointment:", error);
      },
    }
  );

  const addAppointment = (appointmentData: Appointment) => {
    addAppointmentMutation.mutate(appointmentData);
  };

  const editAppointmentMutation = useMutation(
    (appointmentData: Appointment) => {
      // Edit appointment
      const editAppointmentPromise =
        trpc.appointment.edit.mutate(appointmentData);

      // Edit patient
      const editPatientPromise = trpc.patient.edit.mutate({
        ...appointmentData.patient,
      });

      return Promise.all([editAppointmentPromise, editPatientPromise]);
    },
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error editing appointment:", error);
      },
    }
  );

  const editAppointment = (appointmentData: Appointment) => {
    editAppointmentMutation.mutate(appointmentData);
  };

  const removeAppointmentMutation = useMutation(
    (appointmentData: Appointment) =>
      trpc.appointment.remove.mutate(appointmentData),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error removing appointment:", error);
      },
    }
  );

  const removeAppointment = (appointmentData: Appointment) => {
    removeAppointmentMutation.mutateAsync(appointmentData);
    return Promise.resolve();
  };

  return {
    appointments,
    appointmentsLoading,
    appointmentsError,
    addAppointment,
    editAppointment,
    removeAppointment,
    removeAppointmentLoading: removeAppointmentMutation.isLoading,
    addAppointmentLoading: addAppointmentMutation.isLoading,
    addAppointmentError: addAppointmentMutation.error,
  };
};

export default useAppointments;
