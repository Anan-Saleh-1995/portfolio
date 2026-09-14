import { useState, useEffect, useRef } from "react";

const SCROLL_THRESHOLD = 80;

export const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let scheduledFrame: number | null = null;

    const updateVisibility = () => {
      scheduledFrame = null;
      const currentScrollY = window.scrollY;
      const nextHidden =
        currentScrollY > lastScrollY.current &&
        currentScrollY > SCROLL_THRESHOLD;
      lastScrollY.current = currentScrollY;

      if (nextHidden === hiddenRef.current) return;

      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
    };

    const handleScroll = () => {
      scheduledFrame ??= requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scheduledFrame !== null) cancelAnimationFrame(scheduledFrame);
    };
  }, []);

  return hidden;
};
