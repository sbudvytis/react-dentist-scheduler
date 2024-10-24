import { create } from "zustand";
import { Appointment } from "@/components/Dashboard/types";

interface FormDataState {
  formData: Appointment;
  setFormData: (formData: Partial<Appointment>) => void;
}

const useFormDataStore = create<FormDataState>((set) => ({
  formData: {
    userId: 0,
    id: 0,
    scheduleId: 0,
    title: "",
    email: "",
    notes: "",
    start: new Date(),
    end: new Date(),
    patient: {
      patientId: 0,
      firstName: "",
      lastName: "",
      contactNumber: "",
    },
  },
  setFormData: (formData) =>
    set((state) => ({ formData: { ...state.formData, ...formData } })),
}));

export default useFormDataStore;
