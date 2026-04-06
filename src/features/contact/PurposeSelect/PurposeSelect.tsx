import { useEffect, useRef, useState } from "react";
import { homeContent } from "@/shared/content/en/home";
import styles from "./PurposeSelect.module.css";

export const PurposeSelect = () => {
  const { purposeSelect } = homeContent.contact.form;
  const options = purposeSelect.options;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((option) => option.value === selected);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(options[index].value);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = listRef.current?.children[index + 1] as
        | HTMLLIElement
        | undefined;
      next?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = listRef.current?.children[index - 1] as
        | HTMLLIElement
        | undefined;
      prev?.focus();
    }
  };

  return (
    <div className={styles.customSelect} ref={rootRef}>
      <input type="hidden" name="subject" value={selected} />
      <button
        id="contact-subject"
        type="button"
        className={styles.selectTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className={
            selectedOption ? styles.selectValue : styles.selectPlaceholder
          }
        >
          {selectedOption ? selectedOption.label : purposeSelect.placeholder}
        </span>

        <span className={styles.selectChevron} aria-hidden="true">
          v
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          className={styles.selectMenu}
          role="listbox"
          aria-label={purposeSelect.ariaLabel}
        >
          {options.map((option, index) => {
            const isSelected = selected === option.value;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`${styles.selectOption} ${
                  isSelected ? styles.selectOptionSelected : ""
                }`}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
