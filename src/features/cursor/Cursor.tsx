import { useCursorTracking } from "./useCursorTracking";
import styles from "./Cursor.module.css";

export function Cursor() {
  const { hasMouse, dotRef, ringRef } = useCursorTracking();

  if (!hasMouse) return null;

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
