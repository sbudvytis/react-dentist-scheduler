import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  ChipProps,
  Tooltip,
} from "@nextui-org/react";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import type { UserBare } from "@mono/server/src/shared/entities";
import { IoPersonRemoveOutline } from "react-icons/io5";

const statusColorMap: Record<string, ChipProps["color"]> = {
  approved: "success",
  notApproved: "danger",
};

const AllUsers = () => {
  const { userId } = useAuth(); // Get the current user's ID
  const { users, removeUser } = useUser(true, userId); // Pass it to useUser

  const renderCell = (user: UserBare, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserBare];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", isBordered: true }}
            description={user.email}
            name={`${user.firstName} ${user.lastName}`}
            className="gap-4"
          />
        );

      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              user.isApproved
                ? statusColorMap["approved"]
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
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => removeUser(user.id)}
                >
                  <IoPersonRemoveOutline />
                </span>
              </Tooltip>
            )}
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

  return (
    <Table aria-label="Users waiting for approval" shadow="sm" radius="sm">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={"start"} width={"33%"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody>
        {users.length > 0
          ? users.map((user: UserBare) => (
              <TableRow key={user.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(user, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          : "No rows to display."}
      </TableBody>
    </Table>
  );
};

export default AllUsers;
