import { useState } from "react";
import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import type { UserBare } from "@mono/server/src/shared/entities";

const useUser = () => {
  const [users, setUsers] = useState<UserBare[]>([]);

  const loadUsers = async () => {
    try {
      const response = await trpc.user.find.query();
      const rawUsers = response;
      return rawUsers.filter((user: UserBare) => !user.isApproved);
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
  } = useQuery("users", loadUsers, {
    onSuccess: (data) => setUsers(data),
  });

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
    removeUsers.mutate(id);
  };

  return {
    users: usersData || users,
    usersLoading,
    usersError,
    loadUsers,
    approveUser,
    removeUser,
  };
};

export default useUser;
