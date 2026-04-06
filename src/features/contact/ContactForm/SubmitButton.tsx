import { useFormStatus } from "react-dom";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import styles from "./ContactForm.module.css";

export const SubmitButton = () => {
  const { submit } = getHomeContent().contact.form;
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={styles.submit}>
      {pending ? submit.pending : submit.idle}
    </button>
  );
};
