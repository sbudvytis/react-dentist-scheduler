import { useState, useEffect } from "react";
import {
  clearStoredAccessToken,
  clearSelectedId,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
  getUserFromToken,
} from "@/utils/auth";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";
import { useQueryClient } from "react-query";
import { trpc } from "../trpc";

const useAuth = () => {
  const [authToken, setAuthToken] = useState<string | null>(
    getStoredAccessToken(localStorage)
  );
  const [userId, setUserId] = useState<number | null>(null);
  const { resetSelectedScheduleId } = useSelectedSchedule();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authToken) {
      setUserId(getUserIdFromToken(authToken));
    }
  }, [authToken]);

  const signup = trpc.user.signup.mutate;

  const isLoggedIn = !!authToken;

  const login = async (userLogin: { email: string; password: string }) => {
    const { accessToken } = await trpc.user.login.mutate(userLogin);
    setAuthToken(accessToken);
    storeAccessToken(localStorage, accessToken);
    queryClient.removeQueries();
    return { message: "Login successful" };
  };

  const logout = () => {
    setAuthToken(null);
    clearStoredAccessToken(localStorage);
    clearSelectedId(localStorage);
    resetSelectedScheduleId();
    queryClient.removeQueries();
  };

  const canApproveUsers = authToken
    ? getUserFromToken(authToken).permissions.includes("APPROVE_USERS")
    : false;

  const canViewAllSchedules = authToken
    ? getUserFromToken(authToken).permissions.includes("VIEW_ALL_SCHEDULES")
    : false;

  const isDentist = authToken
    ? getUserFromToken(authToken).role === "dentist"
    : false;

  return {
    authToken,
    userId,
    isLoggedIn,
    login,
    logout,
    signup,
    canApproveUsers,
    canViewAllSchedules,
    isDentist,
  };
};

export default useAuth;
