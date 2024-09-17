import { DateSelectArg } from "@fullcalendar/core/index.js";

export interface CalendarConfig {
  scheduleId: number;
  userId: number;
  view: string;
  weekends: boolean;
  slotMinTime: string;
  slotMaxTime: string;
}

export interface PatientData {
  patientId: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
}

export interface Appointment {
  userId: number;
  id: number;
  scheduleId: number | null;
  title: string;
  start: Date;
  end: Date;
  notes: string;
  email: string;
  patient: PatientData;
}

export interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
}

export interface ChangeInfo {
  event: {
    id: number;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
      notes: string;
      email: string;
      patient: PatientData;
    };
  };
}

export interface CalendarProps {
  config: {
    scheduleId: number;
    userId: number;
    view: string;
    weekends: boolean;
    slotMinTime: string;
    slotMaxTime: string;
  };
  appointments: Appointment[];
  editAppointment: (appointment: Appointment) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setSelectedDateRange: (range: { start: Date; end: Date }) => void;
  setSelectInfo: (info: DateSelectArg | null) => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
}
