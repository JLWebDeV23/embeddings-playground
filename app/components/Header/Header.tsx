import React from "react";

import Link from "next/link";
import Logo from "../Logo/Logo";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-3">
      <div>
        <Link color="foreground" href="/">
          <Logo />
        </Link>
      </div>
      <div className="hidden sm:flex gap-4">
        <Link color="foreground" href="/main">
          Version 1.0
        </Link>
        <Link color="foreground" href="/" aria-current="page">
          Version 2.0
        </Link>
      </div>
    </header>
  );
};

export default Header;
