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
import {
  IoSettingsOutline,
  IoLogOutOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useMediaQuery } from "react-responsive";

const User = () => {
  const { isLoggedIn, authToken, logout } = useAuth();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const icons = {
    user: <IoPersonOutline fill="currentColor" size={16} />,
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
        <Dropdown placement="bottom-end" radius="lg" className="text-slate-600">
          <DropdownTrigger>
            <Button
              name={`${currentUser.firstName} ${currentUser.lastName}`}
              color="default"
              variant="bordered"
              radius={isMobile ? "sm" : "lg"}
              isIconOnly={isMobile}
              className="border-0 bg-white border-gray-200 font-medium"
            >
              {isMobile ? (
                <IoSettingsOutline size={20} />
              ) : (
                <>
                  {<IoPersonOutline />} {currentUser.email}
                </>
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              isReadOnly
              key="profile"
              textValue="profile"
              showDivider={true}
              className="cursor-default"
            >
              {isMobile ? (
                <p className="flex font-medium items-center gap-2">
                  {icons.user} {currentUser.email}
                </p>
              ) : (
                <p className="font-medium">
                  Welcome, {currentUser.firstName} {currentUser.lastName}
                </p>
              )}
            </DropdownItem>
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
