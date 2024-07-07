import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavigationBar from "./Navbar/Navbar";

type Props = {
  children: React.ReactNode;
};

const App = ({ children }: Props) => {
  return (
    <main className="flex flex-col inset-0 min-h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:20px_20px] bg-white opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
      <div className="relative flex h-screen flex-col overflow-x-hidden">
        <NavigationBar />
        <div className="flex-1 overflow-x-hidden">{children}</div>
        <ToastContainer position="bottom-right" />
      </div>
    </main>
  );
};

export default App;
