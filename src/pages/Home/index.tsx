import { Nav } from "@/features/nav/Nav";
import styles from "./Home.module.css";

export function Home() {
  return (
    <>
      <Nav />
      <main className={styles.root}></main>
    </>
  );
}
