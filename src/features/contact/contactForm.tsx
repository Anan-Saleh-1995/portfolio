import { useActionState } from "react";
import styles from "./Contact.module.css";
import { submitContactAction } from "./contact.action";
import { initialContactFormState } from "./contact.initialState";
import { ContactSuccess } from "./ContactSuccess";
import { SubmitButton } from "./SubmitButton";
import { PurposeSelect } from "./PurposeSelect";

export const ContactForm = () => {
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    initialContactFormState,
  );

  const resetKey = state.success ? "success" : "form";

  if (state.success) {
    return <ContactSuccess onReset={() => window.location.reload()} />;
  }

  return (
    <form action={formAction} noValidate className={styles.form} key={resetKey}>
      <div className={styles.srOnly} aria-live="polite">
        {isPending && "Sending your message..."}
        {!isPending && state.errorMessage}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-describedby={
            state.errors.name ? "contact-name-error" : undefined
          }
          aria-invalid={!!state.errors.name}
          className={styles.input}
        />
        {state.errors.name && (
          <span id="contact-name-error" className={styles.error} role="alert">
            {state.errors.name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          aria-describedby={
            state.errors.email ? "contact-email-error" : undefined
          }
          aria-invalid={!!state.errors.email}
          className={styles.input}
        />
        {state.errors.email && (
          <span id="contact-email-error" className={styles.error} role="alert">
            {state.errors.email}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-subject" className={styles.label}>
          Purpose
        </label>
        <PurposeSelect />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          aria-describedby={
            state.errors.message ? "contact-message-error" : undefined
          }
          aria-invalid={!!state.errors.message}
          className={styles.textarea}
        />
        {state.errors.message && (
          <span
            id="contact-message-error"
            className={styles.error}
            role="alert"
          >
            {state.errors.message}
          </span>
        )}
      </div>

      {state.errorMessage && (
        <div className={styles.errorBanner} role="alert">
          {state.errorMessage}
        </div>
      )}

      <SubmitButton />
    </form>
  );
};
