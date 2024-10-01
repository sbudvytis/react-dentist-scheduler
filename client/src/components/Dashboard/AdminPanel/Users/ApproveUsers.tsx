import { User, Chip, Tooltip, ChipProps, Spinner } from "@nextui-org/react";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { CheckIcon } from "../icons/CheckIcon";
import useUser from "@/hooks/useUser";
import type { UserBare } from "@mono/server/src/shared/entities";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  notApproved: "danger",
};

const AdminPanel = () => {
  const { users, approveUser, removeUser, usersLoading } = useUser(false, null);

  const renderCell = (user: UserBare, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserBare];

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
            {user.isApproved ? "" : "Not approved"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex gap-2">
            <Tooltip content="Approve user" radius="sm">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => approveUser(user.id)}
              >
                <CheckIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Remove user" radius="sm">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => removeUser(user.id)}
              >
                <IoPersonRemoveOutline />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };
  const columns = [
    { name: "Name", uid: "name" },
    { name: "Role", uid: "role" },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
  ];

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center py-48">
        <Spinner color="default" />
      </div>
    );
  }

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
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                No results.
              </td>
            </tr>
          ) : (
            users.map((user: UserBare) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.uid} className="py-2 px-2">
                    <div className="px-2">{renderCell(user, column.uid)}</div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
