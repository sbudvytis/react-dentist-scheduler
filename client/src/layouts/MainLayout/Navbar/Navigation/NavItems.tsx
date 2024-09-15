import { Button, NavbarMenuItem } from "@nextui-org/react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = {
  className?: string;
};

const NavItems = ({ className }: Props) => {
  const { isLoggedIn, canApproveUsers } = useAuth();

  return (
    <>
      {isLoggedIn ? (
        <>
          <NavbarMenuItem className={`${className}`}>
            <Button
              as={Link}
              to="/dashboard"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 bg-white border-gray-200 shadow-md shadow-gray-100"
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
                className="border-1 bg-white border-gray-200 shadow-md shadow-gray-100"
              >
                Admin Panel
              </Button>
            </NavbarMenuItem>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default NavItems;
