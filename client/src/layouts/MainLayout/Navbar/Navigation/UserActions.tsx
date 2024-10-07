import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import User from "@/layouts/MainLayout/Navbar/User/User";

type Props = {
  isLoggedIn: boolean;
};

const UserActions = ({ isLoggedIn }: Props) => {
  return (
    <div className="flex items-center">
      {isLoggedIn ? (
        <User />
      ) : (
        <Button
          as={Link}
          to="/login"
          color="default"
          variant="bordered"
          radius="sm"
          className="border-1 bg-white border-gray-200 h-9"
        >
          Sign in / Sign up
        </Button>
      )}
    </div>
  );
};

export default UserActions;
