import NavBar from "@/Components/NavBar/NavBar";
import SideMenu from "@/Components/SideMenu/SideMenu";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <div style={{ display: "flex"}}>
        <SideMenu />
        <div className="content">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
