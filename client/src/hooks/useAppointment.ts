import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import { Appointment } from "@/components/Dashboard/types";

const useAppointments = (scheduleId: number | null) => {
  // Fetch appointments based on the scheduleId
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    isError: appointmentsError,
    refetch,
  } = useQuery(["appointments", scheduleId], () =>
    scheduleId ? trpc.appointment.find.query({ scheduleId }) : []
  );

  // Add appointment mutation with async handling
  const addAppointmentMutation = useMutation(
    (appointmentData: Appointment) =>
      trpc.appointment.create.mutate({ ...appointmentData, scheduleId }),
    {
      onSuccess: () => {
        refetch(); // Refetch appointments on success
      },
      onError: (error: unknown) => {
        console.error("Error adding appointment:", error);
      },
    }
  );

  // Add appointment with async/await
  const addAppointment = async (appointmentData: Appointment) => {
    try {
      await addAppointmentMutation.mutateAsync(appointmentData); // Await mutation completion
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  // Edit appointment mutation with async handling
  const editAppointmentMutation = useMutation(
    (appointmentData: Appointment) =>
      trpc.appointment.edit.mutate(appointmentData),
    {
      onSuccess: () => {
        refetch(); // Refetch appointments on success
      },
      onError: (error: unknown) => {
        console.error("Error editing appointment:", error);
      },
    }
  );

  // Edit appointment with async/await
  const editAppointment = async (appointmentData: Appointment) => {
    try {
      await editAppointmentMutation.mutateAsync(appointmentData); // Await mutation completion
    } catch (error) {
      console.error("Error editing appointment:", error);
    }
  };

  // Remove appointment mutation with async handling
  const removeAppointmentMutation = useMutation(
    (appointmentData: Appointment) =>
      trpc.appointment.remove.mutate(appointmentData),
    {
      onSuccess: () => {
        refetch(); // Refetch appointments on success
      },
      onError: (error: unknown) => {
        console.error("Error removing appointment:", error);
      },
    }
  );

  // Remove appointment with async/await
  const removeAppointment = async (appointmentData: Appointment) => {
    try {
      await removeAppointmentMutation.mutateAsync(appointmentData); // Await mutation completion
    } catch (error) {
      console.error("Error removing appointment:", error);
    }
  };

  // Get today's appointments
  const getTodaysAppointments = (appointments: Appointment[]) => {
    const today = new Date();
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start);
      return (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );
    });
  };

  return {
    appointments,
    appointmentsLoading,
    appointmentsError,
    addAppointment, // Now async
    editAppointment, // Now async
    removeAppointment, // Now async
    getTodaysAppointments,
    removeAppointmentLoading: removeAppointmentMutation.isLoading,
    removeAppointmentError: removeAppointmentMutation.error,
    addAppointmentLoading: addAppointmentMutation.isLoading,
    addAppointmentError: addAppointmentMutation.error,
    editAppointmentLoading: editAppointmentMutation.isLoading,
    editAppointmentError: editAppointmentMutation.error,
  };
};

export default useAppointments;
