import { Nav } from "@/features/nav/Nav";
import { Hero } from "@/features/hero/Hero";
import { About } from "@/features/about/About";
import { Arsenal } from "@/features/arsenal/Arsenal";
import { Forge } from "@/features/forge/Forge";
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
      </main>
    </>
  );
}
