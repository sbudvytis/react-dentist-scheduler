import { User as UserTypes } from "@/components/Dashboard/types";
import { Chip, Tooltip, User, ChipProps } from "@nextui-org/react";
import { IoPersonRemoveOutline } from "react-icons/io5";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  notApproved: "danger",
};

type UserRowProps = {
  user: UserTypes;
  userId: number;
  onOpenDeleteModal: (user: UserTypes) => void;
};

const UserRow = ({ user, userId, onOpenDeleteModal }: UserRowProps) => {
  return (
    <tr className="hover:bg-gray-100 even:bg-white odd:bg-gray-50">
      <td className="py-2 px-2">
        <div className="px-2">
          <User
            avatarProps={{ radius: "full", isBordered: false }}
            description={user.email}
            name={`${user.firstName} ${user.lastName}`}
          />
        </div>
      </td>
      <td className="py-2 px-2">{user.role}</td>
      <td className="py-2 px-2">
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
      </td>
      <td className="py-2 px-2">
        <div className="relative flex gap-2">
          {user.id !== userId && (
            <Tooltip
              color="danger"
              content="Remove user"
              radius="sm"
              className="bg-black"
            >
              <span
                className="text-lg text-danger-600 cursor-pointer active:opacity-50"
                onClick={() => onOpenDeleteModal(user)}
              >
                <IoPersonRemoveOutline />
              </span>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
