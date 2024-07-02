import { useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  Link,
} from "@nextui-org/react";
import NavItems from "./NavItems";
import LoggedInUser from "@/layouts/DashboardLayout/Sidebar/User/LoggedInUser";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      className="px-3 border-b-1 border-gray-200 bg-white"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            href="/dashboard"
            color="foreground"
            className="active:scale-95 transition-all"
          >
            <img src="/src/assets/logo1.png" alt="Logo" className="h-11" />{" "}
            <p className="font-bold text-inherit px-3">Dentist scheduler</p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex" justify="end">
          <NavItems className="text-sm" />
        </NavbarContent>
      </NavbarContent>
      <NavbarMenu>
        <LoggedInUser />
        <NavItems />
      </NavbarMenu>
    </Navbar>
  );
};

export default NavigationBar;
