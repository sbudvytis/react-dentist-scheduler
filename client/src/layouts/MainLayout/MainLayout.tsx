import { Toaster } from "sonner";
import NavigationBar from "./Navbar/Navbar";
import useAuth from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const App = ({ children }: Props) => {
  const { isLoggedIn } = useAuth();

  return (
    <main className="flex flex-col inset-0 w-full bg-gray-100 overflow-hidden">
      <div className="relative flex h-[100dvh] flex-col hide-main-scrollbar">
        {!isLoggedIn && <NavigationBar />}
        <div className="flex-1">{children}</div>
        <Toaster richColors position="bottom-right" />
      </div>
    </main>
  );
};

export default App;
