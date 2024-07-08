"use client";
import React from "react";
import Link from "next/link";
import Logo from "../Logo/Logo";
import BuyMeACoffee from "./BuyMeACoffee/BuyMeACoffee";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Button, Divider } from "@nextui-org/react";
import SetupApiKeyModal from "../SetupApiKeyModal";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-6 h-fit">
            <Link color="foreground" href="/">
                <Logo />
            </Link>
            <div className="hidden sm:flex gap-3 items-center h-fit">
                <Button
                    variant="light"
                    as={Link}
                    href="/rag"
                    className="px-2 w-fit min-w-0"
                >
                    Legacy
                </Button>
                <Button
                    variant="light"
                    as={Link}
                    href="/logprob"
                    className="px-2 w-fit min-w-0"
                >
                    RAG
                </Button>
                <Button
                    variant="light"
                    as={Link}
                    href="/logprob"
                    className="px-2 w-fit min-w-0"
                >
                    Tokenizer
                </Button>
                <Button
                    variant="light"
                    as={Link}
                    href="/model-compare"
                    className="px-2 w-fit min-w-0"
                >
                    Model Compare
                </Button>
                <Divider orientation="vertical" className="h-6" />
                <SetupApiKeyModal
                    variant="light"
                    className="px-2 w-fit min-w-0"
                />
                <ThemeSwitcher />
                <BuyMeACoffee />
            </div>
        </header>
    );
};

export default Header;
