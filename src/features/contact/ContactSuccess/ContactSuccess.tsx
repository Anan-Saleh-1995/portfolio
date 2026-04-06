import { EnsoMark } from "@/shared/ui/EnsoMark";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import styles from "./ContactSuccess.module.css";

interface Props {
  onReset: () => void;
}

export const ContactSuccess = ({ onReset }: Props) => {
  const { success } = getHomeContent().contact.form;

  return (
    <div className={styles.success} role="status" aria-live="polite">
      <EnsoMark size={48} className={styles.successEnso} />
      <h3 className={styles.successHeading}>{success.heading}</h3>
      <p className={styles.successText}>{success.message}</p>
      <button type="button" onClick={onReset} className={styles.resetLink}>
        {success.reset}
      </button>
    </div>
  );
};
