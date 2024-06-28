import { Button } from "@nextui-org/react";
import IonIcon from "@reacticons/ionicons";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const switchTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div>
            <Button onClick={switchTheme} variant="light" isIconOnly size="lg">
                {theme === "light" ? (
                    <IonIcon name="moon" />
                ) : (
                    <IonIcon name="sunny" />
                )}
            </Button>
        </div>
    );
};