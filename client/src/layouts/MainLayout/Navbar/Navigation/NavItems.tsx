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
              startContent={<IoAlbumsOutline size={18} />}
              className="bg-indigo-500 text-white font-medium"
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
                variant="bordered"
                radius="lg"
                startContent={<IoShieldCheckmarkOutline size={18} />}
                className="bg-white font-medium border-2 border-indigo-500 text-indigo-500"
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
