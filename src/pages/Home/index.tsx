import { Nav } from "@/features/nav/Nav";
import { Hero } from "@/features/hero/Hero";
import { TheWay } from "@/features/TheWay/TheWay";
import { Arsenal } from "@/features/arsenal/Arsenal";
import { Forge } from "@/features/forge/Forge";
import { ProvingGround } from "@/features/provingGround/ProvingGround";
import { Contact } from "@/features/contact/Contact";
import { Footer } from "@/features/footer/Footer";
import styles from "./Home.module.css";

export const Home = () => (
  <>
    <Nav />
    <main id="main-content" className={styles.root}>
      <Hero />
      <TheWay />
      <Arsenal />
      <Forge />
      <ProvingGround />
      <Contact />
    </main>
    <Footer />
  </>
);
