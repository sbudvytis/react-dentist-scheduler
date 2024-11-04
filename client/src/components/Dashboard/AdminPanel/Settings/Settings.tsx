import useAuth from "@/hooks/useAuth";
import AdminGuard from "../AdminGuard";

const Settings = () => {
  const { canApproveUsers } = useAuth();
  return (
    <>
      {canApproveUsers ? (
        <>
          <div className="pb-6">
            <h1 className="text-xl text-left flex items-center gap-2 text-gray-800 font-semibold">
              Settings
            </h1>
            <h2 className="text-sm text-gray-500">Manage system settings</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p>coming soon</p>
          </div>
        </>
      ) : (
        <AdminGuard />
      )}
    </>
  );
};

export default Settings;
