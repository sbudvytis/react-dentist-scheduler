import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import type { UserBare } from "@mono/server/src/shared/entities";

const useUser = (
  filterApproved: boolean = false,
  currentUserId: number | null
) => {
  const loadUsers = async () => {
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
  } = useQuery(["users", filterApproved], loadUsers);

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

  return {
    users: usersData || [],
    usersLoading,
    usersError,
    approveUser,
    removeUser,
  };
};

export default useUser;
