import { EnsoMark } from "@/shared/ui/EnsoMark";
import styles from "./Contact.module.css";

type Props = {
  onReset: () => void;
};

export const ContactSuccess = ({ onReset }: Props) => {
  return (
    <div className={styles.success} role="status" aria-live="polite">
      <EnsoMark size={48} className={styles.successEnso} />
      <h3 className={styles.successHeading}>Word Received</h3>
      <p className={styles.successText}>
        Your message has been received. I will respond within 48 hours.
      </p>
      <button type="button" onClick={onReset} className={styles.resetLink}>
        Send Another
      </button>
    </div>
  );
};
