import { User, Tooltip, Spinner } from "@nextui-org/react";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { CheckIcon } from "../icons/CheckIcon";
import useUser from "@/hooks/useUser";
import { User as UserTypes } from "@/components/Dashboard/types";

const AdminPanel = () => {
  const { users, approveUser, removeUser, usersLoading } = useUser(false, null);

  const renderCell = (user: UserTypes, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserTypes];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", isBordered: false }}
            description={user.email}
            name={`${user.firstName} ${user.lastName}`}
          />
        );

      case "actions":
        return (
          <div className="relative flex gap-2">
            <Tooltip
              content="Approve user"
              radius="sm"
              className="bg-black text-white"
            >
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => approveUser(user.id)}
              >
                <CheckIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content="Remove user"
              radius="sm"
              className="bg-black"
            >
              <span
                className="text-lg text-danger-600 cursor-pointer active:opacity-50"
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
    <div className="overflow-hidden text-sm rounded-2xl border border-gray-200">
      <div className="overflow-x-auto overflow-y-auto min-h-96 max-h-96">
        <table className="min-w-full">
          <thead className="text-xs bg-white sticky top-0 z-10">
            <tr className="border-b border-gray-200">
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
              users.map((user: UserTypes) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 even:bg-white odd:bg-gray-50"
                >
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
    </div>
  );
};

export default AdminPanel;
