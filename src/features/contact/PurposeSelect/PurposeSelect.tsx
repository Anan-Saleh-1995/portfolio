import { getHomeContent } from "@/shared/i18n/getHomeContent";
import styles from "./PurposeSelect.module.css";

interface Props {
  defaultValue: string;
}

export const PurposeSelect = ({ defaultValue }: Props) => {
  const { purposeSelect } = getHomeContent().contact.form;

  return (
    <div className={styles.selectWrap}>
      <select
        id="contact-subject"
        name="subject"
        defaultValue={defaultValue}
        className={styles.select}
        aria-label={purposeSelect.ariaLabel}
      >
        <option value="" disabled hidden>
          {purposeSelect.placeholder}
        </option>
        {purposeSelect.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.selectChevron} aria-hidden="true">
        v
      </span>
    </div>
  );
};
