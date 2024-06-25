import Image from "next/image";

const BuyMeACoffee = () => {
    return (
        <a href="https://www.buymeacoffee.com/JLiou" target="_blank">
            <Image
                src="/buyMeACoffee.png"
                width={217}
                height={60}
                className="h-12 w-auto hover:scale-105 transition-all duration-300"
                alt="Buy Me A Coffee"
            />
        </a>
    );
};

export default BuyMeACoffee;
