import { Nav } from "@/features/nav/Nav";
import { Hero } from "@/features/hero/Hero";
import { About } from "@/features/about/About";
import { Arsenal } from "@/features/arsenal/Arsenal";
import { Forge } from "@/features/forge/Forge";
import { Contact } from "@/features/contact/Contact";
import { Footer } from "@/features/footer/Footer";
import styles from "./Home.module.css";

export function Home() {
  return (
    <>
      <Nav />
      <main className={styles.root}>
        <Hero />
        <About />
        <Arsenal />
        <Forge />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
