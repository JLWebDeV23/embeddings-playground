import Image from "next/image";
import styles from "./page.module.css";
import AppContainer from "./components/AppContainer/AppContainer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";

export default function Home() {
  return (
    <AppContainer>
      <Header />
      <Main />
    </AppContainer>
  );
}
