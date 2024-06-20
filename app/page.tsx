"use client";

import Version_2_0 from "./version_2_0/page";

import { NextUIProvider } from "@nextui-org/react";
import ModelDataProvider from "./providers/ModelDataProvider";
import SystemMessageProvider from "@/app/providers/SystemMessageProvider";

export default function Home() {
    return (
        <SystemMessageProvider>
            <ModelDataProvider>
                <NextUIProvider className="flex flex-col flex-1">
                    <Version_2_0 />
                </NextUIProvider>
            </ModelDataProvider>
        </SystemMessageProvider>
    );
}
