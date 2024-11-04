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

  const firstName = userToDelete ? userToDelete.firstName : "";
  const lastName = userToDelete ? userToDelete.lastName : "";

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
    <div className="overflow-hidden text-sm rounded-2xl bg-white">
      <div className="overflow-x-auto overflow-y-auto p-6">
        <div className="pb-2">
          <h1 className="text-lg text-left flex items-center text-slate-800 font-semibold">
            Current Users
          </h1>
          <h2 className="text-sm text-slate-400">
            Manage users and their roles
          </h2>
        </div>
        <table className="min-w-full">
          <thead className="text-xs bg-white sticky top-0 z-10">
            <tr>
              <th className="text-left py-2 pr-2 font-semibold text-gray-500">
                Name
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">
                Role
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">
                Status
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">
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
        firstName={firstName}
        lastName={lastName}
      />
    </div>
  );
};

export default AllUsers;
