import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./Navbar/Navbar";
import useAuth from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const App = ({ children }: Props) => {
  const { isLoggedIn } = useAuth();

  return (
    <main className="flex flex-col inset-0 w-full bg-gray-50 overflow-hidden">
      <div className="relative flex h-[100dvh] flex-col hide-main-scrollbar">
        {!isLoggedIn && <NavigationBar />}
        <div className="flex-1">{children}</div>
        <ToastContainer position="bottom-right" theme="colored" />
      </div>
    </main>
  );
};

export default App;
