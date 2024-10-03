import useAuth from "@/hooks/useAuth";

const AdminGuard = () => {
  const { canApproveUsers } = useAuth();

  if (!canApproveUsers) {
    return (
      <table className="w-full border-1 flex p-4 rounded-lg min-h-96 justify-center items-center text-gray-600">
        <tbody className="text-center">
          <tr>
            <td>
              <img
                src="/not-allowed.svg"
                alt="No data"
                className="size-96 py-4"
              />
            </td>
          </tr>
          <tr>
            <td>
              <p className="relative flex justify-center items-center gap-2 pt-4">
                You do not have permission to view this page!
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
};

export default AdminGuard;
