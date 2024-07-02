import { Button, NavbarMenuItem } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = {
  className?: string;
};

const NavItems = ({ className }: Props) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, canApproveUsers } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <NavbarMenuItem className={`${className}`}>
            <Link to="/dashboard">Dashboard</Link>
          </NavbarMenuItem>
          {canApproveUsers ? (
            <NavbarMenuItem className={`${className}`}>
              <Link to="/dashboard/admin-panel">Admin Panel</Link>
            </NavbarMenuItem>
          ) : (
            ""
          )}
          <NavbarMenuItem>
            <Button
              onClick={handleLogout}
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 border-gray-200 shadow-md shadow-gray-100"
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
    </>
  );
};

export default NavItems;
