import "@/styles/globals.css";
// import "@/components/NavbarComponent"
import NavbarComponent from "@/components/NavbarComponent";
import Head from "next/head";
// import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/icons8-quest-96.png" sizes="any" />
        <title>QuickQuest</title>
      </Head>
      {/* <NavbarComponent /> */}
      <Component {...pageProps} />
    </>
  );
}
