import { useActionState, useState } from "react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import { submitContactAction } from "../contact.action";
import { initialContactFormState } from "../contact.initialState";
import { ContactSuccess } from "../ContactSuccess/ContactSuccess";
import { SubmitButton } from "./SubmitButton";
import { PurposeSelect } from "../PurposeSelect/PurposeSelect";
import styles from "./ContactForm.module.css";

export const ContactForm = () => {
  const [formVersion, setFormVersion] = useState(0);

  return (
    <ContactFormContent
      key={formVersion}
      onReset={() => setFormVersion((prev) => prev + 1)}
    />
  );
};

interface ContactFormContentProps {
  onReset: () => void;
}

const ContactFormContent = ({ onReset }: ContactFormContentProps) => {
  const { form } = getHomeContent().contact;
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    initialContactFormState,
  );

  if (state.success) {
    return <ContactSuccess onReset={onReset} />;
  }

  const formKey = JSON.stringify(state.values);

  return (
    <form key={formKey} action={formAction} noValidate className={styles.form}>
      <div className={styles.srOnly} aria-live="polite">
        {isPending && form.liveRegion.pending}
        {!isPending && state.errorMessage}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>
          {form.labels.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          defaultValue={state.values.name}
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
          {form.labels.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          defaultValue={state.values.email}
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
          {form.labels.purpose}
        </label>
        <PurposeSelect defaultValue={state.values.subject} />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          {form.labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          defaultValue={state.values.message}
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
