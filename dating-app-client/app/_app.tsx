"use client";
import { AppProps } from "next/app";
import { ToastProvider } from "./_context/ToastContext";

function App({ Component, pageProps }: AppProps) {
  return (
    <Component className="w-full h-screen place-items-center" {...pageProps} />
  );
}
