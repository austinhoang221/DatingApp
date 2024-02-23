"use client";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <Component className="w-full h-screen place-items-center" {...pageProps} />
  );
}
