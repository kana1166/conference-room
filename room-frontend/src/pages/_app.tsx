import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import Modal from "react-modal";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);

  return <Component {...pageProps} />;
}
