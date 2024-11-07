import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import User from "@/layouts/MainLayout/Navbar/User/User";

interface Props {
  isLoggedIn: boolean;
}

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
          radius="lg"
          className="border-1 border-gray-200 bg-white font-medium"
        >
          Sign in / Sign up
        </Button>
      )}
    </div>
  );
};

export default UserActions;
