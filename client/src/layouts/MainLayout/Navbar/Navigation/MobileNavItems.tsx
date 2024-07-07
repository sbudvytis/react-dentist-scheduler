import { Button, NavbarMenuItem } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = {
  className?: string;
};

const MobileNavItems = ({ className }: Props) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, canApproveUsers } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex gap-2 justify-center">
      {isLoggedIn ? (
        <>
          <NavbarMenuItem className={`${className}`}>
            <Button
              as={Link}
              to="/dashboard"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 border-gray-200 shadow-md shadow-gray-100"
            >
              Dashboard
            </Button>
          </NavbarMenuItem>
          {canApproveUsers ? (
            <NavbarMenuItem className={`${className}`}>
              <Button
                as={Link}
                to="/dashboard/admin-panel"
                color="default"
                variant="bordered"
                radius="sm"
                className="border-1 border-gray-200 shadow-md shadow-gray-100"
              >
                Admin Panel
              </Button>
            </NavbarMenuItem>
          ) : null}
          <NavbarMenuItem className={`${className}`}>
            <Button
              as={Link}
              to="/login"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 border-gray-200 shadow-md shadow-gray-100"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </NavbarMenuItem>
        </>
      ) : (
        <>
          <NavbarMenuItem>
            <Button
              as={Link}
              to="/login"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 border-gray-200 shadow-md shadow-gray-100"
            >
              Sign in / Sign up
            </Button>
          </NavbarMenuItem>
        </>
      )}
    </div>
  );
};

export default MobileNavItems;
