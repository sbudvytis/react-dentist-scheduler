import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import type { UserBare } from "@mono/server/src/shared/entities";

const useUser = (
  filterApproved: boolean = false,
  currentUserId: number | null
) => {
  // Only load users if currentUserId is valid (i.e., the user is logged in)
  const loadUsers = async () => {
    if (!currentUserId) {
      throw new Error("User is not logged in");
    }

    try {
      const response = await trpc.user.find.query();
      return filterApproved
        ? response
        : response.filter((user: UserBare) => !user.isApproved);
    } catch (error) {
      console.error("Error loading users:", error);
      throw error;
    }
  };

  const {
    isLoading: usersLoading,
    isError: usersError,
    data: usersData,
    refetch,
  } = useQuery(["users", filterApproved], loadUsers, {
    enabled: !!currentUserId, // Prevents the query from running if user is not logged in
  });

  const findUserByEmail = (email: string) => {
    return usersData?.find((user) => user.email === email);
  };

  const approveUsers = useMutation(
    (id: number) => trpc.user.approve.mutate({ id }),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error approving user:", error);
      },
    }
  );

  const approveUser = (id: number) => {
    approveUsers.mutate(id);
  };

  const removeUsers = useMutation(
    (id: number) => trpc.user.remove.mutate({ id }),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error removing user:", error);
      },
    }
  );

  const removeUser = (id: number) => {
    if (id === currentUserId) {
      console.warn("Cannot remove the currently logged-in user.");
      return;
    }
    removeUsers.mutate(id);
  };

  const setPasswordApi = async (token: string, password: string) => {
    try {
      await trpc.user.verify.mutate({ token, password });
      return { success: true };
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Invalid or expired token"
      ) {
        throw new Error("Your setup link has expired or is invalid.");
      } else {
        throw new Error("Failed to set password.");
      }
    }
  };

  const requestNewSetupLinkApi = async (email: string) => {
    try {
      await trpc.user.request.mutate({ email });
      return { success: true };
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Invalid or expired token"
      ) {
        throw new Error("Your setup link has expired or is invalid.");
      } else {
        throw new Error("Failed to set password.");
      }
    }
  };

  return {
    users: usersData || [],
    usersLoading,
    usersError,
    approveUser,
    removeUser,
    setPasswordApi,
    requestNewSetupLinkApi,
    findUserByEmail,
  };
};

export default useUser;
