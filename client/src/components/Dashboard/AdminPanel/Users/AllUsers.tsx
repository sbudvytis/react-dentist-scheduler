import React from "react";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import type { UserBare } from "@mono/server/src/shared/entities";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { Chip, ChipProps, Tooltip, User } from "@nextui-org/react"; // Keep Tooltip from NextUI

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  notApproved: "danger",
};

const AllUsers = () => {
  const { userId } = useAuth(); // Get the current user's ID
  const { users, removeUser } = useUser(true, userId); // Pass it to useUser

  const renderCell = (user: UserBare, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", isBordered: false }}
            description={user.email}
            name={`${user.firstName} ${user.lastName}`}
          />
        );

      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              user.isApproved
                ? statusColorMap["active"]
                : statusColorMap["notApproved"]
            }
            size="sm"
            radius="sm"
            variant="flat"
          >
            {user.isApproved ? "Approved" : "Not approved"}
          </Chip>
        );

      case "actions":
        return (
          <div className="relative flex gap-2">
            {user.id !== userId && ( // Disable remove action for logged-in user
              <Tooltip color="danger" content="Remove user" radius="sm">
                <span
                  className="text-lg text-red-500 cursor-pointer active:opacity-50"
                  onClick={() => removeUser(user.id)}
                >
                  <IoPersonRemoveOutline />
                </span>
              </Tooltip>
            )}
          </div>
        );

      default:
        return user[columnKey as keyof UserBare];
    }
  };

  const columns = [
    { name: "Name", uid: "name" },
    { name: "Role", uid: "role" },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
  ];

  return (
    <div className="hide-scrollbar overflow-auto text-sm rounded-lg border border-gray-200 min-h-96 max-h-96">
      <table className="min-w-full">
        <thead className="text-xs bg-white sticky top-0 z-10">
          <tr className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gray-200">
            {columns.map((column) => (
              <th
                key={column.uid}
                className="text-left py-2 px-4 font-semibold text-gray-500"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserBare) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.uid} className="py-2 px-2">
                  <div className="px-2">{renderCell(user, column.uid)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
