import { create } from "zustand";

interface LoginState {
  errorMessage: string;
  successMessage: string;
  hasSucceeded: boolean;
}

interface LoginActions {
  setErrorMessage: (message: string) => void;
  setSuccessMessage: (message: string) => void;
  setHasSucceeded: (status: boolean) => void;
  resetMessages: () => void;
}

type UseLoginStore = LoginState & LoginActions;

const useSignupLoginStore = create<UseLoginStore>((set) => ({
  errorMessage: "",
  successMessage: "",
  hasSucceeded: false,
  setErrorMessage: (message) => set({ errorMessage: message }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  setHasSucceeded: (status) => set({ hasSucceeded: status }),
  resetMessages: () => set({ errorMessage: "", successMessage: "" }),
}));

export default useSignupLoginStore;
