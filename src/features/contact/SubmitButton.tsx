import { useFormStatus } from "react-dom";
import styles from "./Contact.module.css";

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={styles.submit}>
      {pending ? "Sending..." : "Send Word"}
    </button>
  );
};
