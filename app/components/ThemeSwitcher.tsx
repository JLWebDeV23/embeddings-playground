import { Button, ButtonProps } from "@nextui-org/react";
import IonIcon from "@reacticons/ionicons";
import { useTheme } from "next-themes";

export const ThemeSwitcher = (props: ButtonProps) => {
    const { theme, setTheme } = useTheme();

    const switchTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div>
            <Button onClick={switchTheme} {...props} isIconOnly size="lg">
                {theme === "light" ? (
                    <IonIcon name="moon-outline" />
                ) : (
                    <IonIcon name="sunny-outline" />
                )}
            </Button>
        </div>
    );
};
