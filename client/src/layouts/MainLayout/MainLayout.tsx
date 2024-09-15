import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavigationBar from "./Navbar/Navbar";

type Props = {
  children: React.ReactNode;
};

const App = ({ children }: Props) => {
  return (
    <main className="flex flex-col inset-0 min-h-full w-full bg-gray-50">
      <div className="relative flex h-screen flex-col overflow-x-hidden">
        <NavigationBar />
        <div className="flex-1 overflow-x-hidden">{children}</div>
        <ToastContainer position="bottom-right" />
      </div>
    </main>
  );
};

export default App;
