import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
} from "@nextui-org/react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "@/utils/auth";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

const User = () => {
  const { isLoggedIn, authToken, logout } = useAuth();

  const icons = {
    settings: <IoSettingsOutline fill="currentColor" size={16} />,
    logout: <IoLogOutOutline fill="currentColor" size={16} />,
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentUser =
    isLoggedIn && authToken ? getUserFromToken(authToken) : null;

  return (
    <div>
      {isLoggedIn && currentUser && (
        <Dropdown placement="bottom-end" radius="sm" className="text-gray-600">
          <DropdownTrigger>
            <Button
              name={`${currentUser.firstName} ${currentUser.lastName}`}
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 bg-white border-gray-200 shadow-md shadow-gray-100"
            >
              {currentUser.email}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="settings"
              startContent={icons.settings}
              textValue="Settings"
              showDivider={true}
              onClick={() => navigate("/dashboard/my-settings")}
            >
              My Settings
            </DropdownItem>
            <DropdownItem
              key="logout"
              startContent={icons.logout}
              color="danger"
              textValue="Log Out"
              onClick={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

export default User;
