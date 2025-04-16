import "@livekit/components-styles/components/participant";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import "@/styles/globals.css";

import { CloudProvider } from "@/cloud/useCloud";

import { Header } from "@/components/header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <CloudProvider>
        <div className="flex flex-col h-screen bg-gray-100">
          <Header />
          <Component {...pageProps} />
        </div>
      </CloudProvider>
    </ClerkProvider>
  );
}
