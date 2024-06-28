"use client";
import ModelDataProvider from "@/app/providers/ModelDataProvider";
import SystemMessageProvider from "@/app/providers/SystemMessageProvider";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const ModalInfoProvider = dynamic(
    () => import("@/app/providers/ModalInfoProvider"),
    {
        ssr: false,
    }
);

export default function Providers({ children }: PropsWithChildren) {
    return (
        <SystemMessageProvider>
            <ModalInfoProvider>
                <ModelDataProvider>
                    <NextUIProvider className="flex flex-col flex-1">
                        <NextThemesProvider attribute="class">
                            {children}
                        </NextThemesProvider>
                    </NextUIProvider>
                </ModelDataProvider>
            </ModalInfoProvider>
        </SystemMessageProvider>
    );
}
