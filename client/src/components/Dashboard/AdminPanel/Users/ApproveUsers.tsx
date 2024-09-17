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
import { IoPersonRemoveOutline } from "react-icons/io5";
import { CheckIcon } from "../icons/CheckIcon";
import { IoCheckmarkDone } from "react-icons/io5";
import useUser from "@/hooks/useUser";
import type { UserBare } from "@mono/server/src/shared/entities";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  notApproved: "danger",
};

const AdminPanel = () => {
  const { users, approveUser, removeUser } = useUser(false, null);

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

  if (users.length === 0) {
    return (
      <Card className="border-none text-default-500" radius="sm" shadow="sm">
        <CardBody className="text-center">
          <p className="relative flex justify-center items-center gap-2">
            <IoCheckmarkDone /> All clear! There are no users to approve.
          </p>
        </CardBody>
      </Card>
    );
  }

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
        {users.map((user: UserBare) => (
          <TableRow key={user.id}>
            {columns.map((column) => (
              <TableCell key={column.uid}>
                {renderCell(user, column.uid)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminPanel;
