import { Nav } from "@/features/nav/Nav";
import { Hero } from "@/features/hero/Hero";
import styles from "./Home.module.css";

export function Home() {
  return (
    <>
      <Nav />
      <main className={styles.root}>
        <Hero />
      </main>
    </>
  );
}
