"use client";

import Version_2_0 from "./components/Version_2_0";

import { NextUIProvider } from "@nextui-org/react";
import ModelDataProvider from "./providers/ModelDataProvider";
import SystemMessageProvider from "@/app/providers/SystemMessageProvider";
import ModalInfoProvider from "@/app/providers/ModalInfoProvider";

export default function Home() {
    return (
        <SystemMessageProvider>
            <ModalInfoProvider>
                <ModelDataProvider>
                    <NextUIProvider className="flex flex-col flex-1">
                        <Version_2_0 />
                    </NextUIProvider>
                </ModelDataProvider>
            </ModalInfoProvider>
        </SystemMessageProvider>
    );
}
