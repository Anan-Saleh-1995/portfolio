import styles from "./SectionLabel.module.css";

export function SectionLabel({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className={styles.root}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.number}>{number}</span>
      <span className={styles.slash}>/</span>
      <span className={styles.title}>{title}</span>
    </div>
  );
}
