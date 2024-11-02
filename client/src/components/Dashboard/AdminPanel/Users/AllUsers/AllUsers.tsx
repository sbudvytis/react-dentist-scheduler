import { useState } from "react";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import showToast from "@/utils/showToast";
import useCalendar from "@/hooks/useCalendar";
import { User as UserTypes } from "@/components/Dashboard/types";
import UserRow from "./UserRow";
import DeleteUserModal from "./DeleteModal";
import { Spinner } from "@nextui-org/react";

const AllUsers = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserTypes | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { userId } = useAuth();
  const { users, removeUser, usersLoading } = useUser(true, userId);
  const { schedules } = useCalendar();

  const openDeleteModal = (user: UserTypes) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const userHasSchedules = schedules.some(
          (schedule) => schedule.userId === userToDelete.id
        );

        if (userHasSchedules) {
          showToast("error", "Failed to remove user!");
          setDeleteError("Cannot delete user with existing schedule.");
          return;
        }

        await removeUser(userToDelete.id);
        showToast("success", "User removed successfully!");
        closeDeleteModal();
      } catch (error) {
        console.error("Error removing user:", error);
        setDeleteError("Failed to remove user.");
      }
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center py-48">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden text-sm rounded-2xl border border-gray-200">
      <div className="overflow-x-auto overflow-y-auto min-h-96 max-h-96">
        <table className="min-w-full">
          <thead className="text-xs bg-white sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-4 font-semibold text-gray-500">
                Name
              </th>
              <th className="text-left py-2 px-4 font-semibold text-gray-500">
                Role
              </th>
              <th className="text-left py-2 px-4 font-semibold text-gray-500">
                Status
              </th>
              <th className="text-left py-2 px-4 font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user: UserTypes) =>
                userId !== null && (
                  <UserRow
                    key={user.id}
                    user={user}
                    userId={userId}
                    onOpenDeleteModal={openDeleteModal}
                  />
                )
            )}
          </tbody>
        </table>
      </div>

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        errorMessage={deleteError}
      />
    </div>
  );
};

export default AllUsers;
