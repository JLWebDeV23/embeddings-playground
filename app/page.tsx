'use client'

import Version_2_0 from "./version_2_0/page";

import { NextUIProvider } from '@nextui-org/react'

export default function Home() {
  return (
    <NextUIProvider>
      <Version_2_0 />
    </NextUIProvider>
  );
}
