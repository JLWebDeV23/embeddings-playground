import React from "react";
import logoImage from "../../images/logo-image.png";
import styles from "./Header.module.css";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import { Main } from "next/document";
import Logo from "../Logo/Logo";

const Header = () => {
  return (
    <header>
      <Navbar shouldHideOnScroll>
        <NavbarBrand>
          <Link color="foreground" href="/">
            <Logo />
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/main">
              Version 1.0
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link color="foreground" href="/" aria-current="page">
              Version 2.0
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;
