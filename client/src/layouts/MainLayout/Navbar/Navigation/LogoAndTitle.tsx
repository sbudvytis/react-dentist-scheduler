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
          <img src="/logo1.png" alt="Logo" className="h-8" />
          <p className="ml-2 text-xl font-semibold font-bitter text-indigo-950">
            Calendent
          </p>
        </Link>
      </div>

      {/* Mobile logo */}
      <div
        className={`md:hidden items-center absolute ${
          isLoggedIn ? "left-1/2 transform -translate-x-1/2" : "left-4"
        }`}
      >
        <Link to="/dashboard" className="flex items-center">
          <img src="/logo1.png" alt="Logo" className="h-7" />
          <p className="ml-2 text-lg font-semibold font-bitter text-indigo-950">
            Calendent
          </p>
        </Link>
      </div>
    </>
  );
};

export default LogoAndTitle;
