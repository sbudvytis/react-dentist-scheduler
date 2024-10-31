import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import { IoAlbumsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

interface Props {
  className?: string;
  closeMenu: () => void;
}

const MobileNavItems = ({ className, closeMenu }: Props) => {
  const { isLoggedIn, canApproveUsers } = useAuth();

  return (
    <>
      <div className="flex gap-2 justify-center">
        {isLoggedIn ? (
          <>
            <div className={`${className}`}>
              <Button
                as={Link}
                to="/dashboard"
                color="default"
                variant="solid"
                radius="lg"
                startContent={<IoAlbumsOutline />}
                className="border-1 bg-white border-gray-200 font-medium h-9"
                onClick={closeMenu}
              >
                Dashboard
              </Button>
            </div>
            {canApproveUsers ? (
              <div className={`${className}`}>
                <Button
                  as={Link}
                  to="/admin-panel"
                  color="default"
                  variant="solid"
                  radius="lg"
                  startContent={<IoShieldCheckmarkOutline />}
                  className="border-1 bg-white border-gray-200 font-medium h-9"
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
                className="border-1 bg-white border-gray-200 font-medium h-9"
                onClick={closeMenu}
              >
                Sign in / Sign up
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MobileNavItems;
