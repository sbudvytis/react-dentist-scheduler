import { Button } from "@nextui-org/react";
import { IoMenuOutline } from "react-icons/io5";

type Props = {
  toggleMenu: () => void;
};

const HamburgerMenuButton = ({ toggleMenu }: Props) => {
  return (
    <Button
      isIconOnly
      color="default"
      variant="bordered"
      radius="sm"
      onClick={toggleMenu}
      className="border-1 bg-white border-gray-200 focus:outline-none md:hidden"
      aria-label="Toggle Menu"
    >
      <IoMenuOutline size={28} />
    </Button>
  );
};

export default HamburgerMenuButton;
