import { Link } from "react-router-dom";

interface Props {
  isLoggedIn: boolean;
}

const LogoAndTitle = ({ isLoggedIn }: Props) => {
  return (
    <>
      {/* Desktop logo */}
      <div className="hidden md:flex items-center lg:min-w-68 lg:max-w-68">
        <Link to="/dashboard" className="flex items-center">
          <img src="/logo1.png" alt="Logo" className="h-9" />
          <p className="ml-3 text-md font-semibold">Dentist Scheduler</p>
        </Link>
      </div>

      {/* Mobile logo */}
      <div
        className={`md:hidden items-center absolute ${
          isLoggedIn ? "left-1/2 transform -translate-x-1/2" : "left-4"
        }`}
      >
        <Link to="/dashboard" className="flex items-center">
          <img src="/logo1.png" alt="Logo" className="h-9" />
          <p className="ml-3 text-sm font-bold">Dentist Scheduler</p>
        </Link>
      </div>
    </>
  );
};

export default LogoAndTitle;
