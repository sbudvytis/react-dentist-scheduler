import { User, Divider } from "@nextui-org/react";
import useAuth from "@/hooks/useAuth";
import { getUserFromToken } from "@/utils/auth";
import type { AuthUser } from "@mono/server/src/shared/entities";

const LoggedInUser = () => {
  const { isLoggedIn, authToken } = useAuth();

  const currentUser: AuthUser | null =
    isLoggedIn && authToken ? getUserFromToken(authToken) : null;

  return (
    <div className="pt-4 px-4">
      {isLoggedIn && currentUser && (
        <User
          name={`${currentUser.firstName} ${currentUser.lastName}`}
          description={`${currentUser.role} (${currentUser.email})`}
          avatarProps={{
            name: currentUser.firstName,
            isBordered: true,
            radius: "lg",
          }}
          className="gap-4"
        />
      )}
      <Divider className="my-4" />
    </div>
  );
};

export default LoggedInUser;
