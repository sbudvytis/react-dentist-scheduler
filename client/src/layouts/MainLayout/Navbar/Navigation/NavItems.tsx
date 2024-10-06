import { Button } from "@nextui-org/react";
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
          <div className={`${className}`}>
            <Button
              as={Link}
              to="/dashboard"
              color="default"
              variant="solid"
              radius="sm"
              className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white"
            >
              Dashboard
            </Button>
          </div>
          {canApproveUsers ? (
            <div className={`${className}`}>
              <Button
                as={Link}
                to="/dashboard/admin-panel"
                color="default"
                variant="solid"
                radius="sm"
                className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white"
              >
                Admin Panel
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default NavItems;
