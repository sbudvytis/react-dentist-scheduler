import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./Navbar/Navbar";

type Props = {
  children: React.ReactNode;
};

const App = ({ children }: Props) => {
  return (
    <main className="flex flex-col inset-0 min-h-full w-full bg-gray-50">
      <div className="relative flex h-screen flex-col hide-main-scrollbar">
        <NavigationBar />
        <div className="flex-1">{children}</div>
        <ToastContainer position="bottom-right" />
      </div>
    </main>
  );
};

export default App;
