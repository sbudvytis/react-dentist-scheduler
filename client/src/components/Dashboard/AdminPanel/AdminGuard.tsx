import { Card, CardBody } from "@nextui-org/react";
import useAuth from "@/hooks/useAuth";

type AdminGuardProps = {
  children: React.ReactNode;
};

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { canApproveUsers } = useAuth();

  if (!canApproveUsers) {
    return (
      <Card className="border-none text-default-500" radius="sm" shadow="sm">
        <CardBody className="text-center">
          <p className="relative flex justify-center items-center gap-2">
            Hey there, looks like you don't have permission to access this page.
          </p>
        </CardBody>
      </Card>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
