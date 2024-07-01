"use client";
import React from "react";
import Link from "next/link";
import Logo from "../Logo/Logo";
import BuyMeACoffee from "./BuyMeACoffee/BuyMeACoffee";
import { ThemeSwitcher } from "../ThemeSwitcher";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-6">
            <Link color="foreground" href="/">
                <Logo />
            </Link>
            <div className="hidden sm:flex gap-4 items-center">
                <Link color="foreground" href="/rag">
                    RAG
                </Link>
                <Link color="foreground" href="/rag2">
                    RAG2
                </Link>
                <Link color="foreground" href="/">
                    Tokenizer
                </Link>
                <Link color="foreground" href="/model-compare">
                    Model Compare
                </Link>
                <ThemeSwitcher />
                <BuyMeACoffee />
            </div>
        </header>
    );
};

export default Header;
