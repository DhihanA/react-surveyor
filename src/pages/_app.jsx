import "@/styles/globals.css";
// import "@/components/NavbarComponent"
import NavbarComponent from "@/components/NavbarComponent";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>QuickQuest</title>
      </Head>
      <NavbarComponent />
      <Component {...pageProps} />
    </>
  );
}
