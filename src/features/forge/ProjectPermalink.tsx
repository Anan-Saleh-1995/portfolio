import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./ProjectPermalink.module.css";

type CopyStatus = "idle" | "copying" | "copied" | "error";

export const ProjectPermalink = ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<number | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copyLink = async () => {
    window.clearTimeout(resetTimer.current);
    setStatus("copying");
    const url = new URL(window.location.href);
    url.hash = id;

    try {
      await navigator.clipboard.writeText(url.toString());
      if (!mounted.current) return;
      setStatus("copied");
      resetTimer.current = window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      if (mounted.current) setStatus("error");
    }
  };

  return (
    <span className={styles.control}>
      <button
        type="button"
        className={styles.copyButton}
        onClick={() => {
          void copyLink();
        }}
        disabled={status === "copying"}
        aria-label={
          status === "copied"
            ? `Link to ${title} copied`
            : `Copy link to ${title}`
        }
      >
        {status === "copied" ? (
          <Check size={13} aria-hidden="true" />
        ) : (
          <Copy size={13} aria-hidden="true" />
        )}
        {status === "copied"
          ? "Copied"
          : status === "copying"
            ? "Copying…"
            : "Copy link"}
      </button>
      <span
        role="status"
        className={status === "error" ? styles.recovery : "sr-only"}
      >
        {status === "copied" && `Link to ${title} copied.`}
        {status === "error" && (
          <>
            Couldn’t copy. <a href={`#${id}`}>Use project link</a>
          </>
        )}
      </span>
    </span>
  );
};
