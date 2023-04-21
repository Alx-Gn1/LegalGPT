import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
// import Script from "next/script";
const defaultFont = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className={defaultFont.className}>
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  );
}
