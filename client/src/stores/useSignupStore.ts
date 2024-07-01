import { create } from "zustand";

interface SignupState {
  errorMessage: string;
  successMessage: string;
  hasSucceeded: boolean;
}

interface SignupActions {
  setErrorMessage: (message: string) => void;
  setSuccessMessage: (message: string) => void;
  setHasSucceeded: (status: boolean) => void;
}

type UseSignupStore = SignupState & SignupActions;

const useSignupStore = create<UseSignupStore>((set) => ({
  errorMessage: "",
  successMessage: "",
  hasSucceeded: false,
  setErrorMessage: (message) => set({ errorMessage: message }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  setHasSucceeded: (status) => set({ hasSucceeded: status }),
}));

export default useSignupStore;
