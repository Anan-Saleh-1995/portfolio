import { useFormStatus } from "react-dom";
import { homeContent } from "@/shared/content/en/home";
import styles from "./ContactForm.module.css";

export const SubmitButton = () => {
  const { submit } = homeContent.contact.form;
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={styles.submit}>
      {pending ? submit.pending : submit.idle}
    </button>
  );
};
