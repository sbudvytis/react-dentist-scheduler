import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import { IoAlbumsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

interface Props {
  className?: string;
}

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
              radius="lg"
              startContent={<IoAlbumsOutline />}
              className="bg-black hover:bg-indigo-600 text-white h-9 font-medium"
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
                radius="lg"
                startContent={<IoShieldCheckmarkOutline />}
                className="bg-black hover:bg-indigo-600 text-white h-9 font-medium"
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
