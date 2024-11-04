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
              className="bg-zinc-400 text-white font-medium"
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
                className="bg-white font-medium"
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
