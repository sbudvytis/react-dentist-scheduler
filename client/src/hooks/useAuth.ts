import { useState, useEffect } from "react";
import {
  clearStoredAccessToken,
  clearSelectedId,
  getStoredAccessToken,
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
  const [clinicId, setClinicId] = useState<number | null>(null);
  const [clinicInfo, setClinicInfo] = useState<{
    name: string;
    address: string;
    contactNumber: string;
  } | null>(null);
  const [usersEmail, setUsersEmail] = useState<string | null>(null);
  const { resetSelectedScheduleId } = useSelectedSchedule();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authToken) {
      const user = getUserFromToken(authToken);
      setUserId(user.id);
      setClinicId(user.clinicId); // Assuming clinicId is part of the user object
      setUsersEmail(user.email);
    }
  }, [authToken]);

  useEffect(() => {
    if (clinicId) {
      trpc.clinic.find.query({ clinicId }).then((clinicData) => {
        setClinicInfo(clinicData); // Save clinic data to state
      });
    }
  }, [clinicId]);

  const signup = trpc.user.signup.mutate;

  const addUser = trpc.user.add.mutate;

  const isLoggedIn = !!authToken;

  const login = async (userLogin: { email: string; password: string }) => {
    const {
      accessToken,
      userRole,
      userPermissions,
      userFirstName,
      userLastName,
      userEmail,
    } = await trpc.user.login.mutate(userLogin);

    setAuthToken(accessToken);
    storeAccessToken(localStorage, accessToken);
    queryClient.removeQueries();

    // Create a user object from the response
    const user = {
      role: userRole,
      permissions: userPermissions,
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
    };

    return user; // Return the constructed user object
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

  const isAdmin = authToken
    ? getUserFromToken(authToken).role === "admin"
    : false;

  const isAdminUser = () => isAdmin;

  const userRole = authToken ? getUserFromToken(authToken).role : "";

  return {
    authToken,
    userId,
    clinicId,
    clinicInfo,
    isLoggedIn,
    login,
    logout,
    signup,
    addUser,
    usersEmail,
    canApproveUsers,
    canViewAllSchedules,
    isDentist,
    isAdmin,
    isAdminUser,
    userRole,
  };
};

export default useAuth;
