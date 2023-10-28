import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WalletsContextProvider } from "@/context/walletsContext";
import { NetworkContextProvider } from "@/context/networkContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NetworkContextProvider>
      <WalletsContextProvider>
        <Component {...pageProps} />
      </WalletsContextProvider>
    </NetworkContextProvider>
  );
}
