import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = {
  className?: string;
  closeMenu: () => void;
};

const MobileNavItems = ({ className, closeMenu }: Props) => {
  const { isLoggedIn, canApproveUsers } = useAuth();

  return (
    <div className="flex gap-2 justify-center">
      {isLoggedIn ? (
        <>
          <div className={`${className}`}>
            <Button
              as={Link}
              to="/dashboard"
              color="default"
              variant="solid"
              radius="sm"
              size="sm"
              className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white"
              onClick={closeMenu}
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
                size="sm"
                className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white"
                onClick={closeMenu}
              >
                Admin Panel
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div>
            <Button
              as={Link}
              to="/login"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 bg-white border-gray-200"
              onClick={closeMenu}
            >
              Sign in / Sign up
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileNavItems;
