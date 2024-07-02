import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  ChipProps,
  Card,
  CardBody,
} from "@nextui-org/react";
import { DeleteIcon } from "./icons/DeleteIcon";
import { CheckIcon } from "./icons/CheckIcon";
import useUser from "@/hooks/useUser";
import type { UserBare } from "@mono/server/src/shared/entities";
import { useCallback } from "react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  notApproved: "danger",
};

const AdminPanel = () => {
  const { users, approveUser, removeUser } = useUser();

  const renderCell = useCallback(
    (user: UserBare, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserBare];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "sm", isBordered: true }}
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
              <Tooltip color="danger" content="Delete user" radius="sm">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => removeUser(user.id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [approveUser, removeUser]
  );

  const columns = [
    { name: "Name", uid: "name" },
    { name: "Role", uid: "role" },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
  ];

  if (users.length === 0) {
    return (
      <Card className="border-none text-default-500" radius="sm" shadow="sm">
        <CardBody className="text-center">
          <p className="relative flex justify-center items-center gap-2">
            <CheckIcon /> All clear! There are no users to approve.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Table aria-label="Users waiting for approval" shadow="sm">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={"start"}>
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

export default AdminPanel;
