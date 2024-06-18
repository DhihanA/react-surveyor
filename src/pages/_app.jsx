import "@/styles/globals.css";
// import "@/components/NavbarComponent"
import NavbarComponent from "@/components/NavbarComponent";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavbarComponent />
      <Component {...pageProps} />
    </>
  );
}
