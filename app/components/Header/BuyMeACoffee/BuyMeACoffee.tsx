import Script from "next/script";
import Image from "next/image";

const BuyMeACoffee = () => {
  return (
    <a href="https://www.buymeacoffee.com/JLiou" target="_blank">
      <Image
        src="/buyMeACoffee.png"
        width={217}
        height={60}
        alt="Buy Me A Coffee"
        style={{ height: "60px !important", width: "217px !important" }}
      />
    </a>
  );
};

export default BuyMeACoffee;
