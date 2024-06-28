import { Button, Link } from "@nextui-org/react";
import BuyMeACoffeLogoWhite from "@/app/assets/bmc-full-logo-white.svg";
import BuyMeACoffeLogoAllWhite from "@/app/assets/bmc-full-logo-all-white.svg";
import BuyMeACoffeLogo from "@/app/assets/bmc-full-logo.svg";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "next-themes";

const BuyMeACoffee = () => {
    const [isHovered, setIsHovered] = useState(false);
    const { theme } = useTheme();

    const ThemedLogo =
        theme === "dark" ? BuyMeACoffeLogoAllWhite : BuyMeACoffeLogo;

    const currentLogo = isHovered ? BuyMeACoffeLogoWhite : ThemedLogo;

    return (
        <Button
            variant="bordered"
            className="bg-background hover:bg-[#fd0] hover:border-foreground"
            size="lg"
            as={Link}
            href="https://www.buymeacoffee.com/JLiou"
            target="_blank"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={currentLogo}
                alt="Buy Me A Coffee"
                className="h-full w-auto p-2"
            />
        </Button>
    );
};

export default BuyMeACoffee;
